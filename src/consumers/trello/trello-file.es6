import path from 'path';
import Promise from 'bluebird';
import R from 'ramda';
import TrelloAnnotation from './trello-annotation';
import {LINE_TYPE_MULTI} from '../../core/rules';
import fs from 'fs';
// let fs = Promise.promisifyAll(require('fs'));

export default class TrelloFile{
	constructor(file){
		this.file = file;
		let filepath = path.join(file.folder, file.name);
		this.annotations = this.file.annotations.map(function(annotation){
			return new TrelloAnnotation(annotation, filepath);
		});
	}

	process(lists){
		this.annotations = this.annotations.map(function(annotation){
			return annotation.process(lists);
		});
		return this;
	}

	post(trello){
		return Promise.map(this.annotations, function(annotation){
			return annotation.post(trello);
		})
		.then(() => {
			return this;
		})
	}

	writeToDisk(){
		let markers = this.file.matcher.matchers.filter(function(matcher){
			return matcher.type === LINE_TYPE_MULTI;
		})[0].marker;

		this.annotations = R.sortBy(R.prop('annotation.comment.range.start'), this.annotations);
		this.annotations.reverse();

		let contents = this.annotations.map(function(annotation){
			return annotation.toFile();
		})

		let original = this.file.content.split('\n');

		contents.forEach(function(content){
			let startIndex = content.range.start,
				endIndex = (content.range.end - content.range.start) + 1,
				padding = content.padding,
				newContent = content.content;

			newContent.unshift(markers.start);
			newContent.push(markers.end);

			newContent = newContent.map(function(line){
				return padding+line;
			})

			original.splice(startIndex, endIndex, newContent.join('\n'));
		});

		let filepath = path.join(this.file.folder, this.file.name);

		fs.writeFileSync(filepath, original.join('\n'), {encoding: 'utf8'});

		return this;

	}
}
