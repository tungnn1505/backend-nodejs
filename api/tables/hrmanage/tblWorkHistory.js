const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblWorkHistory', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        DateEnd: Sequelize.DATE,
        DateStart: Sequelize.DATE,
        Status: Sequelize.STRING,
        Describe: Sequelize.STRING,
        IDNhanVien: Sequelize.BIGINT,
        WorkPlace: Sequelize.STRING,
    });

    return table;
}