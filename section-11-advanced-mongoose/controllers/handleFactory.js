const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// @route   GET /api/v1/resource/
exports.getAll = Model => {
  return catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (Hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // query คือ cursors ที่ได้จาก mongoDB
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // EXECUTE Query
    const tours = await features.query;

    // SEND Response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  });
};

// @route   GET /api/v1/resource/:id
exports.getOne = (Model, populateOptions) => {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const resource = await query;

    if (!resource) {
      return next(
        new AppError(
          `No resource found with that ID ${req.params.id}`,
          404,
        ),
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: resource,
      },
    });
  });
};

// @route   POST /api/v1/resource
exports.createOne = Model => {
  return catchAsync(async (req, res, next) => {
    // ใช้ method บน Model
    const resource = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: resource,
      },
    });
  });
};
// @route   PATCH /api/v1/resource/:id
exports.updateOne = Model => {
  return catchAsync(async (req, res, next) => {
    const resource = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!resource) {
      return next(
        new AppError(
          `No resource found with that ID ${req.params.id}`,
          404,
        ),
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: resource,
      },
    });
  });
};

// @route   DELETE /api/v1/resource/:id
exports.deleteOne = Model => {
  return catchAsync(async (req, res, next) => {
    const resource = await Model.findByIdAndDelete(req.params.id);

    if (!resource) {
      return next(
        new AppError(
          `No resource found with that ID ${req.params.id}`,
          404,
        ),
      );
    }

    res.status(204).json({
      status: 'success',
      data: {},
    });
  });
};
