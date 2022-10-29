const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblMucDongBaoHiem', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        CompanyBHXH: Sequelize.FLOAT,
        CompanyBHYT: Sequelize.FLOAT,
        CompanyBHTN: Sequelize.FLOAT,
        StaffBHXH: Sequelize.FLOAT,
        StaffBHTNLD: Sequelize.FLOAT,
        StaffUnion: Sequelize.FLOAT,
        StaffBHYT: Sequelize.FLOAT,
        StaffBHTN: Sequelize.FLOAT,
        DateStart: Sequelize.DATE,
        DateEnd: Sequelize.DATE,
        MinimumWage: Sequelize.FLOAT,
        ApplicableDate: Sequelize.DATE,
    });

    return table;
}