'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = _bluebird2.default.promisifyAll(require('fs'));

var helpers = {
	notNullFilter: function notNullFilter(item) {
		return item !== null;
	},

	listDirectoryFiles: function listDirectoryFiles(dir) {
		var result = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

		return fs.readdirAsync(dir).map(function (fileName) {
			var filePath = _path2.default.join(dir, fileName);
			return fs.statAsync(filePath).then(function (stat) {
				return stat.isDirectory() ? helpers.listDirectoryFiles(filePath) : filePath;
			});
		}).reduce(function (result, current) {
			return result.concat(current);
		}, result);
	},

	filterWithExtensions: _ramda2.default.curry(function (extensions, filename) {
		var extArray = _util2.default.isArray(extensions) ? extensions : [extensions],
		    extension = _path2.default.extname(filename);

		extension.substring(0, 1) === '.' && (extension = extension.substring(1));

		return extArray.reduce(function (result, current) {
			return result ? true : current === extension;
		}, false);
	}),

	getPathRelativeTo: _ramda2.default.curry(function (from, to) {
		return _path2.default.relative(from, to);
	})
};

exports.default = helpers;
//# sourceMappingURL=helpers.js.map