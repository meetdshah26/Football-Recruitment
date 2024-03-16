const Category = require('../../models/categoryModel');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false }).sort('-_id');
    res.render('category', { categories });
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/');
  }
};

exports.getAddCategory = (req, res) => res.render('category_add');

exports.postAddCategory = async (req, res) => {
  try {
    await Category.create({
      name: req.body.name,
    });
    req.flash('green', 'Category added successfully.');
    res.redirect('/category');
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/category');
  }
};

exports.getEditCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      req.flash('red', 'Category not found!');
      return res.redirect('/category');
    }

    res.render('category_edit', { category });
  } catch (error) {
    if (error.name === 'CastError') req.flash('red', 'Category not found!');
    else req.flash('red', error.message);
    res.redirect('/category');
  }
};

exports.postEditCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      req.flash('red', 'Category not found!');
      return res.redirect('/category');
    }

    category.name = req.body.name;

    await category.save();

    req.flash('green', 'Category updated successfully');
    res.redirect('/category');
  } catch (error) {
    req.flash('red', error.message);
    res.redirect('/category');
  }
};

exports.getDeleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });

    req.flash('green', 'Category deleted successfully.');
    res.redirect('/category');
  } catch (error) {
    if (error.name === 'CastError' || error.name === 'TypeError')
      req.flash('red', 'Category not found!');
    else req.flash('red', error.message);
    res.redirect('/category');
  }
};