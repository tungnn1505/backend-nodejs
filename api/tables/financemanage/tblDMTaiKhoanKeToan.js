const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDMTaiKhoanKeToan', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        AccountingCode: Sequelize.STRING,
        AccountingName: Sequelize.STRING,
        IDLoaiTaiKhoanKeToan: Sequelize.BIGINT,
        Levels: Sequelize.INTEGER,
        IDLevelAbove: Sequelize.BIGINT,
        MoneyDebit: Sequelize.FLOAT,
        MoneyCredit: Sequelize.FLOAT,
        YearStart: Sequelize.STRING,
        TypeClause: Sequelize.STRING,
        IsDelete: Sequelize.BOOLEAN,
        CurrencyID: Sequelize.BIGINT,
        IsHasCurrency: Sequelize.BOOLEAN,
    });

    return table;
}