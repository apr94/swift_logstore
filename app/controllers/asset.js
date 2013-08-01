var mongoose = require('mongoose')
,   Asset = mongoose.model('Asset')
var storage;
var config = require('../../config/config')[process.env.NODE_ENV || 'development']
if(process.env.OSPASSWORD){
	storage = require('../helpers/swift');
	console.log('Using swift storage backend');
	config.swift.password = process.env.OSPASSWORD;
}else{
	storage = require('../helpers/localstore');
	console.log("No OSPASSWORD using local storage");
}

exports.create = function(req, res, next){
	var noData = function(){
		console.log("request missing data");
		res.info = {error: "No data in request"};
		return next();
	}
	if(!req.body) return noData();
	if(!req.body.to) return noData();
	if(!req.body.from) return noData();
	if(!req.body.title) return noData();

	console.log("creating asset");
	var asset = new Asset(req.body);
	asset.save(function(err, doc){
			if(err){
			return next(err);
			}
			console.log("Created asset", doc);
			res.info =  {success: "asset created", id: doc._id};
			next();
			});
}
exports.storeLog = function(req, res, next){
	req.type = 'application/gzip';
	storage.store(req, function(e){
			if(e) {
			return res.send(e);
			}
			res.info =  {success: "log asset stored"};
			next();
			});
};

exports.getLog = function(req, res, next){
	req.type = 'application/gzip';
	res.setHeader('Content-type','text/plain');
	res.setHeader('Content-Encoding','gzip');
	res.setHeader('Content-Disposition', 'attachment; filename="log.tar.gz"');
	console.log("Grabbing logs");
	storage.retrieve(req, res, function(){
			console.log('storage retrieve finished');
			});

};


