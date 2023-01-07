const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require("express-session");
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public/html')));
app.use(express.static(path.join(__dirname, 'public/css')));
app.use(express.static(path.join(__dirname, 'public/scripts')));

app.use(bodyParser.json());
app.use(session({
  secret:'sifra',
  resave:true,
  saveUninitialized:true
}));

app.post('/login',function(req,res){

  if(req.session.username == null){
    //provjeravamo da li postoji unutar fajla nastavnici.json
    let fileText = fs.readFileSync('data/nastavnici.json');  
    let json = JSON.parse(fileText);
    //console.log(json);
    let uneseni_username = req.body.username;
    let uneseni_password = req.body.password;

    let postoji = false;
    for(let i = 0 ; i < json.length ; i++){
      let obj = json[i];
      if(obj.nastavnik.username == uneseni_username){ 
        postoji = true;
      }

    }
    if(postoji == false){
      res.json({"poruka":"Neuspješna prijava"});
      return;
    }

    else{
    //provjerimo da li taj username postoji 
    for(let i = 0 ; i < json.length ; i++){
      let obj = json[i];
        if(obj.nastavnik.username == uneseni_username){ 
          bcrypt.compare(uneseni_password,obj.nastavnik.password_hash).then(function(isValid){
          
          if(isValid){
            req.session.username = uneseni_username;
            req.session.predmeti = obj.predmeti;
            res.json({"poruka":"Uspješna prijava"});
          }
          else{
            res.json({"poruka":"Neuspješna prijava"});
          }
        });
      }
     
    }
  }
  }
  else{
    //vec je neko logovan, sesija je otvorena
  }

});





app.listen(3000);
