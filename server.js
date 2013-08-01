
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , fs = require('fs')
  , config = require('./config/config')[process.env.NODE_ENV || 'development']
  , path = require('path');

var app = express();

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
    mongoose.connect(config.db);


var models_path = __dirname + '/app/models'
 , model_files = fs.readdirSync(models_path);
   model_files.forEach(function(file) {
   require(models_path+'/'+file)
   });
// controllers
var asset = require('./app/controllers/asset')
  , notifications = require('./app/controllers/notifications')
  , Asset = mongoose.model('Asset');

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
function respond(req, res){
  if(res.info) res.json(res.info);
  else res.json({error: 'No response given'});
}

app.post('/asset', express.bodyParser(), asset.create, respond);
app.put('/asset/:id/log', asset.storeLog, notifications.newLog, respond);
app.get('/asset/:id/log', asset.getLog, respond);
app.param('id', function(req, res, next, id){
  Asset.findOne({ _id: id})
  .exec(function(err, item){
    if(err) return next(err);
    if(!item) return res.send(404);
    req.asset = item;
    next();
  });
});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
