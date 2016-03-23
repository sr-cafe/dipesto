'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _nodeTrello = require('node-trello');

var _nodeTrello2 = _interopRequireDefault(_nodeTrello);

var _trelloFile = require('./trello-file');

var _trelloFile2 = _interopRequireDefault(_trelloFile);

var _endpoints = require('./endpoints');

var ENDPOINTS = _interopRequireWildcard(_endpoints);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mapInputFilesToTrelloFiles = function mapInputFilesToTrelloFiles(files) {
	return files.map(function (file) {
		return new _trelloFile2.default(file);
	});
};

var filterBoardByName = _ramda2.default.curry(function (name, boards) {
	return boards.filter(function (board) {
		return board.name === name;
	});
});

var getTrelloBoard = _ramda2.default.curry(function (trello, name) {

	var filterBoard = filterBoardByName(name);

	return new _bluebird2.default(function (resolve, reject) {
		trello.get(ENDPOINTS.BOARDS_URL, function (err, boards) {
			if (err) {
				reject(err);
			} else {
				var board = filterBoard(boards);

				if (!board.length) {
					reject(new Error('No board found with name ' + name));
				} else {
					resolve(board[0]);
				}
			}
		});
	});
});

var getTrelloBoardLists = _ramda2.default.curry(function (trello, board) {
	var options = {
		cards: 'open'
	};

	return new _bluebird2.default(function (resolve, reject) {
		trello.get(ENDPOINTS.LISTS_URL(board.id), options, function (err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
});

var processFilesWithLists = _ramda2.default.curry(function (files, lists) {
	return files.map(function (file) {
		return file.process(lists);
	});
});

var postFilesToTrello = _ramda2.default.curry(function (trello, files) {
	return _bluebird2.default.map(files, function (file) {
		return file.post(trello);
	});
});

var DipestoConsumer = function () {
	function DipestoConsumer(key, token, boardName) {
		_classCallCheck(this, DipestoConsumer);

		this.trello = new _nodeTrello2.default(key, token);
		this.boardName = boardName;
	}

	_createClass(DipestoConsumer, [{
		key: 'run',
		value: function run(_input) {
			var input = JSON.parse(_input),
			    files = mapInputFilesToTrelloFiles(input.files);

			var getBoard = getTrelloBoard(this.trello),
			    getBoardLists = getTrelloBoardLists(this.trello),
			    processFiles = processFilesWithLists(files),
			    postFiles = postFilesToTrello(this.trello);

			return _ramda2.default.pipeP(getBoard, getBoardLists, processFiles, postFiles, function (files) {
				files.map(function (file) {
					file.writeToDisk();
				});
			})(this.boardName);
		}
	}]);

	return DipestoConsumer;
}();

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


exports.default = DipestoConsumer;
//# sourceMappingURL=index.js.map