const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  process.exit(1);
});

dotenv.config();
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.set('strictQuery', false);
mongoose
  .connect(DB, { useNewUrlParser: true })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

// process.on('SIGTERM', () => {

//     console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
//     server.close(() => {
//         console.log('💥 Process terminated!');
//     });
// });
