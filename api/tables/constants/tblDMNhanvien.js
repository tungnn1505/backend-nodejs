const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDMNhanvien', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        StaffCode: Sequelize.STRING,
        StaffName: Sequelize.STRING,
        CMNDNumber: Sequelize.STRING,
        Address: Sequelize.STRING,
        IDNation: Sequelize.BIGINT,
        PhoneNumber: Sequelize.STRING,
        Gender: Sequelize.STRING,
        IDBoPhan: Sequelize.BIGINT,
        IDChucVu: Sequelize.BIGINT,
        TaxCode: Sequelize.STRING,
        BankNumber: Sequelize.STRING,
        BankName: Sequelize.STRING,
        Birthday: Sequelize.DATE,
        Degree: Sequelize.STRING,
        PermanentResidence: Sequelize.STRING,
        ProbationaryDate: Sequelize.DATE,
        probationarySalary: Sequelize.FLOAT,
        WorkingDate: Sequelize.DATE,
        BHXHSalary: Sequelize.FLOAT,
        WorkingSalary: Sequelize.FLOAT,
        ContactUrgent: Sequelize.STRING,
        IDMayChamCong: Sequelize.BIGINT,
        Email: Sequelize.STRING,
        Status: Sequelize.STRING,
        ProductivityWages: Sequelize.FLOAT,
        CoefficientsSalary: Sequelize.FLOAT,
        IDSpecializedSoftware: Sequelize.INTEGER,
        CMNDPlace: Sequelize.STRING,
        CMNDDate: Sequelize.DATE,
        FileAttachID: Sequelize.BIGINT,
        OldProductivity: Sequelize.FLOAT,
        Increase: Sequelize.FLOAT,
    });

    return table;
}