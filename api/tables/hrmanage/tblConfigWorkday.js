const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblConfigWorkday', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Date: Sequelize.DATE,
        Note: Sequelize.STRING
    });

    return table;
}