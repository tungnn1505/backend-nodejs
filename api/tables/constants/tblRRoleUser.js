const Sequelize = require('sequelize');

module.exports = function(db) {
    var table = db.define('tblRRoleUser', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        RoleID: Sequelize.BIGINT,
        UserID: Sequelize.BIGINT
    });

    return table;
}