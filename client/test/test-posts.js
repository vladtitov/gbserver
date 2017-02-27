///<reference path="./../../typings/index.d.ts"/>
var test;
(function (test) {
    var TestPosts = (function () {
        function TestPosts(request) {
            this.request = request;
            this.getpostsUrl = "http://localhost:3011/api/Posts/getMyPosts";
        }
        TestPosts.prototype.getMyPosts = function (callback) {
            this.request.get(this.getpostsUrl).done(function (res) {
                console.log(res);
                callback(res);
            }).fail(function (err) { return console.error(err); });
        };
        TestPosts.prototype.savePost = function () {
            var url = 'http://localhost:3011/api/Posts';
            var post = { isoffer: true, title: "post 2 ", description: 'my saved post 2' };
            this.request.save(post, url).done(function (res) { return console.log(res); }).fail(function (err) { return console.error(err); });
        };
        return TestPosts;
    }());
    test.TestPosts = TestPosts;
    var Login = (function () {
        function Login() {
            // loginUrl:string = 'http://grabopapi2dev.us-west-2.elasticbeanstalk.com/api/v1/auth';
            this.loginUrl2 = 'http://localhost:3011/api/Apusers/login';
            this.user = {
                email: 'uplight.ca@gmail.com',
                password: 'zaq12wsx'
            };
        }
        Login.prototype.get = function (url) {
            return $.ajax({
                // headers:{'Authorization':'8nvBJSkAHT38Lz0ECjV1cEBMdE9FwKsPxe8htUt0UMJ5kQ0uZ4auF46H6rm94XXS'},
                headers: { 'Authorization': this.token },
                dataType: "json",
                url: url
            });
        };
        Login.prototype.save = function (data, url) {
            return $.ajax({
                // headers:{'Authorization':'8nvBJSkAHT38Lz0ECjV1cEBMdE9FwKsPxe8htUt0UMJ5kQ0uZ4auF46H6rm94XXS'},
                headers: { 'Authorization': this.token },
                dataType: "application/json; charset=utf-8",
                contentType: "application/json; charset=utf-8",
                url: url,
                type: "POST",
                data: JSON.stringify(data)
            });
        };
        Login.prototype.doLogin = function (callBack) {
            var _this = this;
            $.post(this.loginUrl2, this.user).done(function (res) {
                console.log(res);
                _this.credetials = res;
                _this.token = res.id;
                callBack();
            }).fail(function (err) { return callBack(err); });
        };
        return Login;
    }());
    test.Login = Login;
})(test || (test = {}));
$(document).ready(function () {
    var login = new test.Login();
    var posts = new test.TestPosts(login);
    login.doLogin(function (err) {
        posts.getMyPosts(function (res) {
            posts.savePost();
        });
    });
});
