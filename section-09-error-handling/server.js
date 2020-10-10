const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');

// connect DB
(async () => {
  await mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log('MongoDB Connected...');
})();

const PORT = config.port || 3000;

const server = app.listen(PORT, () => {
  console.log(`Sever running on port : ${PORT}`);
});

// Global unhandledRejection
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! : Shutting Down...');

  // close server after pending last request
  server.close(() => {
    process.exit(1);
  });
});
