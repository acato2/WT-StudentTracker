const Sequelize = require("sequelize");
const modeli = require("./modeli");
const sequelize = new Sequelize("wt22", "root", "password", {
   host: "localhost",
   dialect: "mysql"
});

modeli(sequelize);
module.exports = sequelize;
