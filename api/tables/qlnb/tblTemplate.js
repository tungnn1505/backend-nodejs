const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblTemplate', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Name: Sequelize.STRING,
        Code: Sequelize.STRING,
    });

    return table;
}