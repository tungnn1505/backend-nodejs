const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblAccountingBooks', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        NumberReceipts: Sequelize.FLOAT,
        CreateDate: Sequelize.DATE,
        EntryDate: Sequelize.DATE,
        Number: Sequelize.STRING,
        Reason: Sequelize.STRING,
        IDAccounting: Sequelize.BIGINT,
        DebtIncurred: Sequelize.FLOAT,
        CreditIncurred: Sequelize.FLOAT,
        DebtSurplus: Sequelize.FLOAT,
        CreaditSurplus: Sequelize.FLOAT,
        IDPayment: Sequelize.BIGINT,
        IDnotices: Sequelize.BIGINT,
        ClauseType: Sequelize.STRING,
        Contents: Sequelize.STRING,
    });

    return table;
}