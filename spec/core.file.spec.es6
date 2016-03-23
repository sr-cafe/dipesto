import File from '../src/core/file.es6';
import Matcher from '../src/core/matcher.es6';
import Annotation from '../src/core/annotation.es6';

describe('File', function(){
	let file,
		content = `var t = 1;
			//TODO Check t exists
			t = t +2;
			/*TODO Implement this method.
			It should always return a positive integer.
			But lookout for edge cases.*/
			var notImplementedYet = function(){
				// This is a simple comment.
				// NOTE This is an annotaton comment.
				// Code continues.
			}`;

	beforeEach(function(){
		file = new File(content, 'test.es6', '/path/to/file');
		file.parse();
	});

	it('has an Annotations array property', function(){
		expect(file.annotations).toEqual(jasmine.any(Array));
	});

	describe('annotations', function(){
		it('only contains entries for comment annotations', function(){
			// 3 annotations for 3 comments with annotation markers
			expect(file.annotations.length).toBe(3);

			// Each one is an Annotation
			file.annotations.forEach(function(annotation){
				expect(annotation).toEqual(jasmine.any(Annotation));
			});

			// Check type, content and range
			let current = file.annotations[0];
			expect(current.type).toEqual('TODO');
			expect(current.content).toEqual(['Check t exists']);
			expect(current.comment.range).toEqual({start:1, end:1});

			current = file.annotations[1];
			expect(current.type).toEqual('TODO');
			expect(current.content).toEqual(['Implement this method.',
				'It should always return a positive integer.',
				'But lookout for edge cases.'
			]);
			expect(current.comment.range).toEqual({start:3, end:5});

			current = file.annotations[2];
			expect(current.type).toEqual('NOTE');
			expect(current.content).toEqual(['This is an annotaton comment.']);
			expect(current.comment.range).toEqual({start:8, end:8});

		});


	})

})
