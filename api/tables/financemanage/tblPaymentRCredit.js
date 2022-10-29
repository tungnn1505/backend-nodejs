const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblPaymentRCredit', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        PaymentID: Sequelize.BIGINT,
        IDSpecializedSoftware: Sequelize.BIGINT

    });

    return table;
}