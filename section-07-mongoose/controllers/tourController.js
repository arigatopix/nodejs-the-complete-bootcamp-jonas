const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      success: true,
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      data: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      data: err
    });
  }
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

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!tour) throw new Error('resource not found');

    res.status(200).json({
      success: true,
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      data: err
    });
  }
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    success: true,
    data: null
  });
};
