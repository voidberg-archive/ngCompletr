'use strict';

describe('ngCompletr', function() {
  var $compile, $scope, $timeout;

  beforeEach(module('ngCompletr'));

  beforeEach(inject(function(_$compile_, $rootScope, _$timeout_) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    $timeout = _$timeout_;
  }));

  describe('Render', function() {

    it('should keep the original input element with the original properties', function() {
      var element = angular.element('<ng-completr ng-completr-query="search.query" ><input id="autocomplete1" placeholder="Search for something" type="text" class="form-control" /></ng-completr>');
      $scope.search = { query: null };

      $compile(element)($scope);
      $scope.$digest();

      expect(element.find('#autocomplete1').length).toBe(1);
      expect(element.find('#autocomplete1').attr('placeholder')).toEqual('Search for something');
    });
  });

  describe('Local data', function() {

    it('should show search results after 3 letter is entered', function() {
      var element = angular.element('<ng-completr ng-completr-query="search.query" ng-completr-result="search.result" ng-completr-source="countries" ng-completr-search="searchOptions" ng-completr-display="displayOptions"><input id="autocomplete1" placeholder="Search for something" type="text" class="form-control" /></ng-completr>');

      $scope.search = { query: null };

      $scope.searchOptions = { fields: ['name'] };
      $scope.displayOptions = { title: ['name'] };

      $scope.countries = [
        {name: 'Afghanistan', code: 'AF'},
        {name: 'Aland Islands', code: 'AX'},
        {name: 'Albania', code: 'AL'}
      ];

      $compile(element)($scope);
      $scope.$digest();

      var inputField = element.find('#autocomplete1');
      var e = $.Event('keyup');
      e.which = 97; // letter: a

      inputField.val('a');
      inputField.trigger('input');
      inputField.trigger(e);
      expect(element.find('.ng-completr-dropdown').length).toBe(0);

      inputField.val('aa');
      inputField.trigger('input');
      inputField.trigger(e);
      expect(element.find('.ng-completr-dropdown').length).toBe(0);

      inputField.val('aaa');
      inputField.trigger('input');
      inputField.trigger(e);

      $timeout.flush();

      expect(element.find('.ng-completr-searching').length).toBe(1);
      expect(element.find('.ng-completr-dropdown').length).toBe(1);
    });

    it('should show search results after 1 letter is entered with minlength being set to 1', function() {
      var element = angular.element('<ng-completr ng-completr-query="search.query" ng-completr-result="search.result" ng-completr-source="countries" ng-completr-search="searchOptions" ng-completr-display="displayOptions"><input id="autocomplete1" placeholder="Search for something" type="text" class="form-control" /></ng-completr>');

      $scope.search = { query: null };

      $scope.searchOptions = { fields: ['name'], minLength: 1 };
      $scope.displayOptions = { title: ['name'] };

      $scope.countries = [
        {name: 'Afghanistan', code: 'AF'},
        {name: 'Aland Islands', code: 'AX'},
        {name: 'Albania', code: 'AL'}
      ];
      $compile(element)($scope);
      $scope.$digest();

      var inputField = element.find('#autocomplete1');
      var e = $.Event('keyup');
      e.which = 97; // letter: a
      inputField.val('a');
      inputField.trigger('input');
      inputField.trigger(e);
      $timeout.flush();

      expect(element.find('.ng-completr-searching').length).toBe(1);
      expect(element.find('.ng-completr-dropdown').length).toBe(1);
    });
  });

  describe('Local data via function', function () {

    it('should call the data function', function () {
      var element = angular.element('<ng-completr ng-completr-query="search.query" ng-completr-result="search.result" ng-completr-source="countries" ng-completr-search="searchOptions" ng-completr-display="displayOptions"><input id="autocomplete1" placeholder="Search for something" type="text" class="form-control" /></ng-completr>');

      $scope.search = { query: null };

      $scope.searchOptions = { fields: ['name'], minLength: 1 };
      $scope.displayOptions = { title: ['name'] };

      $scope.searchCallback = function (query, callback) {

      };
    });
  });


  describe('Process Results', function() {

    it('should set $scope.results[0].title', function() {
      var element = angular.element('<ng-completr ng-completr-query="search.query" ng-completr-result="search.result" ng-completr-source="names" ng-completr-search="searchOptions" ng-completr-display="displayOptions"><input id="autocomplete1" placeholder="Search names" type="text" class="form-control" /></ng-completr>');

      $scope.searchOptions = { fields: ['name'], minLength: 1 };
      $scope.displayOptions = { title: ['name'] };

      $compile(element)($scope);
      $scope.$digest();

      var name = 'John';
      var responseData = [ {name: name} ];
      element.isolateScope().processResults(responseData);
      expect(element.isolateScope().results[0].title).toBe(name);
    });

    it('should set $scope.results[0].title for two title fields', function() {
      var element = angular.element('<ng-completr ng-completr-query="search.query" ng-completr-result="search.result" ng-completr-source="names" ng-completr-search="searchOptions" ng-completr-display="displayOptions"><input id="autocomplete1" placeholder="Search names" type="text" class="form-control" /></ng-completr>');

      $scope.searchOptions = { fields: ['name'], minLength: 1 };
      $scope.displayOptions = { title: ['firstName', 'lastName'] };

      $compile(element)($scope);
      $scope.$digest();

      var lastName = 'Doe', firstName = 'John';
      var responseData = [ {lastName: lastName, firstName: firstName} ];
      element.isolateScope().processResults(responseData);
      expect(element.isolateScope().results[0].title).toBe(firstName + ' ' + lastName);
    });

    it('should set $scope.results[0].description', function() {
      var element = angular.element('<ng-completr ng-completr-query="search.query" ng-completr-result="search.result" ng-completr-source="names" ng-completr-search="searchOptions" ng-completr-display="displayOptions"><input id="autocomplete1" placeholder="Search names" type="text" class="form-control" /></ng-completr>');

      $scope.searchOptions = { fields: ['name'], minLength: 1 };
      $scope.displayOptions = { title: ['name'], description: 'desc' };

      $compile(element)($scope);
      $scope.$digest();

      var description = 'blah blah blah';
      var responseData = [ {name: 'John', desc: description} ];
      element.isolateScope().processResults(responseData);
      expect(element.isolateScope().results[0].description).toBe(description);
    });

    it('should set $scope.results[0].image', function() {
      var element = angular.element('<ng-completr ng-completr-query="search.query" ng-completr-result="search.result" ng-completr-source="names" ng-completr-search="searchOptions" ng-completr-display="displayOptions"><input id="autocomplete1" placeholder="Search names" type="text" class="form-control" /></ng-completr>');

      $scope.searchOptions = { fields: ['name'], minLength: 1 };
      $scope.displayOptions = { title: ['name'], image: 'pic' };

      $compile(element)($scope);
      $scope.$digest();

      var image = 'some pic';
      var responseData = [ {name: 'John', pic: image} ];
      element.isolateScope().processResults(responseData);
      expect(element.isolateScope().results[0].image).toBe(image);
    });
  });

  describe('Search Timer Complete', function() {

    describe('local data', function() {
      it('should set $scope.searching to false and call $scope.processResults', function() {
        var element = angular.element('<ng-completr ng-completr-query="search.query" ng-completr-result="search.result" ng-completr-source="countries" ng-completr-search="searchOptions" ng-completr-display="displayOptions"><input id="autocomplete1" placeholder="Search names" type="text" class="form-control" /></ng-completr>');

        $scope.searchOptions = { fields: ['name'], minLength: 1 };
        $scope.displayOptions = { title: ['name'] };

        $scope.search = { query: null };

        $scope.countries = [
          {name: 'Afghanistan', code: 'AF'},
          {name: 'Aland Islands', code: 'AX'},
          {name: 'Albania', code: 'AL'}
        ];
        $compile(element)($scope);
        $scope.$digest();

        var queryTerm = 'al';
        spyOn(element.isolateScope(), 'processResults');
        element.isolateScope().searchTimerComplete(queryTerm);
        expect(element.isolateScope().processResults).toHaveBeenCalledWith($scope.countries.slice(1,3), queryTerm);
      });
    });

    describe('Remote data', function() {

      it('should call $http with given url and param', inject(function($httpBackend) {
        var element = angular.element('<ng-completr ng-completr-query="search.query" ng-completr-result="search.result" ng-completr-source="source" ng-completr-search="searchOptions" ng-completr-display="displayOptions"><input id="autocomplete1" placeholder="Search names" type="text" class="form-control" /></ng-completr>');

        $scope.searchOptions = { fields: ['name'], minLength: 1 };
        $scope.displayOptions = { title: ['name'] };

        $scope.source = 'names?q=';
        $scope.search = { query: null };

        $compile(element)($scope);
        $scope.$digest();

        var queryTerm = 'john';
        var results = {data: [{name: 'john'}]};
        spyOn(element.isolateScope(), 'processResults');
        $httpBackend.expectGET('names?q=' + queryTerm).respond(200, results);
        element.isolateScope().searchTimerComplete(queryTerm);

        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      }));

      it('should set $scope.searching to false and call $scope.processResults after success', inject(function($httpBackend) {
        var element = angular.element('<ng-completr ng-completr-min-length="1" ng-completr-query="search.query" ng-completr-result="search.result" ng-completr-source="source" ng-completr-data-field="data" ng-completr-title-field="name"><input id="autocomplete1" placeholder="Search names" type="text" class="form-control" /></ng-completr>');
        var element = angular.element('<ng-completr ng-completr-query="search.query" ng-completr-result="search.result" ng-completr-source="source" ng-completr-search="searchOptions" ng-completr-display="displayOptions"><input id="autocomplete1" placeholder="Search names" type="text" class="form-control" /></ng-completr>');

        $scope.searchOptions = { fields: ['name'], minLength: 1, data: 'data' };
        $scope.displayOptions = { title: ['name'] };

        $scope.source = 'names?q=';
        $scope.search = { query: null };

        $compile(element)($scope);
        $scope.$digest();

        var queryTerm = 'john';
        var results = {data: [{name: 'john'}]};

        spyOn(element.isolateScope(), 'processResults');

        $httpBackend.expectGET('names?q=' + queryTerm).respond(200, results);
        element.isolateScope().searchTimerComplete(queryTerm);
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();

        expect(element.isolateScope().processResults).toHaveBeenCalledWith(results.data, queryTerm);
        expect(element.isolateScope().searching).toBe(false);
      }));
    });
  });
});
