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

// Execute Promises chain
readFilePromises(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    // resolved Promises object
    console.log(res.body.message);

    // write to file
    return writeFilePromises(`${__dirname}/dog-img.txt`, res.body.message);
  })
  .then(console.log(`Random dog image save to file...`))
  .catch((err) => {
    // rejected error
    console.log(err);
  });
