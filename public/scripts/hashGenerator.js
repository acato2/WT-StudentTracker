const bcrypt = require('bcrypt');
bcrypt.hash('PASSWORDHASH2', 10, function(err, hash) {
    console.log(hash);
});