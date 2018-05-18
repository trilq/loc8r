var mongoose = require('mongoose');
var loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}

var updateAverageRating = function(location) {
  var i, reviewCount, ratingAverage, ratingTotal;
  if (location.reviews && location.reviews.length > 0) {
    reviewCount = location.reviews.length;
    ratingTotal = 0;
    for (i = 0; i < reviewCount; i++) {
      ratingTotal += location.reviews[i].rating;
    }
    ratingAverage = parseInt(ratingTotal/reviewCount, 10);
    location.rating = ratingAverage;
  }
};

var _doAddReview = function(req, res, location) {
  if (!location) {
    sendJsonResponse(res, 404, { message: "location not found" });
  } else {
    location.reviews.push({
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });
    updateAverageRating(location);
    
    location.save(function(err, location) {
      var thisReview;
      if (err) {
        console.log(err);
        sendJsonResponse(res, 400, err);
      } else {
        thisReview = location.reviews[location.reviews.length - 1];
        sendJsonResponse(res, 201, thisReview);
      }
    });
  }
};

module.exports.reviewsCreate = function(req, res) {
  var locationid = req.params.locationid;
  if (locationid) {
    loc
      .findById(locationid)
      .select('reviews')
      .exec(
        function(err, location) {
          if (err) {
             sendJsonResponse(res, 404, err);
          } else {
            _doAddReview(req, res, location);
          }
        }
    );
  } else {
    sendJsonResponse(res, 404, { message: "Not found, locationid required" });
  }
};

module.exports.reviewsReadOne = function(req, res) {
  if (req.params && req.params.locationid && req.params.reviewid) {
    loc
      .findById(req.params.locationid)
      .select('name reviews')
      .exec(function(err, location) {
        var response, review;
        if (!location) {
          sendJsonResponse(res, 404, {message: "locationid not found"});
        } else if (err) {
          sendJsonResponse(res, 404, err);
        } else {
          if (location.reviews && location.reviews.length > 0) {
            review = location.reviews.id(req.params.reviewid);
            if (!review) {
              sendJsonResponse(res, 404, {message: "reviewid not found"});
            } else {
              response = {
                location: { name: location.name, _id: req.params.locationid },
                review: review
              };
              sendJsonResponse(res, 200, response);
            }
          } else {
            sendJsonResponse(res, 404, {message: "No reviews found"});
          }
        }
      });
  } else {
    sendJsonResponse(res, 404, {message: "No locationid and/or reviewid in request"});
  }
};

module.exports.reviewsUpdateOne = function(req, res) {
  if (!req.params.locationid || !req.params.reviewid) {
    sendJsonResponse(res, 404, {message: "Not found, both locationid and reviewid are required"});
  } else {
    loc 
      .findById(req.params.locationid)
      .select('rating review')
      .exec(function(err, location) {
        var thisReview;
        if (err) {
          sendJsonResponse(res, 400, err);
        } else if (!location) {
          sendJsonResponse(res, 404, {message: "locationid not found"});
        } else {
          if (location.reviews && location.reviews.length > 0) {
            thisReview = location.reviews.id(req.params.reviewid);
            if (!thisReview) {
              sendJsonResponse(res, 404, {message: "reviewid not found"});
            } else {
              thisReview.author = req.body.author;
              thisReview.rating = req.body.rating;
              thisReview.reviewText = req.body.reviewText;
              updateAverageRating(location);
              
              location.save(function(err, location) {
                if (err) {
                  sendJsonResponse(res, 400, err);
                } else {
                  sendJsonResponse(res, 200, theReview);
                }
              });
            }
          } else {
            sendJsonResponse(res, 404, {message: "No review to update"});
          }
        }
      });
  }
};

module.exports.reviewsDeleteOne = function(req, res) {
  if (!req.params.locationid || !req.params.reviewid) {
    sendJsonResponse(res, 404, { message: "Not found, both locationid and reviewid are required" });
  } else {
    loc 
      .findById(req.params.locationid)
      .select('reviews')
      .exec(function(err, location) {
        if (err) {
          sendJsonResponse(res, 400, err);
        } else if (!location) {
          sendJsonResponse(res, 404, { message: "location not found"});
        } else {
          if (location.reviews && location.reviews.length > 0) {
            location.reviews.id(req.params.reviewid).remove();
            updateAverageRating(location);
            
            location.save(function(err, location) {
              if (err) {
                sendJsonResponse(res, 400, err);
              } else {
                sendJsonResponse(res, 204, null);
              }
            });
          } else {
            sendJsonResponse(res, 404, { message: "no review to delete"});
          }
        }
      });
  }
};