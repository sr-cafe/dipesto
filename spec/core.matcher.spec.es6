// Tests for specific filetypes are located on the "match_rules" folder.

"use strict"

import Matcher from '../src/core/matcher.es6';
import Comment from '../src/core/comment.es6';
import {LINE_TYPE_SINGLE, LINE_TYPE_MULTI} from '../src/core/rules.es6';

describe('Matcher', function(){
	it('has a static "getForType" method', function(){
		expect(Matcher.getForType).toBeDefined();
	});

	describe('getForType', function(){
		it('returns null for a "falsy" input', function(){
			expect(Matcher.getForType()).toEqual(null);
			expect(Matcher.getForType(null)).toEqual(null);
			expect(Matcher.getForType('')).toEqual(null);
		});

		it('returns a Matcher instance for a known type', function(){
			let result = Matcher.getForType('default');
			expect(result).toEqual(jasmine.any(Matcher));
		});

		it('throws an error for an unknown type', function(){
			let test = function(){
				Matcher.getForType('unknown');
			};

			expect(test).toThrow();
		});
	});

	it('has a static "getForExtension" method', function(){
		expect(Matcher.getForExtension).toBeDefined();
	});

	describe('getForExtension', function(){
		it('returns null for a "falsy" input', function(){
			expect(Matcher.getForExtension()).toEqual(null);
			expect(Matcher.getForExtension(null)).toEqual(null);
			expect(Matcher.getForExtension('')).toEqual(null);
		});

		it('returns the "default" matcher for an unknown extension', function(){
			let result = Matcher.getForExtension('unknown');
			expect(result.type).toEqual('default');
		});
	});

	it('returns "null" for a non comment string', function(){
		let matcher = Matcher.getForExtension('unknown'),
			result = matcher.getComment('This is not a comment');
		expect(result).toEqual(null);
	});

	it('when markers are ambiguous, it returns a multiline comment', function(){
		let text = ['##This is an ambiguous comment##'],
			expected = ['This is an ambiguous comment'],
			matcher = Matcher.getForType('default'),
			result = matcher.getComment(text[0], 0, text);
		expect(result.content).toEqual(expected);
	});

	it('returns a single Comment instance when a multiline comment is found', function(){
		let text = [
				'Not a comment',
				'Also not a comment',
				'## A multiline comment',
				'which expands',
				'for 3 lines##',
				'Again, not a comment'
			],
			matcher = Matcher.getForType('default'),
			result = text.map(function(line, index, array){
				return matcher.getComment(line, index, array);
			});

		expect(result[0]).toBe(null);
		expect(result[1]).toBe(null);
		expect(result[3]).toBe(null);
		expect(result[4]).toBe(null);
		expect(result[5]).toBe(null);

		expect(result[2]).toEqual(jasmine.any(Comment));
		expect(result[2].type).toBe(LINE_TYPE_MULTI);
	});

});
