function login(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
 
    PoziviAjax.postLogin(username,password,function(err,data){
      let jsonParsed = JSON.parse(data);
      
      console.log(jsonParsed.poruka);
    
      //nije doslo do errora
      if(!err){
        //provjeravamo da li je prijava uspjesna
        if(jsonParsed.poruka == "Uspješna prijava"){
          document.getElementById("error").innerHTML = "";

          window.location.href = "http://localhost:3000/predmeti.html";
        
        }
        else if (jsonParsed.poruka == "Neuspješna prijava"){
          document.getElementById("error").innerHTML = "Wrong username or password.";
        }


      }
   
    });
   
}
