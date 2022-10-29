const Sequelize = require('sequelize');

module.exports = function(db) {
    var table = db.define('tblRole', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Code: Sequelize.STRING,
        Name: Sequelize.STRING,
        Permissions: Sequelize.STRING
    });

    return table;
}