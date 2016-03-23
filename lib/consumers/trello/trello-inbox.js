'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _matcher = require('../../core/matcher');

var _matcher2 = _interopRequireDefault(_matcher);

var _rules = require('../../core/rules');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = _bluebird2.default.promisifyAll(require('fs'));

var filterCardWithAnnotations = _ramda2.default.curry(function (annotations, card) {
	var annotationForCard = annotations.filter(function (annotation) {
		return annotation.id === card.id;
	});

	return annotationForCard.length === 0;
});

var markers = _matcher2.default.getForType('default').matchers.filter(function (matcher) {
	return matcher.type === _rules.LINE_TYPE_MULTI;
})[0].marker;

var createTextForCard = function createTextForCard(card) {
	var content = [card.name];

	if (card.desc) {
		content = content.concat(card.desc.split('\n'));
	}

	content.push('TR_ID: ' + card.id);
	content.push('TR_STATUS: To Do');

	return content;
};

var TrelloInbox = function () {
	function TrelloInbox(filepath) {
		_classCallCheck(this, TrelloInbox);

		this.filepath = filepath;
	}

	_createClass(TrelloInbox, [{
		key: 'process',
		value: function process(files, lists) {
			var annotations = files.reduce(function (previous, current) {
				return previous.concat(current.annotations);
			}, []);

			var cards = lists.reduce(function (previous, current) {
				return previous.concat(current.cards);
			}, []);

			var cardFilter = filterCardWithAnnotations(annotations),
			    inboxCards = cards.filter(cardFilter),
			    inboxAnnotations = inboxCards.map(createTextForCard).map(function (text) {
				text.unshift(markers.start);
				text.push(markers.end);

				return text.join('\n');
			}).join('\n\n');

			return fs.writeFile(this.filepath, inboxAnnotations, { encoding: 'utf8' });
		}
	}]);

	return TrelloInbox;
}();

exports.default = TrelloInbox;
//# sourceMappingURL=trello-inbox.js.map