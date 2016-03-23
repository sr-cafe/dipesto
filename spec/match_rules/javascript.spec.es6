"use strict"

import Matcher from '../../src/core/matcher.es6';
import Comment from '../../src/core/comment.es6';
import {COMMENTS, LINE_TYPE_SINGLE, LINE_TYPE_MULTI} from '../../src/core/rules.es6';

describe('Javascript matcher', function(){
	it('returns a Matcher for the "js" extension', function(){
		let result = Matcher.getForExtension('js');
		expect(result).toEqual(jasmine.any(Matcher));
		expect(result.type).toEqual('javascript');
	});

	it('returns a Matcher for the "es6" extension', function(){
		let result = Matcher.getForExtension('js');
		expect(result).toEqual(jasmine.any(Matcher));
		expect(result.type).toEqual('javascript');
	});
});

describe('Javascript comment', function(){
	const rule = COMMENTS.filter(function(rule){
		return rule.type == 'javascript';
	})[0];

	let matcher;


	beforeEach(function() {
		matcher = new Matcher(rule);
	});

	it('returns a Comment instance for a single line comment', function(){
		let text = '//This is a comment',
			expected = ['This is a comment'],
			result = matcher.getComment(text, 0);

		expect(result).toEqual(jasmine.any(Comment));
		expect(result.content).toEqual(expected);
	});

	it('returns a Comment instance for a multiline comment', function(){
		let text = [
				'/*This is a multiline comment',
				'which expands for',
				'3 lines*/'
			],
			expected = [
				'This is a multiline comment',
				'which expands for',
				'3 lines'
			],
			result = matcher.getComment(text[0], 0, text);

		expect(result).toEqual(jasmine.any(Comment));
		expect(result.content).toEqual(expected);
	});
});
