const Sequelize = require('sequelize');

module.exports = (baza) => {
    baza.Nastavnik = baza.define('Nastavnik',{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: Sequelize.STRING,
        password_hash: Sequelize.STRING
    }, {
        tableName: 'nastavnik',
        timestamps: false
    });

    baza.Predmet = baza.define('Predmet',{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        predmet: Sequelize.STRING,
        brojPredavanjaSedmicno: Sequelize.INTEGER,
        brojVjezbiSedmicno: Sequelize.INTEGER
    }, {
        tableName: 'predmet',
        timestamps: false
    });

    baza.NastavnikPredmet = baza.define('nastavnik_predmet',{
        nastavnik_id: Sequelize.INTEGER,
        predmet_id: Sequelize.INTEGER
    }, {
        tableName: 'nastavnik_predmet',
        timestamps: false
    });

    baza.Student = baza.define('Student',{
        index: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        ime: Sequelize.STRING
    }, {
        tableName: 'student',
        timestamps: false
    });
    baza.StudentPredmet = baza.define('student_predmet',{
        student_id: Sequelize.INTEGER,
        predmet_id: Sequelize.INTEGER
    }, {
        tableName: 'student_predmet',
        timestamps: false
    });
    baza.Prisustvo = baza.define('Prisustvo',{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sedmica: Sequelize.INTEGER,
        predavanja: Sequelize.INTEGER,
        vjezbe: Sequelize.INTEGER
    }, {
        tableName: 'prisustvo',
        timestamps: false
    });

    baza.Nastavnik.belongsToMany(baza.Predmet, { through: 'nastavnik_predmet',foreignKey: 'nastavnik_id', timestamps:false})
    baza.Predmet.belongsToMany(baza.Nastavnik, { through: 'nastavnik_predmet',foreignKey: 'predmet_id',timestamps:false});

    baza.Student.belongsToMany(baza.Predmet, { through: 'student_predmet',foreignKey: 'student_id', timestamps:false})
    baza.Predmet.belongsToMany(baza.Student, { through: 'student_predmet',foreignKey: 'predmet_id',timestamps:false});

    baza.Student.hasMany(baza.Prisustvo, {foreignKey: 'index'});
    baza.Predmet.hasMany(baza.Prisustvo, {foreignKey: 'predmet_id'});
    

}