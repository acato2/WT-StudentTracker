const bcrypt = require('bcrypt');
bcrypt.hash('text', 10, function(err, hash) {
    console.log(hash);
});