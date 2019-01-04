var rs = require('fs');
console.log(1);
var data = rs.readFileSync('data.txt',{encoding:'utf8'});
console.log(data);
