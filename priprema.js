const db = require("./public/scripts/baza.js")
db.sync({ force: true }).then(function () {
  inicializacija();
});
function inicializacija() {

  db.Nastavnik.bulkCreate([
    {
      username: "USERNAME", password_hash: "$2b$10$mBxmXVMvJ6tVBzACY37Ei.3p7ttYOQjHjWmBUGW64D0J53TFoEF6u"
    },
    {
      username: "USERNAME2", password_hash: "$2b$10$60vLgTAiY/eA2.y8A2bAvOY6FjjmKJ.QSoVq2.ID4kN56fnxVGh9u"
    }
  ])
  db.Predmet.bulkCreate([
    {
      predmet: "PREDMET1", brojPredavanjaSedmicno: 3, brojVjezbiSedmicno: 2
    },
    {
      predmet: "PREDMET2", brojPredavanjaSedmicno: 3, brojVjezbiSedmicno: 2
    },
    {
      predmet: "PREDMET3", brojPredavanjaSedmicno: 3, brojVjezbiSedmicno: 2
    }
  ])
  db.NastavnikPredmet.bulkCreate([
    {
      nastavnik_id: 1, predmet_id: 1
    },
    {
      nastavnik_id: 1, predmet_id: 2
    },
    {
      nastavnik_id: 1, predmet_id: 3
    },
    {
      nastavnik_id: 2, predmet_id: 1
    }
  ])
  db.Student.bulkCreate([
    {
      index: 12345, ime: "Neko Nekic"
    },
    {
      index: 12346, ime: "Drugi Neko"
    }
  ])
  db.Prisustvo.bulkCreate([
    {
      sedmica: 1, predavanja: 1, vjezbe: 1, index: 12345, predmet_id: 1
    },
    {
      sedmica: 1, predavanja: 2, vjezbe: 2, index: 12346, predmet_id: 1
    },
    {
      sedmica: 2, predavanja: 3, vjezbe: 2, index: 12346, predmet_id: 1
    },
    {
      sedmica: 3, predavanja: 1, vjezbe: 0, index: 12345, predmet_id: 1
    },
    {
      sedmica: 4, predavanja: 0, vjezbe: 0, index: 12345, predmet_id: 1
    },
    {
      sedmica: 5, predavanja: 3, vjezbe: 0, index: 12345, predmet_id: 1
    },
    {
      sedmica: 5, predavanja: 0, vjezbe: 2, index: 12346, predmet_id: 1
    },
    {
      sedmica: 6, predavanja: 3, vjezbe: 2, index: 12346, predmet_id: 1
    },
    {
      sedmica: 7, predavanja: 2, vjezbe: 0, index: 12345, predmet_id: 1
    },
    {
      sedmica: 7, predavanja: 2, vjezbe: 2, index: 12346, predmet_id: 1
    },
    {
      sedmica: 1, predavanja: 1, vjezbe: 1, index: 12345, predmet_id: 2
    },
    {
      sedmica: 1, predavanja: 2, vjezbe: 2, index: 12346, predmet_id: 2
    },
    {
      sedmica: 2, predavanja: 3, vjezbe: 2, index: 12346, predmet_id: 2
    },
    {
      sedmica: 3, predavanja: 1, vjezbe: 0, index: 12345, predmet_id: 2
    },
    {
      sedmica: 4, predavanja: 0, vjezbe: 0, index: 12345, predmet_id: 2
    },
    {
      sedmica: 5, predavanja: 3, vjezbe: 0, index: 12345, predmet_id: 2
    },
    {
      sedmica: 1, predavanja: 1, vjezbe: 1, index: 12345, predmet_id: 3
    },
    {
      sedmica: 1, predavanja: 2, vjezbe: 2, index: 12346, predmet_id: 3
    },
    {
      sedmica: 2, predavanja: 3, vjezbe: 2, index: 12346, predmet_id: 3
    },
    {
      sedmica: 2, predavanja: 3, vjezbe: 2, index: 12345, predmet_id: 3
    },
    {
      sedmica: 3, predavanja: 1, vjezbe: 0, index: 12345, predmet_id: 3
    },

  ])
  db.StudentPredmet.bulkCreate([
    {
      student_id: 12345, predmet_id: 1
    },
    {
      student_id: 12345, predmet_id: 2
    },
    {
      student_id: 12345, predmet_id: 3
    },
    {
      student_id: 12346, predmet_id: 1
    },
    {
      student_id: 12346, predmet_id: 2
    },
    {
      student_id: 12346, predmet_id: 3
    }
  ])
}
