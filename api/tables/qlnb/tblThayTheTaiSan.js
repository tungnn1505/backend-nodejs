const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblThayTheTaiSan', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDTaiSan: Sequelize.BIGINT,
        IDTaiSanThayThe: Sequelize.BIGINT,
        DateThayThe: Sequelize.DATE
    });

    return table;
}