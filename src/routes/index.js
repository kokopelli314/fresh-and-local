const express = require('express');
const passport = require('passport');
const account = require('../authentication/account');
const router = express.Router();

/**
 * Landing page
 */
router.get('/', function (req, res) {
    res.render('index');
});

/**
 * Producer dashboard
 */
router.get('/dashboard', function (req, res) {
    res.render('dashboard');
});

/**
 * Producer product list page
 */
router.get('/dashboard/products', function (req, res) {
    res.render('products');
});

/**
 * New product upload page
 */
router.get('/dashboard/products/add', function (req, res) {
    res.render('products-add');
});
/**
 * New product post
 */
router.post('/products/add', function (req, res) {
    // await product.add(req.user.username, req.body);
    req.session.message = `✓ Product successfully added!`;
    res.redirect('/dashboard/products')
});

/**
 * Update producer profile information
 */
router.post('/profile', async function (req, res) {
    await account.updateProfile(req.user.username, req.body);
    req.session.message = `✓ Information successfully updated!`;
    res.redirect('/dashboard');
});

/**
 * Producer login page.
 */
router.get('/login', function (req, res) {
    res.render('login', { user: req.user });
});

/**
 * Log in to producer dashboard.
 */
router.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect('/dashboard');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

/**
 * Producer registration page.
 */
router.get('/register', function (req, res) {
    res.render('register', { });
});

/**
 * Register username and password. Form post route.
 */
router.post('/register', function( req, res) {
    account.ProducerAccount.register(
        new account.ProducerAccount({ username: req.body.username }),
        req.body.password,
        function (err, account) {
            if (err) {
                return res.render('register', { error: err.message });
            }
            passport.authenticate('local')(req, res, function() {
                req.session.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.redirect('/dashboard');
                });
            });
        }
    );
});

/**
 * Test!
 */
router.get('/ping', function (req, res) {
    res.status(200).send('pong!');
});

module.exports = router;
