/* Get home page */
module.exports.homelist = function(req, res) {
	res.render('locations-list', {
    title : 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r', 
      strapLine: 'Find a place to work near you!'
    },
    locations: [{
      name: 'Starcups',
      address: '125 High Street, Reading, RG6 1PS, London',
      rating: 3,
      facilities: ['Hot drinks', 'Food', 'Premium wifi'],
      distance: '100m'
    },{
      name: 'Cafe Central',
      address: '115 Nguyen Hue Boulevard, Ben Nghe Ward, District 1, Saigon',
      rating: 4,
      facilities: ['Hot drinks', 'Food', 'Premium wifi'],
      distance: '200m'
    }, {
      name: 'Burger Queen',
      address: '125 High Street, Reading, RG6 1PS, London',
      rating: 2,
      facilities: ['Food', 'Premium wifi'],
      distance: '250m'
    }]
   });
};

/* Get 'Location info' page */
module.exports.locationInfo = function(req, res) {
	res.render('location-info', {
    title: 'Cafe Central', 
    pageHeader: {title: 'Cafe Central'}, 
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or you don\'t - please leave a review to help other people just like you.' 
    },
    location: {
      name: 'Cafe Central',
      address: '115 Nguyen Hue Boulevard, Ben Nghe Ward, District 1',
      rating: 3,
      facilities: ['Hot drinks', 'Food', 'Premium wifi'],
      coords: {lat: 10.773861, lng: 106.703683},
      openingTimes: [{
        days: 'Monday - Friday',
        opening: '7:00am',
        closing: '7:00pm',
        closed: false
      }, {
        days: 'Saturday',
        opening: '8:00am',
        closing: '5:00pm',
        closed: false
      }, {
        days: 'Sunday',
        closed: true
      }],
      reviews: [{
        author: 'Tri Le',
        rating: 5,
        timestamp: '20 Apr 2018',
        reviewText: 'What a great place. I can\'t say enough good things about it.'
      }, {
        author: 'Charlie Chaplin',
        rating: 3,
        timestamp: '16 June 2013',
        reviewText: 'It was okay. Coffee wasn\'t great, but the wifi was fast.'
      }]
    }
  });
};

/* Get 'Add review' page */
module.exports.addReview = function(req, res) {
	res.render('location-review-form', {
    title: 'Review Starcups on Loc8r',
    pageHeader: {title: 'Review Starcups'}
  });
};
