const path = require('path')
const readDirFiles = require('read-dir-files')
const endsWith = require('ends-with')
const fs = require('fs')
const util = require('util')
const readFileAsync = util.promisify(fs.readFile)

const rootPath = path.join(__dirname, 'sample-root')

function getMatches(matchResult) {
    var matches = [];

    if (!matchResult) {
        return matches;
    }

    for (var i = 1; i < matchResult.length; i++) {
        matches.push(matchResult[i])
    }

    return matches;
}

const getModulesFromFileContent = function (content) {
    var regex = /\s*define\s*\(\s*\[\s*('[^']*')(?:\s*,\s*('[^']*'))*\s*\]/i
    var matchResult = content.match(regex)

    return getMatches(matchResult, regex)
}

let listener = readDirFiles.list(rootPath, function (e, allFiles) {
    let files = allFiles.filter(file => endsWith(file, '.js'))

    let modulePromises = files.map(file => {
        return readFileAsync(file, 'utf8').then(content => {
            return getModulesFromFileContent(content)
        })
    })

    Promise.all(modulePromises).then(modulesFromFiles => {
        let result = modulesFromFiles.reduce((prev, current, index, array) => prev.concat(current), [])
        result.forEach(element => {
            console.log(element)
        })
    }
    )
})