let trenutnaSedmica = 0;
let podaciIspravni = true;   // za validaciju

let TabelaPrisustvo = function (divRef, podaci) {
    //gledamo koja je zadnja unesena sedmica 
    let brojSedmica = 0;
    for (let sedmica of podaci.prisustva) {
        if (sedmica.sedmica > brojSedmica) {
            brojSedmica = sedmica.sedmica; 
        }
    }
    trenutnaSedmica = brojSedmica;
    iscrtajTabelu(trenutnaSedmica)

    function iscrtajTabelu(trenutnaSedmica) {
        //brisemo staru tabelu
        divRef.innerHTML = "";
        //naziv predmeta
        let html = `<h2 style="margin-left:50px; margin-top:50px;margin-bottom:-20px;">${podaci.predmet}</h2><br>`
        //tabela
        html += "<table>";
        //prvi red
        html += `<tr><th>${"Ime i prezime"}</th><th>${"Index"}</th>`
        let niz = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
        for (let i = 1; i <= brojSedmica; i++) {
            if (trenutnaSedmica == i) {
                html += `<th colspan = ${podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno}>${niz[i]}</th>`
            }
            else {
                html += `<th>${niz[i]}</th>`
            }
        }
        if(brojSedmica!=15){
        html += `<th colspan=${15 - brojSedmica} id="zadnjakolona">${niz[brojSedmica + 1]}-${"XV"}</th></tr>`
        }


        //ulazimo u petlju

        podaci.studenti.forEach(student => {
            var pomocniHtml = ""
            //validacija - ima 2 ili više studenata sa istim indeksom
            let brojac2 = 0;
            podaci.studenti.forEach(s => {
                if (s.index == student.index) {
                    brojac2++;
                }
            })
            if (brojac2 >= 2) {
                podaciIspravni = false;
                return;
            }

            //validacija - postoji prisustvo studenta koji nije u listi studenata
            let nizIndexaStudenti = []; //niz indexa iz niza studenti
            podaci.studenti.forEach(s => {
                nizIndexaStudenti.push(s.index);
            })
            let nizIndexaPrisustva = [];
            podaci.prisustva.forEach(p => {
                nizIndexaPrisustva.push(p.index);
            })

            //izbaci duplikate iz niza
            nizIndexaPrisustva = nizIndexaPrisustva.filter((element, index) => {
                return nizIndexaPrisustva.indexOf(element) === index;
            });
            //sortiraj oba niza
            nizIndexaStudenti.sort(function (a, b) { return a - b });
            nizIndexaPrisustva.sort(function (a, b) { return a - b });

            //provjeri da li postoji neki indeks u listi prisustva kojeg nema u listi studenti
            nizIndexaPrisustva.forEach(p => {
                //ako naidjemo na neki broj koji nizindeksstudenti ne sadrzi onda je problem
                if (nizIndexaStudenti.includes(p) == false) {
                    podaciIspravni = false;
                    return;
                }
            })

            //validacija - posljednja stavka

            //izdvojimo sve sedmice u jedan niz
            let sveSedmice = [];
            podaci.prisustva.forEach(p => {
                sveSedmice.push(p.sedmica);
            })
            //izbaci duplikate
            sveSedmice = sveSedmice.filter((element, index) => {
                return sveSedmice.indexOf(element) === index;
            });
            for(let i = 0; i <sveSedmice.length-1 ; i++){
                if(sveSedmice[i+1]-sveSedmice[i]!=1){
                    podaciIspravni=false;
                    return;
                }
            }


            //ispisemo ime i indeks
            html += ` <tr>
           <td rowspan="2">${student.ime}</td>
           <td rowspan="2">${student.index}</td>`

            //posmatramo samo one sa istim indeksom
            let prisustvoStudenta = podaci.prisustva.filter(pr => pr.index == student.index)
            prisustvoStudenta = prisustvoStudenta.sort((a, b) => a.sedmica - b.sedmica) //sortiramo ih po sedmicama

            //izvucemo sve sedmice studenta
            let nizSedmica = [];
            prisustvoStudenta.forEach(s => {
                nizSedmica.push(s.sedmica)
            })

            let j = 0;
            for (let week = 0; week < brojSedmica; week++) {
                let element;
                if (nizSedmica.includes(week + 1)) {
                    element = prisustvoStudenta[j];
                    //validacija - broj prisustva veci od broja casova sedmicno
                    if (element.predavanja > podaci.brojPredavanjaSedmicno || element.vjezbe > podaci.brojVjezbiSedmicno) {
                        podaciIspravni = false;
                        return;
                    }
                    //validacija - broj prisustva je manji od nule
                    if (element.predavanja < 0 || element.vjezbe < 0) {
                        podaciIspravni = false;
                        return;
                    }
                    //validacija - isti student ima 2 i više unosa prisustva za istu sedmicu
                    let brojac = 0;
                    prisustvoStudenta.forEach(element2 => {
                        if (element.sedmica == element2.sedmica) {
                            brojac++;
                        }
                    })
                    if (brojac >= 2) {
                        podaciIspravni = false;
                        return;
                    }
                    j++;
                }
                //
                if (week + 1 == trenutnaSedmica) { //ispisi vise detalja ako je trenutna sedmica
                    for (let i = 0; i < podaci.brojPredavanjaSedmicno; i++) {
                        html += ` <td class="uskakolona">P ${i + 1}</td>`
                    }
                    for (let i = 0; i < podaci.brojVjezbiSedmicno; i++) {
                        html += ` <td class="uskakolona">V ${i + 1}</td>`
                    }

                    pomocniHtml = "</tr><tr>"
                    for (let i = 0; i < podaci.brojPredavanjaSedmicno; i++) {
                        if (nizSedmica.includes(week + 1)) {
                            if (i < element.predavanja) {
                                pomocniHtml += `<td class="prisutan"></td>`
                            }
                            else {
                                pomocniHtml += `<td class="odsutan"></td>`
                            }
                        }
                        else {
                            pomocniHtml += `<td class="nijeuneseno"></td>`
                        }

                    }
                    for (let i = 0; i < podaci.brojVjezbiSedmicno; i++) {
                        if (nizSedmica.includes(week + 1)) {
                            if (i < element.vjezbe) {
                                pomocniHtml += `<td class="prisutan"></td>`
                            }
                            else {
                                pomocniHtml += `<td class="odsutan"></td>`
                            }
                        }
                        else {
                            pomocniHtml += `<td class="nijeuneseno"></td>`
                        }

                    }
                    pomocniHtml += `</tr>`
                }

                else {
                    if (nizSedmica.includes(week + 1)) {
                        let procenat = (element.predavanja + element.vjezbe) / (podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno) * 100;
                        html += `<td rowspan="2" width="30px">${procenat}%</td>`
                    }
                    else {
                        html += `<td rowspan="2" width="30px"></td>`
                    }
                }
            };
           
            for (let i = 0; i < 15 - brojSedmica; i++) {
                html += ` <td rowspan= "2" class="prazna"></td>`
            }
            html += pomocniHtml
        });



        if (podaciIspravni == false) {
            divRef.innerHTML = `<p style="margin:50px; font-size:20px;">Podaci o prisustvu nisu validni!</p>`

        }
        else {

            divRef.innerHTML = html;
        }
    }

    //Zadatak 2

    //implementacija metoda
    let sljedecaSedmica = function () {
        trenutnaSedmica++;
        if (trenutnaSedmica <= brojSedmica) {
            iscrtajTabelu(trenutnaSedmica)
        }
        else {
            trenutnaSedmica--;
        }

    }

    let prethodnaSedmica = function () {
        trenutnaSedmica--;
        if (trenutnaSedmica >= 1) {
            iscrtajTabelu(trenutnaSedmica);
        }
        else {
            trenutnaSedmica++;
        }
    }
    if (podaciIspravni == true) { //ako nisu validni ne prikaze dugmad
        //Zadatak 2
        var button = document.createElement("button");
        button.style = "margin-left:50px; margin-right:-35px; margin-bottom:5px; font-size: 25px;";
        button.onclick = prethodnaSedmica;
        button.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
        document.body.appendChild(button);

        var button2 = document.createElement("button");
        button2.style = "margin-left:50px; font-size: 25px;";
        button2.onclick = sljedecaSedmica;
        button2.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
        document.body.appendChild(button2);
    }



    return {
        sljedecaSedmica: sljedecaSedmica,
        prethodnaSedmica: prethodnaSedmica
    }
};
