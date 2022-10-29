const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDaoTaoTruoc', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDNhanVien: Sequelize.BIGINT,
        DateStart: Sequelize.DATE,
        DateEnd: Sequelize.DATE,
        TrainingPlace: Sequelize.STRING,
        Major: Sequelize.STRING,
        Degree: Sequelize.STRING,
        Note: Sequelize.STRING,
        Classification: Sequelize.STRING,
    });

    return table;
}