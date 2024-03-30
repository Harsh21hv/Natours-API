const User = require('./../models/usermodel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../Controllers/handlerFactory')

const filteredObj = (Obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(Obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = Obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next)=>{
  req.params.id = req.user.id;
  next()
}

exports.updateMe = async (req, res, next) => {
  // 1) create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. please use /updateMypassword.',
        400
      )
    );
  }
  //2- Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filteredObj(req.body, 'name', 'email');
  //3- update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined/please signup instead',
  });
};



exports.getAllUsers = factory.getAll(User)
exports.getUser = factory.getOne(User)
//Do not update password with this 
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)
