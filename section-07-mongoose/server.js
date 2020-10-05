const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');

// connect DB
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(con => {
    // console.log(con.connections);
    console.log('MongoDB Connected...');
  })
  .catch(err => {
    throw new Error('MongoDB error');
  });

// Create simple Tour Model
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour much have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour much have a price']
  }
});

// create Model
const Tour = mongoose.model('Tour', tourSchema);

// create Model instance
const testTour = new Tour({
  name: 'The Forest Hill tour',
  rating: 4.7,
  price: 497
});

// Save to MongoDB
testTour
  .save()
  .then(doc => {
    console.log(doc);
  })
  .catch(err => {
    console.log('ERROR :', err);
  });

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`Sever running on port : ${PORT}`);
});
