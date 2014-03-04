'use strict';
/**
 * ngCompletr
 *
 * Defines the autocomplete widget.
 */
(function(window, angular, undefined) {
  angular.module('ngCompletr', [])
    .run(['$templateCache', function ($templateCache) {
      $templateCache.put('ngCompletr.html', '<div class="ng-completr-holder"><span ng-transclude></span><div class="ng-completr-dropdown" ng-if="showDropdown"><div class="ng-completr-searching" ng-show="searching">Searching...</div><div class="ng-completr-no-results" ng-show="!searching && (!results || results.length == 0)">No results found</div><div class="ng-completr-row" ng-repeat="result in results" ng-click="selectResult(result)" ng-mouseover="hoverRow()" ng-class="{\'ng-completr-selected-row\': $index == currentIndex}"><div ng-if="imageField" class="ng-completr-image-holder"><img ng-if="result.image && result.image != \'\'" ng-src="{{result.image}}" class="ng-completr-image"/><div ng-if="!result.image && result.image != \'\'" class="ng-completr-image-default"></div></div><div class="ng-completr-title" ng-if="matchClass" ng-bind-html="result.title"></div><div class="ng-completr-title" ng-if="!matchClass">{{ result.title }}</div><div ng-if="result.description && result.description != \'\'" class="ng-completr-description">{{result.description}}</div></div></div></div>');
    }])
    .directive('ngCompletr', ['$timeout', '$http', '$compile', function($timeout, $http, $compile) {
      return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
          'id': '@id',
          'query': '=ngCompletrQuery',
          'source': '=ngCompletrSource',
          'delay': '@ngCompletrDelay',
          'minLength': '@ngCompletrMinLength',
          'searchFields': '@ngCompletrSearchFields',
          'dataField': '@ngCompletrDataField',
          'titleField': '@ngCompletrTitleField',
          'descriptionField': '@ngCompletrDescriptionField',
          'imageField': '@ngCompletrImageField',
          'selectedObject': '=ngCompletrResult',
          'selectedCallback': '=ngCompletrResultCallback',
        },
        templateUrl: 'ngCompletr.html',
        link: function($scope, element) {
          var keys = {
            'down': 40,
            'up': 38,
            'return': 13,
            'esc': 27,
            'backspace': 8
          };

          var minLength, delay;

          $scope.inputElement = element.find('input');
          $scope.inputElement.attr('ng-model', 'query');
          $compile($scope.inputElement)($scope);

          if ($scope.minLength) {
            $scope.minLength = parseInt($scope.minLength, 10);
          }

          minLength = $scope.minLength ? $scope.minLength : 3;

          if ($scope.delay) {
            $scope.delay = parseInt($scope.delay, 10);
          }

          delay = $scope.delay ? $scope.delay : 100;

          $scope.showDropdown = false;
          $scope.searching = false;
          $scope.lastSearchTerm = null;
          $scope.results = [];
          $scope.currentIndex = null;
          $scope.searchTimer = null;

          var isNewSearchNeeded = function(newTerm, oldTerm) {
            return newTerm.length >= minLength && newTerm !== oldTerm;
          };

          $scope.selectResult = function(result) {
            $scope.query = $scope.lastSearchTerm = result.title;
            $scope.selectedObject = result;
            if (angular.isFunction($scope.selectedCallback)) {
              $scope.selectedCallback(result);
            }
            $scope.showDropdown = false;
            $scope.results = [];
          };

          $scope.hoverRow = function(index) {
            $scope.currentIndex = index;
          };

          $scope.processResults = function(results) {
            if (results && results.length > 0) {
              $scope.results = [];

              var titleFields = [];
              if ($scope.titleField && $scope.titleField !== '') {
                titleFields = $scope.titleField.split(',');
              }

              for (var i = 0; i < results.length; i++) {
                var title = '';
                var description = '';
                var image = '';

                if (angular.isString(results[i])) {
                  title = results[i];
                }
                else {
                  var titleCode = [];

                  for (var t = 0; t < titleFields.length; t++) {
                    titleCode.push(results[i][titleFields[t]]);
                  }

                  if ($scope.descriptionField) {
                    description = results[i][$scope.descriptionField];
                  }

                  if ($scope.imageField) {
                    image = results[i][$scope.imageField];
                  }

                  title = titleCode.join(' ');
                }

                var resultRow = {
                  title: title,
                  description: description,
                  image: image,
                  originalObject: results[i]
                };

                $scope.results[$scope.results.length] = resultRow;
              }
            } else {
              $scope.results = [];
            }
          };

          $scope.searchTimerComplete = function(str) {
            if (angular.isArray($scope.source)) {
              var searchFields = $scope.searchFields.split(',');
              var matches = [];

              for (var i = 0; i < $scope.source.length; i++) {
                var match = false;

                if (angular.isString($scope.source[i])) {
                  match = ($scope.source[i].toLowerCase().indexOf(str.toLowerCase()) >= 0);
                }
                else {
                  for (var s = 0; s < searchFields.length; s++) {
                    match = match || ($scope.source[i][searchFields[s]].toLowerCase().indexOf(str.toLowerCase()) >= 0);
                  }
                }

                if (match) {
                  matches[matches.length] = $scope.source[i];
                }
              }

              $scope.searching = false;
              $scope.processResults(matches, str);
            }

            if (angular.isFunction($scope.source)) {
              // Do function search
            }

            if (angular.isString($scope.source)) {
              $http.get($scope.source + str, {}).
                // success(function(responseData, status, headers, config) {
                success(function(responseData) {
                  $scope.searching = false;
                  $scope.processResults(responseData[$scope.dataField], str);
                }).
                // error(function(data, status, headers, config) {
                error(function() {
                  $scope.searching = false;
                  console.log('error');
                });
            }
          };

          $scope.keyPressed = function(event) {
            if (!(event.which === keys.up || event.which === keys.down || event.which === keys.return)) {
              if (!$scope.query || $scope.query === '') {
                $scope.showDropdown = false;
                $scope.lastSearchTerm = null;
              }
              else if (isNewSearchNeeded($scope.query, $scope.lastSearchTerm)) {
                $scope.lastSearchTerm = $scope.query;
                $scope.showDropdown = true;
                $scope.currentIndex = -1;
                $scope.results = [];

                if ($scope.searchTimer) {
                  $timeout.cancel($scope.searchTimer);
                }

                $scope.searching = true;

                $scope.searchTimer = $timeout(function() {
                  $scope.searchTimerComplete($scope.query);
                }, delay);
              }
            }
            else {
              event.preventDefault();
            }
          };

          $scope.inputElement.on('keyup', $scope.keyPressed);

          element.on('keyup', function (event) {
            if(event.which === keys.down) {
              if (($scope.currentIndex + 1) < $scope.results.length) {
                $scope.currentIndex ++;
                $scope.$apply();
                event.preventDefault();
                event.stopPropagation();
              }

              $scope.$apply();
            }
            else if(event.which === keys.up) {
              if ($scope.currentIndex >= 1) {
                $scope.currentIndex --;
                $scope.$apply();
                event.preventDefault();
                event.stopPropagation();
              }
            }
            else if (event.which === keys.return) {
              if ($scope.currentIndex >= 0 && $scope.currentIndex < $scope.results.length) {
                $scope.selectResult($scope.results[$scope.currentIndex]);
                $scope.$apply();
                event.preventDefault();
                event.stopPropagation();
              }
              else {
                $scope.results = [];
                $scope.$apply();
                event.preventDefault();
                event.stopPropagation();
              }
            }
            else if (event.which === keys.esc) {
              $scope.results = [];
              $scope.showDropdown = false;
              $scope.$apply();
            }
            else if (event.which === keys.backspace) {
              $scope.selectedObject = null;
              $scope.$apply();
            }
          });
        }
      };
    }]);
})(window, window.angular);
