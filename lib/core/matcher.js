'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     TODO: Allow to define a different set of rules.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     TR_ID: 56f2704002f134fd24c9f746
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     TR_STATUS: To Do
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */
/*
TODO: Allow to add rules to the current set.
TR_ID: 56f27040053daa8e2a002198
TR_STATUS: To Do
*/

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _rules = require('./rules');

var _comment = require('./comment');

var _comment2 = _interopRequireDefault(_comment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Matcher = function () {
	_createClass(Matcher, null, [{
		key: 'getForType',
		value: function getForType(type) {
			try {
				return _getForType(type);
			} catch (e) {
				throw new Error(e.message);
			}
		}
	}, {
		key: 'getForExtension',
		value: function getForExtension(extension) {
			return _getForExtension(extension);
		}
	}]);

	function Matcher(rule) {
		_classCallCheck(this, Matcher);

		Object.assign(this, rule);

		this.getPattern = getPattern(this.matchers);
	}

	_createClass(Matcher, [{
		key: 'getComment',
		value: function getComment(line, lineNumber, linesArray) {
			var pattern = this.getPattern(line),
			    comment = null;

			// In case more than one pattern matches ('#' and '##') select the multiline type
			if (pattern.length > 1) {
				pattern = pattern.filter(function (current) {
					return current.type == _rules.LINE_TYPE_MULTI;
				});
			};

			if (pattern.length > 0) {
				pattern = pattern[0];
				comment = _comment2.default.createComment(pattern, line, lineNumber, linesArray).clean(this.cleaners);
			};

			return comment;
		}
	}]);

	return Matcher;
}();

/***************
	HELPERS
***************/


exports.default = Matcher;
var _getForType = _ramda2.default.memoize(function (type) {
	if (!type) {
		return null;
	}

	var filter = filterRuleByType(type),
	    rule = _rules.COMMENTS.filter(filter);

	if (!rule.length) {
		throw new Error('No rules defined for type "' + type + '"');
	}

	return new Matcher(rule[0]);
});

var _getForExtension = _ramda2.default.memoize(function (extension) {
	if (!extension) {
		return null;
	}

	if (extension.substring(0, 1) == '.') {
		extension = extension.substring(1);
	}

	var filter = filterRuleByExtension(extension),
	    rule = _rules.COMMENTS.filter(filter);

	return rule.length > 0 ? _getForType(rule[0].type) : _getForType('default');
});

var filterRuleByType = _ramda2.default.curry(function (type, rule) {
	return type === rule.type;
});

var filterRuleByExtension = _ramda2.default.curry(function (extension, rule) {
	return rule.extensions.filter(function (ext) {
		return extension === ext;
	}).length > 0;
});

var filterComment = _ramda2.default.curry(function (line, matcher) {
	return matcher.pattern.start.test(line);
});

var getPattern = _ramda2.default.curry(function (matchers, line) {
	return matchers.filter(filterComment(line.trim()));
});
//# sourceMappingURL=matcher.js.map