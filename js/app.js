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

		/*
		declares an app, lists all of the modules that should be available to it.
		app then encapsulates everything we need while keeping other variables off the global scope.

		*/
        var app = angular.module('sampleApp', ['SampleModule', 'SampleHttpService', 'ObjectFactory', 'MyObject']);

        /*
        defines the app routes -- app route is everything after the hash -- http://localhost/#/route
        */
        app.config(function ($routeProvider) {
            $routeProvider.
                when('/', {templateUrl: 'partials/home.html'}).
                when('/service', {controller: 'SampleController', templateUrl: 'partials/service.html'}).
                when('/object', {controller: 'SampleObjectController', templateUrl: 'partials/object.html'}).
                when('/http', {controller: 'SampleHttpController', templateUrl: 'partials/http.html'}).
                when('/httpservice', {controller: 'SampleHttpPlusServiceController', templateUrl: 'partials/httpservice.html'}).
                when('/directive1', {controller: 'EmptyController', templateUrl: 'partials/directive1.html'}).
                when('/directive2', {controller: 'EmptyController', templateUrl: 'partials/directive2.html'}).
                when('/directive3', {controller: 'EmptyController', templateUrl: 'partials/directive3.html'}).
                otherwise({redirectTo: '/'});
        });        

    /* 
    instantiates a MyObject, so you can see how it works.
    */
    angular.module('MyObject', []).factory('MyObject', function (ObjectFactory) {
        var MyObject = ObjectFactory({type: 'Mine'});     
        return MyObject;
    });

    /*
    controllers, referenced in the routing table.
    */
    app.controller('EmptyController', ['$scope', function($scope) {
        
      }
    ]);

    app.controller('SampleController', ['$scope', 'SampleModule', function($scope, SampleModule) {
        $scope.contacts = SampleModule.getData();
      }
    ]);

    app.controller('SampleObjectController', ['$scope', 'MyObject', function($scope, MyObject) {
        $scope.contacts = MyObject.getObjectData();
      }
    ]);

    /*
    note the injection of the $http service here 
    contacts.json is just a couple of contacts and should be on local host.
    */
    app.controller('SampleHttpController', ['$scope', '$http', function($scope, $http) {
    $http({method: "get", url: "contacts.json", cache: false}). 
      success(function(data) { 
        $scope.contacts = data;
      }).
      error(function() { 
        console.log('error');
      });
        }
    ]);

        /*
        the most helpful quesiton on stack exchange about this
        http://stackoverflow.com/questions/13937318/convert-angular-http-get-function-to-a-service
        */
        app.controller('SampleHttpPlusServiceController', ['$scope', 
          'SampleHttpService', function($scope, SampleHttpService) {
            SampleHttpService.getData(function(data) {
              $scope.contacts = data;
            });
          }
        ]);


/*
Cribbed from @CodeFriar because I was borking on how to work it.  
Then I deleted all his really excellent comments just so I could read it more easily.
If you want to have some fun, change the name to "simpleDirective" camel case and watch
the partial break.  Apparently AngularJS changes these to hyphenated text -- 
*/
app.directive('simpledirective', function(){
	return {
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<h1>This Is A Simple Directive</h1><p>Really.</p>', // you can inline some html in a string here
		link: function($scope, iElm, iAttrs, controller) {
			//all directives must return a link function, but the link function doesn't
			//have to actually do anything.
		}
	};
});

/*
Another directive, cribbed largely from @CodeFriar's original work.
*/
app.directive('contactsdirective', function(){
	return {
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		controller: ["$scope", "$element", "$attrs", "$transclude", "SampleModule",
      		function($scope, $element, $attrs, $transclude, SampleModule) {
      			$scope.contacts = SampleModule.getData();
      		 }],
		template: '<ul>	<div ng-repeat="current in contacts">{{current.Id}}: {{current.Name}}</div>', // you can inline some html in a string here
		link: function($scope, iElm, iAttrs, controller) {
			//all directives must return a link function, but the link function doesn't
			//have to actually do anything.
		}
	};
});

app.directive('httpcontactsdirective', function(){
  return {
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    controller: ["$scope", "$element", "$attrs", "$transclude", "SampleHttpService",
          function($scope, $element, $attrs, $transclude, SampleHttpService) {
            SampleHttpService.getData(function(data) {
              $scope.contacts = data;
            });
           }],
    template: '<ul> <div ng-repeat="current in contacts">{{current.Id}}: {{current.Name}}</div>', // you can inline some html in a string here
    link: function($scope, iElm, iAttrs, controller) {
      //all directives must return a link function, but the link function doesn't
      //have to actually do anything.
    }
  };
});




