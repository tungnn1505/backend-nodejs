const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblDateOfLeave', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        LeaveID: Sequelize.BIGINT,
        DateEnd: Sequelize.NOW,
        DateStart: Sequelize.NOW,
        WorkContent: Sequelize.STRING,
        WorkResult: Sequelize.STRING,
        TimeStartReal: Sequelize.NOW,
        TimeEndReal: Sequelize.NOW,
        IDLoaiChamCong: Sequelize.BIGINT,

    });
    return table;
}