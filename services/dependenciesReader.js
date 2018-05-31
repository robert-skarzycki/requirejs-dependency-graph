const ScriptFile = require('./scriptFile')
const endsWith = require('ends-with')
const readDir = require('read-dir-files')

module.exports = class DependenciesReader {

    build(rootPath) {
        readDir.list(rootPath, function (e, allFiles) {
            let files = allFiles.filter(file => endsWith(file, '.js'))

            let scriptFiles = files.map(file => new ScriptFile(file))

            let modulePromises = scriptFiles.map(sf => sf.getDependencies())

            Promise.all(modulePromises).then(modulesFromFiles => {
                let result = modulesFromFiles.reduce((prev, current, index, array) => prev.concat(current), [])
                result.forEach(element => {
                    console.log(element)
                })
            })
        })
    }
}