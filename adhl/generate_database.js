(function() {
  //
  //  - pass 1 (32min)
  //    - generate lid,patron and patron,lid DBs
  //    - generate lid-info DB
  //  - pass 2 (16min)
  //    - add count in lid-info DB
  //  - pass 3 (18min)
  //    - collapse lid,patrons to lid->patrons
  //    - collapse patron,lid to patron->(lids,count)
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

    function process(sourceDB, targetDB, infoMap, cb) {
      var n = 0;
      var count = 0;
      var current;
      var content = [];

      function next(key) {
        if (current) {
          targetDB.put(current, JSON.stringify(content), function(err) {
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
          }
          var key = data.key.split(',')[0];
          var val = data.key.split(',')[1];

          if (current !== key) {
            next(key);
          }
          if(infoMap) {
            val = [val, infoMap[val]];
          }
          content.push(val);
        })
        .on('end', function() {
          cb();
          next();
        });
    }
    process(lidpatronDB, lidDB, false, function() {
      process(patronlidDB, patronDB, lidCount, done);
    });
  }

  //pass4{{{1
  function done() { //{{{2
    console.log('done');
  }

  //stat{{{1
  var t0 = Date.now();
  var prevCount = 0;

  function logStatus(name, nr, total) {
    var t = Date.now() - t0;
    t0 = Date.now();
    console.log(String(new Date()), name, nr + '/' + total, t + 'ms', ((total - nr) * t / (nr - prevCount) / 60 / 1000 * 100 | 0) / 100 + 'minutes-remaining');
    prevCount = nr;
  }

})(); //{{{1
