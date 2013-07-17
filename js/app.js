/*
	Sangular
  https://github.com/ReidCarlberg/Sangular
  various declarations that help build modules, all of which are available to the app.
*/

/*
Simplest way to deliver data: encapsulate it in a module.
This toy example simply returns a JSON string.
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
				//constructor--non-toy would do something with the params.
			}
      //instances of this would all have access to this data.
			AbstractObject.getObjectData = function() {
				return [{"Id": "Three", "Name": "NameThree"}, {"Id": "Four", "Name": "NameFour"}];
			}

			return AbstractObject;
		}

		return ObjectFactory;
	});




