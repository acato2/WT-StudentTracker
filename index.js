const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/public'));


app.get('/predmet.html',function(req,res) {
  res.sendFile(path.join(__dirname+'/public/html/predmet.html'));
});
app.get('/prisustvo.html',function(req,res) {
    res.sendFile(path.join(__dirname+'/public/html/prisustvo.html'));
});


app.listen(3000);
