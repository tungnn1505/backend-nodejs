const Sequelize = require('sequelize');

module.exports = function(db) {
    var table = db.define('tblLoaiChamCong', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Code: Sequelize.STRING,
        Name: Sequelize.STRING,
        Description: Sequelize.STRING,
        Type: Sequelize.STRING,
        Compensation: Sequelize.BOOLEAN, // phép bù
        SalaryIsAllowed: Sequelize.BOOLEAN, // được hưởng lương
    });

    return table;
}