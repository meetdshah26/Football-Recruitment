const deleteFile = require('../../utils/deleteFile');

const Page = require('../../models/pageModel');

exports.getWhoWeAre = async (req, res) => {
  try {
    const page = await Page.findOne({ key: 'whoWeAre' });
    res.render('whoWeAre', { page });
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/');
  }
};

exports.postWhoWeAre = async (req, res) => {
  try {
    const page = await Page.findOne({ key: 'whoWeAre' });

    page.title = req.body.title;
    page.content = req.body.EnContent;

    if (req.file) {
      deleteFile(page.image);
      page.image = `/uploads/${req.file.filename}`;
    }

    await page.save();

    req.flash('green', 'Data updated successfully.');
    res.redirect('/cms/whoWeAre');
  } catch (error) {
    req.flash('red', error.message);
    res.redirect(req.originalUrl);
  }
};

exports.getPrivacy = async (req, res) => {
  try {
    const page = await Page.findOne({ key: 'privacy' });
    res.render('privacy', { page });
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/');
  }
};

exports.postPrivacy = async (req, res) => {
  try {
    const page = await Page.findOne({ key: 'privacy' });

    page.title = req.body.title;
    page.content = req.body.EnContent;

    if (req.file) {
      deleteFile(page.image);
      page.image = `/uploads/${req.file.filename}`;
    }

    await page.save();

    req.flash('green', 'Privacy notice updated successfully.');
    res.redirect('/cms/privacy');
  } catch (error) {
    req.flash('red', error.message);
    res.redirect(req.originalUrl);
  }
};


exports.getTermsCondi = async (req, res) => {
  try {
    const page = await Page.findOne({ key: 'termsConditions' });
    res.render('terms', { page });
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/');
  }
};

exports.postTermsCondi = async (req, res) => {
  try {
    const page = await Page.findOne({ key: 'termsConditions' });

    page.title = req.body.title;
    page.content = req.body.EnContent;

    if (req.file) {
      deleteFile(page.image);
      page.image = `/uploads/${req.file.filename}`;
    }

    await page.save();

    req.flash('green', 'Terms & conditions updated successfully.');
    res.redirect('/cms/terms');
  } catch (error) {
    req.flash('red', error.message);
    res.redirect(req.originalUrl);
  }
};