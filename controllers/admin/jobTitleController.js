const JobTitle = require('../../models/jobTitleModel');

exports.getTitles = async (req, res) => {
  try {
    const titles = await JobTitle.find({ isDeleted: false }).sort('name');
    res.render('title', { titles });
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/');
  }
};

exports.getAddTitle = (req, res) => res.render('title_add');

exports.postAddTitle = async (req, res) => {
  try {
    await JobTitle.create({
      name: req.body.name,
    });

    req.flash('green', 'Job title added successfully.');
    res.redirect('/title');
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/title');
  }
};

exports.getEditTitle = async (req, res) => {
  try {
    const title = await JobTitle.findById(req.params.id);
    if (!title) {
      req.flash('red', 'Job title not found!');
      return res.redirect('/title');
    }

    res.render('title_edit', { title });
  } catch (error) {
    if (error.name === 'CastError') req.flash('red', 'Job title not found!');
    else req.flash('red', error.message);
    res.redirect('/title');
  }
};

exports.postEditTitle = async (req, res) => {
  try {
    const title = await JobTitle.findById(req.params.id);
    if (!title) {
      req.flash('red', 'Job title not found!');
      return res.redirect('/title');
    }

    title.name = req.body.name;

    await title.save();

    req.flash('green', 'Job title updated successfully');
    res.redirect('/title');
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/title');
  }
};

exports.getDeleteTitle = async (req, res) => {
  try {
    await JobTitle.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });

    req.flash('green', 'Job title deleted successfully.');
    res.redirect('/title');
  } catch (error) {
    if (error.name === 'CastError' || error.name === 'TypeError')
      req.flash('red', 'Job title not found!');
    else req.flash('red', error.message);
    res.redirect('/title');
  }
};
