(function() {
  'use strict';
  var http = require('http');
  var levelup = require('levelup');
  var lidInfoDB = levelup('lid-info.leveldb');
  var lidDB = levelup('lid.leveldb');
  var patronDB = levelup('patron.leveldb');
  var relatedDB = levelup('related.leveldb');
  var maxSamples = 1000;
  var relatedCount = 100;

  function related(lid, res) {
    var t0 = Date.now();
    relatedDB.get(lid, function(err, data) {
      if (err || !data) {
        lidDB.get(lid, function(err, patrons) {
          if (err) {
            return res.end('{"error":"local id not found"}');
          }
          patrons = JSON.parse(patrons);
          patrons = patrons.slice(0, maxSamples);
          var coloans = {};

          function traverse() {
            if (patrons.length === 0) {
              return summariseResult();
            }
            var patron = patrons.pop();
            patronDB.get(patron, function(err, data) {
              if (err || !data) {
                console.log(err, data);
                return traverse();
              }
              var books = JSON.parse(data);
              for (var i = 0; i < books.length; ++i) {
                coloans[books[i]] = (coloans[books[i]] || 0) + 1;
              }
              traverse();
            });
          }
          traverse();

          function summariseResult() {
            var result = Object.keys(coloans).map(function(coloan) {
              var n = coloans[coloan];
              var total = +coloan.split(',')[1];
              var weight = n / Math.log(total + 10) * 1000 | 0;
              return [coloan.split(',')[0], weight];
            });
            result.sort(function(a, b) {
              return b[1] - a[1];
            });
            console.log('time:', (Date.now() - t0) / 1000);
            result = JSON.stringify(result.slice(0, relatedCount));
            relatedDB.put(lid, result);
            return res.end(result);
          }
        });
      } else {
        return res.end(data);
      }
    });
  }

  http.createServer(function(req, res) {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });

    var urlParts = req.url.split('/');
    if (urlParts[1] === 'info') {
      lidInfoDB.get(urlParts[2], function(err, data) {
        res.end(err ? '{"error":"local id not found"}' : data);
      });
    } else if (urlParts[1] === 'related') {
      related(urlParts[2], res);
    } else {
      res.end('{"error":"unsupported method"}');
    }
  }).listen(process.env.PORT || 1337, '0.0.0.0');
})();
