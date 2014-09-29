(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};

  relvis.textLayout = function textLayout(ctx, str, width) { //{{{2
    window.ctx = ctx;
    var spacing = ctx.measureText(' ').width;
    var words = str.split(' ');
    var lengths = words.map(function(word) {
      return ctx.measureText(word).width;
    });
    var lines = [];
    var line = [];
    var linePos = 0;
    for (var i = 0; i < words.length; ++i) {
      if (linePos > 0 && linePos + lengths[i] > width) {
        lines.push({
          str: line.join(' '),
          len: linePos
        });
        line = [];
        linePos = 0;
      }
      line.push(words[i]);
      linePos += lengths[i] + spacing;
    }
    lines.push({
      str: line.join(' '),
      len: linePos
    });
    return lines;
  };

  relvis.writeBox = function writeBox(ctx, str, x, y, w, h) { //{{{2
    var size = 60;
    var lines, i, maxLen;
    do {
      size = size * 0.9 | 0;
      ctx.font = size + 'px sans-serif';
      lines = relvis.textLayout(ctx, str, w);
      maxLen = 0;
      for (i = 0; i < lines.length; ++i) {
        maxLen = Math.max(maxLen, lines[i].len);
      }
    } while (size > 13 && (maxLen > w || lines.length * size > h));

    for (i = 0; i < lines.length; ++i) {
      if (size * (i + 1) < h) {
        ctx.fillText(lines[i].str, x, y + size * (i + 1));
      }
    }
  };
  /* //{{{1 main-code where graph-canvas not extracted
  //{{{1 d3 force layout experiment
  var margin = 0.05;
  var categories = {
    authorInfo: ['Om forfatteren', 'Creator'],
    review: ['Anmeldelse', 'Lektørudtalelse'],
    structure: ['Serie', 'Udgave', 'Collection'],
    circular: ['Publikum', 'Emne', 'Sprog']
  };

  var categoryNodeList = [];

  function createNodesExternal(item) { //{{{2
    var root, nodes, edges, i, rel, categoryMap, categoryNodes, category, property, node;

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

    // {{{3 nodes for individual ralations
    for (i = 0; i < item.length; ++i) {
      rel = item[i];
      property = rel.property;
      if (property === 'Cover') {
        root.imgSrc = rel.value;
      }
      if (property === 'Titel') {
        root.label = rel.value;
      }
      category = categoryMap[property];
      if (category) {
        node = {
          label: (rel.title || rel.value),
          property: property,
          value: rel.value,
          visible: true
        };
        nodes.push(node);
        edges.push({
          source: categoryNodes[category],
          target: node
        });
        edges.push({
          source: root,
          target: node
        });
      }
    }
    return {
      nodes: nodes,
      edges: edges
    };
  }
  //{{{2 create force graph
  function createGraph(canvas) {
    var graph, force;
    graph = createNodesExternal(sampleItem);
    force = window.d3.layout.force()
      .size([window.innerWidth, window.innerHeight])
      .nodes(graph.nodes)
      .links(graph.edges)
      .charge(-120)
      .linkDistance(30)
      .start();
    //.gravity(1)

    var t0 = Date.now();
    force.on('tick', function() {
      relvis.visualObjectRatio = 13 / 8;
      //console.log(Date.now() - t0);
      t0 = Date.now();

      var i;
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      var visibleNodes = graph.nodes.filter(function(o) {
        return o.visible;
      });
      var boundaries = relvis.findBoundaries(visibleNodes, ['x', 'y']);
      visibleNodes = visibleNodes.map(function(node) {
        var newNode = Object.create(node);
        var xy = boundaries.zeroOne(node);
        newNode.x = (xy.x * (1 - 2 * margin) + margin) * canvas.width;
        newNode.y = (xy.y * (1 - 2 * margin) + margin) * canvas.height;
        return newNode;
      });

      categoryNodeList[0].x = boundaries.min.x;
      categoryNodeList[0].y = boundaries.min.y;
      categoryNodeList[1].x = boundaries.max.x;
      categoryNodeList[1].y = boundaries.min.y;
      categoryNodeList[2].x = boundaries.max.x;
      categoryNodeList[2].y = boundaries.max.y;
      categoryNodeList[3].x = boundaries.min.x;
      categoryNodeList[3].y = boundaries.max.y;

      relvis.nearestPoints(visibleNodes);
      for (i = 0; i < visibleNodes.length; ++i) {
        var node = visibleNodes[i];
        // size should be 1/2 distance to nearest (or if neares is smaller, a bit larger, which is why we make the size of the nearest node factor in)
        var size = node.nearestDist * 0.8 - 0.34 * node.nearestNode.nearestDist; // * Math.SQRT1_2;

        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.beginPath();
        ctx.moveTo(node.x - size, node.y);
        ctx.quadraticCurveTo(node.x - size, node.y + size / relvis.visualObjectRatio, node.x, node.y + size / relvis.visualObjectRatio);
        ctx.quadraticCurveTo(node.x + size, node.y + size / relvis.visualObjectRatio, node.x + size, node.y);
        ctx.quadraticCurveTo(node.x + size, node.y - size / relvis.visualObjectRatio, node.x, node.y - size / relvis.visualObjectRatio);
        ctx.quadraticCurveTo(node.x - size, node.y - size / relvis.visualObjectRatio, node.x - size, node.y);
        ctx.fill();
        ctx.stroke();
        //ctx.fillRect(node.x - size, node.y - size / relvis.visualObjectRatio, size * 2, size * 2 / relvis.visualObjectRatio);
        //, sz.x*canvas.width, sz.y*canvas.height);
        ctx.font = '20px sans serif';
        ctx.fillStyle = '#f00';
        var textBoxSize = 0.75;
        relvis.writeBox(ctx, node.label,
          node.x - size * textBoxSize, node.y - size * textBoxSize / relvis.visualObjectRatio,
          size * textBoxSize * 2, size * textBoxSize * 2 / relvis.visualObjectRatio);
      }
    });
  }

  */
})();
