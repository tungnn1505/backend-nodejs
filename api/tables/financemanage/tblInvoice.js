const Sequelize = require('sequelize');

module.exports = function(db) {
    var table = db.define('tblInvoice', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Status: Sequelize.STRING,
        IDSpecializedSoftware: Sequelize.INTEGER,
        VoucherNumber: Sequelize.STRING,
        Request: Sequelize.STRING,
        Payments: Sequelize.STRING,
        PayDate: Sequelize.DATE,
        InitialAmount: Sequelize.FLOAT,
        PaidAmount: Sequelize.FLOAT,
        UnpaidAmount: Sequelize.FLOAT,
        IsInvoice: Sequelize.BOOLEAN,
        RefNumber: Sequelize.STRING,
        CreatedDate: Sequelize.NOW,
        IDCustomer: Sequelize.BIGINT,
        InvoiceNumber: Sequelize.STRING,
        CurrencyID: Sequelize.BIGINT,
        Contents: Sequelize.STRING,
        UserID: Sequelize.BIGINT,
        AccountID: Sequelize.BIGINT,
        AccountName: Sequelize.BIGINT,
        MoneyTotal: Sequelize.FLOAT,
        TypeMoney: Sequelize.STRING,
    });
    return table;
}