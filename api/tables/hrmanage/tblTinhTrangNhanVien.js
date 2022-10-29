const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblTinhTrangNhanVien', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDNhanVien: Sequelize.BIGINT,
        IDStatus: Sequelize.BIGINT

    });

    return table;
}