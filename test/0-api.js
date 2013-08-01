var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var config = require('../config/config')[process.env.NODE_ENV || 'development'];
var collection;
var request = require("request");
var fs = require("fs");
var checksum = require('checksum');
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200);
    res.end();
}).listen(4001, '127.0.0.1');

describe('Test REST API', function(){
  var assetId = null;
  before(function(done){
    require('../server.js');
    this.timeout(200);
    if(fs.exists(__dirname + '/downloads/log.tar.gz')) fs.unlinkSync(__dirname + '/downloads/log.tar.gz');
    MongoClient.connect(config.db, function(err, db){
      collection = db.collection('assets');
      collection.drop(function(err){
        done();
      });
    });
  });
  it("Should respond 200OK with an error key POST /asset without correct json data in body", function(done){
    request.post({url: "http://localhost:4000/asset", json:true}, function(e, r, b){
      console.log(b.error);
      assert.ok(!e);
      assert.ok(b.error);
      done();
    });

  });

  it("Should respond 200OK with id in json and create an empty asset POST /asset", function(done){
    request.post({url: "http://localhost:4000/asset", json:true, body: {title: "hey", to: 'bryan@test.com', from: 'test@test.com'}}, function(e, r, b){
      console.log(b);
      assert.ok(!e);
      assert.ok(!b.error);
      assert.ok(b);
      assert.ok(b.id);
      assetId = b.id;
      done();
    });

  });
  it("Should respond 200OK and store the log asset in swift PUT /asset/:id/log", function(done){
    this.timeout(5000);
    assert.ok(assetId);
    fs.createReadStream(__dirname + '/assets/log.txt')
    .pipe(request.put({url: "http://localhost:4000/asset/" + assetId + "/log", pool: false}, function(e, r){
      assert.equal(r.statusCode , 200);
      done();
    }));

  });
  it("Should respond 200OK and retrieve the zipped log asset in swift GET /asset/:id/log", function(done){
    this.timeout(5000);
    assert.ok(assetId);
    var filename = __dirname + '/download/log.tar.gz';
    var writeStream = fs.createWriteStream(filename);
    var r = request.get({url: "http://localhost:4000/asset/" + assetId + "/log"});
    r.pipe(writeStream);
    r.on('end', function(){
      console.log("File download complete, checking checksums");
      checksum.file(filename, function(err, sum1){
        checksum.file(__dirname + '/assets/log.txt', function(err, sum2){
          assert.equal(sum1, sum2);
          done();
        });
      });
    });

  });
  it.skip("Should respond 200OK and retreive JSON data on asset GET /asset/:id", function(done){


  });

});
