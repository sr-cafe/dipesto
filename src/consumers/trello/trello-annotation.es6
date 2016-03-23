import Promise from 'bluebird';

import * as PATTERNS from './patterns';
import * as ENDPOINTS from './endpoints';

let getCommentPadding = function(comment){
	return comment[0].split('').filter(function(char){
		return char === '\t';
	}).join('');
}

export default class TrelloAnnotation{
	constructor(annotation, filepath){
		Object.assign(this, this.parse(annotation));
		this.filepath = filepath;
	}

	toFile(){
		let result = {
			range: this.annotation.comment.range,
			content: this.content,
			padding: getCommentPadding(this.annotation.comment.originalContent)
		};

		result.content[0] = this.annotation.type+': '+result.content[0];
		result.content.push('TR_ID: '+this.id);
		result.content.push('TR_STATUS: '+this.status);

		return result;
	}

	parse(annotation){
		let result = {
			annotation: annotation,
			isTrello: false,
			content: null,
			id: null,
			status: null,
			label: null
		};

		result.content = annotation.content.slice(0);

		// A single line cannot be a Trello Annotation
		if(result.content.length > 1){
			result.content = result.content.map(function(line, index, array){
				if(PATTERNS.ID.test(line)){
					result.id = line.replace(PATTERNS.ID, '');
					return '';
				}

				if(PATTERNS.STATUS.test(line)){
					result.status = line.replace(PATTERNS.STATUS, '');
					return '';
				}

				return line;
			}).filter(function(line){
				return line.length > 0;
			});



			if(result.id){
				result.isTrello = true;
			}
		}

		return result;
	}

	process(lists){
		this.associatedCard = this.getAssociatedCard(lists);

		let list;

		if(!this.associatedCard){
			list = this.getListByStatus(lists, 'To Do');
			this.idList = list.id;
			this.status = 'To Do';
		}
		else{
			list = this.getListByStatus(lists, this.status);
			this.idList = list.id;
		}

		return this;
	}

	post(trello){
		let postData = this.getTrelloPostData(),
			method = postData.id ? 'put' : 'post',
			url = postData.id ? ENDPOINTS.UPDATE_CARD_URL(postData.id) : ENDPOINTS.NEW_CARD_URL;

		if(this.checkNeedsUpdating(postData)){
			return new Promise((resolve, reject) => {
				trello[method](url, postData, (err, data) => {
					if(err){
						reject(err);
					}
					else{
						this.updateFromTrello(data);
						resolve(this);
					}
				});
			});
		}
		else{
			return Promise.resolve(this);
		}
	}

	getTrelloPostData(){
		let result = {
			id: this.id,
			idList: this.idList,
			name: this.annotation.type+': '+this.content[0],
			desc: ''
		};

		if(this.content.length > 1){
			result.desc = this.content.slice(1).join('\n');
			result.desc += '\n\n';
		}

		result.desc += `**File:** ${this.filepath}\n**Line:** ${this.annotation.comment.range.start}`;

		return result;
	}

	checkNeedsUpdating(currentData){
		let needsUpdate;

		if(!this.associatedCard){
			needsUpdate = true;
		}
		else{
			needsUpdate = ['idList', 'name', 'desc'].some((key) => {
				return currentData[key] !== this.associatedCard[key];
			});
		}
		return needsUpdate;
	}

	updateFromTrello(data){
		this.id = data.id;
	}

	getAssociatedCard(lists){
		let result = null;

		if(this.id){
			result = lists.reduce(function(annotation, list){
				return list.cards.reduce(function(annotation, card){
					if(card.id === annotation.id){
						return card;
					}
					else{
						return annotation;
					}
				}, annotation);
			}, this);

			if(result === this){
				result = null;
			}
		}

		return result;
	}

	getListByStatus(lists, status){
		let result = lists.filter(function(list){
			return list.name === status;
		});

		if(result.length > 0){
			result = result[0];
		}
		else{
			result = null;
		}

		return result;

	}
}
