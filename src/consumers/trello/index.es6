/*
NOTE: This is a test
TR_ID: 56f2859b245d2588a29740c5
TR_STATUS: To Do
*/

import path from 'path';
import R from 'ramda';
import Promise from 'bluebird';
import Trello from 'node-trello';

import TrelloFile from './trello-file';
import TrelloInbox from './trello-inbox';
import * as ENDPOINTS from './endpoints';

let mapInputFilesToTrelloFiles = function(files){
	return files.map(function(file){
		return new TrelloFile(file);
	});
}

let filterBoardByName = R.curry(function(name, boards){
	return boards.filter(function(board){
		return board.name === name;
	});
});

let getTrelloBoard = R.curry(function(trello, name){

	let filterBoard = filterBoardByName(name);

	return new Promise(function(resolve, reject){
		trello.get(ENDPOINTS.BOARDS_URL, function(err, boards){
			if(err){
				reject(err);
			}
			else{
				let board = filterBoard(boards);

				if(!board.length){
					reject(new Error(`No board found with name ${name}`));
				}
				else{
					resolve(board[0]);
				}
			}
		});
	});
});

let getTrelloBoardLists = R.curry(function(trello, board){
	let options = {
		cards:'open'
	};

	return new Promise(function(resolve, reject){
		trello.get(ENDPOINTS.LISTS_URL(board.id), options, function(err, data){
			if(err){
				reject(err);
			}
			else{
				resolve(data);
			}
		});
	})
});

let processFilesWithLists = R.curry(function(files, lists){
	return{
		files: files.map(function(file){
			return file.process(lists);
		}),
		lists: lists
	}
});

let postFilesToTrello = R.curry(function(trello, filesAndLists){
	return Promise.map(filesAndLists.files, function(file){
		return file.post(trello);
	})
});

let processInboxWithFilepath = R.curry(function(filepath, filesAndLists){
	let inbox = new TrelloInbox(filepath);
	return inbox.process(filesAndLists.files, filesAndLists.lists);
});

export default class DipestoConsumer{
	constructor(key, token, boardName, inboxPath){
		this.trello = new Trello(key, token);
		this.boardName = boardName;
		this.inboxPath = inboxPath || './inbox.trello';
	}

	run(_input){
		let input = JSON.parse(_input),
			files = mapInputFilesToTrelloFiles(input.files);

		let getBoard = getTrelloBoard(this.trello), // () -> Lists
			getBoardLists = getTrelloBoardLists(this.trello), // (Lists) -> Lists
			processFiles = processFilesWithLists(files), // (Lists) -> Files
			postFiles = postFilesToTrello(this.trello),
			processInbox = processInboxWithFilepath(this.inboxPath);

		return R.pipeP(
			getBoard,
			getBoardLists,
			processFiles,
			function(filesAndLists){
				return Promise.all([
					postFiles(filesAndLists),
					processInbox(filesAndLists)
				]).then(function(results){
					return{
						files: results[0],
						lists: results[1]
					}
				})
			},
			function(filesAndLists){
				return filesAndLists.files.map(function(file){
					file.writeToDisk();
				})
			},
			function(){
				console.log('ALL DONE');
			}
		)(this.boardName);

	}
}
