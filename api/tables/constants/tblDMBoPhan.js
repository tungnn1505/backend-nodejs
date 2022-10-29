const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDMBoPhan', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        DepartmentCode: Sequelize.STRING,
        DepartmentName: Sequelize.STRING,
        IDChiNhanh: Sequelize.BIGINT

    });

    return table;
}