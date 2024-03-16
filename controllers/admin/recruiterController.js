const deleteFile = require('../../utils/deleteFile');
const Recruiter = require('../../models/recruiterModel');

exports.getRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.find({ isDeleted: false }).sort('-_id');

    res.render('recruiter', { recruiters });
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/');
  }
};

exports.getAddRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.find({ isDeleted: false }).sort('name');

    res.render('recruiter_add', {
      recruiters,
    });
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/recruiter');
  }
};

exports.postAddRecruiters = async (req, res) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    await Recruiter.create({
      image,
      recruiterName: req.body.recruiter,
      companyName: req.body.company,
      email: req.body.email,
      location: req.body.location,
    });

    req.flash('green', 'Data added successfully.');
    res.redirect('/recruiter');
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/recruiter');
  }
};

exports.getEditRecruiters = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id);
    if (!recruiter) {
      req.flash('red', 'Data not found!');
      return res.redirect('/recruiter');
    }

    res.render('recruiter_edit', { recruiter });
  } catch (error) {
    if (error.name === 'CastError') req.flash('red', 'Data not found!');
    else req.flash('red', error.message);
    res.redirect('/recruiter');
  }
};

exports.postEditRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.findById(req.params.id);
    if (!recruiters) {
      req.flash('red', 'Recruiter not found!');
      return res.redirect('/recruiter');
    }

    if (req.file) {
      deleteFile(recruiters.image);
      recruiters.image = `/uploads/${req.file.filename}`;
    }

    recruiters.recruiterName = req.body.recruiter;
    recruiters.companyName = req.body.company;
    recruiters.email = req.body.email;
    recruiters.location = req.body.location;

    await recruiters.save();

    req.flash('green', 'Data updated successfully');
    res.redirect('/recruiter');
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/recruiter');
  }
};

exports.getDeleteRecruiters = async (req, res) => {
  try {
    await Recruiter.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });

    req.flash('green', 'Recruiter deleted successfully.');
    res.redirect('/recruiter');
  } catch (error) {
    if (error.name === 'CastError' || error.name === 'TypeError')
      req.flash('red', 'Recruiter not found!');
    else req.flash('red', error.message);
    res.redirect('/recruiter');
  }
};
