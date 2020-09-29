const fs = require('fs');
const superagent = require('superagent');

fs.readFile(`${__dirname}/dog.txt`, 'utf8', (err, data) => {
  // fetch data from dog.ceo
  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      if (err) return console.log(err.message);

      // ได้ obj ที่ส่งมาจาก api
      // ต้องไล่หาเอาจาก res
      console.log(res.body.message);

      // write to file
      fs.writeFile(`${__dirname}/dog-img.txt`, res.body.message, (err) => {
        if (err) return console.log(err.message);

        console.log(`Random dog image save to file...`);
      });
    });
});