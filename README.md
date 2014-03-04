ngCompletr
==========

A simple but powerful AngularJS directive that allows you to quickly create autocomplete boxes that pull data either from a server or local variable.

To see a demo go here: http://darylrowland.github.io/angucomplete.

###Key Features
* Show just a title, a title and a description or a title, description and image in your autocomplete list
* Deliberately minimally styled so you can customise it to your heart's content!
* Reads JSON data and allows you to specify which fields to use for display
* Simple setup - e.g. to pull data from a server, just set the url parameter


### Getting Started
Download the code, and include the minified ngCompletr.js file in your page. Then add the ngCompletr module to your Angular App file, e.g.
```html
var app = angular.module('app', ["ngCompletr"]);
```

### Usage

```html
<ng-completr 
    id="ex1"
    ng-completr-query="searchCountry.query"
    ng-completr-delay="100"
    ng-completr-source="countries"
    ng-completr-search-fields="name"
    ng-completr-title-field="name"
    ng-completr-min-length="1"
    ng-completr-match-class="highlight"
    ng-completr-result="searchCountry.result">
    <input placeholder="Search countries" type="text" class="form-control" />
</ng-completr>
```

###ngCompletr?
* ngAutocomplete was taken.
* ngAutocomplete2 / ngAutocompletePro / ngAutocompletePlus sounded bad.
* ngAutocompletr was too close to ngAutocomplete.
* ngComplete wasn't quite 2.0 enough.
* ngCompletr it is!

###License
Released under the MIT license.
