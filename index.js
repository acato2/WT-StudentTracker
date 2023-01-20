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
  secret: 'sifra',
  resave: true,
  saveUninitialized: true
}));

app.post('/login', function (req, res) {

  if (req.session.username == null) {
    //provjeravamo da li postoji unutar fajla nastavnici.json
    let fileText = fs.readFileSync('data/nastavnici.json');
    let json = JSON.parse(fileText);
    let uneseni_username = req.body.username;
    let uneseni_password = req.body.password;

    let postoji = false;
    for (let i = 0; i < json.length; i++) {
      let obj = json[i];
      if (obj.nastavnik.username == uneseni_username) {
        postoji = true;
      }

    }
    if (postoji == false) {
      res.json({ "poruka": "Neuspješna prijava" });
      return;
    }

    else {
      //provjerimo da li taj username postoji 
      for (let i = 0; i < json.length; i++) {
        let obj = json[i];
        if (obj.nastavnik.username == uneseni_username) {
          bcrypt.compare(uneseni_password, obj.nastavnik.password_hash).then(function (isValid) {

            if (isValid) {
              req.session.username = uneseni_username;
              req.session.predmeti = obj.predmeti;
              res.json({ "poruka": "Uspješna prijava" });
            }
            else {
              res.json({ "poruka": "Neuspješna prijava" });
            }
          });
        }

      }
    }
  }
  else {
    //vec je neko logovan, sesija je otvorena
  }

});

app.get('/predmeti', function (req, res) {
  if (req.session.username != null) {  //ako je loginovan
    res.json(req.session.predmeti);
  }
  else {
    res.json({ greska: "Nastavnik nije loginovan" });
  }
});


app.post('/logout', function (req, res) {
  //brise informacije iz sesije
  if (req.session.username != null) {
    req.session.username = null;
    req.session.predmeti = null;
    res.json({ poruka: "Uspješno odjavljen korisnik" })
  }
  else {
    res.json({ poruka: "Neuspješno odjavljen korisnik" })
  }
});

app.get('/predmet/:NAZIV', function (req, res) {
  //provjeravamo da li u prisustva.json ima taj predmet i vracamo prisustva
  let fileText = fs.readFileSync('data/prisustva.json');
  let json = JSON.parse(fileText);

  for (let i = 0; i < json.length; i++) {
    let obj = json[i];
    if (obj.predmet == req.params.NAZIV) {
      res.json(obj);
    }
  }
});

app.post('/prisustvo/predmet/:NAZIV/student/:index', function (req, res) {
  let fileText = fs.readFileSync('data/prisustva.json');
  let json = JSON.parse(fileText);
  //odgovor je cijeli json sa azuriranim prisustvom za taj predmet

  let imaPrisustvo = false;
  for (let i = 0; i < json.length; i++) {
    let obj = json[i];
    if (obj.predmet == req.params.NAZIV) {  //znaci da smo nasli prisustvo za taj predmet
      //prolazimo kroz prisustva
      for (let j = 0; j < obj.prisustva.length; j++) {
        let obj2 = obj.prisustva[j];
        //ako su u pitanju crvena i zelena celija, odnosno ako prisustvo vec postoji
        if (obj2.sedmica == req.body.sedmica && obj2.index == req.params.index) {
          imaPrisustvo = true;
          //mijenjamo
          obj2.predavanja = req.body.predavanja;
          obj2.vjezbe = req.body.vjezbe;

          fs.writeFile('data/prisustva.json', JSON.stringify(json), (err) => {
            if (err) throw err;
          });
          let povratni;
          for (let i = 0; i < json.length; i++) {
            if (json[i].predmet == req.params.NAZIV) {
              povratni = json[i];

            }
          }
          res.json(povratni);
        }

      }
      if (imaPrisustvo == false) {
        //dodajemo novi objekat
        let novi = {
          "sedmica": req.body.sedmica,
          "predavanja": req.body.predavanja,
          "vjezbe": req.body.vjezbe,
          "index": parseInt(req.params.index)
        };
        obj.prisustva.push(novi);
        fs.writeFile('data/prisustva.json', JSON.stringify(json), (err) => {
          if (err) throw err;
        });
        let povratni;
          for (let i = 0; i < json.length; i++) {
            if (json[i].predmet == req.params.NAZIV) {
              povratni = json[i];

            }
          }
        res.json(povratni);

      }
    }
  }

});





app.listen(3000);
