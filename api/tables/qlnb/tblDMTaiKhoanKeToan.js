const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDMTaiKhoanKeToan', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        AccountingCodeI: Sequelize.STRING,
        AccountingCodeII: Sequelize.STRING,
        AccountingName: Sequelize.STRING,
        IDLoaiTaiKhoanKeToan: Sequelize.BIGINT,
    });

    return table;
}