'use strict';
var dsConfig = require('../datasources.json');
module.exports = function(app) {
  // Install a "/ping" route that returns "pong"
    var User = app.models.user;

    // console.log(User);
    //login page
    app.get('/login', function(req, res) {

        var credentials = dsConfig.emailDs.transports[0].auth;

         res.render('login', {
        email: credentials.user,
        password: credentials.pass
        });

       // res.json(dsConfig.emailDs);
    });

    //verified
    app.get('/verified', function(req, res) {

        res.render('verified');
    });

    //log a user in
    app.post('/login', function(req, res) {

        console.log(req.body);

        User.login({
            email: req.body.email,
            password: req.body.password
        },'user').then(function (token) {
            res.json(token);
        }).catch(function (err) {
            res.json(err);
        }).done(function () {
            console.log(' final ');
        });
    });

    //log a user out
    app.get('/logout', function(req, res, next) {

        if (!req.accessToken) return res.sendStatus(401);

        User.logout(req.accessToken.id, function(err) {
            if (err) return next(err);
            res.redirect('/');
        });
    });

    //send an email with instructions to reset an existing user's password
    app.post('/request-password-reset', function(req, res, next) {
        User.resetPassword({
            email: req.body.email
        }, function(err) {
            if (err) return res.status(401).send(err);

            res.render('response', {
             title: 'Password reset requested',
             content: 'Check your email for further instructions',
             redirectTo: '/',
             redirectToLinkText: 'Log in'
             });

        });
    });

    //show password reset form
    app.get('/reset-password', function(req, res, next) {
        if (!req.accessToken) return res.sendStatus(401);
         res.render('password-reset', {
         accessToken: req.accessToken.id
         });
    });

    //reset the user's pasword
    app.post('/reset-password', function(req, res, next) {
        if (!req.accessToken) return res.sendStatus(401);

        //verify passwords match
        if (!req.body.password ||
            !req.body.confirmation ||
            req.body.password !== req.body.confirmation) {
            return res.sendStatus(400, new Error('Passwords do not match'));
        }

        User.findById(req.accessToken.userId, function(err, user) {
            if (err) return res.sendStatus(404);
            user.updateAttribute('password', req.body.password, function(err, user) {
                if (err) return res.sendStatus(404);
                console.log('> password reset processed successfully');
                 res.render('response', {
                 title: 'Password reset success',
                 content: 'Your password has been reset successfully',
                 redirectTo: '/',
                 redirectToLinkText: 'Log in'
                 });
            });
        });
    });

  app.get('/ping', function(req, res) {
    res.send('pong');
  });
};

