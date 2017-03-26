var fs = require('fs');
var os = require('os');
var process = require('process');

var moduleName = JSON.parse(fs.readFile('package.json').toString()).name;
var isInGroup = /@.*\/.*/.test(moduleName);
var modulesPath = isInGroup ? `../../../modules/${moduleName}` : `../../.modules/${moduleName}`;
var execStr = isInGroup ? `ln -s ../../node_modules/${moduleName}` : `${modulesPath}`;

var isExists = fs.exists(modulesPath);
!isExists && fs.mkdir(modulesPath);

switch (os.type) {
    case 'Linux':
    case 'Darwin':
        process.exec(execStr);
        break;
    case 'Windows':
        break;
    default :
        process.exec(execStr);
}
