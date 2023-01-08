
function funkcija(){
    let lista = document.getElementById("topnav");
    PoziviAjax.getPredmeti(function(err,data){
            let jsonParsed = JSON.parse(data);
            let html = "";
            html += `<a id="naslov" class="nav-link" >PREDMETI</a>`
            for(let i=0;i<jsonParsed.length;i++){
                html += `<a class="nav-link" onmouseover="this.style.cursor='pointer'">${jsonParsed[i]}<a>`
            }
            html+= ` <button class="nav-link" type="button" id="logout" onclick="logout()">LOG OUT</button> `;
            lista.innerHTML = html;
});


}

function logout(){
    PoziviAjax.postLogout(function(err,data){
        let jsonParsed = JSON.parse(data);
        if(jsonParsed.poruka == "Uspješno odjavljen korisnik"){
            window.location.href = "http://localhost:3000/prijava.html";
        }

    });

}
//provjerimo da li je null
var el = document.getElementById("topnav");
if(el){
document.getElementById("topnav").addEventListener("click", function(event) {
    PoziviAjax.getPredmet(event.target.text,function(err,data){
        let jsonParsed = JSON.parse(data);
        if(!err){
            let div = document.getElementById("prisustvo");
            let prisustvo = TabelaPrisustvo(div, jsonParsed);
        }

    });
});
}


