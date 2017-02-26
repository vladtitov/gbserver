'use strict';

module.exports = function(Review) {

    Review.observe('access', function(ctx, next){
        console.log('Review.observe  access', ctx.options);
        next();
    })


    Review.log = function(messageId, options) {

        const Message = this.app.models.Reviewer;

        console.log(options);
        // IMPORTANT: forward the options arg
        return Message.findById(messageId, null, options)
                .then(function(msg){
                const token = options && options.accessToken;
        const userId = token && token.userId;
        const user = userId ? 'user#' + userId : '<anonymous>';
        console.log('(%s) %s', user,user);
    });
}



/*
    Review.observe('before save',function (ctx, next) {
        console.log(ctx.req.query.access_token);

    });*/

        Review.beforeRemote('create', function(context, user, next) {
     // console.log(context);
      console.log(context.req.accessToken)
    context.args.data.date = Date.now();
    context.args.data.publisherId = context.req.accessToken.userId;
    next();
  });
};
