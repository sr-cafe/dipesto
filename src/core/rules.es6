export const LINE_TYPE_SINGLE = 'singleLine';
export const LINE_TYPE_MULTI = 'multiLine';

export const ANNOTATION_TYPE_TODO = 'TODO';
export const ANNOTATION_TYPE_NOTE = 'NOTE';
export const ANNOTATION_TYPE_FIXME = 'FIXME';

export const EMPTY_LINE = /^\s*$/;
export const NEW_LINE = /[\r\n]+/g;

let defaultCleaners = [
	/\*\*+/g,
	/--+/g
];

/*
TODO: Allow new patterns to be injected
TR_ID: 56f27040dde94b032e8fcba8
TR_STATUS: To Do
*/
export let COMMENTS = [
	{
		type: 'default',
		extensions: [],
		matchers: [
			{
				type: LINE_TYPE_SINGLE,
				pattern: {
					start: /^#/
				}
			},
			{
				type: LINE_TYPE_MULTI,
				pattern: {
					start: /^##/,
					end: /##$/
				}
			}
		],
		cleaners: defaultCleaners
	},

	{
		type: 'javascript',
		extensions: [
			'js',
			'es6'
		],
		matchers: [
			{
				type: LINE_TYPE_SINGLE,
				pattern: {
					start: /^\/\//
				}
			},
			{
				type: LINE_TYPE_MULTI,
				pattern: {
					start: /^\/\*/,
					end: /\*\/$/
				},
				marker: {
					start: '/*',
					end: '*/'
				}
			}
		],
		cleaners: defaultCleaners
	},

	{
		type: 'css',
		extensions: [
			'css',
			'scss'
		],
		matchers: [
			{
				type: LINE_TYPE_SINGLE,
				pattern: {
					start: /^\/\//
				}
			},
			{
				type: LINE_TYPE_MULTI,
				pattern: {
					start: /^\/\*/,
					end: /\*\/$/
				}
			}
		],
		cleaners: [
			/\*+/g,
			/-+/g
		]
	}
];

export const ANNOTATIONS = [
	{
		type: ANNOTATION_TYPE_TODO,
		pattern: /^TODO\W*/
	},
	{
		type: ANNOTATION_TYPE_NOTE,
		pattern: /^NOTE\W*/
	},
	{
		type: ANNOTATION_TYPE_FIXME,
		pattern: /^FIXME\W*/
	}
];
