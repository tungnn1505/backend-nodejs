var moment = require('moment');
var fs = require('fs');
var database = require('../database');
const Sequelize = require('sequelize');
const Op = require('sequelize').Op;
const bodyParser = require('body-parser');
var mtblDMUser = require('../tables/constants/tblDMUser');
var mtblVayTamUng = require('../tables/financemanage/tblVayTamUng')

var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
async function getPaymentApproval(userID) {
    var array = [];
    await database.connectDatabase().then(async db => {
        if (db) {
            var user = await mtblDMUser(db).findOne({ where: { ID: userID } });

            let tblDeNghiThanhToan = mtblDeNghiThanhToan(db);
            tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
            await tblDeNghiThanhToan.findAll({
                where: {
                    [Op.or]: [{
                        [Op.and]: {
                            IDNhanVienKTPD: user.IDNhanvien,
                            TrangThaiPheDuyetKT: 'Chờ phê duyệt',
                            IsNotification: null
                        },
                    }, {
                        [Op.and]: {
                            TrangThaiPheDuyetKT: {
                                [Op.ne]: 'Chờ phê duyệt'
                            },
                            IDNhanVienLDPD: user.IDNhanvien,
                            TrangThaiPheDuyetLD: 'Chờ phê duyệt',
                            IsNotification: null
                        }
                    }],
                },
                include: [{
                    model: mtblDMNhanvien(db),
                    required: false,
                    as: 'nv'
                },],
            }).then(async data => {
                for (let i = 0; i < data.length; i++) {
                    var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: data[i].IDNhanVien } });
                    array.unshift({
                        name: data[i].nv ? data[i].nv.StaffName : 'admin',
                        type: 'payment',
                        userID: userID.ID,
                        status: 'Yêu cầu duyệt',
                        code: data[i].PaymentOrderCode,
                        id: data[i].ID,
                    })
                }
            })
        } else {
            array = []
        }
    })
    return array
}
async function getPaymentOfUser(userID) {
    var array = [];
    await database.connectDatabase().then(async db => {
        if (db) {
            var user = await mtblDMUser(db).findOne({ where: { ID: userID } });

            let tblDeNghiThanhToan = mtblDeNghiThanhToan(db);
            tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
            await tblDeNghiThanhToan.findAll({
                where: {
                    TrangThaiPheDuyetKT: {
                        [Op.ne]: 'Chờ phê duyệt'
                    },
                    TrangThaiPheDuyetLD: {
                        [Op.ne]: 'Chờ phê duyệt'
                    },
                    IsNotification: null
                },
                include: [{
                    model: mtblDMNhanvien(db),
                    required: false,
                    as: 'nv'
                },],
            }).then(async data => {
                for (let i = 0; i < data.length; i++) {
                    array.unshift({
                        name: '',
                        type: 'payment',
                        userID: '',
                        status: 'Đã được duyệt',
                        code: data[i].PaymentOrderCode,
                        id: data[i].ID,
                    })
                }
            })
        } else {
            array = []
        }
    })
    return array
}
async function getLoanApproval(userID) {
    var array = [];
    await database.connectDatabase().then(async db => {
        if (db) {
            var user = await mtblDMUser(db).findOne({ where: { ID: userID } });

            let tblVayTamUng = mtblVayTamUng(db);
            tblVayTamUng.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVienAdvance', sourceKey: 'IDNhanVienAdvance', as: 'advanceStaff' })
            await tblVayTamUng.findAll({
                where: {
                    [Op.or]: [{
                        [Op.and]: {
                            IDNhanVienPD: user.IDNhanvien,
                            TrangThaiPheDuyetPD: 'Chờ phê duyệt',
                            IsNotification: null
                        },
                    }, {
                        [Op.and]: {
                            TrangThaiPheDuyetPD: {
                                [Op.ne]: 'Chờ phê duyệt'
                            },
                            IDNhanVienLD: user.IDNhanvien,
                            TrangThaiPheDuyetLD: 'Chờ phê duyệt',
                            IsNotification: null
                        }
                    }],
                },
                include: [{
                    model: mtblDMNhanvien(db),
                    required: false,
                    as: 'advanceStaff'
                },],
            }).then(async data => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].TrangThaiPheDuyetPD == 'Chờ phê duyệt') {
                        var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: data[i].IDNhanVienPD } });
                        array.unshift({
                            name: data[i].advanceStaff ? data[i].advanceStaff.StaffName : 'admin',
                            type: 'loan',
                            userID: userID.ID,
                            status: 'Yêu cầu duyệt',
                            code: data[i].AdvanceCode,
                            id: data[i].ID,
                        })
                    }
                    if (data[i].TrangThaiPheDuyetLD == 'Chờ phê duyệt') {
                        var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: data[i].IDNhanVienLD } });
                        array.unshift({
                            name: data[i].advanceStaff ? data[i].advanceStaff.StaffName : 'admin',
                            type: 'loan',
                            userID: userID.ID,
                            status: 'Yêu cầu duyệt',
                            code: data[i].AdvanceCode,
                            id: data[i].ID,
                        })
                    }
                }
            })
        } else {
            array = []
        }
    })
    return array
}
async function getLoanOfUser(userID) {
    var array = [];
    await database.connectDatabase().then(async db => {
        if (db) {
            var user = await mtblDMUser(db).findOne({ where: { ID: userID } });

            let tblVayTamUng = mtblVayTamUng(db);
            tblVayTamUng.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVienAdvance', sourceKey: 'IDNhanVienAdvance', as: 'advanceStaff' })
            await tblVayTamUng.findAll({
                where: {
                    IDNhanVienAdvance: user.IDNhanvien,
                    TrangThaiPheDuyetLD: 'Đã phê duyệt',
                    IsNotification: null
                },
                include: [{
                    model: mtblDMNhanvien(db),
                    required: false,
                    as: 'advanceStaff'
                },],
            }).then(async data => {
                for (let i = 0; i < data.length; i++) {
                    array.unshift({
                        name: '',
                        type: 'loan',
                        userID: userID,
                        status: 'Đã được duyệt',
                        code: data[i].AdvanceCode,
                        id: data[i].ID,
                    })
                }
            })
        } else {
            array = []
        }
    })
    return array
}
async function getPaymentAndLoanToUserID(userID) {
    var array = [];
    await database.connectDatabase().then(async db => {
        if (db) {
            if (socket.userID) {
                let user = await mtblDMUser(db).findOne({
                    where: { ID: socket.userID }
                })
                if (user) {
                    let permissions = user.Permissions ? JSON.parse(user.Permissions) : {}
                    if (permissions.notiTC) {
                        console.log(permissions.notiTC);
                        for (let tc = 0; tc < permissions.notiTC.length; tc++) {
                            if (permissions.notiTC[tc].key == 'isNotiApprovalDNTT' && permissions.notiTC[tc].completed == true) {
                                array = await getPaymentApproval(socket.userID)
                            }
                            if (permissions.notiTC[tc].key == 'isNotiPersonalDNTT' && permissions.notiTC[tc].completed == true) {
                                let arrayUserPayment = await getPaymentOfUser(userID)
                                Array.prototype.push.apply(array, arrayUserPayment);
                            }
                            if (permissions.notiTC[tc].key == 'isNotiApprovalLoan' && permissions.notiTC[tc].completed == true) {
                                let arrayLoanApproval = await getLoanApproval(userID)
                                Array.prototype.push.apply(array, arrayLoanApproval);
                            }
                            if (permissions.notiTC[tc].key == 'isNotiPersonalLoan' && permissions.notiTC[tc].completed == true) {
                                let arrayLoanPersonal = await getLoanOfUser(userID)
                                Array.prototype.push.apply(array, arrayLoanPersonal);
                            }
                        }
                    }
                }
            }
        }
    })
}
async function getDetailLoan(id) {
    var obj = {};
    await database.connectDatabase().then(async db => {
        if (db) {
            let tblVayTamUng = mtblVayTamUng(db);
            tblVayTamUng.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVienAdvance', sourceKey: 'IDNhanVienAdvance', as: 'advanceStaff' })
            await tblVayTamUng.findAll({
                where: {
                    ID: id
                },
                include: [{
                    model: mtblDMNhanvien(db),
                    required: false,
                    as: 'advanceStaff'
                },],
            }).then(async data => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].TrangThaiPheDuyetPD == 'Chờ phê duyệt') {
                        var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: data[i].IDNhanVienPD } });
                        obj = {
                            name: data[i].advanceStaff ? data[i].advanceStaff.StaffName : 'admin',
                            type: 'loan',
                            userID: userID.ID,
                            status: 'Yêu cầu duyệt',
                            code: data[i].AdvanceCode,
                            id: data[i].ID,
                        }
                    } else if (data[i].TrangThaiPheDuyetLD == 'Chờ phê duyệt') {
                        var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: data[i].IDNhanVienLD } });
                        obj = {
                            name: data[i].advanceStaff ? data[i].advanceStaff.StaffName : 'admin',
                            type: 'loan',
                            userID: userID.ID,
                            status: 'Yêu cầu duyệt',
                            code: data[i].AdvanceCode,
                            id: data[i].ID,
                        }
                    } else if (data[i].TrangThaiPheDuyetLD == 'Đã phê duyệt') {
                        var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: data[i].IDNhanVienAdvance } });
                        obj = {
                            name: '',
                            type: 'loan',
                            userID: userID.ID,
                            status: 'Đã được duyệt',
                            code: data[i].AdvanceCode,
                            id: data[i].ID,
                        }
                    }
                }
            })
        }
    })
    return obj
}

