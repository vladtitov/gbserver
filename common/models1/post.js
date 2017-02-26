'use strict';

module.exports = function(Post) {

   /*


    Post.observe('access', function(ctx, next){
        console.log('Post.observe  access', ctx.options);


        next();

    });
*/

    Post.observe('before save', function(ctx, next) {
        console.log(ctx.options);
       // console.log(ctx.data);
        console.log(ctx.instance);
        var userId =  ctx.options.accessToken.userId;

        if(ctx.instance)ctx.instance.userid= userId;
        console.log(ctx.instance);



        console.log('supports isNewInstance?', ctx.isNewInstance !== undefined);
        next();
    });



    Post.getMyPosts = function(options,cb) {
        //console.log(options);
        if(options && options.accessToken){
            Post.find({where: {userid:options.accessToken.userId}}, function(err, userPosts) {
                cb(err,userPosts);
            });
        }else cb(null,[]);



    };


    Post.remoteMethod('getMyPosts', {
        accepts: {"arg": "options", "type": "object", "http": "optionsFromRequest"},
        http:{verb:'get'},
        returns: {arg: 'data', type: 'array'}
    });
};
