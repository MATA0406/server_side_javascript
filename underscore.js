// underscore라는 모듈을 사용할 수 있는 객체를 리턴
const _ = require('underscore'); // const는 상수라는 뜻
var arr = [3, 6, 9, 12];

console.log(arr[0]);
console.log(_.first(arr));  // underscore를 이용한 배열의 첫번째 원소를 리턴
console.log(arr[arr.length - 1]);
console.log(_.last(arr)); // underscore를 이용한 배열의 마지막 원소를 리턴
