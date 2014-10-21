(function() {
  //
  //  - pass 1
  //    - generate lid,patron and patron,lid DBs
  //    - generate lid-info DB
  //  - pass 2
  //    - add count in lid-info DB
  //  - pass 3
  //    - collapse lid,patrons to lid->patrons
  //    - collapse patron,lid to patron->(lids,count)
  //  - pass 4
  //    - cooccurrence stat for lids (with random patron sampling if many patrons)
  'use strict';
  var lineReader = require('line-reader');
  var levelup = require('levelup');

  var count;
  var limit;
  limit = 100000;
  limit = 47196844;
  var commitSize = 250000;

  (function() {
    process.nextTick(pass1);
  })();

  //pass1{{{1
  var lidpatronDB = levelup('lid-patron.leveldb');
  var patronlidDB = levelup('patron-lid.leveldb');
  var lidInfoDB = levelup('lid-info.leveldb');
  var lidCount = {};

  function pass1() { //{{{2
    count = 0;

    var lidBatch = lidpatronDB.batch();
    var patronBatch = patronlidDB.batch();
    var lidInfoBatch = lidInfoDB.batch();

    function commit(cb) {
      lidBatch.write(function() {
        patronBatch.write(function() {
          lidInfoBatch.write(function() {
            lidBatch = lidpatronDB.batch();
            patronBatch = patronlidDB.batch();
            lidInfoBatch = lidInfoDB.batch();
            cb();
          });
        });
      });
    }

    lineReader.eachLine('../../final_adhl.csv', function(line, last, cb) {
      ++count;
      if (last || count >= limit) {
        return commit(pass2);
      }

      var fields = line.split(',');
      var patron = fields[0];
      var lid = fields[5];
      lidCount[lid] = 0;
      var title = fields[8];
      var author = fields[9];
      var kind = fields[10];
      lidBatch.put(lid + ',' + patron, '1');
      patronBatch.put(patron + ',' + lid, '1');
      lidInfoBatch.put(lid, JSON.stringify({
        title: title,
        author: author,
        kind: kind
      }));

      if (count % commitSize === 0) {
        logStatus('pass1', count, limit);
        commit(cb);
      } else {
        cb();
      }
    });
  }

  //pass2{{{1
  function pass2() { //{{{2
    console.log('pass2');
    var numEntries = Object.keys(lidCount).length;
    var n = 0;
    var count = 0;

    function countLids() {
      lidpatronDB.createReadStream()
        .on('data', function(data) {
          if (++count % commitSize === 0) {
            logStatus('pass2a', count, limit);
          }
          ++lidCount[data.key.split(',')[0]];
        })
        .on('end', writeLidCount);
    }

    function writeLidCount() {
      var lids = Object.keys(lidCount);
      var totalCount = lids.length;
      var count = 0;
      (function handleLids() {
        if (lids.length === 0) {
          return pass3();
        }

        var lid = lids.pop();
        lidInfoDB.get(lid, function(err, data) {
          if (++count % commitSize === 0) {
            logStatus('pass2b', count, totalCount);
          }
          if (err) {
            console.log(err);
          }
          data = JSON.parse(data);
          data.count = lidCount[lid];
          lidInfoDB.put(lid, JSON.stringify(data), handleLids);
        });
      })();
    }

    countLids();
  }

  //pass3{{{1
  var lidDB = levelup('lid.leveldb');
  var patronDB = levelup('patron.leveldb');

  function pass3() { //{{{2

    function process(sourceDB, targetDB, cb) {
      var n = 0;
      var count = 0;
      var current;
      var content = [];

      function next(key) {
        if (current) {
          targetDB.put(current, String(content), function(err) {
            if (err) {
              console.log(err);
            }
          });
        }
        current = key;
        content = [];
      }
      lidpatronDB.createReadStream()
        .on('data', function(data) {
          if (++count % commitSize === 0) {
            logStatus('pass3' + targetDB.location, count, limit);
            console.log(data.key);
          }
          var key = data.key.split(',')[0];
          var val = data.key.split(',')[1];

          if (current !== key) {
            next(key);
          }
          content.push(val);
        })
        .on('end', function() {
          cb();
          next();
        });
    }
    process(lidpatronDB, lidDB, function() {
      process(patronlidDB, patronDB, pass4);
    });
  }

  //pass4{{{1
  function pass4() { //{{{2
    console.log('pass4');
  }

  //stat{{{1
  var t0 = Date.now();
  var prevCount = 0;

  function logStatus(name, nr, total) {
    var t = Date.now() - t0;
    t0 = Date.now();
    console.log(name, nr + '/' + total, t + 'ms', ((total - nr) * t / (nr - prevCount) / 60 / 1000 * 100 | 0) / 100 + 'minutes-remaining');
    prevCount = nr;
  }

  /* //{{{1old
  var count = 0;

  function done() {
    console.log('done');
  }

  var coloansDB = levelup('coloans.leveldb');
  var lidInfoDB = levelup('lid-info.leveldb');
  var lidDB = levelup('lid.leveldb');
  var patronDB = levelup('patron.leveldb');

  var t0 = Date.now();
  var statStep = 2500;
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

      function update(db, key, val, cb) {
        db.get(key, function(err, data) {
          var elems;
          if (err) {
            elems = [];
          } else {
            elems = data.split(',');
          }
          if (elems.length < maxSize && !(val in elems)) {
            elems.push(val);
            db.put(key, String(elems), cb);
          } else {
            cb();
          }
        });

        update(lidDB, lid, patron, function() {
          update(patronDB, patron, lid, function() {
            next();
          });
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
        });
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
          if (err) {
            console.log(err);
          }
          var patrons = data.split(',').slice(0, sampleSize);
          var sampleCount = patrons.length;
          var borrows = {};

          function handlePatrons() {
            if (!patrons.length) {
              return chooseColoans();
            }
            var patron = patrons.pop();
            patronDB.get(patron, function(err, data) {
              if (err) {
                console.log(err);
              }
              var lids = data.split(',');
              lids.forEach(function(lid) {
                if (!borrows[lid]) {
                  borrows[lid] = 1;
                } else {
                  ++borrows[lid];
                }
              });
              handlePatrons();
            });
          }
          handlePatrons();

          function chooseColoans() {
            var coloans = [];
            Object.keys(borrows).forEach(function(lid) {
              coloans.push({
                lid: lid,
                coloans: borrows[lid],
                total: lidStat[lid]
              });
            });
            coloans.sort(function(a, b) {
              return a.coloans < b.coloans;
            });
            if (sampleCount > 1) {
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

  pass1();

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
})(); //{{{1
