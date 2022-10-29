const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDecidedInsuranceSalary', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDStaff: Sequelize.BIGINT,
        Name: Sequelize.STRING,
        StartDate: Sequelize.DATE,
        EndDate: Sequelize.DATE,
        Increase: Sequelize.FLOAT,
        Coefficient: Sequelize.FLOAT,

    });

    return table;
}