var mongoose = require('mongoose');

mongoose.connect('mongodb://rohit:yadav@ds155160.mlab.com:55160/urlapp');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var URL = new Schema({
    url : String,
    shortcode : String,
    owner : String,
    hits : Number,
    created_at : Date
});

mongoose.model('URL', URL);
var Url = mongoose.model('URL'); //this is URL model

Url.shortLink = function (urlObj, callback) {
    urlObj.save(callback);
};

Url.getURLFromCode = function (shortcode, callback) {
    var query = {shortcode : shortcode};
    Url.findOneAndUpdate(query,{$inc: {hits : 1}}, callback);
};

module.exports = Url; //export model Url.

