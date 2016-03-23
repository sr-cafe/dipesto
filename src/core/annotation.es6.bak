import R from 'ramda';
import {ANNOTATIONS} from './rules';

/*
TODO: Allow new patterns to be injected
TR_ID: 56f270404fdee3bee6d128e7
TR_STATUS: To Do
*/
let isAnnotationFilter = R.curry(function(matchers, line){
	return matchers.filter(function(matcher){
		return matcher.pattern.test(line);
	})
})(ANNOTATIONS);

export default class Annotation{
	static createAnnotation(comment){
		let annotation = null,
			firstLine = comment.content[0],
			annotationRule = isAnnotationFilter(firstLine);

		if(annotationRule.length){
			annotationRule = annotationRule[0];
		}
		else{
			annotationRule = null;
		};

		if(annotationRule){
			let content = comment.content;
			content[0] = content[0].replace(annotationRule.pattern, '');

			annotation = new Annotation(annotationRule.type, content, comment);
		}

		return annotation;
	}

	constructor(type, content, comment){
		this.type = type;
		this.content = content;
		this.comment = comment;
	}
}
