const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblRate', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDCurrency: Sequelize.BIGINT,
        ExchangeRate: Sequelize.FLOAT,
        Date: Sequelize.DATE

    });

    return table;
}