'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rules = require('./rules');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Comment = function () {
	_createClass(Comment, null, [{
		key: 'createComment',
		value: function createComment(matcher, line, lineNumber, linesArray) {
			var comment = null;

			if (matcher.type === _rules.LINE_TYPE_SINGLE) {
				comment = new Comment(matcher, [line], {
					start: lineNumber,
					end: lineNumber
				});
			} else {
				comment = Comment.createMultilineComment(matcher, lineNumber, linesArray);
			}

			return comment;
		}
	}, {
		key: 'createMultilineComment',
		value: function createMultilineComment(matcher, startLine, linesArray) {
			var pattern = matcher.pattern.end,
			    scanLines = linesArray.slice(startLine),
			    closingCommentLine = void 0,
			    comment = void 0;

			scanLines.some(function (line, i) {
				return pattern.test(line.trim()) ? (closingCommentLine = i, true) : false;
			});

			var range = {
				start: startLine,
				end: startLine + closingCommentLine
			};

			var content = linesArray.slice(range.start, range.end + 1);

			// Overwrite those lines on the original array so we don't need to scan them
			for (var i = range.start + 1; i <= range.end; i++) {
				linesArray[i] = '';
			}

			comment = new Comment(matcher, content, range);

			return comment;
		}
	}, {
		key: 'cleanCommentLine',
		value: function cleanCommentLine(line, cleaners) {
			return cleaners.reduce(function (previous, current) {
				return previous.replace(current, '').trim();
			}, line);
		}
	}]);

	function Comment(matcher, content, range) {
		_classCallCheck(this, Comment);

		this.type = matcher.type;
		this.matcher = matcher;
		this.originalContent = content;

		this.content = content.map(function (line) {
			return line.trim();
		});
		this.range = range;
	}

	_createClass(Comment, [{
		key: 'clean',
		value: function clean(_cleaners) {
			var _this = this;

			this.content = this.content.map(function (line, index, array) {
				var cleaners = [];

				if (index === 0) {
					cleaners.push(_this.matcher.pattern.start);
				};

				if (index === array.length - 1) {
					cleaners.push(_this.matcher.pattern.end);
				};

				if (_cleaners) {
					cleaners = cleaners.concat(_cleaners);
				};

				return Comment.cleanCommentLine(line, cleaners);
			}).filter(function (line) {
				return line.trim().length > 0;
			});

			return this;
		}
	}]);

	return Comment;
}();

exports.default = Comment;
//# sourceMappingURL=comment.js.map