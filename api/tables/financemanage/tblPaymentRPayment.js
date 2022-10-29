const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblPaymentRPayment', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDPayment: Sequelize.BIGINT,
        IDPaymentR: Sequelize.BIGINT,
        Amount: Sequelize.FLOAT
    });

    return table;
}