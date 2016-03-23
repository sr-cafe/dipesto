'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _helpers = require('../helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _matcher = require('./matcher');

var _matcher2 = _interopRequireDefault(_matcher);

var _comment = require('./comment');

var _comment2 = _interopRequireDefault(_comment);

var _annotation = require('./annotation');

var _annotation2 = _interopRequireDefault(_annotation);

var _rules = require('./rules');

var RULES = _interopRequireWildcard(_rules);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var commentsMapper = function commentsMapper(line, index, array) {
	return this.matcher.getComment(line, index, array);
};

var File = function () {
	function File(content, name, folder) {
		_classCallCheck(this, File);

		this.content = content;
		this.name = name;
		this.folder = folder;

		this.matcher = this.getMatcher();
	}

	_createClass(File, [{
		key: 'getMatcher',
		value: function getMatcher() {
			var extension = _path2.default.extname(this.name);
			return _matcher2.default.getForExtension(extension);
		}
	}, {
		key: 'parse',
		value: function parse() {
			this.annotations = this.content.split('\n').map(commentsMapper.bind(this)).filter(_helpers2.default.notNullFilter).map(function (comment) {
				return _annotation2.default.createAnnotation(comment);
			}).filter(_helpers2.default.notNullFilter);

			return this;
		}
	}]);

	return File;
}();

exports.default = File;
//# sourceMappingURL=file.js.map