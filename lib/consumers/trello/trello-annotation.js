'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _patterns = require('./patterns');

var PATTERNS = _interopRequireWildcard(_patterns);

var _endpoints = require('./endpoints');

var ENDPOINTS = _interopRequireWildcard(_endpoints);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getCommentPadding = function getCommentPadding(comment) {
	return comment[0].split('').filter(function (char) {
		return char === '\t';
	}).join('');
};

var TrelloAnnotation = function () {
	function TrelloAnnotation(annotation, filepath) {
		_classCallCheck(this, TrelloAnnotation);

		Object.assign(this, this.parse(annotation));
		this.filepath = filepath;
	}

	_createClass(TrelloAnnotation, [{
		key: 'toFile',
		value: function toFile() {
			var result = {
				range: this.annotation.comment.range,
				content: this.content,
				padding: getCommentPadding(this.annotation.comment.originalContent)
			};

			result.content[0] = this.annotation.type + ': ' + result.content[0];
			result.content.push('TR_ID: ' + this.id);
			result.content.push('TR_STATUS: ' + this.status);

			return result;
		}
	}, {
		key: 'parse',
		value: function parse(annotation) {
			var result = {
				annotation: annotation,
				isTrello: false,
				content: null,
				id: null,
				status: null,
				label: null
			};

			result.content = annotation.content.slice(0);

			// A single line cannot be a Trello Annotation
			if (result.content.length > 1) {
				result.content = result.content.map(function (line, index, array) {
					if (PATTERNS.ID.test(line)) {
						result.id = line.replace(PATTERNS.ID, '');
						return '';
					}

					if (PATTERNS.STATUS.test(line)) {
						result.status = line.replace(PATTERNS.STATUS, '');
						return '';
					}

					return line;
				}).filter(function (line) {
					return line.length > 0;
				});

				if (result.id) {
					result.isTrello = true;
				}
			}

			return result;
		}
	}, {
		key: 'process',
		value: function process(lists) {
			this.associatedCard = this.getAssociatedCard(lists);

			var list = void 0;

			if (!this.associatedCard) {
				list = this.getListByStatus(lists, 'To Do');
				this.idList = list.id;
				this.status = 'To Do';
			} else {
				list = this.getListByStatus(lists, this.status);
				this.idList = list.id;
			}

			return this;
		}
	}, {
		key: 'post',
		value: function post(trello) {
			var _this = this;

			var postData = this.getTrelloPostData(),
			    method = postData.id ? 'put' : 'post',
			    url = postData.id ? ENDPOINTS.UPDATE_CARD_URL(postData.id) : ENDPOINTS.NEW_CARD_URL;

			if (this.checkNeedsUpdating(postData)) {
				return new _bluebird2.default(function (resolve, reject) {
					trello[method](url, postData, function (err, data) {
						if (err) {
							reject(err);
						} else {
							_this.updateFromTrello(data);
							resolve(_this);
						}
					});
				});
			} else {
				return _bluebird2.default.resolve(this);
			}
		}
	}, {
		key: 'getTrelloPostData',
		value: function getTrelloPostData() {
			var result = {
				id: this.id,
				idList: this.idList,
				name: this.annotation.type + ': ' + this.content[0],
				desc: ''
			};

			if (this.content.length > 1) {
				result.desc = this.content.slice(1).join('\n');
				result.desc += '\n\n';
			}

			result.desc += '**File:** ' + this.filepath + '\n**Line:** ' + this.annotation.comment.range.start;

			return result;
		}
	}, {
		key: 'checkNeedsUpdating',
		value: function checkNeedsUpdating(currentData) {
			var _this2 = this;

			var needsUpdate = void 0;

			if (!this.associatedCard) {
				needsUpdate = true;
			} else {
				needsUpdate = ['idList', 'name', 'desc'].some(function (key) {
					return currentData[key] !== _this2.associatedCard[key];
				});
			}
			return needsUpdate;
		}
	}, {
		key: 'updateFromTrello',
		value: function updateFromTrello(data) {
			this.id = data.id;
		}
	}, {
		key: 'getAssociatedCard',
		value: function getAssociatedCard(lists) {
			var result = null;

			if (this.id) {
				result = lists.reduce(function (annotation, list) {
					return list.cards.reduce(function (annotation, card) {
						if (card.id === annotation.id) {
							return card;
						} else {
							return annotation;
						}
					}, annotation);
				}, this);

				if (result === this) {
					result = null;
				}
			}

			return result;
		}
	}, {
		key: 'getListByStatus',
		value: function getListByStatus(lists, status) {
			var result = lists.filter(function (list) {
				return list.name === status;
			});

			if (result.length > 0) {
				result = result[0];
			} else {
				result = null;
			}

			return result;
		}
	}]);

	return TrelloAnnotation;
}();

exports.default = TrelloAnnotation;
//# sourceMappingURL=trello-annotation.js.map