const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDMChiNhanh', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        BranchCode: Sequelize.STRING,
        BranchName: Sequelize.STRING,
        Address: Sequelize.STRING,
        PhoneNumber: Sequelize.STRING,
        FaxNumber: Sequelize.STRING,
        Email: Sequelize.STRING,

    });

    return table;
}