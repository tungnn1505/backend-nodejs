const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblPhanPhoiVPPChiTiet', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDPhanPhoiVPP: Sequelize.BIGINT,
        IDVanPhongPham: Sequelize.BIGINT,
        Amount: Sequelize.FLOAT,
        Describe: Sequelize.STRING,

    });

    return table;
}