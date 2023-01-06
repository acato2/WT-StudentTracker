function login(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let fun = function(err,data){
      //JSON.parse(data);
      console.log(data);
    };
    PoziviAjax.postLogin(username,password,fun);
}