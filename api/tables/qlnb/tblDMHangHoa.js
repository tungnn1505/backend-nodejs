const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDMHangHoa', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Name: Sequelize.STRING,
        Code: Sequelize.STRING,
        Unit: Sequelize.STRING,
        IDDMLoaiTaiSan: Sequelize.BIGINT,
    });

    return table;
}