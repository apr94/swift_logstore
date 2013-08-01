var request = require("request");
var fs = require("fs");
var assetId;


var data = {title:'Hey look at this', to: 'bryan@comcast.net', from: 'test@comcast.net'};

request.post({url: "http://localhost:4000/asset", json:true, body: data},
  function(e, r, b){
    assetId = b.id;
    if(!assetId){
      console.log("NO asset id returned failing and exiting");
      process.exit();
    }
    fs.createReadStream(__dirname + '/../test/assets/video.mp4')
    .pipe(request.put({url: "http://localhost:4000/asset/" + assetId + "/video", pool: false}, 
      function(e, r){
        if(r.statusCode == 200)
          console.log("Video uploaded"); 
        else
          console.log('video upload failed');
      }));
    fs.createReadStream(__dirname + '/../test/assets/thumb.jpg')
    .pipe(request.put({url: "http://localhost:4000/asset/" + assetId + "/thumb", pool: false}, 
      function(e, r){
        if(r.statusCode == 200)
          console.log("thumb uploaded"); 
        else
          console.log('thumb upload failed');
      }));
  });

