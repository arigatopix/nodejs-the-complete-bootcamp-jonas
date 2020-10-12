const fs = require('fs');
const mongoose = require('mongoose');

const config = require('./config');

// Load Model
const Tour = require('./models/tourModel');
const Review = require('./models/reviewModel');

// connectDB
(async () => {
  await mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log('Database Connected');
})();

// read-json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, 'utf8'),
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/reviews.json`, 'utf8'),
);

// Import data to database
const importData = async () => {
  try {
    // console.log(tours);
    // await Tour.create(tours);
    await Review.create(reviews);
    console.log('Data successfully loaded!');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

// Delete data from database
const removeData = async () => {
  try {
    // await Tour.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

// Execution read from CLI
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  // remove from db
  removeData();
}
