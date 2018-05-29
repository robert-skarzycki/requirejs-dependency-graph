var path = require('path')
var readDirFiles = require('read-dir-files')
var endsWith = require('ends-with')
var fs = require('fs')

var rootPath = path.join(__dirname, 'sample-root')

var listener = readDirFiles.list(rootPath, function (e, allFiles) {
    var files = allFiles.filter(file => endsWith(file, '.js'))

    for (var i = 0; i < files.length; i++) {
        var file = files[i]
        fs.readFile(file, 'utf8', function (err, content) {
            console.log(content)
        })
    }
})