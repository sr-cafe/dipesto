'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _trelloAnnotation = require('./trello-annotation');

var _trelloAnnotation2 = _interopRequireDefault(_trelloAnnotation);

var _rules = require('../../core/rules');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// let fs = Promise.promisifyAll(require('fs'));

var TrelloFile = function () {
	function TrelloFile(file) {
		_classCallCheck(this, TrelloFile);

		this.file = file;
		var filepath = _path2.default.join(file.folder, file.name);
		this.annotations = this.file.annotations.map(function (annotation) {
			return new _trelloAnnotation2.default(annotation, filepath);
		});
	}

	_createClass(TrelloFile, [{
		key: 'process',
		value: function process(lists) {
			this.annotations = this.annotations.map(function (annotation) {
				return annotation.process(lists);
			});
			return this;
		}
	}, {
		key: 'post',
		value: function post(trello) {
			var _this = this;

			return _bluebird2.default.map(this.annotations, function (annotation) {
				return annotation.post(trello);
			}).then(function () {
				return _this;
			});
		}
	}, {
		key: 'writeToDisk',
		value: function writeToDisk() {
			var markers = this.file.matcher.matchers.filter(function (matcher) {
				return matcher.type === _rules.LINE_TYPE_MULTI;
			})[0].marker;

			this.annotations = _ramda2.default.sortBy(_ramda2.default.prop('annotation.comment.range.start'), this.annotations);
			this.annotations.reverse();

			var contents = this.annotations.map(function (annotation) {
				return annotation.toFile();
			});

			var original = this.file.content.split('\n');

			contents.forEach(function (content) {
				var startIndex = content.range.start,
				    endIndex = content.range.end - content.range.start + 1,
				    padding = content.padding,
				    newContent = content.content;

				newContent.unshift(markers.start);
				newContent.push(markers.end);

				newContent = newContent.map(function (line) {
					return padding + line;
				});

				original.splice(startIndex, endIndex, newContent.join('\n'));
			});

			var filepath = _path2.default.join(this.file.folder, this.file.name);

			_fs2.default.writeFileSync(filepath, original.join('\n'), { encoding: 'utf8' });

			return this;
		}
	}]);

	return TrelloFile;
}();

exports.default = TrelloFile;
//# sourceMappingURL=trello-file.js.map