var request = require('request');
var config = require('../../config/config')[process.env.NODE_ENV || 'development'];
if(config.notificationUrl && config.serviceUrl){
  console.log("Using " + config.notificationUrl + " for notifications");
}else{
  console.log("no notificationUrl in config exiting");
  process.exit();
}
var EVENT_NAME = 'new-log-mail';

exports.newLog = function(req, res, next){
  var data = {
    to: req.asset.to,
    from: req.asset.from,
    msg: { event: EVENT_NAME, logUrl: config.serviceUrl + 'asset/' + req.asset._id + '/log',
           title: req.asset.title }
  };
  request.post({url: config.notificationUrl, json: true, body: data}, 
    function(e, r, b){
      if(e) return next(e);
      console.log('Notification sent');
      next();
    });
}
