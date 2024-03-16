const Job = require('../../models/jobModel');
const Category = require('../../models/categoryModel');
const Recruiter = require('../../models/recruiterModel');
const AppliedJob = require('../../models/appliedJobModel');

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isDeleted: false })
      .sort('-_id')
      .populate('category recruiter');

    res.render('job', { jobs });
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/');
  }
};

exports.viewJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'category recruiter'
    );
    if (!job) {
      req.flash('red', 'Vacancy not found.');
      return res.redirect('/job');
    }

    const appliedJobs = await AppliedJob.find({
      job_id: req.params.id,
    }).populate({ path: 'user_id' });

    res.render('job_view', { job, appliedJobs });
  } catch (error) {
    if (error.name == 'CastError') req.flash('red', 'Vacancy not found.');
    else req.flash('red', error.message);
    res.redirect('/job');
  }
};

exports.getAddJob = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false }).sort('name');
    const recruiters = await Recruiter.find({ isDeleted: false }).sort(
      'recruiterName'
    );

    res.render('job_add', {
      categories,
      recruiters,
    });
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/job');
  }
};

exports.postAddJob = async (req, res) => {
  try {
    await Job.create({
      title: req.body.title,
      recruiter: req.body.recruiter,
      category: req.body.category,
      job_type: req.body.jobType,
      short_description: req.body.shortDesc,
      description: req.body.skill,
      salary: req.body.salary,
      experience: req.body.experience,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      popular: req.body.popular,
      work_place: req.body.workPlace,
    });

    req.flash('green', 'Vacancy added successfully.');
    res.redirect('/job');
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/job');
  }
};

exports.getEditJob = async (req, res) => {
  try {
    const jobs = await Job.findById(req.params.id);
    if (!jobs) {
      req.flash('red', 'Vacancy not found!');
      return res.redirect('/job');
    }

    const categories = await Category.find({ isDeleted: false });
    const recruiters = await Recruiter.find({ isDeleted: false });

    res.render('job_edit', { jobs, categories, recruiters });
  } catch (error) {
    if (error.name === 'CastError') req.flash('red', 'Vacancy not found!');
    else req.flash('red', error.message);
    res.redirect('/job');
  }
};

exports.postEditJob = async (req, res) => {
  try {
    const jobs = await Job.findById(req.params.id);
    if (!jobs) {
      req.flash('red', 'Vacancy not found!');
      return res.redirect('/job');
    }

    jobs.recruiter = req.body.recruiter;
    jobs.title = req.body.title;
    jobs.category = req.body.category;
    jobs.job_type = req.body.job_type;
    jobs.short_description = req.body.short_description;
    jobs.description = req.body.skill;
    jobs.salary = req.body.salary;
    jobs.experience = req.body.experience;
    jobs.country = req.body.country;
    jobs.state = req.body.state;
    jobs.city = req.body.city;
    jobs.popular = req.body.popular;
    jobs.work_place = req.body.workPlace;

    await jobs.save();

    req.flash('green', 'Vacancy updated successfully');
    res.redirect('/job');
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/job');
  }
};

exports.getDeleteJob = async (req, res) => {
  try {
    await Job.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });

    req.flash('green', 'Vacancy deleted successfully.');
    res.redirect('/job');
  } catch (error) {
    if (error.name === 'CastError' || error.name === 'TypeError')
      req.flash('red', 'Vacancy not found!');
    else req.flash('red', error.message);
    res.redirect('/job');
  }
};

exports.updateSwitch = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Vacancy not found' });
    }

    job.popular = req.body.popular;
    await job.save();
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
