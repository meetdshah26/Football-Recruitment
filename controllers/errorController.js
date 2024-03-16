const multer = require('multer');

module.exports = (error, req, res, next) => {

  if (error instanceof multer.MulterError) {
    // handle MulterError
    req.flash('red', error.message);
    return res.redirect(req.originalUrl);
  }

  if (error.code == 11000) {
    return res.status(403).json({
      success: false,
      message: `${Object.keys(error.keyPattern)[0]} is already registered.`,
    });
  }

  if (error.name === 'ValidationError') {
    let errors = {};
    Object.keys(error.errors).forEach(
      (key) => (errors[key] = error.errors[key].message)
    );
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  if (error.name == 'BadRequestError' && error.message.errors) {
    let errors = {};
    Object.keys(error.message.errors).forEach((key) => {
      let myKey = key;
      if (myKey.includes('.')) myKey = myKey.split('.').pop();
      errors[myKey] = error.message.errors[key].message;
    });
    return res.status(400).json({ success: false, errors });
  }

  if (error.name == 'MulterError') error.status = 413;

  if (
    error.message.toString().includes(': ') &&
    error.name == 'BadRequestError'
  ) {
    error.message = error.message.toString().split(': ').pop();
  }
  res.status(error.status || 500).json({
    success: false,
    message: error.message,
    errorCode: res.errorCode,
  });
};
