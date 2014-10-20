(function() {
  'use strict';
  var lineReader = require('line-reader');
  var levelup = require('levelup');

  var count = 0;

  function done() {
    console.log('done');
  }

  var coloansDB = levelup('coloans.leveldb');
  var lidInfoDB = levelup('lid-info.leveldb');

  var t0 = Date.now();
  var statStep = 25000;
  var prevPatron;
  var lendlist = [];
  var patrons = [];
  var lids = {};
  var nextId = 0;
  var coloanCount = 0;

  var limit;
  limit = 47196844;
  limit = 100000;
  function stat() {
  }

  pass1();
  function pass1() {
  lineReader.eachLine('../../final_adhl.sorted.csv', function(line, last, cb) {
    if (++count % statStep === 0) {
      console.log('pass1', count + '/' + limit, (Date.now() - t0)+ 'ms', ((limit- count) * (Date.now() - t0)/1000/60/statStep | 0) + 'remaining-minutes');
      t0 = Date.now();
    }

    var fields = line.split(',');
    var patron = fields[0];
    var lid = fields[5];
    var title = fields[8];
    var author = fields[9];
    var kind = fields[10];

    lidInfoDB.get(lid, function(err, obj) {
      if(err) {
        obj = {
          title: title,
          author: author,
          kind: kind,
          count: 1
        };
      } else {
        obj = JSON.parse(obj);
        ++obj.count;
      }
      lidInfoDB.put(lid, JSON.stringify(obj), function(err) { if(err) {console.log(err);}})
    });

    if(patron === prevPatron) {
      if(!(lid in lendlist)) {
        lendlist.push(lid);
      }
    } else {
      lendlist.sort();
      if(lendlist.length < 3000 && lendlist.length > 1) {
        for(var i = 0; i < lendlist.length; ++i) {
        }
        coloansDB.put(patron, String(lendlist));
        ++coloanCount;
      }
      prevPatron = patron;
      lendlist = [];
    }

    if (count > limit || last) {
      pass2();
    } else {
      cb();
    }
  });
  }

    function pass2() {
    }


    /*
    function inccooccur(a, b, cb) {
      a = +a;
      b = +b;
      if (a < b) {
        var t = a;
        a = b;
        b = t;
      }
      var name = a + ',' + b;

      cooccurDB.get(name, function(err, val) {
        if (err) {
          val = 0;
        } else {
          val = +val;
        }
        ++val;
        cooccurDB.put(name, String(val), function(err) {
          if (err) {
            console.log(err);
          }
        });
      });
    }

    /// OLD VERSION

    lends.get(patron, function(err, val) {
      if (err) {
        val = [];
      } else {
        val = JSON.parse(val);
      }
      if ((val.length < 3000) && !(lid in val)) {
        val.push(lid);
        lends.put(patron, JSON.stringify(val), function(err) {
          if (err) {
            console.log(err);
          }
        });
        //if (val.length > 3000) {
          //val.shift();
        //}
        for (var i = 0; i < val.length; ++i) {
          inccooccur(val[i], lid);
        }
      }
    });
    lidInfo.put(lid, JSON.stringify({
      title: title,
      author: author,
      kind: kind
    }), function(err) {
      if (err) {
        console.log(err);
      }
      if (last) {
        done();
      } else {
        cb();
      }
    });
    */
})();
