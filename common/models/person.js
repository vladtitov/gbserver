'use strict';

var config = require('../../server/config.json');
var path = require('path');

module.exports = function(Person) {

    Person.upload = function(options, req, res, upload_id, cb) {

        var token = options.accessToken;
        console.log(token);
        var folder = 'folder-'+ token.userId;

        var onUploaded = function (err,result) {
            console.log(JSON.stringify(result));
            cb(null,result)
        };

        var StorageContainer = Person.app.models.Container;

        StorageContainer.getContainers(function (err, containers) {
            if (containers.some(function(e) { return e.name == folder; })) {
                StorageContainer.upload(req, res, {container: folder}, onUploaded);

            }
            else {
                StorageContainer.createContainer({name: folder}, function(err, c) {
                    StorageContainer.upload(req, res, {container: c.name}, onUploaded);
                });
            }
        });
    };

    Person.remoteMethod('upload',
        {
            http: {path: '/:id/upload', verb: 'post'},
            accepts: [
                {arg: "options", type: "object", http: "optionsFromRequest"},
                {arg: 'req', type: 'object', 'http': {source: 'req'}},
                {arg: 'res', type: 'object', 'http': {source: 'res'}},
                {arg: 'id', type: 'string'}
            ],
            returns: {arg: 'status', type: 'object'}
        }
    );


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
