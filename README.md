ngCompletr
==========

A simple but powerful AngularJS directive that allows you to quickly create autocomplete boxes that pull data either from a server or local variable. It started as a rewrite of `angucomplete`.

## Key Features

* Show just a title, a title and a description or a title, description and image in your autocomplete list
* Deliberately minimally styled so you can customise it to your heart's content!
* Reads JSON data and allows you to specify which fields to use for display
* Simple setup - e.g. to pull data from a server, just set the url parameter


## Getting Started
Download the code, and include the minified ngCompletr.js file in your page. Optionally add the css. Then add the ngCompletr module to your Angular App file, e.g.
```html
var app = angular.module('app', ["ngCompletr"]);
```

## Usage

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

## Options

<table>
	<thead>
		<tr>
			<th>Option</th>
			<th>Required</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>ng-completr-source</td>
			<td>Y</td>
			<td>
				The source of the autocomplete. Can be:
				<ul>
					<li>An array of items.</li>
					<li>A function that will receive the query string and a callback to pass back the results.</li>
					<li>A string that contains the url that will be queried.</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>ng-completr-query</td>
			<td>Y</td>
			<td>
				Query string model.
			</td>
		</tr>
		<tr>
			<td>ng-completr-result</td>
			<td>Y</td>
			<td>
				The variable that the result will be put into.
			</td>
		</tr>
		<tr>
			<td>ng-completr-result-callback</td>
			<td>N</td>
			<td>
				Callback function that will be called when a result is selected.
			</td>
		</tr>
		<tr>
			<td>ng-completr-search</td>
			<td>N</td>
			<td>
				Search options. An object with the following properties:
				<ul>
					<li>delay: Number of miliseconds after which the search will be performed.</li>
					<li>minLength: Minimum number of characters to trigger a search.</li>
					<li>data: When using a REST backend, the field of the response that contains the result.</li>
					<li>fields: When using an array, the fields that will be used to search.</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>ng-completr-display</td>
			<td>N</td>
			<td>
				Display options. An object with the following properties:
				<ul>
					<li>title: Fields that contain the title of the result.</li>
					<li>description: Field that contains the description of the result.</li>
					<li>image: Field that contains the image of the result.</li>
				</ul>
			</td>
		</tr>
	</tbody>
</thead>
</table>

## ngCompletr?

* ngAutocomplete was taken.
* ngAutocomplete2 / ngAutocompletePro / ngAutocompletePlus sounded bad.
* ngAutocompletr was too close to ngAutocomplete.
* ngComplete wasn't quite 2.0 enough.
* ngCompletr it is!

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code using [Grunt](http://gruntjs.com/). Also, for new features, add a unit test.

If you're creating a pull request, also please add yourself to the `CONTRIBUTORS.txt` file.

## Release History
* 0.0.2 - Initial public release
* 0.0.1 - Internal release

## License

Released under the MIT license.
