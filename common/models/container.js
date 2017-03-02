/**
 * Created by Vlad on 2/27/2017.
 */
module.exports = function(Container) {

   Container.beforeRemote('upload', function(ctx, unused, next) {
        // Change the request parameters within the context here...
        console.log(unused);
        console.log(ctx.args.req.params.container);
        console.log(ctx.req.accessToken);

        Container.getContainers(function (err, containers) {

            if (containers.some(function(e) { return e.name == ctx.args.req.params.container; })) {
               // StorageContainer.upload(req, res, {container: ctx.args.req.params.container}, cb);
                //console.log(' exists');
                next();
            }
            else {
                console.log('creating container ');
                Container.createContainer({name: ctx.args.req.params.container}, function(err, c) {
                    //StorageContainer.upload(req, res, {container: c.name}, cb);
                    console.log(err,c);
                    next();
                });
            }

        });


    });
};