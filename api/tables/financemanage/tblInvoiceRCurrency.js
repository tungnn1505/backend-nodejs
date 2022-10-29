const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblInvoiceRCurrency', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        CurrencyID: Sequelize.BIGINT,
        InvoiceID: Sequelize.BIGINT,
        InitialAmount: Sequelize.FLOAT,
        PaidAmount: Sequelize.FLOAT,
        UnpaidAmount: Sequelize.FLOAT,
        Status: Sequelize.STRING,
    });

    return table;
}