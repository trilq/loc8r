var mongoose = require('mongoose');
var loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}

module.exports.reviewsCreate = function(req, res) {
  sendJsonResponse(res, 200, {status: "successs"});
};

module.exports.reviewsReadOne = function(req, res) {
  sendJsonResponse(res, 200, {status: "successs"});
};

module.exports.reviewsUpdateOne = function(req, res) {
  sendJsonResponse(res, 200, {status: "successs"});
};

module.exports.reviewsDeleteOne = function(req, res) {
  sendJsonResponse(res, 200, {status: "successs"});
};