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
  var lidDB = levelup('lid.leveldb');
  var patronDB = levelup('patron.leveldb');

  var t0 = Date.now();
  var statStep =  2500;
  var prevPatron;
  var lendlist = [];
  var patrons = [];
  var lids = {};
  var nextId = 0;
  var coloanCount = 0;
  var minColoans = 3;
  var maxSize = 10000;
  var sampleSize = 1000; // number of patrons to sample
  var lidStat = {};

  var limit;
  limit = 47196844;
  limit = 3000;

  function stat() {}

  pass1();
  var lidCount = 0;

  function pass1() {
    lineReader.eachLine('../../final_adhl.sorted.csv', function(line, last, cb) {
      if (++count % statStep === 0) {
        console.log('pass1', count + '/' + limit, (Date.now() - t0) + 'ms', ((limit - count) * (Date.now() - t0) / 1000 / 60 / statStep | 0) + 'remaining-minutes');
        t0 = Date.now();
      }

      var fields = line.split(',');
      var patron = fields[0];
      var lid = fields[5];
      var title = fields[8];
      var author = fields[9];
      var kind = fields[10];

      update(lidDB, lid, patron, function() {
        update(patronDB, patron, lid, function() {
          next();
        });
      });

      function update(db, key, val, cb) {
        db.get(key, function(err, data) {
          if(err) {
            var elems = [];
          } else {
            elems = data.split(',');
          }
          if(elems.length < maxSize && !(val in elems)) {
            elems.push(val);
            db.put(key, String(elems), cb); 
          } else {
            cb();
          }
        });
      }

      lidStat[lid] = (lidStat[lid] || 0) + 1;
      lidInfoDB.get(lid, function(err, obj) {
        if (err) {
          obj = {
            title: title,
            author: author,
            kind: kind,
            count: 1
          };
          ++lidCount;
        } else {
          obj = JSON.parse(obj);
          ++obj.count;
        }
        lidInfoDB.put(lid, JSON.stringify(obj), function(err) {
          if (err) {
            console.log(err);
          }
        })
      });


      function next() {
        if (count > limit || last) {
          pass2();
        } else {
          cb();
        }
      }
    });
  }

  function pass2() {
    console.log('pass2', lidCount);
    lidInfoDB.createReadStream()
      .on('data', function(data) {
        var lid = data.key;
        lidDB.get(lid, function(err, data) {
          if(err) {
            console.log(err);
          }
          var patrons = data.split(',').slice(0, sampleSize);
          var sampleCount = patrons.length;
          var borrows = {};
          handlePatrons();
          function handlePatrons() {
            if(!patrons.length) {
              return chooseColoans();
            }
            var patron = patrons.pop();
            patronDB.get(patron, function(err, data) {
              if(err) {
                console.log(err);
              }
              var lids = data.split(',');
              lids.forEach(function(lid) {
                if(!borrows[lid]) {
                  borrows[lid] = 1;
                } else {
                  ++borrows[lid];
                }
              });
              handlePatrons();
            });
          }
          function chooseColoans() {
            var coloans = [];
            Object.keys(borrows).forEach(function(lid) {
              coloans.push({
                lid: lid,
                coloans: borrows[lid],
                total: lidStat[lid]
              });
            });
            coloans.sort(function(a,b) {
              return a.coloans < b.coloans;
            });
            if(sampleCount > 1) {
              console.log(lid, JSON.stringify(coloans.slice(0, 30)));
            }
          }
        });
    }).on('end', function() {
      setTimeout(pass3, 3000);
    });

  }
  function pass3() {
    console.log('pass3');
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
