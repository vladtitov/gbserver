///<reference path="./../typings/index.d.ts"/>

module test{
  export class TestPosts{
    getpostsUrl:string = "http://localhost:3011/api/Posts/getMyPosts";
    constructor(private request:Login){

    }

    getMyPosts(callback:Function):void{
      this.request.get(this.getpostsUrl).done((res)=>{
        console.log(res);
        callback(res);
      }).fail(err=>console.error(err));
    }

    savePost():void{
      let url = 'http://localhost:3011/api/Posts';
      let post:any = {description:'my saved post 4'};
      this.request.save(post,url).done((res)=>console.log(res)).fail(err=>console.error(err));
    }

  }

  export class Login{
   // loginUrl:string = 'http://grabopapi2dev.us-west-2.elasticbeanstalk.com/api/v1/auth';
    loginUrl2:string ='http://localhost:3011/api/Reviewers/login';
    token:string;
    credetials: {
      created:string;
      id:string;
      ttl:number;
      userId:number;
    }

    user:any = {
      email:'uplight.ca@gmail.com',
      password:'zaq12wsx'
    }

    get(url:string):JQueryXHR{
      return $.ajax({
       // headers:{'Authorization':'8nvBJSkAHT38Lz0ECjV1cEBMdE9FwKsPxe8htUt0UMJ5kQ0uZ4auF46H6rm94XXS'},
        headers:{'Authorization':this.token},
        dataType: "json",
        url:url
      })
    }

    save(data:any,url:string):JQueryXHR{
      return $.ajax({
        // headers:{'Authorization':'8nvBJSkAHT38Lz0ECjV1cEBMdE9FwKsPxe8htUt0UMJ5kQ0uZ4auF46H6rm94XXS'},
        headers:{'Authorization':this.token},
        dataType: "application/json; charset=utf-8",
        contentType:"application/json; charset=utf-8",
        url:url,
        type: "POST",
        data:JSON.stringify(data)

      })

    }

    constructor(){


    }

    doLogin(callBack:Function):void{
      $.post(this.loginUrl2, this.user).done((res)=>{
        console.log(res);
        this.credetials = res;
        this.token = res.id;
        callBack();
      }).fail(err=>callBack(err))
    }
  }
}


$(document).ready(function () {
  let login = new test.Login();
  let posts:test.TestPosts = new test.TestPosts(login);

  login.doLogin((err)=>{
    posts.getMyPosts((res)=>{
      posts.savePost();
    });
  });


})