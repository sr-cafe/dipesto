import {LINE_TYPE_SINGLE, LINE_TYPE_MULTI} from './rules';

export default class Comment{
	static createComment(matcher, line, lineNumber, linesArray){
		let comment = null;

		if(matcher.type === LINE_TYPE_SINGLE){
			comment = new Comment(
				matcher,
				[line],
				{
					start: lineNumber,
					end: lineNumber
				}
			);
		}
		else{
			comment = Comment.createMultilineComment(
				matcher,
				lineNumber,
				linesArray
			);
		}

		return comment;
	}

	static createMultilineComment(matcher, startLine, linesArray){
		let pattern = matcher.pattern.end,
			scanLines = linesArray.slice(startLine),
			closingCommentLine,
			comment;

		scanLines.some(function(line, i) {
			return pattern.test(line.trim())
				? ((closingCommentLine = i), true)
				: false;
		});

		let range = {
			start: startLine,
			end: startLine + closingCommentLine
		};

		let content = linesArray.slice(range.start, range.end + 1);

		// Overwrite those lines on the original array so we don't need to scan them
		for(let i = range.start + 1; i <= range.end; i++){
			linesArray[i] = '';
		}

		comment = new Comment(matcher, content, range);

		return comment;
	}

	static cleanCommentLine(line, cleaners){
		return cleaners.reduce(function(previous, current){
			return previous.replace(current, '').trim();
		}, line);
	}

	constructor(matcher, content, range){
		this.type = matcher.type;
		this.matcher = matcher;
		this.originalContent = content;

		this.content = content.map(function(line){
			return line.trim();
		});
		this.range = range;
	}

	clean(_cleaners){
		this.content = this.content.map((line, index, array) => {
			let cleaners = [];

			if(index === 0){
				cleaners.push(this.matcher.pattern.start);
			};

			if(index === array.length - 1){
				cleaners.push(this.matcher.pattern.end);
			};

			if(_cleaners){
				cleaners = cleaners.concat(_cleaners);
			};

			return Comment.cleanCommentLine(line, cleaners);

		}).filter(function(line){
			return line.trim().length > 0;
		});

		return this;
	}
}
