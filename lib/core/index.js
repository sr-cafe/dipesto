'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _helpers = require('../helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _file = require('./file');

var _file2 = _interopRequireDefault(_file);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = _bluebird2.default.promisifyAll(require("fs"));

var Dipesto = function () {
	_createClass(Dipesto, null, [{
		key: 'EXTENSIONS',
		get: function get() {
			return ['es6'];
		}
	}]);

	function Dipesto() {
		_classCallCheck(this, Dipesto);

		/* TODO Read command line arguments
  Don't forget to provide defaults.
  */
		// TODO Allow excluded folders
		// NOTE Is "process.cwd()" necessary?

		this.folders = [_path2.default.join(process.cwd(), 'src')];

		this.extensions = getExtensions();
	}

	_createClass(Dipesto, [{
		key: 'run',
		value: function run() {
			var _this = this;

			return _bluebird2.default.reduce(this.folders, directoriesReducer, []).filter(_helpers2.default.filterWithExtensions(this.extensions)).map(filesMapper).filter(function (file) {
				return file.annotations && file.annotations.length;
			}).then(function (files) {
				_this.timestamp = new Date().getTime();
				_this.files = files;
				return _this;
			});

			// return Promise.reduce(this.folders, directoriesReducer, [])
			// 	.filter(helpers.filterWithExtensions(this.extensions))
			// 	.map(filesMapper)
			// 	.filter(function(file){
			// 		return file.annotations && file.annotations.length;
			// 	})
			// 	.then(function(files){
			// 		return {
			// 			timestamp: new Date().getTime(),
			// 			files: files
			// 		}
			// 	});
		}
	}, {
		key: 'output',
		value: function output() {
			return JSON.stringify(this, JSONReplacer, 4);
		}
	}]);

	return Dipesto;
}();

/***************
	HELPERS
***************/

// TODO Implement injection of extensions via command line


exports.default = Dipesto;
var getExtensions = function getExtensions() {
	return Dipesto.EXTENSIONS;
};

var getPathRelativeToCWD = _helpers2.default.getPathRelativeTo(process.cwd());

var directoriesReducer = function directoriesReducer(result, currentPath) {
	return _helpers2.default.listDirectoryFiles(currentPath, result);
};

var filesMapper = function filesMapper(filePath) {
	return fs.readFileAsync(filePath, { encoding: 'utf8' }).then(function (content) {
		var folder = _path2.default.dirname(getPathRelativeToCWD(filePath)),
		    name = _path2.default.basename(filePath);
		return new _file2.default(content, name, folder).parse();
	});
};

var JSONReplacer = function JSONReplacer(key, value) {
	if (value instanceof RegExp) {
		return value.toString();
	}

	return value;
};
//# sourceMappingURL=index.js.map