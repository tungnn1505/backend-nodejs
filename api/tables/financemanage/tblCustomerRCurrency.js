const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblCustomerRCurrency', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        CustomerID: Sequelize.BIGINT,
        CurrencyID: Sequelize.BIGINT,
        SupplierID: Sequelize.BIGINT,
        Type: Sequelize.STRING,
        Surplus: Sequelize.FLOAT,
        AccountID: Sequelize.BIGINT,
        IsDebtAccount: Sequelize.BOOLEAN,
    });

    return table;
}