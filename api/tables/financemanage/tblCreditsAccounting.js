const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblCreditsAccounting', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDCreditDebtnotices: Sequelize.BIGINT,
        IDAccounting: Sequelize.BIGINT,
        Type: Sequelize.STRING,
        Amount: Sequelize.FLOAT,
    });

    return table;
}