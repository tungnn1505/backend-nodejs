const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblTimeAttendanceSummary', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        StaffID: Sequelize.BIGINT,
        StaffName: Sequelize.STRING,
        StaffCode: Sequelize.STRING,
        DepartmentName: Sequelize.STRING,
        Overtime: Sequelize.BIGINT,
        NumberHoliday: Sequelize.BIGINT,
        FreeBreak: Sequelize.BIGINT,
        LateDay: Sequelize.BIGINT,
        Remaining: Sequelize.BIGINT,
        RemainingPreviousYear: Sequelize.BIGINT,
        Month: Sequelize.STRING,
        SickLeave: Sequelize.BIGINT,
        RegimeLeave: Sequelize.BIGINT,

    });

    return table;
}