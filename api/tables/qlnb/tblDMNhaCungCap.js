const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDMNhaCungCap', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        SupplierCode: Sequelize.STRING,
        SupplierName: Sequelize.STRING,
        TaxNumber: Sequelize.STRING,
        BankNumber: Sequelize.STRING,
        BankName: Sequelize.STRING,
        Address: Sequelize.STRING,
        PhoneNumber: Sequelize.STRING,
        FaxNumber: Sequelize.STRING,
        Email: Sequelize.STRING,
        Describe: Sequelize.STRING,
    });

    return table;
}