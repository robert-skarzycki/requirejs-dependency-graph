const fs = require('fs')
const util = require('util')
const readFileAsync = util.promisify(fs.readFile)


module.exports = class ScriptFile {
    constructor(filePath) {
        this.filePath = filePath
    }

    getMatches(matchResult) {
        var matches = [];

        if (!matchResult) {
            return matches;
        }

        for (var i = 1; i < matchResult.length; i++) {
            matches.push(matchResult[i])
        }

        return matches;
    }

    getModulesFromFileContent(content) {
        var regex = /\s*define\s*\(\s*\[\s*('[^']*')(?:\s*,\s*('[^']*'))*\s*\]/i
        var matchResult = content.match(regex)

        return this.getMatches(matchResult, regex)
    }

    async getDependencies() {
        return readFileAsync(this.filePath, 'utf8').then(content => {
            return this.getModulesFromFileContent(content)
        })
    }
}