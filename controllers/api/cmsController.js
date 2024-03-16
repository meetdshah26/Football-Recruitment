const createError = require('http-errors');
const axios = require('axios');

const Page = require('../../models/pageModel');
const Newsletter = require('../../models/newsletterModel');
const Banner = require('../../models/bannerModel');
const Message = require('../../models/messageModel');
const Testimonial = require('../../models/testimonialModel');
const validator = require('../../utils/validation.json');

exports.getWhoWeAre = async (req, res, next) => {
  try {
    let page = await Page.findOne({ key: 'whoWeAre' }).select('-__v -key -_id');

    res.json({ success: true, page });
  } catch (error) {
    next(error);
  }
};

exports.getPrivacy = async (req, res, next) => {
  try {
    let page = await Page.findOne({ key: 'privacy' }).select(
      '-__v -key -_id -createdAt -updatedAt'
    );

    res.json({ success: true, page });
  } catch (error) {
    next(error);
  }
};

exports.postContact = async (req, res, next) => {
  try {
    const { name, email, phone, message, recaptchaToken } = req.body;

    if (!recaptchaToken) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid reCAPTCHA.' });
    }

    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.reCaptchaKey}&response=${recaptchaToken}`;

    const recaptchaResponse = await axios.post(verificationURL);
    if (!recaptchaResponse.data.success) {
      return res
        .status(400)
        .json({ success: false, error: 'reCAPTCHA verification failed.' });
    }

    await Message.create({
      name,
      email,
      phone,
      message,
    });

    res
      .status(201)
      .json({ success: true, message: 'Thank You for Contacting Us.' });
  } catch (error) {
    next(error);
  }
};

exports.newsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    const emailExist = await Newsletter.findOne({ email });
    if (emailExist)
      return next(createError.BadRequest(validator.alreadyRegistered));

    await Newsletter.create({ email });

    res.status(201).json({
      success: true,
      message: validator.msg,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBanners = async (req, res, next) => {
  try {
    const banner = await Banner.findOne().select('-__v -_id');

    res.json({
      success: true,
      banner,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.find()
      .sort('-_id')
      .select('-_id -__v -updatedAt -createdAt');

    res.json({ success: true, testimonial });
  } catch (error) {
    next(error);
  }
};

exports.getTermsCondition = async (req, res, next) => {
  try {
    let page = await Page.findOne({ key: 'termsConditions' }).select(
      '-__v -key -_id -createdAt -updatedAt'
    );

    res.json({ success: true, page });
  } catch (error) {
    next(error);
  }
};
