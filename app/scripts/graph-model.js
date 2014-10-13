(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  relvis.nodes = [];
  relvis.edges = [];
  var categories = { //{{{1
    authorInfo: ['Om forfatteren', 'Creator'],
    review: ['Anmeldelse', 'Lektørudtalelse'],
    circular: ['Publikum', 'Emne', 'Sprog'],
    structure: ['Serie', 'Udgave', 'Collection']
  };

  relvis.createGraph = function() { //{{{1
    var id = 'ting:870970-basis%3A23243431';
    var root, nodes, edges, i, rel, categoryMap, categoryNodes, property, node, categoryNodeList;

    function createCategoryNodes() { // {{{2
      categoryNodes = {};
      categoryMap = {};
      categoryNodeList = [];
      for (var category in categories) {
        if (categories.hasOwnProperty(category)) {
          categoryNodes[category] = {
            label: category,
            type: 'category',
            visible: false
          };
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
            node = {
              label: value,
              property: property,
              value: value,
              visible: true
            };
            if (node.label.slice(0, 5) === 'ting:') {
              node.label = relvis.getValues(node.label, 'Titel')[0] || '...';
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
      root = {
        label: 'root',
        type: 'root',
        visible: true
      };
      root.imgSrc = relvis.getValues(id, 'Cover')[0];
      root.label = relvis.getValues(id, 'Titel')[0];
      nodes.push(root);
    }

    nodes = relvis.nodes = []; //{{{2
    edges = relvis.edges = [];
    createRootNode();
    createCategoryNodes();
    createRelationNodes();
    return {
      nodes: nodes,
      edges: edges
    };
  };
})(); //{{{1
