var moment = require('moment');
var fs = require('fs');
var database = require('../database');
const Sequelize = require('sequelize');
var mtblDMUser = require('../tables/constants/tblDMUser');
var mtblNghiPhep = require('../tables/hrmanage/tblNghiPhep')
var mtblHopDongNhanSu = require('../tables/hrmanage/tblHopDongNhanSu')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblMucDongBaoHiem = require('../tables/hrmanage/tblMucDongBaoHiem')
const Op = require('sequelize').Op;
var schedule = require('node-schedule');

async function getAllLeaveOfUser(userID, type) {
    let array = []
    await database.connectDatabase().then(async db => {
        if (db) {
            let User = await mtblDMUser(db).findOne({ where: { ID: userID } })
            let tblNghiPhep = mtblNghiPhep(db);
            tblNghiPhep.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
            await tblNghiPhep.findAll({
                where: {
                    [Op.or]: [{
                        IDNhanVien: User.IDNhanvien,
                        Type: 'TakeLeave',
                        IsNotification: null
                    },
                    {
                        IDHeadDepartment: User.IDNhanvien,
                        Type: 'TakeLeave',
                        IsNotification: null
                    },
                    {
                        IDHeads: User.IDNhanvien,
                        Type: 'TakeLeave',
                        IsNotification: null
                    },
                    {
                        IDAdministrationHR: User.IDNhanvien,
                        Type: 'TakeLeave',
                        IsNotification: null
                    },
                    ]
                    // Type: 'SignUp',
                },
                include: [{
                    model: mtblDMNhanvien(db),
                    required: false,
                    as: 'nv'
                },],
            }).then(async leave => {
                if (leave) {
                    for (l = 0; l < leave.length; l++) {
                        let name = leave[l].nv ? leave[l].nv.StaffName : '';
                        let code = leave[l].NumberLeave;
                        let leaveID = leave[l].ID;
                        let status = leave[l].Status
                        console.log(status);
                        if (type == 'both' || type == 'request') {
                            if (status == 'Chờ trưởng bộ phận phê duyệt') {

                                var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: leave[l].IDHeadDepartment } });
                                let objResult = {
                                    name: name,
                                    type: 'TakeLeave',
                                    userID: userID.ID,
                                    status: 'Yêu cầu duyệt',
                                    code: code,
                                    id: leaveID
                                }
                                array.push(objResult)
                            } else if (status == 'Chờ thủ trưởng phê duyệt') {
                                var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: leave[l].IDHeads } });
                                let objResult = {
                                    name: name,
                                    type: 'TakeLeave',
                                    userID: userID.ID,
                                    status: 'Yêu cầu duyệt',
                                    code: code,
                                    id: leaveID
                                }
                                array.push(objResult)
                            } else if (status == 'Chờ hành chính nhân sự phê duyệt') {
                                var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: leave[l].IDAdministrationHR } });
                                let objResult = {
                                    name: name,
                                    type: 'TakeLeave',
                                    userID: userID.ID,
                                    status: 'Yêu cầu duyệt',
                                    code: code,
                                    id: leaveID
                                }
                                array.push(objResult)
                            }
                        }
                        if (type == 'both' || type == 'approved') {
                            if (status == 'Hoàn thành') {
                                let objResult = {
                                    name: '',
                                    type: 'TakeLeave',
                                    userID: leave[l].IDNhanVien,
                                    status: 'Đã được duyệt',
                                    code: code,
                                    id: leaveID
                                }
                                array.push(objResult)
                            }
                        }
                    }
                }
            })
        }
    })
    return array
}
async function getAllOvertimeOfUser(userID, type) {
    let array = []
    await database.connectDatabase().then(async db => {
        if (db) {
            let User = await mtblDMUser(db).findOne({ where: { ID: userID } })
            let tblNghiPhep = mtblNghiPhep(db);
            tblNghiPhep.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
            await tblNghiPhep.findAll({
                where: {
                    [Op.or]: [{
                        IDNhanVien: User.IDNhanvien,
                        Type: 'SignUp',
                        IsNotification: null,
                    },
                    {
                        IDHeadDepartment: User.IDNhanvien,
                        Type: 'SignUp',
                        IsNotification: null,
                    },
                    {
                        IDHeads: User.IDNhanvien,
                        Type: 'SignUp',
                        IsNotification: null,
                    },
                    {
                        IDAdministrationHR: User.IDNhanvien,
                        Type: 'SignUp',
                        IsNotification: null,
                    },
                    ]
                },
                include: [{
                    model: mtblDMNhanvien(db),
                    required: false,
                    as: 'nv'
                },],
            }).then(async leave => {
                if (leave) {
                    for (l = 0; l < leave.length; l++) {
                        let name = leave[l].nv ? leave[l].nv.StaffName : ''
                        let code = leave[l].NumberLeave;
                        let leaveID = leave[l].ID;
                        let status = leave[l].Status
                        if (type == 'both' || type == 'request') {
                            if (status == 'Chờ trưởng bộ phận phê duyệt' || status == 'Chờ trưởng bộ phận xác nhận') {
                                var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: leave[l].IDHeadDepartment } });
                                let objResult = {
                                    name: name,
                                    type: 'SignUp',
                                    userID: userID.ID,
                                    status: 'Yêu cầu duyệt',
                                    code: code,
                                    id: leaveID
                                }
                                array.push(objResult)
                            } else if (status == 'Chờ thủ trưởng phê duyệt') {
                                var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: leave[l].IDHeads } });
                                let objResult = {
                                    name: name,
                                    type: 'SignUp',
                                    userID: userID.ID,
                                    status: 'Yêu cầu duyệt',
                                    code: code,
                                    id: leaveID
                                }
                                array.push(objResult)
                            } else if (status == 'Chờ hành chính nhân sự phê duyệt') {
                                var userID = await mtblDMUser(db).findOne({ where: { IDNhanvien: leave[l].IDAdministrationHR } });
                                let objResult = {
                                    name: name,
                                    type: 'SignUp',
                                    userID: userID.ID,
                                    status: 'Yêu cầu duyệt',
                                    code: code,
                                    id: leaveID
                                }
                                array.push(objResult)
                            }
                        }
                        if (type == 'both' || type == 'approved') {
                            if (status == 'Hoàn thành') {
                                let objResult = {
                                    name: '',
                                    type: 'SignUp',
                                    userID: leave[l].IDNhanVien,
                                    status: 'Đã được duyệt',
                                    code: code,
                                    id: leaveID
                                }
                                array.push(objResult)
                            }
                        }

                    }
                }
            })
        }
    })
    return array
}
async function getStaffContractExpirationData() {
    var array = [];
    await database.connectDatabase().then(async db => {
        if (db) {
            let now = moment().add(7, 'hours').format('YYYY-MM-DD');
            let nowTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
            let tblHopDongNhanSu = mtblHopDongNhanSu(db);
            tblHopDongNhanSu.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'staff' })
            await tblHopDongNhanSu.findAll({
                where: {
                    [Op.or]: [{
                        Status: 'Có hiệu lực',
                        // Time: {
                        //     [Op.eq]: null
                        // },
                        ContractDateEnd: {
                            [Op.ne]: null
                        },
                        NoticeTime: {
                            [Op.lte]: nowTime
                        }
                    },
                    {
                        Status: 'Có hiệu lực',
                        NoticeTime: {
                            [Op.lte]: nowTime
                        },
                        ContractDateEnd: {
                            [Op.ne]: null
                        },
                        // Time: {
                        //     [Op.lte]: nowTime
                        // },
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
                            noticeTime: contract[i].Time ? moment(contract[i].Time).subtract(7, 'hours') : null,
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
async function getInsurancePremiums(socket, io) {
    let isNotiInscreaseInsurance = false
    await database.connectDatabase().then(async db => {
        if (db) {
            if (socket.userID) {
                let user = await mtblDMUser(db).findOne({
                    where: { ID: socket.userID }
                })
                if (user) {
                    let permissions = user.Permissions ? JSON.parse(user.Permissions) : {}
                    if (permissions.notiNS) {
                        for (let ts = 0; ts < permissions.notiNS.length; ts++) {
                            if (permissions.notiNS[ts].key == 'isNotiInscreaseInsurance' && permissions.notiNS[ts].completed == true) {
                                isNotiInscreaseInsurance = true
                            }
                        }
                    }
                }
                if (isNotiInscreaseInsurance == true) {
                    await database.connectDatabase().then(async db => {
                        if (db) {
                            var insurancePremiums = await mtblMucDongBaoHiem(db).findOne({
                                order: [
                                    Sequelize.literal('max(DateEnd) DESC'),
                                ],
                                group: ['ID', 'CompanyBHXH', 'CompanyBHYT', 'CompanyBHTN', 'StaffBHXH', 'StaffBHYT', 'StaffBHTN', 'DateStart', 'StaffUnion', 'StaffBHTNLD', 'DateEnd', 'MinimumWage', 'ApplicableDate'],
                                where: {
                                    DateEnd: {
                                        [Op.gte]: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss.SSS')
                                    }
                                }
                            })
                            if (insurancePremiums) {
                                let roomLeave = io.sockets.adapter.rooms['isNotiInscreaseInsurance'].sockets
                                //  Laays danh sách socket trong room
                                roomLeave = Object.keys(roomLeave)
                                socket.emit("insurance-premiums", 1)

                                // for (let s = 0; s < roomLeave.length; s++) {
                                //     let socketGet = io.sockets.connected[roomLeave[s]]
                                //     console.log(socketGet.userID);
                                //     socket.emit("insurance-premiums", 1)

                                // }
                            }
                        }
                    })
                }
            }
        }
    })
}
async function getLeaveAndOvertimeOfUser(userID) {
    let isNotiApprovalTakeLeave = false
    let isNotiPersonalTakeLeave = false
    let isNotiApprovalSignUp = false
    let isNotiPersonalSignUp = false
    let isNotiContract = false
    let objResult = {}
    await database.connectDatabase().then(async db => {
        if (db) {
            let user = await mtblDMUser(db).findOne({
                where: { ID: userID }
            })
            if (user) {
                let permissions = user.Permissions ? JSON.parse(user.Permissions) : {}
                if (permissions.notiNS) {
                    for (let ts = 0; ts < permissions.notiNS.length; ts++) {
                        if (permissions.notiNS[ts].key == 'isNotiApprovalTakeLeave' && permissions.notiNS[ts].completed == true) {
                            isNotiApprovalTakeLeave = true
                        }
                        if (permissions.notiNS[ts].key == 'isNotiPersonalTakeLeave' && permissions.notiNS[ts].completed == true) {
                            isNotiPersonalTakeLeave = true
                        }
                        if (permissions.notiNS[ts].key == 'isNotiApprovalSignUp' && permissions.notiNS[ts].completed == true) {
                            isNotiApprovalSignUp = true
                        }
                        if (permissions.notiNS[ts].key == 'isNotiPersonalSignUp' && permissions.notiNS[ts].completed == true) {
                            isNotiPersonalSignUp = true
                        }
                        if (permissions.notiNS[ts].key == 'isNotiContract' && permissions.notiNS[ts].completed == true) {
                            isNotiContract = true
                        }
                    }
                }
            }
            let arrayLeave = []
            let arrayOvertime = []
            //  approved: đã được duyệt, request: yêu cầu duyệt, both: cả hai
            if (isNotiApprovalTakeLeave == true && isNotiPersonalTakeLeave == true) {
                arrayLeave = await getAllLeaveOfUser(userID, 'both')
            } else if (isNotiApprovalTakeLeave == true && isNotiPersonalTakeLeave == false) {
                arrayLeave = await getAllLeaveOfUser(userID, 'request')
            } else if (isNotiApprovalTakeLeave == false && isNotiPersonalTakeLeave == true) {
                arrayLeave = await getAllLeaveOfUser(userID, 'approved')
            }

            if (isNotiApprovalSignUp == true && isNotiPersonalSignUp == true) {
                arrayOvertime = await getAllOvertimeOfUser(userID, 'both')
            } else if (isNotiApprovalSignUp == true && isNotiPersonalSignUp == false) {
                arrayOvertime = await getAllOvertimeOfUser(userID, 'request')
            } else if (isNotiApprovalSignUp == false && isNotiPersonalSignUp == true) {
                arrayOvertime = await getAllOvertimeOfUser(userID, 'approved')
            }
            var arrayContract = []
            if (isNotiContract == true) {
                arrayContract = await getStaffContractExpirationData();
            }
            let array = []
            Array.prototype.push.apply(array, arrayLeave);
            Array.prototype.push.apply(array, arrayOvertime);
            objResult = {
                'array': array,
                'arrayContract': arrayContract,
            }
        }
    })
    return objResult
}
async function getListContactExpiration(db) {
    let arrayResult = []
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
                ContractDateEnd: {
                    [Op.ne]: null
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
                ContractDateEnd: {
                    [Op.ne]: null
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
                arrayResult.push({
                    contractID: contract[i].ID,
                    staffName: contract[i].staff.StaffName,
                    staffCode: contract[i].staff.StaffCode,
                    contractDateEnd: contract[i].ContractDateEnd ? contract[i].ContractDateEnd : null,
                    noticeTime: contract[i].Time ? contract[i].Time : null,
                })
            }
        }
    })
    return arrayResult
}
async function getListContactDetail(db, id) {
    let obj = {}
    // let now = moment().format('YYYY-MM-DD');
    let nowTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    let tblHopDongNhanSu = mtblHopDongNhanSu(db);
    tblHopDongNhanSu.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'staff' })
    await tblHopDongNhanSu.findOne({
        where: {
            ID: id,
            NoticeTime: {
                [Op.lte]: nowTime
            },
            ContractDateEnd: {
                [Op.ne]: null
            },
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
        if (contract) {
            obj = {
                contractID: contract.ID,
                staffName: contract.staff.StaffName,
                staffCode: contract.staff.StaffCode,
                contractDateEnd: contract.ContractDateEnd ? contract.ContractDateEnd : null,
                noticeTime: contract.Time ? contract.Time : null,
            }
        }
    })
    return obj
}
async function getStaffContractExpirationDataFollowSocket(socket, id, io) {
    var array = [];
    await database.connectDatabase().then(async db => {
        if (db) {
            if (socket.userID) {
                let isNotiContract = false
                let user = await mtblDMUser(db).findOne({
                    where: { ID: socket.userID }
                })
                if (user) {
                    let permissions = user.Permissions ? JSON.parse(user.Permissions) : {}
                    if (permissions.notiNS) {
                        for (let ts = 0; ts < permissions.notiNS.length; ts++) {
                            if (permissions.notiNS[ts].key == 'isNotiContract' && permissions.notiNS[ts].completed == true) {
                                isNotiContract = true
                            }
                        }
                    }
                }
                if (isNotiContract == true) {
                    array = await getListContactExpiration(db)
                    socket.emit("contract-expiration", array);
                    obj = await getListContactDetail(db, id)
                    let roomLeave = io.sockets.adapter.rooms['isNotiContract'].sockets
                    //  Laays danh sách socket trong room
                    roomLeave = Object.keys(roomLeave)
                    for (let s = 0; s < roomLeave.length; s++) {
                        let socketGet = io.sockets.connected[roomLeave[s]]
                        if (obj.contractID) {
                            io.sockets.in(socketGet.id).emit('contract-expiration-detail', obj)
                        }

                    }
                    let objT = await getLeaveAndOvertimeOfUser(socket.userID);
                    socket.emit("system-wide-notification-ns", objT)
                }
            }
        }
    })
}
async function getDetailLeaveOrOvertime(id) {
    var obj = {};
    await database.connectDatabase().then(async db => {
        if (db) {
            let tblNghiPhep = mtblNghiPhep(db);
            tblNghiPhep.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
            await tblNghiPhep.findOne({
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
                    if (data.Type == 'TakeLeave') {
                        if (data.Status == 'Chờ trưởng bộ phận phê duyệt') {
                            let User = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDHeadDepartment } })
                            obj = {
                                name: data.nv ? data.nv.StaffName : '',
                                type: 'TakeLeave',
                                userID: User.ID,
                                status: 'Yêu cầu duyệt',
                                code: data.NumberLeave,
                                id: data.ID,
                            }
                        } else if (data.Status == 'Chờ thủ trưởng phê duyệt') {
                            let User = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDHeads } })
                            obj = {
                                name: data.nv ? data.nv.StaffName : '',
                                type: 'TakeLeave',
                                userID: User.ID,
                                status: 'Yêu cầu duyệt',
                                code: data.NumberLeave,
                                id: data.ID,
                            }
                        } else if (data.Status == 'Chờ hành chính nhân sự phê duyệt') {
                            let User = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDAdministrationHR } })

                            obj = {
                                name: data.nv ? data.nv.StaffName : '',
                                type: 'TakeLeave',
                                userID: User.ID,
                                status: 'Yêu cầu duyệt',
                                code: data.NumberLeave,
                                id: data.ID,
                            }
                        } else if (data.Status == 'Hoàn thành') {
                            let User = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDNhanVien } })
                            obj = {
                                name: '',
                                type: 'TakeLeave',
                                userID: User.ID,
                                status: 'Đã được duyệt',
                                code: data.NumberLeave,
                                id: data.ID,
                            }
                        }
                    } else {
                        if (data.Status == 'Chờ trưởng bộ phận phê duyệt') {
                            let User = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDHeadDepartment } })
                            obj = {
                                name: data.nv ? data.nv.StaffName : '',
                                type: 'SignUp',
                                userID: User.ID,
                                status: 'Yêu cầu duyệt',
                                code: data.NumberLeave,
                                id: data.ID,
                            }
                        } else if (data.Status == 'Chờ trưởng bộ phận xác nhận') {
                            let User = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDHeadDepartment } })
                            obj = {
                                name: data.nv ? data.nv.StaffName : '',
                                type: 'SignUp',
                                userID: User.ID,
                                status: 'Yêu cầu duyệt',
                                code: data.NumberLeave,
                                id: data.ID,
                            }
                        } else if (data.Status == 'Chờ thủ trưởng phê duyệt') {
                            let User = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDHeads } })
                            obj = {
                                name: data.nv ? data.nv.StaffName : '',
                                type: 'SignUp',
                                userID: User.ID,
                                status: 'Yêu cầu duyệt',
                                code: data.NumberLeave,
                                id: data.ID,
                            }
                        } else if (data.Status == 'Chờ hành chính nhân sự phê duyệt') {
                            let User = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDAdministrationHR } })
                            obj = {
                                name: data.nv ? data.nv.StaffName : '',
                                type: 'SignUp',
                                userID: User.ID,
                                status: 'Yêu cầu duyệt',
                                code: data.NumberLeave,
                                id: data.ID,
                            }
                        } else if (data.Status == 'Hoàn thành') {
                            let User = await mtblDMUser(db).findOne({ where: { IDNhanvien: data.IDNhanVien } })
                            obj = {
                                name: '',
                                type: 'SignUp',
                                userID: User.ID,
                                status: 'Đã được duyệt',
                                code: data.NumberLeave,
                                id: data.ID,
                            }
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
            //  gửi cho chính socket đang đăng nhập check quyền
            socket.on("insurance-premiums", async function () {
                await getInsurancePremiums(socket, io)
            });
            socket.on("setup-time-repeat", async function (data) {
                console.log(data);
                database.connectDatabase().then(async db => {
                    if (db) {
                        try {
                            await mtblHopDongNhanSu(db).update({
                                Time: moment(data.time).format('YYYY-MM-DD  HH:mm:ss.SSS'),
                            }, {
                                where: {
                                    ID: data.id
                                }
                            })
                            let obj = await getListContactDetail(db, data.id)
                            if (obj != {}) {
                                let time = moment(obj.noticeTime).subtract(7, 'hours').format('YYYY-MM-DD  HH:mm:ss.SSS')
                                let job = schedule.scheduleJob(time, async function () {
                                    let roomLeave = io.sockets.adapter.rooms['isNotiContract'].sockets
                                    //  Laays danh sách socket trong room
                                    roomLeave = Object.keys(roomLeave)
                                    console.log(roomLeave, obj);
                                    for (let s = 0; s < roomLeave.length; s++) {
                                        let socketGet = io.sockets.connected[roomLeave[s]]
                                        io.sockets.in(socketGet.id).emit('contract-expiration-detail', obj)
                                    }
                                });
                                console.log(job);
                            }
                            // console.log(socket.userID, '----------------- system-wide-notification-ns -------------------');
                            if (socket.userID) {
                                let obj = await getLeaveAndOvertimeOfUser(socket.userID);
                                socket.emit("system-wide-notification-ns", obj)
                            }

                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        console.log('Connect false');
                    }
                })
            })
            socket.on("contract-expiration", async function (data) {
                console.log('-------------------------- contract-expiration ----------------------', data);
                await getStaffContractExpirationDataFollowSocket(socket, data, io)
            });
            socket.on("system-wide-notification-ns", async (data) => {
                console.log(socket.userID, '----------------- system-wide-notification-ns -------------------');
                if (socket.userID) {
                    let obj = await getLeaveAndOvertimeOfUser(socket.userID);
                    socket.emit("system-wide-notification-ns", obj)
                }
            })
            socket.on("notice-create-leave-or-overtime", async (data) => {
                let obj = await getDetailLeaveOrOvertime(data)
                console.log(data, '---------------------------------notice-create-leave-or-overtime-------------------------------------');
                if (obj && obj.type == 'TakeLeave') {
                    let roomLeave = io.sockets.adapter.rooms['isNotiApprovalTakeLeave'].sockets
                    if (obj.status == 'Đã được duyệt') {
                        roomLeave = io.sockets.adapter.rooms['isNotiPersonalTakeLeave'].sockets
                    }
                    //  Laays danh sách socket trong room
                    roomLeave = Object.keys(roomLeave)
                    console.log(roomLeave);
                    for (let s = 0; s < roomLeave.length; s++) {
                        let socketGet = io.sockets.connected[roomLeave[s]]
                        console.log(socketGet.userID);
                        if (obj.userID == socketGet.userID)
                            io.sockets.in(socketGet.id).emit('receive-data', obj)
                        else
                            io.sockets.in(socketGet.id).emit('receive-data', null)

                    }
                } else {
                    let roomOvertime = io.sockets.adapter.rooms['isNotiApprovalSignUp'].sockets
                    if (obj.status == 'Đã được duyệt') {
                        roomOvertime = io.sockets.adapter.rooms['isNotiPersonalSignUp'].sockets
                    }
                    //  Laays danh sách socket trong room
                    roomOvertime = Object.keys(roomOvertime)
                    for (let s = 0; s < roomOvertime.length; s++) {
                        let socketGet = io.sockets.connected[roomOvertime[s]]
                        console.log(socketGet.id);
                        if (obj.userID == socketGet.userID)
                            io.sockets.in(socketGet.id).emit('receive-data', obj)
                        else
                            io.sockets.in(socketGet.id).emit('receive-data', null)

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