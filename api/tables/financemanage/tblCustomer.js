const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblCustomer', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDSpecializedSoftware: Sequelize.BIGINT,
        AmountUnspecified: Sequelize.FLOAT,
        AmountSpent: Sequelize.FLOAT,
        AmountReceivable: Sequelize.FLOAT,
        Name: Sequelize.STRING,
        Code: Sequelize.STRING,
        Address: Sequelize.STRING,
        Emails: Sequelize.STRING,
        Email: Sequelize.STRING,
        ContactPersonEmail: Sequelize.STRING,
        Mobile: Sequelize.STRING,
        Fax: Sequelize.STRING,
        CountryName: Sequelize.STRING,
        CreatedDate: Sequelize.DATE,
        Tax: Sequelize.STRING,
        OldID: Sequelize.BIGINT,
        NewID: Sequelize.BIGINT,
        Note: Sequelize.STRING,
        Debt: Sequelize.STRING,
        DebtDate: Sequelize.DATE,
        DebtDescription: Sequelize.STRING,
    });

    return table;
}