const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblCurrency', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Date: Sequelize.DATE,
        ExchangeRate: Sequelize.FLOAT,
        ShortName: Sequelize.STRING,
        FullName: Sequelize.STRING,
    });
    return table;
}