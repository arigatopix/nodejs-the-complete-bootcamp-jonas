const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @route   POST /api/v1/resource
exports.createOne = Model => {
  return catchAsync(async (req, res, next) => {
    // ใช้ method บน Model
    const resource = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        resource,
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
