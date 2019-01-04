var fs = require('fs');
console.log(1);
var data = fs.readFileSync('data.txt',{encoding:'utf8'});
console.log(data);
