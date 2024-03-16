const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');

const uploadController = require('./controllers/uploadController');
const globalErrorHandler = require('./controllers/errorController');

// Start express app
const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(
  require('cookie-session')({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// CORS middleware
const cors = require('cors');
app.use(cors());
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};
app.options('*', cors(corsOptions));

// caching disabled for every route
app.use(function (req, res, next) {
  res.set(
    'Cache-Control',
    'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
  );
  next();
});

// end app-assets
app.use('/app-assets/*', (req, res) => res.status(404).end());

// 404 uploads
app.use('/uploads/*', (req, res) => res.status(404).end());

// 2) API ROUTES
app.use('/api', require('./routes/api/authRoutes'));
app.use('/api', require('./routes/api/cmsRoutes'));
app.use('/api', require('./routes/api/dashboardRoutes'));
app.use('/api', require('./routes/api/jobRoutes'));

// 404 api
app.use('/api', (req, res, next) => {
  next(createError.NotFound(`Can't find ${req.originalUrl} on this server!`));
});

// 3) ADMIN ROUTES
app.post(
  '/upload',
  uploadController.upload.single('upload'),
  uploadController.uploadCmsImage
);

app.use(function (req, res, next) {
  res.locals.url = req.originalUrl;
  res.locals.title = 'Football Recruitment';
  res.locals.dateLocale = 'en-US';
  res.locals.dateOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  next();
});

app.use('/', require('./routes/admin/authRoutes'));
app.use('/cms', require('./routes/admin/cmsRoutes'));
app.use('/', require('./routes/admin/userRoutes'));
app.use('/', require('./routes/admin/otherRoutes'));
app.use('/', require('./routes/admin/categoryRoutes'));
app.use('/', require('./routes/admin/jobRoutes'));
app.use('/', require('./routes/admin/recruiterRoutes'));
app.use('/', require('./routes/admin/jobTitleRoutes'));
app.use('/', require('./routes/admin/jobSkillRoutes'));

// 404 admin
app.all('/*', (req, res) => res.status(404).render('404'));

// 4) ERROR HANDLING
app.use(globalErrorHandler);

module.exports = app;
