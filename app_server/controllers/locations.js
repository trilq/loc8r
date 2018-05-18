var request = require('request');

var apiOptions = {
  server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://calm-river-86440.herokuapp.com";
}

var _formatDistance = function(distance) {
  var numDistance, unit;
  if (distance < 1000) {
    numDistance = parseInt(distance, 10);
    unit = 'm';
  } else {
    numDistance = parseFloat(distance/1000).toFixed(1);
    unit = 'km';
  }
  return numDistance + unit;
}

var renderHomepage = function(req, res, locData) {
  var message;
  var data;
  
  if (locData instanceof Array) {
    if (locData.length) {
      data = locData.map(loc => { 
        loc.distance = _formatDistance(loc.distance);
        return loc;
      });
    } else {
      message = "No places found nearby";
      data = [];
    }
  } else {
      message = "API lookup error";
      data = [];
  }
  
  res.render('locations-list', {
    title : 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r', 
      strapLine: 'Find a place to work near you!'
    },
    sidebar: "Looking for a wifi and a seat ? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint ? Let Loc8r help you find the place you're looking for.",
    locations: data,
    message: message
   });
}

var renderDetailPage = function(req, res, locDetail) {
  res.render('location-info', {
    title: locDetail.name, 
    pageHeader: {title: locDetail.name}, 
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or you don\'t - please leave a review to help other people just like you.' 
    },
    location: locDetail
  });
}

var _showError = function(req, res, statusCode) {
  var title, content;
  if (statusCode === 404) {
    title = "404, page not found";
    content = "Looks like we can't find this page. Sorry.";
  } else {
    title = statusCode + ", something's gone wrong";
    content = "Something, somewhere, has gone wrong.";
  }
  res.status(statusCode);
  res.render('generic-text', {
    title: title,
    content: content
  });
};

var renderReviewForm = function(req, res, locDetail) {
  res.render('location-review-form', {
    title: 'Review ' + locDetail.name + ' on Loc8r',
    pageHeader: {title: 'Review ' + locDetail.name},
    error: req.query.err
  });
}

var getLocationInfo = function(req, res, callback) {
  var requestOptions, path;
  path = '/api/locations/' + req.params.locationid;
  requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      var data = body;
      if (response.statusCode === 200) {
        data.coords = {
          lng: body.coords[0],
          lat: body.coords[1]
        };
        callback(req, res, data);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};

/* Get home page */
module.exports.homelist = function(req, res) {
  var requestOptions, path;
  path = '/api/locations';
  requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
    qs: {
      lng: 106.701187,
      lat: 10.777783,
      distance: 10000
    }
  };
  request(
    requestOptions,
    function(err, response, body) {
      renderHomepage(req, res, body);
    }
  );
};

/* Get 'Location info' page */
module.exports.locationInfo = function(req, res) {
  getLocationInfo(req, res, function(req, res, locDetail) {
    renderDetailPage(req, res, locDetail);
  });
};

/* Get 'Add review' form */
module.exports.addReview = function(req, res) {
  getLocationInfo(req, res, function(req, res, locDetail) {
    renderReviewForm(req, res, locDetail);
  });
};

module.exports.doAddReview = function(req, res) {
  var requestOptions, path, locationid, postdata;
  locationid = req.params.locationid;
  path = "/api/locations/" + locationid + "/reviews";
  postdata = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: postdata
  };
  
  if (!postdata.author || !postdata.rating || !postdata.reviewText) {
    res.redirect('/location/' + locationid + '/review/new?err=val');
  } else {
    request(requestOptions, function(err, response, body) {
      if (response.statusCode === 201) {
        res.redirect('/location/' + locationid);
      } else if (response.statusCode === 400 && body.name && body.name === "ValidationError") {
        res.redirect('/location/' + locationid + '/review/new?err=val');
      } else {
        console.log(body);
        _showError(req, res, response.statusCode);
      }
    });
  }  
};
