
function funkcija(){
    let lista = document.getElementById("topnav");
    PoziviAjax.getPredmeti(function(err,data){
            let jsonParsed = JSON.parse(data);
            let html = "";
            html += `<a id="naslov" class="nav-link" >PREDMETI</a>`
            for(let i=0;i<jsonParsed.length;i++){
                html += `<a class="nav-link" href="#">${jsonParsed[i]}<a>`
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

