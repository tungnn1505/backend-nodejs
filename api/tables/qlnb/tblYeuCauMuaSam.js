const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblYeuCauMuaSam', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDNhanVien: Sequelize.BIGINT,
        IDPhongBan: Sequelize.BIGINT,
        RequireDate: Sequelize.DATE,
        Reason: Sequelize.STRING,
        RequestCode: Sequelize.STRING,
        Status: Sequelize.STRING,
        IDPheDuyet1: Sequelize.BIGINT,
        IDPheDuyet2: Sequelize.BIGINT,
        ReasonReject1: Sequelize.STRING,
        ReasonReject2: Sequelize.STRING,
        ReasonReject: Sequelize.STRING,
        Type: Sequelize.STRING,
        IDSupplier: Sequelize.BIGINT,
        IDPaymentOrder: Sequelize.BIGINT,
        AssetName: Sequelize.STRING,
        IsNotification: Sequelize.BOOLEAN,
    });

    return table;
}