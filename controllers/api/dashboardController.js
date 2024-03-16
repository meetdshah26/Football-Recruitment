const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const validation = require('../../utils/validation.json');

const User = require('../../models/userModel');

exports.getProfile = (req, res, next) => {
  const user = req.user._doc;

  // Hide fields
  delete user.password;
  delete user.__v;

  res.json({ success: true, user });
};

exports.editProfile = async (req, res, next) => {
  try {
    delete req.body.email;
    delete req.body.password;

    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-__v');

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword)
      return next(createError.BadRequest(validation.oldPassword));
    if (!newPassword)
      return next(createError.BadRequest(validation.newPassword));
    if (newPassword !== confirmPassword)
      return next(createError.BadRequest(validation.confPassword));

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return next(createError.BadRequest(validation.wrongPassword));

    user.password = newPassword;
    await user.save();

    return res.json({
      success: true,
      message: validation.pwSuccess,
    });
  } catch (error) {
    next(error);
  }
};
