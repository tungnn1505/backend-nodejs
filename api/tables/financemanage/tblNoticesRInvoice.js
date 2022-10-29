const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblNoticesRInvoice', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDnotices: Sequelize.BIGINT,
        IDSpecializedSoftware: Sequelize.BIGINT

    });

    return table;
}