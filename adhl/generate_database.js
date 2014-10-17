var lineReader = require('line-reader');

var count = 0;

function done() {
  console.log('done');
}

lineReader.eachLine('../../final_adhl.csv', function(line, last, cb) {
  if(++count % 10000 === 0) {
    console.log('line ' + count);
  }
  if(last) {
    done();
  } else {
    cb();
  }
});
