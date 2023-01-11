function funkcija() {
    let lista = document.getElementById("topnav");
    PoziviAjax.getPredmeti(function (err, data) {
        let jsonParsed = JSON.parse(data);
        let html = "";
        html += `<a id="naslov" class="nav-link" >PREDMETI</a>`
        for (let i = 0; i < jsonParsed.length; i++) {
            html += `<a class="nav-link" ">${jsonParsed[i]}<a>`
        }
        html += ` <button class="nav-link" type="button" id="logout" onclick="logout()">LOG OUT</button> `;
        lista.innerHTML = html;
    });


}

function logout() {
    PoziviAjax.postLogout(function (err, data) {
        let jsonParsed = JSON.parse(data);
        if (jsonParsed.poruka == "Uspješno odjavljen korisnik") {
            window.location.href = "http://localhost:3000/prijava.html";
        }

    });

}
//provjerimo da li je null
var el = document.getElementById("topnav");
let brojStudenata;
let jsonData;
let nazivPredmeta;

if (el) {
    document.getElementById("topnav").addEventListener("click", function (event) {
        PoziviAjax.getPredmet(event.target.text, function (err, data) {
            let jsonParsed = JSON.parse(data);
            nazivPredmeta = event.target.text;
            jsonData = jsonParsed;
            if (!err) {
                let div = document.getElementById("prisustvo");
                let prisustvo = TabelaPrisustvo(div, jsonParsed);
                brojStudenata = jsonParsed.studenti.length;

            }

        });
    });
}
let pris = document.getElementById("prisustvo");
if (pris) {
    //gledamo koja je celija kliknuta
    pris.addEventListener("click", function (event2) {

        if (event2.target.className == "prisutanP" || event2.target.className == "odsutanP" || event2.target.className == "nijeunesenoP"
             ||event2.target.className == "prisutanV" || event2.target.className == "odsutanV" || event2.target.className == "nijeunesenoV" ) {
            let red = 0, brojIndexa = 0;
            var clickedElement = event2.target;
            var table = clickedElement.closest('table');
            if (table) {
                var rows = table.getElementsByTagName('tr');
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].contains(clickedElement)) {
                        red = i + 1;
                        break;
                    }
                }
            }
            if (red == 3) {
                red = red - 3;

            }
            else if (red != 0 && red != 3) {
                red = red - 2 - brojStudenata;
            }
            //saznali smo index studenta
            brojIndexa = jsonData.studenti[red].index;
          
            //trazimo sedmicu

            //mozemo dobit iz globalne varijable TabelaPrisustvo
           
            let brojPredavanja=0,brojVjezbi=0;

            for(let i=0;i<jsonData.prisustva.length;i++){
                if(jsonData.prisustva[i].sedmica == trenutnaSedmica && jsonData.prisustva[i].index == brojIndexa){
                    brojPredavanja = jsonData.prisustva[i].predavanja;
                    brojVjezbi = jsonData.prisustva[i].vjezbe;

                }

            }
            if(event2.target.className == "prisutanP" ){
                brojPredavanja--;
            }
            else if (event2.target.className == "odsutanP" || event2.target.className == "nijeunesenoP"){
                brojPredavanja++;
            }
            else if(event2.target.className == "prisutanV" ){
                brojVjezbi--;
            }
            else if(event2.target.className == "odsutanV" || event2.target.className == "nijeunesenoV"){
                brojVjezbi++;
            }

            let sedm = trenutnaSedmica;

            PoziviAjax.postPrisustvo(nazivPredmeta,brojIndexa,{sedmica:trenutnaSedmica,predavanja:brojPredavanja,vjezbe:brojVjezbi},function(err,data){
              //dobili smo citav json
              //hocemo samo objekat za taj predmet
                let jsonParsed = JSON.parse(data);
                let obj;
                
                for(let i = 0 ;i<jsonParsed.length;i++){
                    if(jsonParsed[i].predmet == nazivPredmeta){
                        obj = jsonParsed[i];

                    }
                }
                jsonData=obj;
                if(!err){
                let div = document.getElementById("prisustvo");
                let prisustvo = TabelaPrisustvo(div, obj);
                for(let i=trenutnaSedmica;i>sedm;i--){
                    prisustvo.prethodnaSedmica();
                }
                
              
                }
            });




        }


    });

}
