/*
TODO: Allow to define a different set of rules.
TR_ID: 56f2704002f134fd24c9f746
TR_STATUS: To Do
*/
/*
TODO: Allow to add rules to the current set.
TR_ID: 56f27040053daa8e2a002198
TR_STATUS: To Do
*/

import R from 'ramda';

import {COMMENTS, LINE_TYPE_MULTI} from './rules';
import Comment from './comment';

export default class Matcher{
	static getForType(type){
		try{
			return getForType(type);
		}
		catch(e){
			throw new Error(e.message);
		}
	}

	static getForExtension(extension){
		return getForExtension(extension);
	}

	constructor(rule){
		Object.assign(this, rule);

		this.getPattern = getPattern(this.matchers);
	}

	getComment(line, lineNumber, linesArray){
		let pattern = this.getPattern(line),
			comment = null;

		// In case more than one pattern matches ('#' and '##') select the multiline type
		if(pattern.length > 1){
			pattern = pattern.filter(function(current){
				return current.type == LINE_TYPE_MULTI;
			});
		};

		if(pattern.length > 0){
			pattern = pattern[0];
			comment = Comment.createComment(
				pattern,
				line,
				lineNumber,
				linesArray
			).clean(this.cleaners);
		};

		return comment;
	}
}

/***************
	HELPERS
***************/
let getForType = R.memoize(function(type){
	if(!type){
		return null;
	}

	let filter = filterRuleByType(type),
		rule = COMMENTS.filter(filter);

	if(!rule.length){
		throw new Error(`No rules defined for type "${type}"`);
	}

	return new Matcher(rule[0]);
});

let getForExtension = R.memoize(function(extension){
	if(!extension){
		return null;
	}

	if(extension.substring(0, 1) == '.'){
		extension = extension.substring(1);
	}

	let filter = filterRuleByExtension(extension),
		rule = COMMENTS.filter(filter);

	return (rule.length > 0) ? getForType(rule[0].type) : getForType('default');
});

let filterRuleByType = R.curry(function(type, rule){
	return type === rule.type;
});

let filterRuleByExtension = R.curry(function(extension, rule){
	return rule.extensions.filter(function(ext){
		return extension === ext;
	}).length > 0;
});

let filterComment = R.curry(function(line, matcher){
	return matcher.pattern.start.test(line);
});

let getPattern = R.curry(function(matchers, line){
	return matchers.filter(filterComment(line.trim()))
});
