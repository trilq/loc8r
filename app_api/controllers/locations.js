var mongoose = require('mongoose');
var loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}

module.exports.locationsListByDistance = function(req, res) {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var distance = parseFloat(req.query.distance);
  
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  
  if ((!lng && lng !== 0) || (!lat && lat !== 0)) {
    sendJsonResponse(res, 404, {message: "lng and lat query parameters are required"});
  } else {  
    loc.aggregate([
      { $geoNear: {
        near: point,
        spherical: true,
        maxDistance: distance,
        num: 10,
        distanceField: 'dist' 
      }}],
      function(err, results, stats) {
        var locations = [];
        if (err) {
          sendJsonResponse(res, 404, err);
        } else {
          results.forEach(function(doc) {
            locations.push({
              distance: doc.dist,
              name: doc.name,
              address: doc.address,
              rating: doc.rating,
              facilities: doc.facilities,
              _id: doc._id
            });
          });
          sendJsonResponse(res, 200, locations);
        }
      }
    );
  }
};

module.exports.locationsCreate = function(req, res) {
	loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(","),
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1,
    },
    {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2
    }]
  }, function(err, location) {
    if (err) {
      sendJsonResponse(res, 400, err);  
    } else {
      sendJsonResponse(res, 201, location);
    }
  });
};

module.exports.locationsReadOne = function(req, res) {
  if (req.params && req.params.locationid) {
    loc
      .findById(req.params.locationid)
      .exec(function(err, location) {
        if (!location) {
          sendJsonResponse(res, 404, {message: "locationid not found"});
        } else if (err) {
          sendJsonResponse(res, 400, err);
        } else {
          sendJsonResponse(res, 200, location);
        }
      });
  } else {
    sendJsonResponse(res, 404, {message: "No locationid in request"});
  }
};

module.exports.locationsUpdateOne = function(req, res) {
  if (req.params && req.params.location) {
    loc
      .findById(req.params.locationid)
      .select('-rating -reviews')
      .exec(function(err, location) {
        if (err) {
          sendJsonResponse(res, 400, err);
        } else if (!location) {
          sendJsonResponse(res, 404, {message: "locationid not found"});
        } else {
          location.name = req.body.name;
          location.address = req.body.address;
          location.facilities = req.body.facilities.split(",");
          location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
          location.openingTimes = [
            { 
              days: req.body.days1,
              opening: req.body.opening1,
              closing: req.body.closing1,
              closed: req.body.closed1
            },
            { 
              days: req.body.days2,
              opening: req.body.opening2,
              closing: req.body.closing2,
              closed: req.body.closed2
            },
          ];
          location.save(function(err, loaction) {
            if (err) {
              sendJsonResponse(res, 400, err);
            } else {
              sendJsonResponse(res, 200, location);
            }
          });
        }
      });
    
  } else {
    sendJsonResponse(res, 404, {message: "Not found, locationid required"});
  }
};

module.exports.locationsDeleteOne = function(req, res) {
  var locationid = req.params.locationid;
  if (locationid) {
    loc
      .findByIdAndRemove(locationid)
      .exec(function(err, location) {
        if (err) {
          sendJsonResponse(res, 400, err);
        } else {
          sendJsonResponse(res, 204, null);
        }
      });
  } else {
    sendJsonResponse(res, 404, {message: "Not found, locationid is required"});
  }
};