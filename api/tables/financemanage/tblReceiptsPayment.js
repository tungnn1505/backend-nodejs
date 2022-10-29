const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblReceiptsPayment', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Type: Sequelize.STRING,
        CodeNumber: Sequelize.STRING,
        IDCurrency: Sequelize.BIGINT,
        Date: Sequelize.DATE,
        Address: Sequelize.STRING,
        Amount: Sequelize.FLOAT,
        AmountWords: Sequelize.STRING,
        Reason: Sequelize.STRING,
        IDManager: Sequelize.INTEGER,
        IDAccountant: Sequelize.INTEGER,
        IDTreasurer: Sequelize.INTEGER,
        IDEstablishment: Sequelize.INTEGER,
        IDSubmitter: Sequelize.INTEGER,
        VoucherNumber: Sequelize.STRING,
        VoucherDate: Sequelize.DATE,
        UnpaidAmount: Sequelize.FLOAT,
        PaidAmount: Sequelize.FLOAT,
        InitialAmount: Sequelize.FLOAT,
        Withdrawal: Sequelize.FLOAT,
        Unknown: Sequelize.BOOLEAN,
        ExchangeRate: Sequelize.FLOAT,
        IDStaff: Sequelize.INTEGER,
        IDCustomer: Sequelize.BIGINT,
        IDPartner: Sequelize.INTEGER,
        RPType: Sequelize.STRING,
        ApplicantReceiverName: Sequelize.STRING,
        SupplierID: Sequelize.BIGINT,
    });

    return table;
}