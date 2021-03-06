const { Router } = require('express');
const passport = require('passport');

const attachTo = (app, data, io) => {
    const router = new Router();
    const controller = require('./controller').init(data, io);

    router
        .get('/register', (req, res) => {
            return controller.getRegisterForm(req, res);
        })
        .get('/login', (req, res) => {
            return controller.getLogInForm(req, res);
        })
        .get('/profile', controller.verifyIsUser, (req, res) => {
            return controller.getProfileForm(req, res);
        })
        .get('/bookings', controller.verifyIsUser, (req, res) => {
            return controller.getMyBookings(req, res);
        })
        .post('/profile', controller.verifyIsUser, (req, res) => {
            return controller.updateProfile(req, res);
        })
        .get('/logout', (req, res) => {
            return controller.logOut(req, res);
        })
        .post('/register', (req, res) => {
            return controller.register(req, res);
        })
        .post('/login', passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/auth/login',
            failureFlash: true,
        }));

    app.use('/auth', router);
};

module.exports = { attachTo };
