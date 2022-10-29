const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblPaymentRPaymentOrder', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        PaymentID: Sequelize.BIGINT,
        PaymentOrderID: Sequelize.BIGINT

    });

    return table;
}