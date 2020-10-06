const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');

// connect DB
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(con => {
    // console.log(con.connections);
    console.log('MongoDB Connected...');
  })
  .catch(err => {
    throw new Error('MongoDB error');
  });

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`Sever running on port : ${PORT}`);
});