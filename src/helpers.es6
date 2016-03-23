import path from 'path';
import Promise from 'bluebird';
import R from 'ramda';
import util from 'util';

let fs = Promise.promisifyAll(require('fs'));

let helpers = {
	notNullFilter: function(item){
		return item !== null;
	},

	listDirectoryFiles: function(dir, result = []){
		return fs.readdirAsync(dir).map(function(fileName){
			let filePath = path.join(dir, fileName);
			return fs.statAsync(filePath).then(function(stat){
				return stat.isDirectory() ? helpers.listDirectoryFiles(filePath) : filePath;
			})
		}).reduce(function(result, current){
			return result.concat(current)
		}, result);
	},

	filterWithExtensions: R.curry(function(extensions, filename){
		let extArray = util.isArray(extensions) ? extensions : [extensions],
			extension = path.extname(filename);

		extension.substring(0, 1) === '.' && (extension = extension.substring(1));

		return extArray.reduce(function(result, current){
			return result ? true : current === extension;
		}, false);
	}),

	getPathRelativeTo: R.curry(function(from, to){
		return path.relative(from, to);
	})
};

export default helpers;
