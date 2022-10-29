const Sequelize = require('sequelize');

module.exports = function(db) {
    var table = db.define('tblDMTinhTrangNV', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        StatusCode: Sequelize.STRING,
        StatusName: Sequelize.STRING,
        Describe: Sequelize.STRING

    });

    return table;
}