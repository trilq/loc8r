var mongoose = require('mongoose');
var loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}

module.exports.locationsListByDistance = function(req, res) {
  sendJsonResponse(res, 200, {status: "successs"});
};

module.exports.locationsCreate = function(req, res) {
  sendJsonResponse(res, 200, {status: "successs"});
};

module.exports.locationsReadOne = function(req, res) {
  if (req.params && req.params.locationid) {
    loc
      .findById(req.params.locationid)
      .exec(function(err, location) {
        if (!location) {
          sendJsonResponse(res, 404, {message: "location not found"});
        } else if (err) {
          sendJsonResponse(res, 404, err);
        } else {
          sendJsonResponse(res, 200, location);
        }
      });
  } else {
    sendJsonResponse(res, 404, {message: "No locationid in request"});
  }
};

module.exports.locationsUpdateOne = function(req, res) {
  sendJsonResponse(res, 200, {status: "successs"});
};

module.exports.locationsDeleteOne = function(req, res) {
  sendJsonResponse(res, 200, {status: "successs"});
};