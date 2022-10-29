const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblQuyetDinhTangLuong', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        DecisionCode: Sequelize.STRING,
        DecisionDate: Sequelize.DATE,
        IncreaseDate: Sequelize.DATE,
        StopDate: Sequelize.DATE,
        StopReason: Sequelize.STRING,
        SalaryIncrease: Sequelize.STRING,
        IDNhanVien: Sequelize.BIGINT,
        Status: Sequelize.STRING,
        StatusDecision: Sequelize.STRING,
        IDEmployeeApproval: Sequelize.BIGINT,
        Reason: Sequelize.STRING,
        Increase: Sequelize.FLOAT,
    });

    return table;
}