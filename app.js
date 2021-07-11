const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const util = require('./global-utils');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const {swaggerDefinition} = require('./swagger-definition');
require('dotenv').config();

const allRoutes = util.getGlobbedPaths(util.assets.routes);
const allPolicies = util.getGlobbedPaths(util.assets.policies);
const allModels = util.getGlobbedPaths(util.assets.models);
const allConfigs = util.getGlobbedPaths(util.assets.configs);
const swaggerOptions = {
  swaggerDefinition,
  apis: util.assets.controllers,
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
const app = express();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'src/modules/core/views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

allPolicies.forEach((element) => {
  require(element).invokeRolesPolicies();
});

const connection = mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('connected to db', process.env.MONGO_URI);
      allModels.forEach((element) => {
        require(element);
      });

      allConfigs.forEach((element) => {
        require(element)(app);
      });

      allRoutes.forEach((element) => {
        require(element)(app);
      });

      // catch 404 and forward to error handler
      app.use((req, res, next) => {
        next(createError(404));
      });
      // error handler
      app.use((err, req, res, next) => {
      // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
      });
    })
    .catch((err) => {
      console.log(err.message);
    });

connection.on;

module.exports = app;

// swagger
// refresh token
