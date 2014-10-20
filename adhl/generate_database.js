(function() {
'use strict';
var lineReader = require('line-reader');
var levelup = require('levelup');

var count = 0;

function done() {
  console.log('done');
}

var lends = levelup('lends.leveldb');
var cooccurDB = levelup('cooccur.leveldb');
var lidInfo = levelup('lid-info.leveldb');

var t0 = Date.now();
lineReader.eachLine('../../final_adhl.csv', function(line, last, cb) {
  if(++count % 10000 === 0) {
    console.log(count, Date.now() - t0);
    t0 = Date.now();
  }

  var fields = line.split(',');
  var patron = fields[0];
  var lid =  fields[5];
  var title =  fields[8];
  var author = fields[9];
  var kind = fields[10];

  function inccooccur(a, b, cb) {
    a = +a;
    b = +b;
    if(a<b) {
      var t = a;
      a = b;
      b = t;
    }
    var name = a + ',' + b;

    cooccurDB.get(name, function(err, val) {
      if(err) {
        val = 0;
      } else {
        val = +val;
      }
      ++val;
      cooccurDB.put(name, String(val), function(err) {
        if(err) {
          console.log(err);
        }
      });
    });
  }

  lends.get(patron, function(err, val) {
    if(err) {
      val = [];
    } else {
      val = JSON.parse(val);
    }
    if((val.length < 10000) && !(lid in val)) {
      val.push(lid);
      lends.put(patron, JSON.stringify(val), function(err) {
        if(err) {
          console.log(err);
        }
      });
      if(val.length > 3000) {
        val.shift();
      }
      for(var i = 0; i < val.length; ++i) {
        inccooccur(val[i], lid);
      }
    }
  });
  lidInfo.put(lid, JSON.stringify({title: title, author: author, kind: kind}), function(err) {
    if(err) {
      console.log(err);
    }
    if(last) {
      done();
    } else {
      cb();
    }
  });
});
})();
