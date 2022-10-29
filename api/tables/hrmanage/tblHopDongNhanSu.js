const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblHopDongNhanSu', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        ContractCode: Sequelize.STRING,
        Date: Sequelize.DATE,
        IDNhanVienSDLD: Sequelize.BIGINT,
        IDNhanVien: Sequelize.BIGINT,
        IDDMNation: Sequelize.BIGINT,
        Birthday: Sequelize.DATE,
        Birthplace: Sequelize.STRING,
        Degree: Sequelize.STRING,
        PermanentResidence: Sequelize.STRING,
        CMNDNumber: Sequelize.STRING,
        CMNDate: Sequelize.BIGINT,
        CMNDPlace: Sequelize.STRING,
        IDLoaiHopDong: Sequelize.BIGINT,
        ContractDateStart: Sequelize.DATE,
        ContractDateEnd: Sequelize.DATE,
        WorkingPlace: Sequelize.STRING,
        Specialize: Sequelize.STRING,
        IDChucVu: Sequelize.BIGINT,
        Description: Sequelize.STRING,
        SalaryNumber: Sequelize.FLOAT,
        SalaryText: Sequelize.STRING,
        UnitSalary: Sequelize.STRING,
        Status: Sequelize.STRING,
        Announced: Sequelize.BOOLEAN,
        NoticeTime: Sequelize.DATE,
        EditDate: Sequelize.DATE,
        Time: Sequelize.NOW,
        ProductivityWages: Sequelize.FLOAT,
        CoefficientsSalary: Sequelize.FLOAT,
    });

    return table;
}