var config = require('../../config/config')[process.env.NODE_ENV || 'development']
var fs = require('fs');
var storage_dir = __dirname + '/../../tmp';
var mkdirp = require('mkdirp');
mkdirp.sync(storage_dir);

exports.store = function(req, cb){
  req.pause();
  console.log("writing file to " + storage_dir + "/" + req.asset._id + '-' + req.type + ((req.type == 'application/gzip') ? '.tar.gz' : '.txt'));
  var fileh = fs.createWriteStream(storage_dir + "/" + req.asset._id + '-' + req.type + ((req.type == 'application/gzip') ? '.tar.gz' : '.txt'));
  var size = 0;
  req.on('data', function(chunk){
    size += chunk.length;
  });
  req.pipe(fileh);
  req.on('end', function(){
    console.log("local file upload complete");
    cb();
  });
  req.resume();
}
exports.retrieve = function (req, res, cb){

  console.log("reading file from " + storage_dir + "/" + req.asset._id + '-' + req.type + ((req.type == 'application/gzip') ? '.tar.gz' : '.txt'));
  var r = fs.createReadStream(storage_dir + "/" + req.asset._id + '-' + req.type + ((req.type == 'application/gzip') ? '.tar.gz' : '.txt'));
  r.pipe(res);
  r.on('end', function(){
    console.log("request to local backend finished");
    cb();
  });
}
