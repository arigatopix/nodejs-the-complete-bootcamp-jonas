const Tour = require('../models/tourModel');

exports.getAllTours = (req, res) => {
  Tour.find().then(tours => {
    res.status(200).json({
      success: true,
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours
      }
    });
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;

  res.status(200).json({
    success: true,
    data: {
      // tour
    }
  });
};

exports.createTour = async (req, res) => {
  try {
    // ใช้ method บน Model
    const tour = await Tour.create(req.body);

    res.status(201).json({
      success: true,
      data: tour
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err
    });
  }
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      tour: '<Updated tour here...>'
    }
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    success: true,
    data: null
  });
};
