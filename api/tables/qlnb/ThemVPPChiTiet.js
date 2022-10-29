const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('ThemVPPChiTiet', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDVanPhongPham: Sequelize.BIGINT,
        IDThemVPP: Sequelize.BIGINT,
        Amount: Sequelize.FLOAT,
        Describe: Sequelize.STRING,
    });

    return table;
}