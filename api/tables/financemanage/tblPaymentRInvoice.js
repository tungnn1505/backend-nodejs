const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblPaymentRInvoice', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDPayment: Sequelize.BIGINT,
        IDSpecializedSoftware: Sequelize.INTEGER,
        Amount: Sequelize.FLOAT,
    });

    return table;
}