(function() {
  'use strict';
  //util {{{1
  function findBoundaries(list, keys) {
    var i, j, item, key;
    var min = {};
    var max = {};
    var range = {};
    for (i = 0; i < keys.length; ++i) {
      min[keys[i]] = Number.POSITIVE_INFINITY;
      max[keys[i]] = Number.NEGATIVE_INFINITY;
    }
    for (i = 0; i < list.length; ++i) {
      item = list[i];
      for (j = 0; j < keys.length; ++j) {
        key = keys[j];
        if (typeof item[key] === 'number') {
          min[key] = Math.min(item[key], min[key]);
          max[key] = Math.max(item[key], max[key]);
        }
      }
    }
    for (i = 0; i < keys.length; ++i) {
      range[keys[i]] = max[keys[i]] - min[keys[i]];
    }
    return {
      min: min,
      max: max,
      range: range,
      zeroOne: function(item) {
        var result = {};
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          result[key] = (item[key] - this.min[key]) / this.range[key];
        }
        return result;
      }
    };
  }
  var sampleItem = [{ //{{{1
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
  var categories = {
    authorInfo: ['Om forfatteren', 'Creator'],
    review: ['Anmeldelse', 'Lektørudtalelse'],
    structure: ['Serie', 'Udgave', 'Collection'],
    circular: ['Publikum', 'Emne', 'Sprog']
  };

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
    for (category in categories) {
      if (categories.hasOwnProperty(category)) {
        categoryNodes[category] = {
          label: category,
          type: 'category',
          visible: false
        };
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
      if(property === 'Cover') { root.imgSrc = rel.value; }
      if(property === 'Titel') { root.label = rel.value; }
      category = categoryMap[property];
      if (category) {
        node = {
          label: property + '\n' + (rel.title || rel.value),
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

    force.on('tick', function() {
      var i;
      var ctx = canvas.getContext('2d');
      var boundaries = findBoundaries(graph.nodes.filter(function(o) {
        return o.visible;
      }), ['x', 'y']);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (i = 0; i < graph.nodes.length; ++i) {
        var node = graph.nodes[i];
        if (node.visible) {
          var xy = boundaries.zeroOne(node);
          ctx.fillText(node.label.slice(0, 40), (0.01 + xy.x * 0.9) * canvas.width, (0.07 + xy.y * 0.9) * canvas.height);
        }
      }
    });
  }


  //{{{1 code for testing/demo
  $(function() {
    document.body.innerHTML += JSON.stringify(sampleItem);

    // button on sample page pops up visualisation
    $('#relvis-button').click(function() {
      var canvasOverlay = new window.CanvasOverlay();
      canvasOverlay.show();
      createGraph(canvasOverlay.canvas);
    });

    // show visualisation on load if we have #relvis hash
    if (location.hash === '#relvis') {
      var canvasOverlay = new window.CanvasOverlay();
      canvasOverlay.show();
      createGraph(canvasOverlay.canvas);
    }
  });
})();