module.exports = {
    sockketIO: async (io) => {
        io.on("connection", async function (socket) {
            console.log('The user is connecting : ' + socket.id);
            socket.on("system-wide-notification-tc", async (data) => {
                console.log(socket.userID, '----------------- system-wide-notification-tc -------------------');
                if (socket.userID) {
                    let array = await getPaymentAndLoanToUserID(socket.userID);
                    socket.emit("system-wide-notification-tc", array)
                }
            })
            socket.on("notice-create-loan", async (data) => {
                let obj = await getDetailLoan(data)
                console.log(data, '--------------------------------- notice-create-loan -------------------------------------');
                if (obj) {
                    let roomLoan = io.sockets.adapter.rooms['isNotiApprovalLoan'].sockets
                    if (obj.status == 'Đã được duyệt') {
                        roomLoan = io.sockets.adapter.rooms['isNotiPersonalLoan'].sockets
                    }
                    //  Laays danh sách socket trong room
                    roomLoan = Object.keys(roomLoan)
                    for (let s = 0; s < roomLoan.length; s++) {
                        let socketGet = io.sockets.connected[roomLoan[s]]
                        console.log(socketGet.userID);
                        if (obj.userID == socketGet.userID)
                            io.sockets.in(socketGet.id).emit('receive-data-tc', obj)
                        else
                            io.sockets.in(socketGet.id).emit('receive-data-tc', null)

                    }
                }
                console.log(io.sockets.adapter.rooms);
            })
            socket.on("disconnect", function () {
                console.log(socket.id + " disconnected!");
            });
        })
    },
}