const jwt = require('jsonwebtoken');
const path = require('path');
const createError = require('http-errors');
const AppliedJob = require('../../models/appliedJobModel');
const validation = require('../../utils/validation.json');
const generatePassword = require('../../utils/generatePassword');
const { sendLink, sendPassword } = require('../../utils/sendMail');

const User = require('../../models/userModel');

// To ensure that a valid user is logged in.
exports.checkUser = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];

    if (!token) return next(createError.Unauthorized(validation.provideToken));

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select('+password');

    if (!user) return next(createError.Unauthorized(validation.login));

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Just check if valid user is logged, doesn't throw error if not
exports.isUser = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];

    if (!token) return next();

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select('+password');

    if (user) req.user = user;

    next();
  } catch (error) {
    next();
  }
};

//Apply Job Without SignUp
exports.register = async (req, res, next) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist)
      return next(createError.Conflict(validation.alreadyRegistered));

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload resume.',
      });
    }

    const newResumes = req.files.map((file) => {
      const resumeTitle = path.parse(file.originalname).name;

      return {
        resumeTitle: req.body.resumeTitle || resumeTitle,
        resumePdf: `/uploads/${file.filename}`,
        selected: true,
      };
    });

    const userPassword = generatePassword(14);

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: userPassword,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      experience: req.body.experience,
      jobTitle: req.body.jobTitle,
      resumes: newResumes,
    });

    // Send an email with the password & Apply For Job
    if (user.email) {
      sendPassword(user.email, userPassword, req.body.title, user.name);

      const appliedJob = new AppliedJob({
        user_id: user._id,
        job_id: req.body.jobId,
        resumePdf: newResumes[0].resumePdf,
      });

      await appliedJob.save();
    }

    user.password = undefined;
    user.jobTitle = undefined;
    user.jobSkill = undefined;
    user.date = undefined;
    user.__v = undefined;

    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: `You have applied for the ${
        req.body.title ? req.body.title : 'Job'
      } successfully.`,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist)
      return next(createError.Conflict(validation.alreadyRegistered));

    // if (!req.files || req.files.length === 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Please upload resume PDF.',
    //   });
    // }

    // const newResumes = req.files.map((file) => {
    //   const resumeTitle = path.parse(file.originalname).name;

    //   return {
    //     resumeTitle: req.body.resumeTitle || resumeTitle,
    //     resumePdf: `/uploads/${file.filename}`,
    //     selected: true,
    //   };
    // });

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
    });

    user.password = undefined;
    user.jobTitle = undefined;
    user.jobSkill = undefined;
    user.resumes = undefined;
    user.date = undefined;
    user.__v = undefined;

    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: validation.registerSuccefully,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(createError.BadRequest(validation.incorrectCredentials));

    const user = await User.findOne({ email }).select('+password -__v');

    if (!user) return next(createError.BadRequest(validation.invalidEmail));

    if (!(await user.correctPassword(password, user.password)))
      return next(createError.BadRequest(validation.invalidPassword));

    await user.save();

    user.password = undefined;
    user.jobTitle = undefined;
    user.jobSkill = undefined;
    user.date = undefined;
    user.__v = undefined;

    const token = user.generateAuthToken();
    res.json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError.NotFound(validation.notRegistered));

    // Generate a reset token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    // Send an email to the user with the reset link
    sendLink(user.email, link);

    res.json({
      success: true,
      message: validation.linkSent,
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Verify the token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Update the user's password
    const user = await User.findById(userId);
    if (!user) return next(createError.BadRequest(validation.tokenInvalid));
    user.password = password;
    await user.save();

    user.password = undefined;

    const authToken = user.generateAuthToken();
    res.json({
      success: true,
      message: validation.pwSuccess,
      token: authToken,
      user,
    });
  } catch (error) {
    if (error.message == 'jwt expired' || error.message == 'invalid signature')
      return next(createError.BadRequest(validation.tokenInvalid));
    next(error);
  }
};
