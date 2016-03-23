import R from 'ramda';
import Promise from 'bluebird';

import Matcher from '../../core/matcher';
import {LINE_TYPE_MULTI} from '../../core/rules';

let fs = Promise.promisifyAll(require('fs'));


let filterCardWithAnnotations = R.curry(function(annotations, card){
	let annotationForCard = annotations.filter(function(annotation){
		return annotation.id === card.id;
	});

	return (annotationForCard.length === 0);
})

let markers = Matcher.getForType('default').matchers.filter(function(matcher){
	return matcher.type === LINE_TYPE_MULTI;
})[0].marker;

let createTextForCard = function(card){
	let content = [card.name];

	if(card.desc){
		content = content.concat(card.desc.split('\n'));
	}

	content.push('TR_ID: '+card.id);
	content.push('TR_STATUS: To Do');

	return content;
};


export default class TrelloInbox{
	constructor(filepath){
		this.filepath = filepath;
	}

	process(files, lists){
		let annotations = files.reduce(function(previous, current){
			return previous.concat(current.annotations);
		}, []);

		let	cards = lists.reduce(function(previous, current){
			return previous.concat(current.cards);
		}, []);

		let cardFilter = filterCardWithAnnotations(annotations),
			inboxCards = cards.filter(cardFilter),
			inboxAnnotations = inboxCards
				.map(createTextForCard)
				.map(function(text){
					text.unshift(markers.start);
					text.push(markers.end);

					return text.join('\n');
				})
				.join('\n\n');

		return fs.writeFile(this.filepath, inboxAnnotations, {encoding: 'utf8'});
	}

}
