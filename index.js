const path = require('path')
const DependenciesReader = require('./services/dependenciesReader')

const rootPath = path.join(__dirname, 'sample-root')

var reader = new DependenciesReader()
reader.build(rootPath)