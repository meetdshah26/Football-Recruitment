const JobSkill = require('../../models/jobSkillModel');

exports.getSkills = async (req, res) => {
  try {
    const skills = await JobSkill.find({ isDeleted: false }).sort('-_id');
    res.render('skill', { skills });
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/');
  }
};

exports.getAddSkill = (req, res) => res.render('skill_add');

exports.postAddSkill = async (req, res) => {
  try {
    await JobSkill.create({
      name: req.body.name,
    });

    req.flash('green', 'Job skill added successfully.');
    res.redirect('/skill');
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/skill');
  }
};

exports.getEditSkill = async (req, res) => {
  try {
    const skill = await JobSkill.findById(req.params.id);
    if (!skill) {
      req.flash('red', 'Job skill not found!');
      return res.redirect('/skill');
    }

    res.render('skill_edit', { skill });
  } catch (error) {
    if (error.name === 'CastError') req.flash('red', 'Job skill not found!');
    else req.flash('red', error.message);
    res.redirect('/skill');
  }
};

exports.postEditSkill = async (req, res) => {
  try {
    const skill = await JobSkill.findById(req.params.id);
    if (!skill) {
      req.flash('red', 'Job skill not found!');
      return res.redirect('/skill');
    }

    skill.name = req.body.name;

    await skill.save();

    req.flash('green', 'Job skill updated successfully');
    res.redirect('/skill');
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/skill');
  }
};

exports.getDeleteSkill = async (req, res) => {
  try {
    await JobSkill.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });

    req.flash('green', 'Job skill deleted successfully.');
    res.redirect('/skill');
  } catch (error) {
    if (error.name === 'CastError' || error.name === 'TypeError')
      req.flash('red', 'Job skill not found!');
    else req.flash('red', error.message);
    res.redirect('/skill');
  }
};
