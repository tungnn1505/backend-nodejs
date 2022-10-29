const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblTaiSanHistory', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDTaiSanBanGiao: Sequelize.BIGINT,
        IDTaiSan: Sequelize.BIGINT,
        DateThuHoi: Sequelize.DATE

    });

    return table;
}