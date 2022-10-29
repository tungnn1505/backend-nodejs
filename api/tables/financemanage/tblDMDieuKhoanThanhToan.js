const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDMDieuKhoanThanhToan', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        RuleCode: Sequelize.STRING,
        RuleName: Sequelize.STRING,
        NumberDate: Sequelize.FLOAT,
        Status: Sequelize.STRING,

    });

    return table;
}