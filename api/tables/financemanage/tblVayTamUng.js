const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblVayTamUng', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        AdvanceCode: Sequelize.STRING,
        IDNhanVienCreate: Sequelize.INTEGER,
        IDBoPhanNVCreate: Sequelize.INTEGER,
        IDNhanVienAdvance: Sequelize.INTEGER,
        IDBoPhanNVAdvance: Sequelize.INTEGER,
        Date: Sequelize.DATE,
        Contents: Sequelize.STRING,
        Cost: Sequelize.FLOAT,
        IDTaiKhoanKeToanCost: Sequelize.BIGINT,
        IDNhanVienLD: Sequelize.INTEGER,
        TrangThaiPheDuyetLD: Sequelize.STRING,
        IDNhanVienPD: Sequelize.INTEGER,
        TrangThaiPheDuyetPD: Sequelize.STRING,
        Reason: Sequelize.STRING,
        Refunds: Sequelize.BOOLEAN,
        Status: Sequelize.STRING,
        IDReceiptsPayment: Sequelize.BIGINT,
        IDnoticesCD: Sequelize.BIGINT,
        IsNotification: Sequelize.BOOLEAN,
    });

    return table;
}