const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // CORS middleware
const helmet = require('helmet');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const log = require('./util/log');
const LocalStrategy = require('passport-local').Strategy;
const account = require('./authentication/account');
const routes = require('./routes/index');



// Load environment variables from .env file, where API keys and passwords are configured
require('dotenv').config();

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

// Create Express server
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('✗ MongoDB connection error. Please make sure MongoDB is running.');
    process.exit();
});

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
app.use(cors()); // Allow CORS
app.use(helmet()); // security middleware
app.use(expressStatusMonitor());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressValidator());
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
    store: new MongoStore({
        url: process.env.MONGODB_URI,
        autoReconnect: true,
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// Assign user and message (if any) for render functions
app.use(function(req, res, next) {
    res.locals.user = req.user || {};
    // assign message to context, then delete from session
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// Routes
app.use('/', routes);


// passport config
passport.use(new LocalStrategy(account.ProducerAccount.authenticate()));
passport.serializeUser(account.ProducerAccount.serializeUser());
passport.deserializeUser(account.ProducerAccount.deserializeUser());


/**
 * Catch 404 and forward to error handler
 */
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    console.log(`404 request`);
    next(err);
});

// Development error handler
if (process.env.NODE_ENV === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.log(err);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// Production error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('✓ App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
