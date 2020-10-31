// ดูข้อมูล variable ใน function
// console.log(arguments);
// ---------------------

// require() behind the scense
// console.log(require('module').wrapper);
// ---------------------

// วิธี import module#1
// const Calc = require('./test-module-1');

// const myCalc = new Calc();

// console.log(myCalc.add(2, 4));
// -----------------------------------

// วิธี import module#2
// const myCalc2 = require('./test-module-2');

// console.log(myCalc2.add(2, 4));

// // or
// const { add, multiply } = require('./test-module-2');

// console.log(add(2, 4));
// ----------------------------------

// cache
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();
