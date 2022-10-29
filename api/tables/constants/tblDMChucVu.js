const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDMChucVu', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        PositionName: Sequelize.STRING,
    });

    return table;
}