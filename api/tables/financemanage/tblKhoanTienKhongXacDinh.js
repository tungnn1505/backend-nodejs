const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblKhoanTienKhongXacDinh', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        PaymentCode: Sequelize.STRING,
        IDKhachHang: Sequelize.BIGINT,
        Contents: Sequelize.STRING,
        TotalCost: Sequelize.FLOAT,
        TypeCost: Sequelize.STRING,
        Date: Sequelize.DATE,
        PaymentFile: Sequelize.STRING,
        Status: Sequelize.STRING,

    });

    return table;
}