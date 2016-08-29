'use strict';

var path = require('path');
var glob = require('glob');
var csv2json = require('json-2-csv').csv2json;
var fs = require('fs');

var tsvDir = path.resolve(__dirname, 'tsv');
var jsonDir = path.resolve(__dirname, 'json');

var files = glob.sync(path.join(tsvDir, "*.tsv"));

files.forEach(function (file) {

	var outputPath = path.join(jsonDir, path.basename(file, path.extname(file)) + ".json");

	console.log(outputPath);

	var csv = fs.readFileSync(file, 'utf-8');
	var lines = csv.split("\n");

	csv = "";
	var tmp = [];
	lines.reduce(function (prev, line) {
		var str = prev ? prev + "\n" + line : line;
		if (str.split('"').length % 2 == 0) {
			return str;
		} else {
			str = str.split("\t").map(function (cell) {
				var matches = cell.match(/^"+/);
				if ( matches && matches[0].length % 2 != 0 ) {
					cell = cell.replace(/^"([\s\S]+)"$/, '$1');
				}
				return cell.split('""').join('"');
			}).join("\t");
			csv = csv + str + "\r";
			return "";
		}
	}, "");

	csv2json(csv, function (err, json) {
		// console.log(json);
		fs.writeFileSync(outputPath, JSON.stringify(json));
	}, {
		delimiter: {
			field: "\t",
			// wrap: '"',
			eol: "\r"
		},
		trimHeaderValues: true,
		trimFieldValues: true
	});

});
