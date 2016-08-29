'use strict';

/**
 * 使い方: node html-generate [dataディレクトリ内のファイル名(拡張子なし)]
 * 例: node html-generate chubu
 */

var p = require('path');
var _ = require('underscore');
var s = require('underscore.string');
var glob = require('glob');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var sprintf = require('sprintf-js').sprintf;
var vsprintf = require('sprintf-js').vsprintf;

var dataDir = p.resolve(__dirname, "json");
var buildDir = p.resolve(__dirname, "build");
var tpl = _.template(fs.readFileSync(p.join(__dirname, "tpl/template.ejs"), 'utf-8'));

if (argv["_"].length == 0) {
	console.log("使い方: node html-generate [dataディレクトリ内のファイル名(拡張子なし)]");
	console.log("例: node html-generate sample");
	process.exit();
}else{
	generate();
	process.exit();
}

function generate() {
	var baseName = argv["_"][0];
	var jsonPath = p.resolve(dataDir, baseName + ".json");
	var json = require(jsonPath);

	/* jsonを修正 */
	json = _.map(json, function (item) {
		item.no = s.trim(sprintf("%02d", parseInt(item.no)));
		return item;
	});

	var content = tpl({json: json});
	var outputPath = p.join(buildDir, baseName + ".html");

	fs.writeFileSync(outputPath, content);
}


