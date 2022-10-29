const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDMLoaiTaiKhoanKeToan', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        TypeName: Sequelize.STRING,

    });

    return table;
}