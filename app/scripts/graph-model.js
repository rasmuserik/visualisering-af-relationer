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
    var root, nodes, edges, i, rel, categoryMap, categoryNodes, category, property, node, categoryNodeList;

    // {{{3 graph definition and root nodes
    root = {
      label: 'root',
      type: 'root',
      visible: true
    };
    nodes = [root];
    edges = [];

    // {{{3 create nodes for categories to get clouds
    categoryNodes = {};
    categoryMap = {};
    categoryNodeList = [];
    for (category in categories) {
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

    // {{{3 nodes for individual relations
    root.imgSrc = relvis.getValues(id, 'Cover')[0];
    root.label = relvis.getValues(id, 'Titel')[0];
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
    relvis.nodes = nodes;
    relvis.edges = edges;
    return {
      nodes: nodes,
      edges: edges
    };
  };
})();
