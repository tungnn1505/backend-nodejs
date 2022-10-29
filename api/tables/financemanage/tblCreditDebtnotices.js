const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblCreditDebtnotices', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Type: Sequelize.STRING,
        IDCurrency: Sequelize.BIGINT,
        IDPartner: Sequelize.INTEGER,
        IDCustomer: Sequelize.INTEGER,
        IDStaff: Sequelize.INTEGER,
        Reason: Sequelize.STRING,
        VoucherNumber: Sequelize.STRING,
        Date: Sequelize.DATE,
        Amount: Sequelize.FLOAT,
        AmountWords: Sequelize.STRING,
        IDManager: Sequelize.INTEGER,
        IDAccountant: Sequelize.INTEGER,
        IDTreasurer: Sequelize.INTEGER,
        IDEstablishment: Sequelize.INTEGER,
        IDSubmitter: Sequelize.INTEGER,
        Undefined: Sequelize.BOOLEAN,
        ApplicantReceiverName: Sequelize.STRING,
    });

    return table;
}