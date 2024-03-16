const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const User = require('../../models/userModel');
const AppliedJob = require('../../models/appliedJobModel');
const Message = require('../../models/messageModel');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('jobTitle jobSkill').sort('-_id');

    res.render('user', { users });
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/');
  }
};

exports.viewUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      'jobTitle jobSkill'
    );

    if (!user) {
      req.flash('red', 'User not found!');
      return res.redirect('/user');
    }

    res.render('user_view', { user });
  } catch (error) {
    if (error.name === 'CastError') req.flash('red', 'User not found!');
    else req.flash('red', error.message);
    res.redirect('/user');
  }
};

exports.getDeleteUser = async (req, res) => {
  try {
    await Promise.all([
      User.findByIdAndDelete(req.params.id),
      AppliedJob.deleteOne({ user_id: req.params.id }),
    ]);

    req.flash('green', 'User deleted successfully.');
    res.redirect('/user');
  } catch (error) {
    if (error.name === 'CastError' || error.name === 'TypeError')
      req.flash('red', 'User not found!');
    else req.flash('red', error.message);
    res.redirect('/user');
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const msgs = await Message.find().sort('-_id');
    res.render('message', { msgs });
  } catch (error) {
    console.log(error);
    req.flash('red', error.message);
    res.redirect('/');
  }
};

exports.viewMessages = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      req.flash('red', 'Message not found!');
      return res.redirect('/message');
    }

    res.render('message_view', { message });
  } catch (error) {
    if (error.name === 'CastError') req.flash('red', 'Message not found!');
    else req.flash('red', error.message);
    res.redirect('/message');
  }
};

exports.getDeleteMessages = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);

    req.flash('green', 'Message deleted successfully.');
    res.redirect('/message');
  } catch (error) {
    if (error.name === 'CastError' || error.name === 'TypeError')
      req.flash('red', 'Message not found!');
    else req.flash('red', error.message);
    res.redirect('/message');
  }
};

exports.exportUsers = async (req, res) => {
  try {
    const users = await User.find().populate('jobTitle');

    const csvWriter = createCsvWriter({
      path: 'users.csv',
      header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Phone' },
        { id: 'resumeAvailability', title: 'Resume Status' },
        { id: 'jobTitle', title: 'Job Title' },
        { id: 'experience', title: 'Experience' },
        { id: 'city', title: 'City' },
        { id: 'date', title: 'Date' },
      ],
    });

    // Separate users into two arrays based on resume availability
    const pendingResumes = users.filter((user) => user.resumes.length === 0);
    const availableResumes = users.filter((user) => user.resumes.length > 0);

    // Concatenate the arrays to get the pending first, then available
    const csvData = [...pendingResumes, ...availableResumes].map((user) => ({
      name: user.name,
      email: user.email,
      phone: user.phone,
      resumeAvailability:
        user.resumes && user.resumes.length > 0 ? 'Available' : 'Pending',
      jobTitle: user.jobTitle.map((x) => x.name).join(' | '),
      experience: user.experience,
      city: user.city,
      date: user.date.toLocaleDateString('en-US'),
    }));

    await csvWriter.writeRecords(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');

    const fileStream = fs.createReadStream('users.csv');
    fileStream.pipe(res);
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/user');
  }
};
