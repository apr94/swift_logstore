var config = require('../../config/config')[process.env.NODE_ENV || 'development']
var request = require('request');
var fs = require('fs');
request.defaults({agent: false});
if(process.env.OSPASSWORD){
  config.swift.password = process.env.OSPASSWORD;
}else{
  console.log("Please export OSPASSWORD");
  process.exit(0);
}

var authed = false;
var token = null;
var swifturl = null;

function checkAuth(cb){
  if(authed) return cb(token);
  
  request({method: 'POST', 
           url: config.swift.authurl,
           body: {"auth":{"passwordCredentials":
             {"username": config.swift.username, password: config.swift.password}, 
             "tenantId":config.swift.tenantId}},
           json: true},
  function(e, r, b){
    if(e) return cb(e);
    if(r.statusCode == 200){
      token = b.access.token.id;
      var service = b.access.serviceCatalog.filter(function(item){ return item.name === "swift" })[0];
      swifturl = service.endpoints[0].publicURL;
      console.log("Test Curl Command: curl -H \"X-Auth-Token:" + token + 
                  "\" " + swifturl + "/" + config.swift.container + "?format=json");
      authed = true;
    }
    cb();

  });
}

exports.store = function(req, cb){
  req.pause();
  checkAuth(function(e){
    if (e) cb(e);
    var size = 0;
    req.on('data', function(chunk){
      size += chunk.length;
    });
    req.pipe(request.put({url : swifturl + "/" + config.swift.container + 
                         "/" + req.asset._id + '-' + req.type, 
                          headers: {'X-Auth-Token': token}, pool: false}, 
    function(e, r){
      console.log("Swift store complete ", req.asset._id, 
                  req.type, r.statusCode, "received size = ", size);
      if(e) return cb(e);
      return cb();
    }));
    req.resume();
  });
}
exports.retrieve = function (req, res, cb){
  checkAuth(function(e){
    console.log("Grabbing from swift");
    console.log("Test Curl Command: curl -O -H \"X-Auth-Token:" + token + 
                "\" " + swifturl + "/" + config.swift.container + "/" + req.asset._id + '-' + req.type);

    var r = request.get({url : swifturl + "/" + config.swift.container + "/" + req.asset._id + '-' + req.type, 
                         headers: {'X-Auth-Token': token}, pool: false});
    r.pipe(res);
    r.on('end', function(){
      console.log("request to swift backend finished");
      cb();
    });
  });
}
