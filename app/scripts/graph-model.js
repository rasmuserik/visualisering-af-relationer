(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  relvis.nodes = [];
  relvis.edges = [];
  var categories = { //{{{1
    authorInfo: ['creator', 'dbcaddi:hasCreatorDescription'],
    review: ['dbcaddi:hasReview', 'dbcaddi:hasAnalysis', 'dbcaddi:hasDescriptionFromPublisher', 'dbcaddi:discussedIn'],
    circular: ['subject'],
    structure: ['dbcaddi:isAnalysisOf', 'dbcaddi:isReviewOf', 'dbcbib:isPartOfManifestation', 'dbcaddi:isDescriptionFromPublisherOf', 'dbcaddi:discusses', 'dbcaddi:hasAdaptation', 'dbcaddi:isAdaptationOf', 'dbcaddi:isManuscriptOf', 'dbcaddi:hasManuscript', 'dbcaddi:continues', 'dbcaddi:continuedIn', 'dbcaddi:isSoundtrackOfMovie', 'dbcaddi:isSoundtrackOfGame', 'dbcaddi:hasSoundtrack', 'dbcaddi:isPartOfAlbum', 'dbcaddi:hasTrack']
  };
  //'dbcaddi:hasOnlineAccess', 'dbcaddi:hasSoundClip'

  relvis.addEventListener('data-update', relvis.throttle(300, function createGraph() { //{{{1

    var type = relvis.getType();
    var ids = relvis.getIds();

    var key;
    var nodeMap = {};
    var prevNodes, root, nodes, edges, i, rel, categoryMap, categoryNodes, property, node, categoryNodeList, j;


    //{{{2 general graph generation
    prevNodes = {};
    relvis.nodes.forEach(function(node) {
      prevNodes[node.id] = node;
    });
    nodes = relvis.nodes = [];
    edges = relvis.edges = [];

    function createNode(node) {
      var prev = nodeMap[node.id] || prevNodes[node.id];
      if (prev) {
        for (var key in node) {
          if (node.hasOwnProperty(key)) {
            prev[key] = node[key];
          }
        }
        node = prev;
      }
      nodeMap[node.id] = node;
      return node;
    }

    //circular relations {{{2

    function traverseRelatedGraph(id, branchout) {
      var i;
      if (nodeMap[id]) {
        return nodeMap[id];
      }
      var node = createNode({
        id: id,
      });
      node.imgSrc = relvis.getValues(id, 'cover')[0];
      node.label = relvis.getValues(id, 'title')[0] || '...';
      node.visible = !!node.label;
      node.type = 'cir';
      nodeMap[id] = node;

      if (branchout.length && node.visible) {
        var branchCount = branchout[0];
        branchout = branchout.slice(1);
        var related = relvis.getValues(id, 'related');
        if (related.length) {
          related = related[0];
          var count = 0;
          for (i = 0; count < branchCount && i < related.length; ++i) {
            var branchId = related[i].id;
            if (!nodeMap[branchId]) {
              ++count;
              var branchNode = traverseRelatedGraph(related[i].id, branchout);
              edges.push({
                source: node,
                target: branchNode
              });
            }
          }
        }
      }

      return node;
    }
    /*
    //log related {{{2
    var related = relvis.getValues(id, 'related');
    var relatedList = [];
    if(related.length) {
      related = related[0].slice(0,10);
      console.log(related.length, 'related to', relvis.getValues(id, 'title')[0]);
      for(i = 0; i < related.length; ++i) {
        var relatedName = relvis.getValues(related[i].id, 'title')[0];
        if(relatedName) {
          relatedList.push(relatedName);
        }
      }
    console.log(relatedList.join(',  '));
    }
    */


    //{{{2 external relations
    function createExternalRelations(id, group) {
      function createCategoryNodes() { // {{{3
        var i;
        categoryNodes = {};
        categoryMap = {};
        categoryNodeList = [];
        for (var category in categories) {
          if (categories.hasOwnProperty(category)) {
            categoryNodes[category] = createNode({
              id: 'category:' + category,
              label: category,
              type: 'category',
              visible: false
            });
            categoryNodeList.push(categoryNodes[category]);
            for (i = 0; i < categories[category].length; ++i) {
              categoryMap[categories[category][i]] = category;
            }
          }
        }
        categoryNodeList[0].fixedPosition = {
          x: 0,
          y: 0
        };
        categoryNodeList[1].fixedPosition = {
          x: 1,
          y: 0
        };
        categoryNodeList[2].fixedPosition = {
          x: 0,
          y: 1
        };
        categoryNodeList[3].fixedPosition = {
          x: 1,
          y: 1
        };
      }

      function createRelationNodes() { //{{{3
        Object.keys(categories).forEach(function(category) {
          categories[category].forEach(function(property) {
            relvis.getValues(id, property).forEach(function(value) {
              node = createNode({
                id: group + '-' + property + '-' + value,
                label: value,
                property: property,
                value: value,
                visible: true
              });
              if (node.label.trim().match(/^\d\d\d\d\d\d-[a-z]*:\d*$/)) {
                node.label = relvis.getValues(node.label, 'title')[0] || 'Loading...';
              }
              edges.push({
                source: categoryNodes[category],
                target: node
              });
              edges.push({
                source: root,
                target: node
              });
            });
          });
        });
      }

      function createRootNode() { //{{{3
        root = createNode({
          id: id,
          label: 'root',
          type: 'root',
          visible: true
        });
        root.imgSrc = relvis.getValues(id, 'cover')[0];
        root.label = relvis.getValues(id, 'title')[0] || 'Loading...';
      }

      createRootNode();
      createCategoryNodes();
      createRelationNodes();
    }
    //actual execution {{{2
    if (type === 'ext') {
      for (i = 0; i < ids.length; ++i) {
        createExternalRelations(ids[i], ids);
        for (j = 0; j < i; ++j) {
          edges.push({
            source: nodeMap[ids[i]],
            target: nodeMap[ids[j]],
            type: 'collection'
          });
        }
      }
    } else {
      //traverseRelatedGraph(ids[0], [6, 3, 2]);
      //traverseRelatedGraph(ids[0], [6, 4]);
      var depth;
      if (ids.length <= 1) {
        depth = [9, 3];
      } else if (ids.length <= 2) {
        depth = [4, 3];
      } else if (ids.length <= 5) {
        depth = [3, 2];
      } else {
        depth = [2, 2];
      }
      for (i = 0; i < ids.length; ++i) {
        node = traverseRelatedGraph(ids[i], depth);
        node.type = 'primary';
        for (j = 0; j < i; ++j) {
          edges.push({
            source: nodeMap[ids[i]],
            target: nodeMap[ids[j]],
            type: 'collection'
          });
        }
      }
    }
    for (key in nodeMap) {
      if (nodeMap.hasOwnProperty(key)) {
        nodes.push(nodeMap[key]);
      }
    }

    relvis.layoutGraph();
    return {
      nodes: nodes,
      edges: edges
    };
  }));
})(); //{{{1
