const multer = require('multer');

exports.upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname.replace(' ', ''));
    },
  }),
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
      cb(null, true);
    else cb(new Error('Please upload jpg or png file.'), false);
  },
});

exports.uploadResume = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname.replace(' ', ''));
    },
  }),
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
      'application/msword',
    ];

    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error('Please upload a valid PDF, DOC, DOCX file.'),
        false
      );
    }
  },
}).array('resumes', 5);

exports.uploadCSV = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'text/csv') cb(null, true);
    else cb(null, false);
  },
});

exports.uploadCmsImage = async (req, res) => {
  try {
    if (!req.file) return res.send('File not uploaded.');

    const url = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
    const send = `<script>window.parent.CKEDITOR.tools.callFunction('${req.query.CKEditorFuncNum}', '${url}');</script>`;
    res.send(send);
  } catch (error) {
    res.send(error.message);
  }
};
