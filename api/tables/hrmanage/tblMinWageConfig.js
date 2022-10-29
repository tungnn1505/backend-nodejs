const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblMinWageConfig', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        MinimumWage: Sequelize.FLOAT,
        StartDate: Sequelize.DATE,
        EndDate: Sequelize.DATE,

    });

    return table;
}