'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _rules = require('./rules');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
TODO: Allow new patterns to be injected
TR_ID: 56f270404fdee3bee6d128e7
TR_STATUS: To Do
*/
var isAnnotationFilter = _ramda2.default.curry(function (matchers, line) {
	return matchers.filter(function (matcher) {
		return matcher.pattern.test(line);
	});
})(_rules.ANNOTATIONS);

var Annotation = function () {
	_createClass(Annotation, null, [{
		key: 'createAnnotation',
		value: function createAnnotation(comment) {
			var annotation = null,
			    firstLine = comment.content[0],
			    annotationRule = isAnnotationFilter(firstLine);

			if (annotationRule.length) {
				annotationRule = annotationRule[0];
			} else {
				annotationRule = null;
			};

			if (annotationRule) {
				var content = comment.content;
				content[0] = content[0].replace(annotationRule.pattern, '');

				annotation = new Annotation(annotationRule.type, content, comment);
			}

			return annotation;
		}
	}]);

	function Annotation(type, content, comment) {
		_classCallCheck(this, Annotation);

		this.type = type;
		this.content = content;
		this.comment = comment;
	}

	return Annotation;
}();

exports.default = Annotation;
//# sourceMappingURL=annotation.js.map