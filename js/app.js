/*
	various declarations that help build modules, all of which are available to the app.
*/


angular.module('SampleModule', []).
    service('SampleModule', function () {
    	this.getData = function() {
    		return [{"Id": "One", "Name": "NameOne"}, {"Id": "Two", "Name": "NameTwo"}];
    	};
 });


/*
modeled on
http://stackoverflow.com/questions/13937318/convert-angular-http-get-function-to-a-service

This is injected into a controller as is.
*/
angular.module('SampleHttpService', []).
    factory('SampleHttpService', ['$http', function ($http) {
		return{
		      getData: function(callback){
		          $http.get('contacts2.json').success(function(data) {
		          callback(data);
		        });
		      }
		  }
		}]);

/*
Instances of this are injected into a controller
*/
angular.module('ObjectFactory', []).
	factory('ObjectFactory', function() {
		function ObjectFactory(params) {
			var type = params.type;

			function AbstractObject(params) {
				//constructor
			}

			AbstractObject.getObjectData = function() {
				return [{"Id": "Three", "Name": "NameThree"}, {"Id": "Four", "Name": "NameFour"}];
			}

			return AbstractObject;
		}

		return ObjectFactory;
	});

// add a namespace for custom directives
// add a namespace for custom directives
angular.module('mydirectives', []);

angular.module('mydirectives').directive('simple', function() {
  return {
    restrict: 'A',
    transclude: true,
    template: '<h1>Simple</h1>'
  };
});

function Ctrl2($scope) {
  $scope.format = 'M/d/yy h:mm:ss a';
}
 
angular.module('time', [])
  // Register the 'myCurrentTime' directive factory method.
  // We inject $timeout and dateFilter service since the factory method is DI.
  .directive('myCurrentTime', function($timeout, dateFilter) {
    // return the directive link function. (compile function not needed)
    return function(scope, element, attrs) {
      var format,  // date format
          timeoutId; // timeoutId, so that we can cancel the time updates
 
      // used to update the UI
      function updateTime() {
        element.text(dateFilter(new Date(), format));
      }
 
      // watch the expression, and update the UI on change.
      scope.$watch(attrs.myCurrentTime, function(value) {
        format = value;
        updateTime();
      });
 
      // schedule update in one second
      function updateLater() {
        // save the timeoutId for canceling
        timeoutId = $timeout(function() {
          updateTime(); // update DOM
          updateLater(); // schedule another update
        }, 1000);
      }
 
      // listen on DOM destroy (removal) event, and cancel the next UI update
      // to prevent updating time after the DOM element was removed.
      element.bind('$destroy', function() {
        $timeout.cancel(timeoutId);
      });
 
      updateLater(); // kick off the UI update process.
    }
  });

