const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblBankAccountManagement', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Name: Sequelize.STRING,
        BranchID: Sequelize.STRING,
        IDEmployee: Sequelize.BIGINT,
        AccountNumber: Sequelize.STRING,
        Surplus: Sequelize.FLOAT
    });

    return table;
}