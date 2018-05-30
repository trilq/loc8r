var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations-ng');
var ctrlOthers = require('../controllers/others');

/* Location pages */
router.get('/', ctrlLocations.goHome);
router.get('/location/near', ctrlLocations.listLocations);
router.get('/location/:locationid', ctrlLocations.locationInfo);
router.get('/location/:locationid/review/new', ctrlLocations.addReview);
router.post('/location/:locationid/review/new', ctrlLocations.doAddReview);

/* Other pages */
router.get('/about', ctrlOthers.about);

module.exports = router;
