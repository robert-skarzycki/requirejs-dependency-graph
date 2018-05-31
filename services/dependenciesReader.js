const ScriptFile = require('./scriptFile')
const endsWith = require('ends-with')
const readDir = require('read-dir-files')
const util = require('util')
const listDir = util.promisify(readDir.list)

module.exports = class DependenciesReader {

    getFileName(rootPath, filePath) {
        return filePath.replace(rootPath, '')
    }

    async build(rootPath) {
        const self = this
        return listDir(rootPath).then(allFiles => {
            let files = allFiles.filter(file => endsWith(file, '.js'))

            let scriptFiles = files.map(file => new ScriptFile(file))

            let modulePromises = scriptFiles.map(sf => sf.getDependencies().then(deps => {
                return {
                    fileName: self.getFileName(rootPath, sf.getFilePath()),
                    dependencies: deps
                }
            }))

            return Promise.all(modulePromises)
            /*let result = modulesFromFiles.reduce((prev, current, index, array) => prev.concat(current), [])
            result.forEach(element => {
                console.log(element)
            })*/
        })
    }
}