const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblLoaiHopDong', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        MaLoaiHD: Sequelize.STRING,
        TenLoaiHD: Sequelize.STRING

    });

    return table;
}