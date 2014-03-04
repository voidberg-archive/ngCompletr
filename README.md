ngCompletr
==========

A simple but powerful AngularJS directive that allows you to quickly create autocomplete boxes that pull data either from a server or local variable.

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
    id="countries_autocomplete"
    ng-completr-source="countries"
    ng-completr-query="searchCountry.query"
    ng-completr-result="searchCountry.result"
    ng-completr-search="searchOptions"
    ng-completr-display="displayOptions">
    <input placeholder="Search countries" type="text" class="form-control" />
</ng-completr>
```

### Options



###ngCompletr?
* ngAutocomplete was taken.
* ngAutocomplete2 / ngAutocompletePro / ngAutocompletePlus sounded bad.
* ngAutocompletr was too close to ngAutocomplete.
* ngComplete wasn't quite 2.0 enough.
* ngCompletr it is!

###License
Released under the MIT license.
