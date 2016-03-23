import path from 'path';
import R from 'ramda';

import helpers from '../helpers';
import Matcher from './matcher';
import Comment from './comment';
import Annotation from './annotation';
import * as RULES from './rules';


let commentsMapper = function(line, index, array){
	return this.matcher.getComment(line, index, array);
};

export default class File{
	constructor(content, name, folder){
		this.content = content;
		this.name = name;
		this.folder = folder;

		this.matcher = this.getMatcher();
	}

	getMatcher(){
		let extension = path.extname(this.name);
		return Matcher.getForExtension(extension);
	}

	parse(){
		this.annotations = this.content.split('\n')
			.map(commentsMapper.bind(this))
			.filter(helpers.notNullFilter)
			.map(function(comment){
				return Annotation.createAnnotation(comment);
			})
			.filter(helpers.notNullFilter);

		return this;
	}
}
