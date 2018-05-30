angular.module('loc8rApp', []);

angular.module('loc8rApp').config( [ '$locationProvider', function( $locationProvider ) {
   // In order to get the query string from the
   // $location object, it must be in HTML5 mode.
   $locationProvider.html5Mode( true );
}]);

// Data service  
var loc8rData = function($http) {
  var request = function(lng, lat, distance) {
    return $http({
      method: 'GET',
      url:'/api/locations?lng=' + lng + '&lat=' + lat + '&distance=' + distance
    });
  };
  return {
    request: request
  };
}

angular.module('loc8rApp').service('loc8rData',loc8rData);

// Geolocation service
var geolocation = function() {
  var getPosition = function(cbSuccess, cbError, cbNoGeo) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
    } else {
      cbNoGeo();
    }
  };
  
  return {
    getPosition: getPosition
  };
};

angular.module('loc8rApp').service('geolocation', geolocation);

// Location list controller
var locationListCtrl = function($scope, $attrs, loc8rData, geolocation) {
  
  var getData = function(position) {
    $scope.message = "Searching for nearby places...";
    
    var lng = position.coords.longitude;
    var lat = position.coords.latitude;
    var distance = $attrs.distance;
    
    console.log(lng);
    console.log(lat);
    console.log(distance);
    
    loc8rData.request(lng, lat, distance).then(
      function(response) {
        $scope.message = response.data.length > 0 ? "" : "No locations found.";
        $scope.data = {
          locations: response.data
        };
      },
      function(err) {
        $scope.message = "Sorry, something's gone wrong.";
      }
    );
  };
  
  var showError = function(error) {
    $scope.$apply(function() {
      $scope.message = error.message;
    });
  };
  
  var noGeo = function() {
    $scope.$apply(function() {
      $scope.message = "Geolocation is not supported by this browser.";
    });
  };
  
  geolocation.getPosition(getData, showError, noGeo);
  
};

angular.module('loc8rApp').controller('locationListCtrl', locationListCtrl);

// Draw map
var displayMap = function(lat, lng, div) {
  
  var styledMapType = new google.maps.StyledMapType([{
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }],
  {name: 'Styled Map'});
  
  var myLatLng = {lat: lat, lng: lng};
  
  var map = new google.maps.Map(document.getElementById(div), {
    center: myLatLng,
    zoom: 17,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
              'styled_map']
    }
  });
  
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');
  
  var image = {
    url: 'https://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=home%7Cbb%7CYou+are+here+!%7CFFBB00%7C000000',
    size: new google.maps.Size(156, 40),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(0,40),
  };
  
  var marker = new google.maps.Marker({
    position: myLatLng,
    icon: image
  });
  
  marker.setMap(map);
}

// Home controller
var homeCtrl = function($scope, geolocation) {
  
  $scope.located = false;
  $scope.errorMessage = '';
  
  var getData = function(position) {
 
    $scope.located = true;
    $scope.lng = position.coords.longitude;
    $scope.lat = position.coords.latitude;
    
    displayMap($scope.lat, $scope.lng, 'map')
    
    console.log($scope.lng);
    console.log($scope.lat);

  };
  
  var showError = function(error) {
    $scope.$apply(function() {
      $scope.errorMessage = error.message;
    });
  };
  
  var noGeo = function() {
    $scope.$apply(function() {
      $scope.errorMessage = "Geolocation is not supported by this browser";
    });
  };
  
  geolocation.getPosition(getData, showError, noGeo);
}

angular.module('loc8rApp').controller('homeCtrl', homeCtrl);

// Valodate if a variable is a number
var _isNumeric = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

// Filter - Format distance for display
var formatDistance = function() {
	return function(distance) {
		var numDistance,
		unit;
		if (distance && _isNumeric(distance)) {
			if (distance < 1000) {
				numDistance = parseInt(distance, 10);
				unit = 'm';
			} else {
				numDistance = parseFloat(distance / 1000).toFixed(1);
				unit = 'km';
			}
			return numDistance + unit;
		} else {
			return "?";
		}
	};
};

// Directive - Display rating stars]
var ratingStars = function() {
	return {
		scope: {
			thisRating: '=rating'
		},
		templateUrl: "/angular/rating-stars.html"
	};
};

angular.module('loc8rApp')
.filter('formatDistance', formatDistance)
.directive('ratingStars', ratingStars);
