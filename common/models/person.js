'use strict';

var config = require('../../server/config.json');
var path = require('path');

module.exports = function(Person) {
    Person.observe('access', function(ctx, next){

        console.log('Reviewer.observe  access', ctx.options);
        next();
    })

    Person.afterRemote('login', function (ctx, user, next) {

        console.log('after login user ', user);
        next();
    });


    Person.afterRemote('create', function(context, user, next) {
        console.log('> user.afterRemote triggered');

        var options = {
            host:'localhost',
            type: 'email',
            text:'Click here for verification {href}',
            to: user.email,
            from: 'noreply@loopback.com',
            subject: 'Thanks for registering.',
            template: path.resolve(__dirname, '../../server/views/verify.ejs'),
            redirect: '/verified',
            user: user
        };


        user.verify(options, function(err, response) {

            if (err) {
                User.deleteById(user.id);
                return next(err);
            }

            console.log('> verification email sent:', response);
           // next();
            context.res.render('response', {
                title: 'Signed up successfully',
                content: 'Please check your email and click on the verification link ' +
                'before logging in.',
                redirectTo: '/',
                redirectToLinkText: 'Log in'
            });
        });
    });


};
