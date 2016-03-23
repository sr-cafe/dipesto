'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var LINE_TYPE_SINGLE = exports.LINE_TYPE_SINGLE = 'singleLine';
var LINE_TYPE_MULTI = exports.LINE_TYPE_MULTI = 'multiLine';

var ANNOTATION_TYPE_TODO = exports.ANNOTATION_TYPE_TODO = 'TODO';
var ANNOTATION_TYPE_NOTE = exports.ANNOTATION_TYPE_NOTE = 'NOTE';
var ANNOTATION_TYPE_FIXME = exports.ANNOTATION_TYPE_FIXME = 'FIXME';

var EMPTY_LINE = exports.EMPTY_LINE = /^\s*$/;
var NEW_LINE = exports.NEW_LINE = /[\r\n]+/g;

var defaultCleaners = [/\*\*+/g, /--+/g];

/*
TODO: Allow new patterns to be injected
TR_ID: 56f27040dde94b032e8fcba8
TR_STATUS: To Do
*/
var COMMENTS = exports.COMMENTS = [{
	type: 'default',
	extensions: [],
	matchers: [{
		type: LINE_TYPE_SINGLE,
		pattern: {
			start: /^#/
		}
	}, {
		type: LINE_TYPE_MULTI,
		pattern: {
			start: /^##/,
			end: /##$/
		}
	}],
	cleaners: defaultCleaners
}, {
	type: 'javascript',
	extensions: ['js', 'es6'],
	matchers: [{
		type: LINE_TYPE_SINGLE,
		pattern: {
			start: /^\/\//
		}
	}, {
		type: LINE_TYPE_MULTI,
		pattern: {
			start: /^\/\*/,
			end: /\*\/$/
		},
		marker: {
			start: '/*',
			end: '*/'
		}
	}],
	cleaners: defaultCleaners
}, {
	type: 'css',
	extensions: ['css', 'scss'],
	matchers: [{
		type: LINE_TYPE_SINGLE,
		pattern: {
			start: /^\/\//
		}
	}, {
		type: LINE_TYPE_MULTI,
		pattern: {
			start: /^\/\*/,
			end: /\*\/$/
		}
	}],
	cleaners: [/\*+/g, /-+/g]
}];

var ANNOTATIONS = exports.ANNOTATIONS = [{
	type: ANNOTATION_TYPE_TODO,
	pattern: /^TODO\W*/
}, {
	type: ANNOTATION_TYPE_NOTE,
	pattern: /^NOTE\W*/
}, {
	type: ANNOTATION_TYPE_FIXME,
	pattern: /^FIXME\W*/
}];
//# sourceMappingURL=rules.js.map