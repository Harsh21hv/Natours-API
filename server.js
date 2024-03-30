const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTIONS! 🤯💥 Shutting Down');
  console.log(err.name, ':', err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful ✅');
  });

//console.log(process.env);

/*Environment variables = these are global variables that are used to define enviroment
in which node app is running*/

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on Port: ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 🤯💥 Shutting Down');
  console.log(err.name);
  server.close(() => {
    process.exit(1);
  });
});


