const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblPaymentAccounting', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDReceiptsPayment: Sequelize.BIGINT,
        IDAccounting: Sequelize.BIGINT,
        Type: Sequelize.STRING,
        Amount: Sequelize.FLOAT,
        Contents: Sequelize.STRING,

    });

    return table;
}