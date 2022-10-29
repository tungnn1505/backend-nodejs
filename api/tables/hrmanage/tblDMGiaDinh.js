const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDMGiaDinh', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDNhanVien: Sequelize.BIGINT,
        Relationship: Sequelize.STRING,
        Name: Sequelize.BIGINT,
        Birthday: Sequelize.DATE,
        Gender: Sequelize.STRING,
        CMNDNumber: Sequelize.STRING,
        Address: Sequelize.STRING,
        Workplace: Sequelize.STRING,
        Reduce: Sequelize.STRING,
        Phone: Sequelize.STRING,
    });

    return table;
}