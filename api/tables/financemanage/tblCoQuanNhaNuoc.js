const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblCoQuanNhaNuoc', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDSpecializedSoftware: Sequelize.BIGINT,
        Status: Sequelize.STRING,
        Date: Sequelize.DATE,
        VoucherNumber: Sequelize.STRING,
        MoneyNumber: Sequelize.FLOAT,
        Note: Sequelize.STRING,
        Type: Sequelize.STRING,
        ReceiptsPaymentID: Sequelize.BIGINT,
    });

    return table;
}