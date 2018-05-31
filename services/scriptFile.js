const fs = require('fs')
const util = require('util')
const readFileAsync = util.promisify(fs.readFile)


module.exports = class ScriptFile {
    constructor(filePath) {
        this.filePath = filePath
    }

    getMatches(matchResult) {
        const matches = []

        if (!matchResult) {
            return matches;
        }

        for (var i = 1; i < matchResult.length; i++) {
            let dependencyRawName = matchResult[i]
            let cleanDependencyName = dependencyRawName.replace(/^\'+|\'+$/g, '');
            matches.push(cleanDependencyName)
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

    getFilePath() {
        return this.filePath
    }
}