'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var BOARDS_URL = exports.BOARDS_URL = '/1/members/me/boards';

var LISTS_URL = exports.LISTS_URL = function LISTS_URL(id) {
	return '/1/boards/' + id + '/lists';
};

var LIST_URL = exports.LIST_URL = function LIST_URL(id) {
	return '/1/lists/' + id;
};

var NEW_CARD_URL = exports.NEW_CARD_URL = '/1/cards';
var UPDATE_CARD_URL = exports.UPDATE_CARD_URL = function UPDATE_CARD_URL(id) {
	return '/1/cards/' + id;
};
//# sourceMappingURL=endpoints.js.map