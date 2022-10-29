var moment = require('moment');
var fs = require('fs');
var database = require('../database');
const Sequelize = require('sequelize');
const Op = require('sequelize').Op;
var mtblDMUser = require("../tables/constants/tblDMUser");
var mtblDMNhanvien = require("../tables/constants/tblDMNhanvien");
var mtblYeuCauMuaSam = require("../tables/qlnb/tblYeuCauMuaSam");
var mtblDeNghiThanhToan = require("../tables/qlnb/tblDeNghiThanhToan");
var mtblHopDongNhanSu = require('../tables/hrmanage/tblHopDongNhanSu')
const bodyParser = require('body-parser');
var mtblDMUser = require('../tables/constants/tblDMUser');

async function getStaffContractExpirationData() {
    var array = [];
    await database.connectDatabase().then(async db => {
        if (db) {
            let now = moment().format('YYYY-MM-DD');
            let nowTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
            let tblHopDongNhanSu = mtblHopDongNhanSu(db);
            tblHopDongNhanSu.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'staff' })
            await tblHopDongNhanSu.findAll({
                where: {
                    [Op.or]: [{
                        Status: 'Có hiệu lực',
                        Time: {
                            [Op.eq]: null
                        },
                        NoticeTime: {
                            [Op.substring]: now
                        }
                    },
                    {
                        Status: 'Có hiệu lực',
                        NoticeTime: {
                            [Op.substring]: now
                        },
                        Time: {
                            [Op.lte]: nowTime
                        },
                    }
                    ]
                },
                order: [
                    ['ID', 'DESC']
                ],
                include: [{
                    model: mtblDMNhanvien(db),
                    required: false,
                    as: 'staff'
                },],
            }).then(contract => {
                if (contract.length > 0) {
                    for (var i = 0; i < contract.length; i++) {
                        array.push({
                            contractID: contract[i].ID,
                            staffName: contract[i].staff.StaffName,
                            staffCode: contract[i].staff.StaffCode,
                            contractDateEnd: contract[i].ContractDateEnd ? contract[i].ContractDateEnd : null,
                            noticeTime: contract[i].NoticeTime ? contract[i].NoticeTime : null,
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
async function getPaymentAndREquest() {
    var array = [];
    await database.connectDatabase().then(async db => {
        if (db) {
            var user = await mtblDMUser(db).findAll();
            let count = 0;
            for (var i = 0; i < user.length; i++) {
                if (user[i]) {
                    let tblYeuCauMuaSam = mtblYeuCauMuaSam(db);
                    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
                    await tblYeuCauMuaSam.findAll({
                        where: [
                            { IDPheDuyet1: user[i].IDNhanvien },
                            { Status: 'Chờ phê duyệt' },
                            { IsNotification: null }
                        ],
                        include: [{
                            model: mtblDMNhanvien(db),
                            required: false,
                            as: 'nv'
                        },],
                    }).then(data => {
                        data.forEach(item => {
                            array.unshift({
                                name: item.nv ? item.nv.StaffName : 'admin',
                                type: 'shopping_cart',
                                userID: user[i].ID,
                            })
                            count += 1;
                        })
                    })
                    await tblYeuCauMuaSam.findAll({
                        where: [
                            { IDPheDuyet2: user[i].IDNhanvien },
                            { Status: 'Đang phê duyệt' },
                            { IsNotification: null }
                        ],
                        include: [{
                            model: mtblDMNhanvien(db),
                            required: false,
                            as: 'nv'
                        },],
                    }).then(data => {
                        data.forEach(item => {
                            array.push({
                                name: item.nv ? item.nv.StaffName : 'admin',
                                type: 'shopping_cart',
                                userID: user[i].ID,
                            })
                            count += 1;
                        })
                    })
                    let tblDeNghiThanhToan = mtblDeNghiThanhToan(db);
                    tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
                    await tblDeNghiThanhToan.findAll({
                        where: {
                            [Op.or]: [{
                                [Op.and]: {
                                    IDNhanVienKTPD: user[i].IDNhanvien,
                                    TrangThaiPheDuyetKT: 'Chờ phê duyệt',
                                    IsNotification: null
                                },
                            }, {
                                [Op.and]: {
                                    TrangThaiPheDuyetKT: {
                                        [Op.ne]: 'Chờ phê duyệt'
                                    },
                                    IDNhanVienLDPD: user[i].IDNhanvien,
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
                    }).then(data => {
                        data.forEach(item => {
                            array.push({
                                name: item.nv ? item.nv.StaffName : 'admin',
                                type: 'payment',
                                userID: user[i].ID,
                            })
                            count += 1;
                        })
                    })
                }
            }
        } else {
            res.json(Constant.MESSAGE.USER_FAIL)
        }
    })
    return array
}
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
async function getRequestApproval(userID) {
    var array = [];
    await database.connectDatabase().then(async db => {
        if (db) {
            var user = await mtblDMUser(db).findOne({ where: { ID: userID } });
            let tblYeuCauMuaSam = mtblYeuCauMuaSam(db);
            tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
            await tblYeuCauMuaSam.findAll({
                where: {
                    [Op.or]: [{
                        IDPheDuyet1: user.IDNhanvien,
                        Status: 'Chờ phê duyệt',
                        IsNotification: null

                    }, {
                        IDPheDuyet2: user.IDNhanvien,
                        Status: 'Đang phê duyệt',
                        IsNotification: null

                    },],
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
                        type: 'shopping_cart',
                        userID: userID.ID,
                        status: 'Yêu cầu duyệt',
                        code: data[i].RequestCode,
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
async function getRequestOfUser(userID) {
    var array = [];
    await database.connectDatabase().then(async db => {
        if (db) {
            var user = await mtblDMUser(db).findOne({ where: { ID: userID } });
            let tblYeuCauMuaSam = mtblYeuCauMuaSam(db);
            tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
            await tblYeuCauMuaSam.findAll({
                where: {
                    IDNhanVien: user.IDNhanvien,
                    Status: {
                        [Op.ne]: 'Chờ phê duyệt'
                    },
                    Status: {
                        [Op.ne]: 'Đang phê duyệt'
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
                        type: 'shopping_cart',
                        userID: null,
                        status: 'Đã được duyệt',
                        code: data[i].RequestCode,
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
async function getDetailRequestShopping(id) {
    let objResult = {}
    await database.connectDatabase().then(async db => {
        if (db) {
            let tblYeuCauMuaSam = mtblYeuCauMuaSam(db);
            tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
            await tblYeuCauMuaSam.findOne({
                where: {
                    ID: id
                },
                include: [{
                    model: mtblDMNhanvien(db),
                    required: false,
                    as: 'nv'
                },],
            }).then(async data => {
                if (data) {
                    if (data.Status != 'Đang phê duyệt' && data.Status != 'Chờ phê duyệt') {
                        var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDNhanVien } });
                        objResult = {
                            name: '',
                            type: 'shopping_cart',
                            userID: userID.ID,
                            status: 'Đã được duyệt',
                            code: data.RequestCode,
                            id: data.ID,
                        }
                    } else if (data.Status == 'Chờ phê duyệt') {
                        var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDPheDuyet1 } });
                        objResult = {
                            name: data.nv ? data.nv.StaffName : 'admin',
                            type: 'shopping_cart',
                            userID: userID.ID,
                            status: 'Yêu cầu duyệt',
                            code: data.RequestCode,
                            id: data.ID,
                        }
                    } else if (data.Status == 'Đang phê duyệt') {
                        var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDPheDuyet2 } });
                        objResult = {
                            name: data.nv ? data.nv.StaffName : 'admin',
                            type: 'shopping_cart',
                            userID: userID.ID,
                            status: 'Yêu cầu duyệt',
                            code: data.RequestCode,
                            id: data.ID,
                        }
                    }
                }
            })
        }
    })
    return objResult
}
async function getDetailPeymentOrder(id) {
    let objResult = {}
    await database.connectDatabase().then(async db => {
        if (db) {
            let tblDeNghiThanhToan = mtblDeNghiThanhToan(db);
            tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
            await tblDeNghiThanhToan.findOne({
                where: {
                    ID: id
                },
                include: [{
                    model: mtblDMNhanvien(db),
                    required: false,
                    as: 'nv'
                },],
            }).then(async data => {
                if (data) {
                    if (data.TrangThaiPheDuyetLD != 'Chờ phê duyệt' && data.TrangThaiPheDuyetLD != 'Chờ phê duyệt') {
                        var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDNhanVien } });
                        objResult = {
                            name: '',
                            type: 'payment',
                            userID: userID.ID,
                            status: 'Đã được duyệt',
                            code: data.PaymentOrderCode,
                            id: data.ID,
                        }
                    } else {
                        var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDNhanVienKTPD } });
                        objResult = {
                            name: data.nv ? data.nv.StaffName : 'admin',
                            type: 'payment',
                            userID: userID.ID,
                            status: 'Yêu cầu duyệt',
                            code: data.PaymentOrderCode,
                            id: data.ID,
                        }
                    }
                }
            })
        }
    })
    return objResult
}
async function getRequestOrderAndPaymentOfUser(userID) {
    var array = [];
    await database.connectDatabase().then(async db => {
        if (db) {
            let user = await mtblDMUser(db).findOne({
                where: { ID: userID }
            })
            if (user) {
                let permissions = user.Permissions ? JSON.parse(user.Permissions) : {}
                if (permissions.notiTS) {
                    console.log(permissions.notiTS);
                    for (let ts = 0; ts < permissions.notiTS.length; ts++) {
                        if (permissions.notiTS[ts].key == 'isNotiApprovalYCMS' && permissions.notiTS[ts].completed == true) {
                            array = await getRequestApproval(userID)
                        }
                        if (permissions.notiTS[ts].key == 'isNotiPersonalYCMS' && permissions.notiTS[ts].completed == true) {
                            let arrayUser = await getRequestOfUser(userID)
                            Array.prototype.push.apply(array, arrayUser);
                        }
                        if (permissions.notiTS[ts].key == 'isNotiApprovalDNTT' && permissions.notiTS[ts].completed == true) {
                            let arrayPayment = await getPaymentApproval(userID)
                            Array.prototype.push.apply(array, arrayPayment);
                        }
                        if (permissions.notiTS[ts].key == 'isNotiPersonalDNTT' && permissions.notiTS[ts].completed == true) {
                            let arrayPayment = await getPaymentOfUser(userID)
                            Array.prototype.push.apply(array, arrayPayment);
                        }
                    }
                }
            }
        } else {
            array = []
        }
    })
    return array
}
module.exports = {
    sockketIO: async (io) => {
        var array = await getPaymentAndREquest()
        var arrayContract = await getStaffContractExpirationData();
        io.on("connection", async function (socket) {
            console.log('The user is connecting : ' + socket.id);
            socket.emit("Server-send-all-the-messages", {
                'qltsArray': array,
                'qlnsArray': arrayContract,
            });
            socket.on("disconnect", function () {
                console.log(socket.id + " disconnected!");
            });
            socket.on("join-room", async (data) => {
                socket.userID = data;
                await database.connectDatabase().then(async db => {
                    if (db) {
                        console.log(data, '--------------------------- Join zoom ---------------------------');
                        let user = await mtblDMUser(db).findOne({
                            where: { ID: data }
                        })
                        if (user) {
                            let permissions = user.Permissions ? JSON.parse(user.Permissions) : {}
                            if (permissions.notiTS && permissions.notiNS && permissions.notiTC) {
                                for (let ts = 0; ts < permissions.notiTS.length; ts++) {
                                    if (permissions.notiTS[ts].completed == true) {
                                        socket.join(permissions.notiTS[ts].key);
                                    }
                                }
                                for (let ns = 0; ns < permissions.notiNS.length; ns++) {
                                    if (permissions.notiNS[ns].completed == true) {
                                        socket.join(permissions.notiNS[ns].key);
                                    }
                                }
                                for (let tc = 0; tc < permissions.notiTC.length; tc++) {
                                    if (permissions.notiTC[tc].completed == true) {
                                        socket.join(permissions.notiTC[tc].key);
                                    }
                                }
                            }
                        }
                    } else {
                        res.json(Constant.MESSAGE.USER_FAIL)
                    }
                })
            })
            //  gửi cho chính socket đang đăng nhập check quyền
            socket.on("system-wide-notification-ts", async (data) => {
                console.log(socket.userID, '----------------- get data -------------------');
                if (socket.userID) {
                    let array = await getRequestOrderAndPaymentOfUser(socket.userID);
                    socket.emit("system-wide-notification-ts", array)
                }
            })
            //  khi tạo yêu cầu mua sắm
            socket.on("notice-create-request-shopping", async (data) => {
                let obj = await getDetailRequestShopping(data)
                // io.sockets.in('isNotiApprovalYCMS').emit("send-data-for-room", obj)
                let clientsApproval = io.sockets.adapter.rooms['isNotiApprovalYCMS'].sockets
                if (obj.status == 'Đã được duyệt') {
                    clientsApproval = io.sockets.adapter.rooms['isNotiPersonalYCMS'].sockets
                }
                //  Laays danh sách socket trong room
                clientsApproval = Object.keys(clientsApproval)
                for (let s = 0; s < clientsApproval.length; s++) {
                    let socketGet = io.sockets.connected[clientsApproval[s]]
                    console.log(socketGet.id);
                    if (obj.userID == socketGet.userID)
                        io.sockets.in(socketGet.id).emit('personal-data', obj)
                    else
                        io.sockets.in(socketGet.id).emit('personal-data', null)

                }
                console.log(io.sockets.adapter.rooms);

            })
            socket.on("notice-create-payment-order", async (data) => {
                let obj = await getDetailPeymentOrder(data)
                let clientsApproval = io.sockets.adapter.rooms['isNotiApprovalDNTT'].sockets
                if (obj.status == 'Đã được duyệt') {
                    clientsApproval = io.sockets.adapter.rooms['isNotiPersonalDNTT'].sockets
                }
                clientsApproval = Object.keys(clientsApproval)
                for (let s = 0; s < clientsApproval.length; s++) {
                    let socketGet = io.sockets.connected[clientsApproval[s]]
                    console.log(socketGet.id);
                    // gửi cá nhân
                    if (obj.userID == socketGet.userID) {
                        io.sockets.in(socketGet.id).emit('personal-data', obj)
                    } else
                        io.sockets.in(socketGet.id).emit('personal-data', null)
                }
                console.log(io.sockets.adapter.rooms);
            })
        })
    },
}