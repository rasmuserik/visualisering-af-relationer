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

    var type = relvis.visualisation.slice(0, 3);
    var id = relvis.visualisation.slice(3);

    var prevNodes, root, nodes, edges, i, rel, categoryMap, categoryNodes, property, node, categoryNodeList;

    function createNode(node) { //{{{2
      var prev = prevNodes[node.id];
      if (prev) {
        for (var key in node) {
          if (node.hasOwnProperty(key)) {
            prev[key] = node[key];
          }
        }
        return prev;
      } else {
        return node;
      }
    }

    function createCategoryNodes() { // {{{2
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
          nodes.push(categoryNodes[category]);
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

    function createRelationNodes() { //{{{2
      Object.keys(categories).forEach(function(category) {
        categories[category].forEach(function(property) {
          relvis.getValues(id, property).forEach(function(value) {
            node = createNode({
              id: id + '-' + property + '-' + value,
              label: value,
              property: property,
              value: value,
              visible: true
            });
            if (node.label.trim().match(/^\d\d\d\d\d\d-[a-z]*:\d*$/)) {
              node.label = relvis.getValues(node.label, 'title')[0] || 'Loading...';
            }
            nodes.push(node);
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

    function createRootNode() { //{{{2
      root = createNode({
        id: id,
        label: 'root',
        type: 'root',
        visible: true
      });
      root.imgSrc = relvis.getValues(id, 'cover')[0];
      root.label = relvis.getValues(id, 'title')[0] || 'Loading...';
      nodes.push(root);
    }

    //actual execution {{{2
    prevNodes = {};
    relvis.nodes.forEach(function(node) {
      prevNodes[node.id] = node;
    });
    nodes = relvis.nodes = [];
    edges = relvis.edges = [];
    createRootNode();
    createCategoryNodes();
    createRelationNodes();
    relvis.layoutGraph();
    return {
      nodes: nodes,
      edges: edges
    };
  }));
})(); //{{{1
