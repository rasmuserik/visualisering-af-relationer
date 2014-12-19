(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  relvis.nodes = [];
  relvis.edges = [];
  relvis.addEventListener('data-update', relvis.throttle(300, function createGraph() {

    var type = relvis.getType();
    var ids = relvis.getIds();

    var nodeMap = {};
    var i, j, id, children, k;

    var searchresults = 30; //{{{1 expand searches
    for (i = 0; i < ids.length; ++i) {
      id = ids[i];
      if (id.slice(0, 7) === 'search:') {
        children = relvis.getValues(id, 'results');
        if (children.length) {
          ids = id.slice(0, i).concat(children[0].slice(0, searchresults)).concat(ids.slice(i + 1));
          relvis.setIds(ids);
          return;
        }
      }
    }

    //{{{1 general graph generation
    var prevNodes = {};
    relvis.nodes.forEach(function(node) {
      prevNodes[node.id] = node;
    });
    var nodes = relvis.nodes = [];
    var edges = relvis.edges = [];

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
      if (node.imgSrc === undefined) {
        node.imgSrc = relvis.getValues(node.id, 'cover')[0];
      }
      if (node.label === undefined || node.label === '...') {
        node.label = relvis.getValues(node.id, 'title')[0] || '...';
      }

      nodeMap[node.id] = node;
      return node;
    }

    function circularRelations() { //{{{1

      if (relvis.d3force) {
        relvis.d3force.gravity(0);
      }
      var traverseIds = [];
      var traverseDepth;

      function traverseGraph() { //{{{2
        var ids, id, j, i, node, depth;
        ids = traverseIds;
        traverseIds = [];
        depth = traverseDepth[0];
        traverseDepth = traverseDepth.slice(1);
        if (typeof depth !== 'number') {
          return;
        }
        for (j = 0; j < ids.length; ++j) {
          id = ids[j];
          if (!nodeMap[id]) {
            relvis.log('errnodemap', id);
          }
          node = nodeMap[id];
          var related = relvis.getValues(id, 'related');
          if (related.length) {
            related = related[0];
            var count = 0;
            for (i = 0; count < depth && i < related.length; ++i) {
              var branchId = related[i].id;
              if (!nodeMap[branchId]) {
                ++count;
                var branchNode = createNode({
                  id: branchId,
                  value: branchId,
                  visible: true
                });
                traverseIds.push(branchId);
                edges.push({
                  source: node,
                  target: branchNode
                });
              }
            }
          }
        }
        traverseGraph();
      }
      //{{{2 travers depths/patterns
      if (ids.length <= 1) {
        traverseDepth = [9, 3];
      } else if (ids.length <= 2) {
        traverseDepth = [4, 3];
      } else if (ids.length <= 3) {
        traverseDepth = [3, 2];
      } else if (ids.length <= 7) {
        traverseDepth = [2, 2];
      } else if (ids.length <= 13) {
        traverseDepth = [3];
      } else if (ids.length <= 20) {
        traverseDepth = [2];
      } else {
        traverseDepth = [1];
      }

      for (i = 0; i < ids.length; ++i) { //{{{2 init/execute traversal
        traverseIds.push(ids[i]);
        createNode({
          id: ids[i],
          value: ids[i],
          type: 'primary',
          visible: true
        });
        for (j = 0; j < i; ++j) {
          edges.push({
            source: nodeMap[ids[i]],
            target: nodeMap[ids[j]],
            type: 'collection'
          });
        }
      }
      traverseGraph();
    }

    function externalRelations() { //{{{1
      var root;
      var categories = { //{{{2
        authorInfo: ['creator', 'dbcaddi:hasCreatorDescription'],
        review: ['dbcaddi:hasReview', 'dbcaddi:hasAnalysis', 'dbcaddi:hasDescriptionFromPublisher', 'dbcaddi:discussedIn'],
        circular: ['subject'],
        structure: ['dbcaddi:isAnalysisOf', 'dbcaddi:isReviewOf', 'dbcbib:isPartOfManifestation', 'dbcaddi:isDescriptionFromPublisherOf', 'dbcaddi:discusses', 'dbcaddi:hasAdaptation', 'dbcaddi:isAdaptationOf', 'dbcaddi:isManuscriptOf', 'dbcaddi:hasManuscript', 'dbcaddi:continues', 'dbcaddi:continuedIn', 'dbcaddi:isSoundtrackOfMovie', 'dbcaddi:isSoundtrackOfGame', 'dbcaddi:hasSoundtrack', 'dbcaddi:isPartOfAlbum', 'dbcaddi:hasTrack']
      };
      //'dbcaddi:hasOnlineAccess', 'dbcaddi:hasSoundClip'

      function createExternalRelations(id, group) { //{{{2
        var categoryNodes;

        function createCategoryNodes() { // {{{3
          var i;
          categoryNodes = {};
          var categoryMap = {};
          var categoryNodeList = [];
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
                var node = createNode({
                  id: group + '-' + property + '-' + value,
                  label: value,
                  property: property,
                  value: value,
                  visible: true
                });
                if (node.label.trim().match(/^\d\d\d\d\d\d-[a-z]*:\d*$/)) {
                  node.label = relvis.getValues(node.label, 'title')[0] || 'Loading...';
                  if (node.label === 'Anmeldelse') {
                    node.label = relvis.getValues(node.value, 'isPartOf')[0] || node.label;
                  }
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
            value: id,
            label: 'root',
            type: 'root',
            visible: true
          });
          root.imgSrc = relvis.getValues(id, 'cover')[0];
          root.label = relvis.getValues(id, 'title')[0] || '...';
        }

        createRootNode();
        createCategoryNodes();
        createRelationNodes();
      }
      //{{{2 execute

      if (relvis.d3force) {
        relvis.d3force.gravity(1);
      }
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
    }

    function structuralRelations() { //{{{1
      var node;
      if (relvis.d3force) {
        relvis.d3force.gravity(1);
      }
      var relations = ['creator', 'subject', 'type' /*, 'dbcaddi:isAnalysisOf', 'dbcaddi:isReviewOf', 'dbcbib:isPartOfManifestation', 'dbcaddi:isDescriptionFromPublisherOf', 'dbcaddi:discusses', 'dbcaddi:hasAdaptation', 'dbcaddi:isAdaptationOf', 'dbcaddi:isManuscriptOf', 'dbcaddi:hasManuscript', 'dbcaddi:continues', 'dbcaddi:continuedIn', 'dbcaddi:isSoundtrackOfMovie', 'dbcaddi:isSoundtrackOfGame', 'dbcaddi:hasSoundtrack', 'dbcaddi:isPartOfAlbum', 'dbcaddi:hasTrack'*/ ];
      for (i = 0; i < ids.length; ++i) {
        node = createNode({
          id: ids[i],
          value: ids[i],
          type: 'primary',
          visible: true
        });
      }
      var relmap = {};
      for (i = 0; i < ids.length; ++i) {
        id = ids[i];
        for (j = 0; j < relations.length; ++j) {
          var relation = relations[j];
          var values = relvis.getValues(id, relation);
          for (k = 0; k < values.length; ++k) {
            var name = relation + '\u0000' + values[k];
            relmap[name] = (relmap[name] || 0) + 1;
          }
        }
      }
      var rellist = [];
      Object.keys(relmap).forEach(function(key) {
        if (relmap[key] > 1) {
          rellist.push({
            name: key.split('\u0000')[0],
            value: key.split('\u0000')[1],
            count: relmap[key]
          });
        }
      });
      rellist.sort(function(a, b) {
        return b.count - a.count;
      });
      rellist = rellist.slice(0, 20);
      for (i = 0; i < rellist.length; ++i) {
        var rel = rellist[i];
        node = createNode({
          id: rel.name + rel.value,
          label: rel.value,
          type: 'category',
          subtype: rel.name,
          visible: true
        });
        for (j = 0; j < ids.length; ++j) {
          if (relvis.getValues(ids[j], rel.name).indexOf(rel.value) !== -1) {
            edges.push({
              source: node,
              target: nodeMap[ids[j]],
              type: 'category'
            });
          }
        }
      }
    }
    //actual execution {{{1
    if (type === 'ext') {
      externalRelations();
    } else if (type === 'cir') {
      circularRelations();
    } else if (type === 'str') {
      structuralRelations();
    }

    //{{{2 commit
    for (var key in nodeMap) {
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
