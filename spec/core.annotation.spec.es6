import Matcher from '../src/core/matcher.es6';
import Comment from '../src/core/comment.es6';
import Annotation from '../src/core/annotation.es6';
import {ANNOTATIONS, LINE_TYPE_SINGLE, LINE_TYPE_MULTI, ANNOTATION_TYPE_TODO} from '../src/core/rules.es6';

describe('Annotation', function(){
	describe('createAnnotation',function(){
		it('returns null for a non annotation comment', function(){
			let text = ['Not an annotation'],
				comment = new Comment({type:LINE_TYPE_SINGLE}, text, {start: 1, end:1}),
				result = Annotation.createAnnotation(comment);

			expect(result).toBe(null);
		});

		it('returns an Annotation instance for a single line annotation comment', function(){
			let text = [`${ANNOTATION_TYPE_TODO} Confirm this is an annotation`],
				comment = new Comment({type:LINE_TYPE_SINGLE}, text, {start: 1, end:1}),
				result = Annotation.createAnnotation(comment);

			expect(result).toEqual(jasmine.any(Annotation));
		});

		it('returns an Annotation instance with the appropriate type', function(){
			let text = [`${ANNOTATION_TYPE_TODO} Confirm this is an annotation`],
				comment = new Comment({type:LINE_TYPE_SINGLE}, text, {start: 1, end:1}),
				result = Annotation.createAnnotation(comment);

			expect(result.type).toEqual(ANNOTATION_TYPE_TODO);
		});

		it('returns an Annotation instance for a multiline annotation comment', function(){
			let text = [
					`${ANNOTATION_TYPE_TODO} Confirm this is an annotation.`,
					'A multiline annotation,',
					'in fact.'
				],
				expected = [
					'Confirm this is an annotation.',
					'A multiline annotation,',
					'in fact.'
					],
				comment = new Comment({type:LINE_TYPE_MULTI}, text, {start: 1, end:3}),
				result = Annotation.createAnnotation(comment);

			expect(result).toEqual(jasmine.any(Annotation));
			expect(result.content).toEqual(expected);
		});
	});

	it('has a "comment" property that holds the original Comment', function(){
		let text = [`${ANNOTATION_TYPE_TODO} Confirm this is an annotation`],
			comment = new Comment({type:LINE_TYPE_SINGLE}, text, {start: 1, end:1}),
			result = Annotation.createAnnotation(comment);

		expect(result.comment).toEqual(jasmine.any(Comment));		
	})
});
