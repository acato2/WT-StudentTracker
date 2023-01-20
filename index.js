const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require("express-session");
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express();
const baza = require("./public/scripts/baza.js");
//baza.sync({ force: false });
//manuelno pokretanje priprema.js fajla za kreiranje početnih podataka

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



app.post('/login', async function (req, res) {

  if (req.session.username == null) {
    let uneseni_username = req.body.username;
    let uneseni_password = req.body.password;

    let postoji = false;

    let nastavnik = await baza.Nastavnik.findOne({
      where: {
        username: uneseni_username
      }
    });
    if (nastavnik) {
      postoji = true;
    }

    if (postoji == false) {
      res.json({ "poruka": "Neuspješna prijava" });
      return;
    }

    else {
      if (postoji == true) {
        bcrypt.compare(uneseni_password, nastavnik.password_hash).then(async function (isValid) {
          if (isValid) {
            req.session.username = uneseni_username;
            //daj sve predmete tog nastavnika
            let predmeti = await baza.Predmet.findAll({
              include: [{
                model: baza.Nastavnik,
                attributes: ['username'],
                where: {
                  id: nastavnik.id
                }
              }]
            });
            let naziviPredmeta = [];
            for (let i = 0; i < predmeti.length; i++) {
              naziviPredmeta.push(predmeti[i].predmet);
            }
            req.session.predmeti = naziviPredmeta;
            res.json({ "poruka": "Uspješna prijava" });
          }
          else {
            res.json({ "poruka": "Neuspješna prijava" });
          }
        });
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

app.get('/predmet/:NAZIV', async function (req, res) {
  let studenti = await baza.Student.findAll({
    include: [{
      model: baza.Predmet,
      where: {
        predmet: req.params.NAZIV
      }
    }]
  });
  let studentiJson = [];
  for (let i = 0; i < studenti.length; i++) {
    let obj = {
      ime: studenti[i].ime,
      index: studenti[i].index
    }
    studentiJson.push(obj);
  }

  //trazimo id predmeta
  let predmet = await baza.Predmet.findOne({
    where: {
      predmet: req.params.NAZIV
    }
  });

  //uzimamo sva prisustva za taj predmet
  let prisustva = await baza.Prisustvo.findAll({
    where: {
      predmet_id: predmet.id
    }

  });

  let prisustvaJson = [];
  for (let i = 0; i < prisustva.length; i++) {
    let obj = {
      sedmica: prisustva[i].sedmica,
      predavanja: prisustva[i].predavanja,
      vjezbe: prisustva[i].vjezbe,
      index: prisustva[i].index
    }
    prisustvaJson.push(obj);
  }
  //pravimo kompletan objekat
  let object = {
    studenti: studentiJson,
    prisustva: prisustvaJson,
    predmet: predmet.predmet,
    brojPredavanjaSedmicno: predmet.brojPredavanjaSedmicno,
    brojVjezbiSedmicno: predmet.brojVjezbiSedmicno
  };

  res.json(object);

});

app.post('/prisustvo/predmet/:NAZIV/student/:index', async function (req, res) {

  let imaPrisustvo = false;
  //trazimo id predmeta
  let predmet = await baza.Predmet.findOne({
    where: {
      predmet: req.params.NAZIV
    }
  });

  //uzimamo sva prisustva za taj predmet
  let prisustva = await baza.Prisustvo.findAll({
    where: {
      predmet_id: predmet.id
    }
  });

  for (let i = 0; i < prisustva.length; i++) {
    let obj = prisustva[i];
    if (obj.sedmica == req.body.sedmica && obj.index == req.params.index) {
      imaPrisustvo = true;
      obj.predavanja = req.body.predavanja;
      obj.vjezbe = req.body.vjezbe;
      await obj.save();
    }
  }
  //ako su kliknute bijele celije dodaje novi red
  if (imaPrisustvo == false) {
    //dodajemo novi red

    await baza.Prisustvo.create({
      sedmica: req.body.sedmica,
      predavanja: req.body.predavanja,
      vjezbe: req.body.vjezbe,
      index: parseInt(req.params.index),
      predmet_id: predmet.id
    });

  }
  let sviPredmeti = await baza.Predmet.findAll({});
  let povratniJson = [];

  //formiramo odgovor
  for (let i = 0; i < sviPredmeti.length; i++) {
    //trazimo studente za taj predmet
    let studenti = await baza.Student.findAll({
      include: [{
        model: baza.Predmet,
        where: {
          predmet: sviPredmeti[i].predmet
        }
      }]
    });
    //pravim json
    let studentiJson = [];
    for (let i = 0; i < studenti.length; i++) {
      let obj = {
        ime: studenti[i].ime,
        index: studenti[i].index
      }
      studentiJson.push(obj);
    }
    //uzimamo sva prisustva za taj predmet
    let prisustva = await baza.Prisustvo.findAll({
      where: {
        predmet_id: sviPredmeti[i].id
      }
    });
    //pravim json
    let prisustvaJson = [];
    for (let i = 0; i < prisustva.length; i++) {
      let obj = {
        sedmica: prisustva[i].sedmica,
        predavanja: prisustva[i].predavanja,
        vjezbe: prisustva[i].vjezbe,
        index: prisustva[i].index
      }
      prisustvaJson.push(obj);
    }
    //pravimo kompletan objekat
    let object = {
      studenti: studentiJson,
      prisustva: prisustvaJson,
      predmet: sviPredmeti[i].predmet,
      brojPredavanjaSedmicno: sviPredmeti[i].brojPredavanjaSedmicno,
      brojVjezbiSedmicno: sviPredmeti[i].brojVjezbiSedmicno
    };
    //sve stavljamo u niz
    povratniJson.push(object);
  }
  res.json(povratniJson);

});





app.listen(3000);
