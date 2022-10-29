const Sequelize = require('sequelize');

module.exports = function(db) {
    var table = db.define('tblDMPermission', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        PermissionName: Sequelize.STRING,
        PermissionCode: Sequelize.STRING,
        Type: Sequelize.STRING,
    });

    return table;
}