const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblRewardPunishmentRStaff', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        RewardPunishmentID: Sequelize.BIGINT,
        StaffID: Sequelize.BIGINT,
        Date: Sequelize.DATE,
        SalaryIncrease: Sequelize.FLOAT,
    });

    return table;
}