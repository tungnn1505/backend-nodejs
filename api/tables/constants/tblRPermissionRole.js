const Sequelize = require('sequelize');

module.exports = function(db) {
    var table = db.define('tblRPermissionRole', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        PermissionID: Sequelize.BIGINT,
        RoleID: Sequelize.BIGINT

    });

    return table;
}