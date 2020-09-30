const fs = require('fs');
const superagent = require('superagent');

/*
 * 41. The Problem with Callbacks: Callback Hell
 */
// fs.readFile(`${__dirname}/dog.txt`, 'utf8', (err, data) => {
//   // fetch data from dog.ceo
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//       if (err) return console.log(err.message);

//       // ได้ obj ที่ส่งมาจาก api
//       // ต้องไล่หาเอาจาก res
//       console.log(res.body.message);

//       // write to file
//       fs.writeFile(`${__dirname}/dog-img.txt`, res.body.message, (err) => {
//         if (err) return console.log(err.message);

//         console.log(`Random dog image save to file...`);
//       });
//     });
// });

/*
 * 42. From Callback Hell to Promises
 */
// fs.readFile(`${__dirname}/dog.txt`, 'utf8', (err, data) => {
//   console.log(`Breed: ${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`) // Promises
//     .then((res) => {
//       // resolved Promises object
//       console.log(res.body.message);

//       // write to file
//       fs.writeFile(`${__dirname}/dog-img.txt`, res.body.message, (err) => {
//         if (err) return console.log(err.message);

//         console.log(`Random dog image save to file...`);
//       });
//     })
//     .catch((err) => {
//       // rejected error
//       return console.log(err.message);
//     });
// });

/* ****************
 * 43. Building Promises
 */

// // create Read Promises object เพื่อ handle .then .catch
// const readFilePromises = (file) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(file, (err, data) => {
//       //rejected
//       if (err) reject('I could not find that file :(');

//       // fullfilled
//       resolve(data);
//     });
//   });
// };

// // create Write Promises
// const writeFilePromises = (file, res) => {
//   return new Promise((resolve, reject) => {
//     fs.writeFile(file, res, (err) => {
//       if (err) reject('Could not write file :(');

//       resolve('success');
//     });
//   });
// };

// // Execute Promises chain
// readFilePromises(`${__dirname}/dog.txt`)
//   .then((data) => {
//     console.log(`Breed: ${data}`);
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     // resolved Promises object
//     console.log(res.body.message);

//     // write to file
//     return writeFilePromises(`${__dirname}/dog-img.txt`, res.body.message);
//   })
//   .then(console.log(`Random dog image save to file...`))
//   .catch((err) => {
//     // rejected error
//     console.log(err);
//   });

/* ****************
 * 44. Consuming Promises with Async/Await
 */

// // create Read Promises object เพื่อ handle .then .catch
// const readFilePromises = (file) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(file, (err, data) => {
//       //rejected
//       if (err) reject('I could not find that file :(');

//       // fullfilled
//       resolve(data);
//     });
//   });
// };

// // create Write Promises
// const writeFilePromises = (file, res) => {
//   return new Promise((resolve, reject) => {
//     fs.writeFile(file, res, (err) => {
//       if (err) reject('Could not write file :(');

//       resolve('success');
//     });
//   });
// };

// const getRandomPicture = async () => {
//   try {
//     // readFile from txt เป็น Promises
//     const data = await readFilePromises(`${__dirname}/dog.txt`);
//     console.log(`Breed: ${data}`);

//     // fetch data from API
//     const res = await await superagent.get(
//       `https://dog.ceo/api/breed/${data}/images/random`
//     );
//     console.log(res.body.message);

//     // writeFile แบบ Promises
//     await writeFilePromises(`${__dirname}/dog-img.txt`, res.body.message);
//   } catch (err) {
//     console.log(err);
//   }
// };

// // Execute function
// getRandomPicture();

/* **
 * 45. Returning Values from Async Functions
 *****/

// // create Read Promises object เพื่อ handle .then .catch
// const readFilePromises = (file) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(file, (err, data) => {
//       //rejected
//       if (err) reject('I could not find that file :(');

//       // fullfilled
//       resolve(data);
//     });
//   });
// };

// // create Write Promises
// const writeFilePromises = (file, res) => {
//   return new Promise((resolve, reject) => {
//     fs.writeFile(file, res, (err) => {
//       if (err) reject('Could not write file :(');

//       resolve('success');
//     });
//   });
// };

// const getRandomPicture = async () => {
//   try {
//     // readFile from txt เป็น Promises
//     const data = await readFilePromises(`${__dirname}/dog.txt`);
//     console.log(`Breed: ${data}`);

//     // fetch data from API
//     const res = await await superagent.get(
//       `https://dog.ceo/api/breed/${data}/images/random`
//     );
//     console.log(res.body.message);

//     // writeFile แบบ Promises
//     await writeFilePromises(`${__dirname}/dog-img.txt`, res.body.message);
//   } catch (err) {
//     // throw err -> rejected Promise
//     throw err;
//   }

//   // return result from Promise
//   return '2: READY !!!';
// };

// // รับค่า result จาก async...await โดยใช้ async...await
// console.log('1: Will get dog pics!');

// (async () => {
//   try {
//     const result = await getRandomPicture();
//     console.log(result);
//     console.log('3:Done Getting dog pics!');

//     return result;
//   } catch (err) {
//     console.log(err);
//   }
// })();

// รับค่า result จาก async...await โดยใช้ .then(), .catch() method
/* 
console.log('1: Will get dog pics!');
getRandomPicture()
  .then((result) => {
    console.log(result);
    console.log('3:Done Getting dog pics!');
  })
  .catch((err) => {
    // รับ result ที่เป็น error ใน async...await
    console.log(err);
  });
 */

/* **
 * 46. Waiting for Multiple Promises Simultaneously
 *****/

// create Read Promises object เพื่อ handle .then .catch
const readFilePromises = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      //rejected
      if (err) reject('I could not find that file :(');

      // fullfilled
      resolve(data);
    });
  });
};

// create Write Promises
const writeFilePromises = (file, res) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, res, (err) => {
      if (err) reject('Could not write file :(');

      resolve('success');
    });
  });
};

const getRandomPicture = async () => {
  try {
    // readFile from txt เป็น Promises
    const data = await readFilePromises(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    // fetch data from API
    const res1Promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const res2Promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const res3Promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    // ใช้รับค่า resolve ของ Promises โดย return array
    const all = await Promise.all([res1Promise, res2Promise, res3Promise]);

    // loop through array เอาเฉพาะ url
    const imgs = all.map((el) => el.body.message);

    console.log(imgs);

    // writeFile แบบ Promises
    // .join('\n') คือ join text โดยมี \n (new line) ระหว่างกลางของ text
    await writeFilePromises(`${__dirname}/dog-img.txt`, imgs.join('\n'));
  } catch (err) {
    // throw err -> rejected Promise
    throw err;
  }

  // return result from Promise
  return '2: READY !!!';
};

// รับค่า result จาก async...await โดยใช้ async...await
console.log('1: Will get dog pics!');

(async () => {
  try {
    const result = await getRandomPicture();
    console.log(result);
    console.log('3:Done Getting dog pics!');

    return result;
  } catch (err) {
    console.log(err);
  }
})();
