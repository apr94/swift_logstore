var mongoose = require('mongoose')
,   Schema = mongoose.Schema

var AssetSchema = new Schema({
    title: {type : String, default : '', trim : true}
  , to: {type : String, default : '', trim : true, index :{}}
  , from: {type : String, default : '', trim : true, index :{}}
  , creator: {type: String}
  , createdAt: {type: Date, default : Date.now}
  , logId: {type: String}
  , notificationSent: {type: Boolean}
  , seen: {type: Boolean, default: false}
  , expireAt: {type: Date, default : null}
});

mongoose.model('Asset', AssetSchema);
