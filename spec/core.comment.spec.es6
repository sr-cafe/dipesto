"use strict"

import Matcher from '../src/core/matcher.es6';
import Comment from '../src/core/comment.es6';
import {COMMENTS, LINE_TYPE_SINGLE, LINE_TYPE_MULTI} from '../src/core/rules.es6';

describe('Comment', function(){
	let rule = COMMENTS.filter(function(rule){
			return rule.type === 'default';
		})[0],

		singleLineMatcher = rule.matchers.filter(function(matcher){
			return matcher.type === LINE_TYPE_SINGLE;
		})[0],

		multiLineMatcher = rule.matchers.filter(function(matcher){
			return matcher.type === LINE_TYPE_MULTI;
		})[0],

		lineCleaners = rule.cleaners;


	it('allows for whitespace to be placed before the comment marker', function(){
		let text = '	      #This is a comment',
			expected = ['#This is a comment'],
			comment = Comment.createComment(singleLineMatcher, text, 1)
		expect(comment).toEqual(jasmine.any(Comment));
		expect(comment.content).toEqual(expected);
	});

	it('returns a "range" object with start and end line numbers', function(){
		let text = [
				'Not a comment',
				'#A comment'
			],
			matcher = Matcher.getForType('default'),
			result = matcher.getComment(text[1], 1, text);

		expect(result.range.start).toBe(1);
		expect(result.range.end).toBe(1);

		// Multiline test
		text = [
			'Not a comment',
			'Also not a comment',
			'## A multiline comment',
			'which expands',
			'for 3 lines##',
			'Again, not a comment'
		],
		matcher = Matcher.getForType('default'),
		result = matcher.getComment(text[2], 2, text);

		expect(result.range.start).toBe(2);
		expect(result.range.end).toBe(4);
	});

	describe('"clean" method', function(){
		it('removes decorative text', function(){
			let text = [
					'##********',
					'This is the comment',
					'-------------##'
				],
				expected = ['This is the comment'],
				comment = Comment.createComment(multiLineMatcher, text, 0, text);

			comment.clean(lineCleaners);
			expect(comment.content).toEqual(expected);

			// Another test
			text = [
					'##********This',
					'is the   ',
					'comment -------------##'
				];

			expected = [
				'This',
				'is the',
				'comment'
			];

			comment = Comment.createComment(multiLineMatcher, text, 0, text);
			comment.clean(lineCleaners);
			expect(comment.content).toEqual(expected);

			// Another test
			text = [
					'##********This',
					'is the   ',
					'comment 2*2 -------------##'
			];
			expected = [
				'This',
				'is the',
				'comment 2*2'
			];

			comment = Comment.createComment(multiLineMatcher, text, 0, text);
			comment.clean(lineCleaners);
			expect(comment.content).toEqual(expected);

			// Another test
			text = '#********This is the comment 2*2 -------------';
			expected = ['This is the comment 2*2'];
			comment = Comment.createComment(singleLineMatcher, text, 0, text);
			comment.clean(lineCleaners);
			expect(comment.content).toEqual(expected);
		});

		it('just removes the comment markers when no additional "cleaners" are provided', function(){
			let text = '********This is the comment********',
				expected = ['********This is the comment********'],
				comment = Comment.createComment(singleLineMatcher, text, 0, text);
			comment.clean();
			expect(comment.content).toEqual(expected);
		})
	});

});
