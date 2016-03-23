import path from 'path';
import Promise from 'bluebird';

import helpers from '../helpers';
import File from './file';

let fs = Promise.promisifyAll(require("fs"));

export default class Dipesto{
	static get EXTENSIONS() { return ['es6'] }

	constructor(){
		/* TODO Read command line arguments
		Don't forget to provide defaults.
		*/
		// TODO Allow excluded folders
		// NOTE Is "process.cwd()" necessary?

		this.folders = [
			path.join(process.cwd(), 'src')
		];

		this.extensions = getExtensions();
	}

	run(){
		return Promise.reduce(this.folders, directoriesReducer, [])
			.filter(helpers.filterWithExtensions(this.extensions))
			.map(filesMapper)
			.filter(function(file){
				return file.annotations && file.annotations.length;
			})
			.then((files) => {
				this.timestamp = new Date().getTime();
				this.files = files;
				return this;
			});

		// return Promise.reduce(this.folders, directoriesReducer, [])
		// 	.filter(helpers.filterWithExtensions(this.extensions))
		// 	.map(filesMapper)
		// 	.filter(function(file){
		// 		return file.annotations && file.annotations.length;
		// 	})
		// 	.then(function(files){
		// 		return {
		// 			timestamp: new Date().getTime(),
		// 			files: files
		// 		}
		// 	});
	}

	output(){
		return JSON.stringify(this, JSONReplacer, 4);
	}
}

/***************
	HELPERS
***************/

// TODO Implement injection of extensions via command line
let getExtensions = function(){
	return Dipesto.EXTENSIONS;
};

let getPathRelativeToCWD = helpers.getPathRelativeTo(process.cwd());

let directoriesReducer = function(result, currentPath){
	return helpers.listDirectoryFiles(currentPath, result);
};

let filesMapper = function(filePath){
	return fs.readFileAsync(filePath, {encoding:'utf8'})
		.then(function(content){
			let folder = path.dirname(getPathRelativeToCWD(filePath)),
				name = path.basename(filePath);
			return new File(content, name, folder).parse();
		});
};

let JSONReplacer = function(key, value){
    if (value instanceof RegExp) {
        return value.toString();
    }
	
    return value;
};
