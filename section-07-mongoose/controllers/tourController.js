const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    // BUILD Query
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludeFileds = ['page', 'sort', 'limit', 'fields'];
    excludeFileds.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);

    // 2) Advanced Filtering
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|in)\b/g,
      match => `$${match}`
    );

    let query = Tour.find(JSON.parse(queryStr));

    // 3) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 4) Select
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 5) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    // check page and skip
    if (req.query.page) {
      const countDoc = await Tour.countDocuments();
      if (skip >= countDoc) throw new Error('This page does not exists');
    }

    query = query.skip(skip).limit(limit);

    // EXECUTE Query
    const tours = await query;

    // SEND Response
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

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) throw new Error('resource not found');

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      data: err
    });
  }
};
