const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblThanhLyTaiSan', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDTaiSan: Sequelize.BIGINT,
        IDNhanVien: Sequelize.BIGINT,
        LiquidationDate: Sequelize.DATE,
        LiquidationReason: Sequelize.STRING

    });

    return table;
}