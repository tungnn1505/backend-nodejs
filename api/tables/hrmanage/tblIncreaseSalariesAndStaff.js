const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblIncreaseSalariesAndStaff', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IncreaseSalariesID: Sequelize.BIGINT,
        StaffID: Sequelize.BIGINT,
        CurrentSalary: Sequelize.FLOAT,
        ProductivityWages: Sequelize.FLOAT,
        Increase: Sequelize.FLOAT,
        Date: Sequelize.DATE,
    });

    return table;
}