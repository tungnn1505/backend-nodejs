const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDMNation', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        NationName: Sequelize.STRING,
    });

    return table;
}