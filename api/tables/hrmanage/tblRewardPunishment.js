const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblRewardPunishment', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        IDStaff: Sequelize.BIGINT,
        Date: Sequelize.DATE,
        SalaryIncrease: Sequelize.FLOAT,
        Reason: Sequelize.STRING,
        Code: Sequelize.STRING,
        Status: Sequelize.STRING,
        ReasonReject: Sequelize.STRING,
        IDEmployeeApproval: Sequelize.BIGINT,
        Type: Sequelize.STRING,
    });

    return table;
}