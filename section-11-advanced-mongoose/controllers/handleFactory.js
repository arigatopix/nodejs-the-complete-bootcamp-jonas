const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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
