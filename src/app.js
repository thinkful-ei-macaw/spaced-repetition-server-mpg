require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV, CLIENT_ORIGIN } = require('./config');
const errorHandler = require('./middleware/error-handler');
const authRouter = require('./auth/auth-router');
const languageRouter = require('./language/language-router');
const userRouter = require('./user/user-router');

const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}));
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);
app.use(helmet());

app.use('/api/users', userRouter);
app.use('/api/auth/login', authRouter);
app.use('/api/language', languageRouter);


app.use(errorHandler);

module.exports = app;
