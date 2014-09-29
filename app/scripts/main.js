(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  var sampleItem = [{ //{{{1 - graph-model
    property: 'Cover',
    value: 'http://dev.vejlebib.dk/sites/default/files/styles/ding_primary_large/public/ting/covers/object/796e550251e19f9e2deeb270d0d80670.jpg?itok=jAqN8JPD'
  }, {
    property: 'Small cover',
    value: 'http://dev.vejlebib.dk/sites/default/files/styles/ding_list_medium/public/ting/covers/object/796e550251e19f9e2deeb270d0d80670.jpg?itok=AckPhF2k'
  }, {
    property: 'Titel',
    value: 'Siddhartha - en indisk legende'
  }, {
    property: 'Collection',
    value: 'ting:870970-basis%3A22331892'
  }, {
    property: 'Creator',
    value: 'Hermann Hesse (2012)'
  }, {
    property: 'Description',
    value: 'Om en from brahmanersøn, der i sin søgen efter sandheden forkaster sine fædres tro. Hans vej går gennem askese, møde med Buddha, kærlighedsoplevelser og et verdsligt liv, før han falder til ro'
  }, {
    property: 'Serie',
    value: 'Gyldendals paperbacks'
  }, {
    property: 'Id',
    value: 'ting:870970-basis%3A23243431'
  }, {
    property: 'Type',
    value: 'Bog'
  }, {
    property: 'Sprog',
    value: 'Dansk'
  }, {
    property: 'Emne',
    value: 'religiøse bøger'
  }, {
    property: 'Emne',
    value: 'siddhartha'
  }, {
    property: 'Bidrag af',
    value: 'Karl Hornelund'
  }, {
    property: 'Original title',
    value: 'Siddhartha'
  }, {
    property: 'ISBN-nummer',
    value: '9788702142570'
  }, {
    property: 'Udgave',
    value: '6. udgave'
  }, {
    property: 'Omfang',
    value: '126 sider'
  }, {
    property: 'Udgiver',
    value: 'Gyldendal'
  }, {
    property: 'Publikum',
    value: 'voksenmaterialer'
  }, {
    property: 'Opstilling',
    value: '0/1 eksemplar hjemme på Vejle > Voksen > Magasin > Skøn > > Hesse'
  }, {
    property: 'Opstilling',
    value: '1/1 eksemplar hjemme på Jelling > Voksen > Magasin > Skøn > > Hesse'
  }, {
    property: 'Om forfatteren',
    value: 'ting:870970-basis%3A12543431',
    title: 'Hermann Hesse : Leben und Werk im Bild : mit dem Kurzgefassten Lebenslauf von Hermann Hesse'
  }, {
    property: 'Om forfatteren',
    value: 'ting:870970-basis%3A85143431',
    title: 'Hermann Hesse : pilgrim of crisis : a biography'
  }, {
    property: 'Om forfatteren',
    value: 'ting:870970-basis%3A14943431',
    title: 'Hermann Hesse : life and art'
  }, {
    property: 'Om forfatteren',
    value: 'ting:870970-basis%3A91483431',
    title: 'Hermann Hesse'
  }, {
    property: 'Om forfatteren',
    value: 'ting:870970-basis%3A19898431',
    title: 'Hermann Hesse : sein Leben und sein Werk (Ved Anni Carlsson, Otto Basler)\nAf indholdet: Anni Carlsson: Vom Steppenwolf zur Morgenlandfahrt ; Otto Basler: Der Weg zum Glasperlenspiel'
  }, {
    property: 'Om forfatteren',
    value: 'ting:870970-basis%3A87875131',
    title: 'Hermann Hesse : sein Leben und sein Werk'
  }, {
    property: 'Om forfatteren',
    value: 'ting:870970-basis%3A91431241',
    title: 'Hermann Hesse : a pictorial biography'
  }, {
    property: 'Om forfatteren',
    value: 'ting:870970-basis%3A57873431',
    title: 'Hermann Hesse : sein Leben und sein Werk (Ved Anni Carlsson)\nSide 236-256: Anni Carlsson: Vom Steppenwolf zur Morgenlandfahrt ; Side 257-300: Anni Carlsson: Hermann Hesses \'Glasperlenspiel\' in seinen Wesensgesetzen'
  }, {
    property: 'Om forfatteren',
    value: 'ting:870970-basis%3A48143431',
    title: 'Hermann Hesse : die Bilderwelt seines Lebens'
  }, {
    property: 'Om forfatteren',
    value: 'ting:870970-basis%3A48178431',
    title: 'Hermann Hesse : Werk und Leben : ein Dichterbildnis'
  }, {
    property: 'Om forfatteren',
    value: 'ting:870970-basis%3A14787431',
    title: 'Hermann Hesse : Leben und Werk (Ved Hermann Hesse ...)'
  }, {
    property: 'Om forfatteren',
    value: 'ting:870970-basis%3A95145731',
    title: 'Hermann Hesse : eine Chronik in Bildern'
  }, {
    property: 'Om forfatteren',
    value: 'ting:870970-basis%3A41573431',
    title: 'Hermann Hesse : biography and bibliography. Volume 1'
  }, {
    property: 'Anmeldelse',
    value: 'ting:870970-basis%3A14853431',
    title: 'Berlingske tidende, 2013-01-24'
  }, {
    property: 'Anmeldelse',
    value: 'ting:870970-basis%3A14878731',
    title: 'Politiken, 2013-02-09'
  }, {
    property: 'Anmeldelse',
    value: 'ting:870970-basis%3A48588431',
    title: 'Weekendavisen, 2013-01-25'
  }, {
    property: 'Lektørudtalelse',
    value: 'ting:870970-basis%3A15153431',
    title: 'Skønt Siddhartha, med skiftende tider har mistet sin kultstatus, er temaet: jeg\'ets søgen efter meningen med tilværelsen, dog evigt aktuelt, og Hesses kendte roman skal selvfølgelig også fremover være at finde på biblioteket. Den egner sig godt til læsning i studiekredse'
  }];
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
          label: /* property + '\n' + */ (rel.title || rel.value),
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
        /*
         */
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


  //{{{1 code for testing/demo
  $(function() {
    // button on sample page pops up visualisation
    $('#relvis-button').click(function() {
      var canvasOverlay = window.canvasOverlay = new relvis.CanvasOverlay();
      canvasOverlay.show();
      createGraph(canvasOverlay.canvas);
    });

    // show visualisation on load if we have #relvis hash
    if (location.hash === '#relvis') {
      var canvasOverlay = window.canvasOverlay = new relvis.CanvasOverlay();
      canvasOverlay.show();
      createGraph(canvasOverlay.canvas);
    }
  });
})();
