import path from 'path';
import R from 'ramda';
import Promise from 'bluebird';
import Trello from 'node-trello';

import TrelloFile from './trello-file';
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
	return files.map(function(file){
		return file.process(lists);
	});
});

let postFilesToTrello = R.curry(function(trello, files){
	return Promise.map(files, function(file){
		return file.post(trello);
	})
});

export default class DipestoConsumer{
	constructor(key, token, boardName){
		this.trello = new Trello(key, token);
		this.boardName = boardName;
	}

	run(_input){
		let input = JSON.parse(_input),
			files = mapInputFilesToTrelloFiles(input.files);

		let getBoard = getTrelloBoard(this.trello),
			getBoardLists = getTrelloBoardLists(this.trello),
			processFiles = processFilesWithLists(files),
			postFiles = postFilesToTrello(this.trello);

		return R.pipeP(
			getBoard,
			getBoardLists,
			processFiles,
			postFiles,
			function(files){
				files.map(function(file){
					file.writeToDisk();
				})
			}
		)(this.boardName);

	}
}


// import Board from './board';
// import TrelloAnnotation from './trello-annotation';
//
// let filesToTrelloAnnotations = function(files){
// 	return files.reduce(function(previous, current){
// 		let filepath = path.join(current.folder, current.name),
// 			annotationMapper = annotationToTrelloAnnotation(filepath)
// 		return previous.concat(current.annotations.map(annotationMapper));
// 	}, [])
// };
//
// let annotationToTrelloAnnotation = R.curry(function(filepath, annotation){
// 	return new TrelloAnnotation(annotation, filepath);
// });
//
// let listAnnotationsGrab = R.curry(function(annotations, lists){
// 	return lists.map(function(list){
// 		return list.grabAnnotations(annotations);
// 	})
// });
//
// export default class DipestoTrelloConsumer{
// 	constructor(key, token, boardName){
// 		this.trello = new Trello(key, token);
// 		this.boardName = boardName;
// 	}
//
// 	run(_input){
// 		let input = JSON.parse(_input),
// 			annotations = filesToTrelloAnnotations(input.files).slice(0, 1);
//
// 		let board = new Board(this.trello);
// 		return board.getByName(this.boardName)
// 			.then(board.getLists.bind(board))
// 			.then(listAnnotationsGrab(annotations))
// 			.then(function(lists){
// 				return lists.map(function(list){
// 					list.update();
// 				})
// 			})
// 	}
//
// }
