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
fs.readFile(`${__dirname}/dog.txt`, 'utf8', (err, data) => {
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`) // Promises
    .then((res) => {
      // resolved Promises object
      console.log(res.body.message);

      // write to file
      fs.writeFile(`${__dirname}/dog-img.txt`, res.body.message, (err) => {
        if (err) return console.log(err.message);

        console.log(`Random dog image save to file...`);
      });
    })
    .catch((err) => {
      // rejected error
      return console.log(err.message);
    });
});
