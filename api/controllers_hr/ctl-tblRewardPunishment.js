const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblRewardPunishment = require('../tables/hrmanage/tblRewardPunishment')
var mtblRewardPunishmentRStaff = require('../tables/hrmanage/tblRewardPunishmentRStaff')
var database = require('../database');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblFileAttach = require('../tables/constants/tblFileAttach');

async function deleteRelationshiptblRewardPunishment(db, listID) {
    await mtblFileAttach(db).destroy({
        where: {
            IDRewardPunishment: {
                [Op.in]: listID
            }
        }
    })
    await mtblRewardPunishmentRStaff(db).destroy({
        where: {
            RewardPunishmentID: {
                [Op.in]: listID
            }
        }
    })
    await mtblRewardPunishment(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}
var mModules = require('../constants/modules');

module.exports = {
    deleteRelationshiptblRewardPunishment,
    //  get_detail_tbl_reward_punishment
    detailtblRewardPunishment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let stt = 1;
                    let arrayRewardPunishmentID = []
                    await mtblRewardPunishmentRStaff(db).findAll({
                        where: { StaffID: body.staffID },
                    }).then(inc => {
                        inc.forEach(item => {
                            arrayRewardPunishmentID.push(item.RewardPunishmentID)
                        })
                    })
                    let tblRewardPunishment = mtblRewardPunishment(db);
                    tblRewardPunishment.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDStaff', sourceKey: 'IDStaff', as: 'staff' })
                    tblRewardPunishment.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: {
                            ID: {
                                [Op.in]: arrayRewardPunishmentID
                            }
                        },
                        order: [
                            ['ID', 'DESC']
                        ],
                        include: [{
                            model: mtblDMNhanvien(db),
                            required: false,
                            as: 'staff'
                        },],
                    }).then(async data => {
                        var array = [];
                        for (let i = 0; i < data.length; i++) {
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                date: data[i].Date ? moment(data[i].Date).format('DD/MM/YYYY') : null,
                                // idStaff: data[i].IDStaff ? data[i].IDStaff : null,
                                // staffName: data[i].IDStaff ? data[i].staff.StaffName : '',
                                amountMoney: data[i].SalaryIncrease ? data[i].SalaryIncrease : null,
                                reason: data[i].Reason ? data[i].Reason : null,
                                code: data[i].Code ? data[i].Code : null,
                                status: data[i].Status ? data[i].Status : null,
                                idEmployeeApproval: data[i].IDEmployeeApproval ? data[i].IDEmployeeApproval : null,
                                reasonReject: data[i].ReasonReject ? data[i].ReasonReject : null,
                                type: data[i].Type ? data[i].Type : null,
                            }
                            let arrayStaff = []
                            let tblRewardPunishmentRStaff = mtblRewardPunishmentRStaff(db);
                            tblRewardPunishmentRStaff.belongsTo(mtblDMNhanvien(db), { foreignKey: 'StaffID', sourceKey: 'StaffID', as: 'staff' })
                            await tblRewardPunishmentRStaff.findAll({
                                where: { RewardPunishmentID: data[i].ID },
                                include: [{
                                    model: mtblDMNhanvien(db),
                                    required: false,
                                    as: 'staff'
                                },],
                            }).then(inc => {
                                inc.forEach(item => {
                                    arrayStaff.push({
                                        id: item.staff.ID,
                                        staffName: item.staff.StaffName,
                                        staffCode: item.staff.StaffCode,
                                    })
                                })
                            })
                            obj['staffIDs'] = arrayStaff
                            array.push(obj);
                            stt += 1;
                        }
                        for (var i = 0; i < array.length; i++) {
                            var arrayFile = []
                            await mtblFileAttach(db).findAll({ where: { IDRewardPunishment: array[i].id } }).then(file => {
                                if (file.length > 0) {
                                    for (var e = 0; e < file.length; e++) {
                                        arrayFile.push({
                                            name: file[e].Name ? file[e].Name : '',
                                            link: file[e].Link ? file[e].Link : '',
                                        })
                                    }
                                }
                            })
                            array[i]['arrayFile'] = arrayFile;
                        }
                        var result = {
                            array: array,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                        }
                        res.json(result);
                    })

                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // add_tbl_reward_punishment
    addtblRewardPunishment: (req, res) => {
        let body = req.body;
        body.staffID = JSON.parse(body.staffID)
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblRewardPunishment(db).create({
                        // IDStaff: body.staffID ? body.staffID : null,
                        Date: body.date ? body.date : null,
                        SalaryIncrease: body.amountMoney ? body.amountMoney : '',
                        Reason: body.reason ? body.reason : '',
                        Code: body.code ? body.code : '',
                        Status: body.status ? body.status : '',
                        IDEmployeeApproval: body.idEmployeeApproval ? body.idEmployeeApproval : '',
                        ReasonReject: body.reasonReject ? body.reasonReject : '',
                        Type: body.type ? body.type : '',
                    }).then(async data => {
                        if (data) {
                            if (body.fileAttach) {
                                body.fileAttach = JSON.parse(body.fileAttach)
                                if (body.fileAttach.length > 0)
                                    for (var j = 0; j < body.fileAttach.length; j++)
                                        await mtblFileAttach(db).update({
                                            IDRewardPunishment: data.ID,
                                        }, {
                                            where: {
                                                ID: body.fileAttach[j].id
                                            }
                                        })
                            }
                            for (let staff = 0; staff < body.staffID.length; staff++) {
                                await mtblRewardPunishmentRStaff(db).create({
                                    StaffID: body.staffID[staff].id,
                                    RewardPunishmentID: data.ID,
                                    Date: data.Date,
                                    SalaryIncrease: data.SalaryIncrease,
                                })
                            }

                        }
                        var result = {
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                        }
                        res.json(result);
                    })
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // update_tbl_reward_punishment
    updatetblRewardPunishment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.fileAttach) {
                        body.fileAttach = JSON.parse(body.fileAttach)
                        await mModules.updateForFileAttach(db, 'IDRewardPunishment', body.fileAttach, body.id)
                    }
                    if (body.staffID) {
                        body.staffID = JSON.parse(body.staffID)
                        await mtblRewardPunishmentRStaff(db).destroy({ where: { RewardPunishmentID: body.id, } })

                        for (let staff = 0; staff < body.staffID.length; staff++) {
                            let objCreate = {
                                StaffID: body.staffID[staff].id,
                                RewardPunishmentID: body.id,
                            }
                            let rewardPunishment = await mtblRewardPunishment(db).findOne({
                                where: { ID: body.id }
                            })
                            if (body.date || body.date === '') {
                                objCreate['Date'] = body.date
                            } else {
                                objCreate['Date'] = rewardPunishment.Date

                            }
                            if (body.amountMoney) {
                                objCreate['SalaryIncrease'] = body.amountMoney
                            } else {
                                objCreate['SalaryIncrease'] = rewardPunishment.SalaryIncrease
                            }
                            await mtblRewardPunishmentRStaff(db).create(objCreate)
                        }
                    }
                    if (body.idStaff || body.idStaff === '') {
                        if (body.idStaff === '')
                            update.push({ key: 'IDStaff', value: null });
                        else
                            update.push({ key: 'IDStaff', value: body.idStaff });
                    }
                    if (body.date || body.date === '') {
                        if (body.date === '')
                            update.push({ key: 'Date', value: null });
                        else
                            update.push({ key: 'Date', value: body.date });
                    }
                    if (body.amountMoney || body.amountMoney === '') {
                        if (body.amountMoney === '')
                            update.push({ key: 'SalaryIncrease', value: null });
                        else
                            update.push({ key: 'SalaryIncrease', value: body.amountMoney });
                    }
                    if (body.idEmployeeApproval || body.idEmployeeApproval === '') {
                        if (body.idEmployeeApproval === '')
                            update.push({ key: 'IDEmployeeApproval', value: null });
                        else
                            update.push({ key: 'IDEmployeeApproval', value: body.idEmployeeApproval });
                    }
                    if (body.reason || body.reason === '')
                        update.push({ key: 'Reason', value: body.reason });
                    if (body.code || body.code === '')
                        update.push({ key: 'Code', value: body.code });
                    if (body.status || body.status === '')
                        update.push({ key: 'Status', value: body.status });
                    if (body.reasonReject || body.reasonReject === '')
                        update.push({ key: 'ReasonReject', value: body.reasonReject });
                    database.updateTable(update, mtblRewardPunishment(db), body.id).then(response => {
                        if (response == 1) {
                            res.json(Result.ACTION_SUCCESS);
                        } else {
                            res.json(Result.SYS_ERROR_RESULT);
                        }
                    })
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // delete_tbl_reward_punishment
    deletetblRewardPunishment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblRewardPunishment(db, listID);
                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                    }
                    res.json(result);
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // get_list_tbl_reward_punishment
    getListtblRewardPunishment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            where = [{
                                Type: {
                                    [Op.like]: '%' + data.search + '%'
                                }
                            },
                            ];
                        } else {
                            where = [{
                                ID: {
                                    [Op.ne]: null
                                }
                            },];
                        }
                        whereOjb = {
                            [Op.and]: [{
                                [Op.or]: where
                            }],
                            [Op.or]: [{
                                ID: {
                                    [Op.ne]: null
                                }
                            }],
                        };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'NGÀY QUYẾT ĐỊNH') {
                                    let startDate = moment(data.items[i]['startDate']).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss')
                                    let endDate = moment(data.items[i]['endDate']).add(23 + 7, 'hours').format('YYYY-MM-DD HH:mm:ss')
                                    userFind['Date'] = {
                                        [Op.between]: [startDate, endDate]
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'LOẠI QUYẾT ĐỊNH') {
                                    userFind['Type'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'LÝ DO') {
                                    userFind['Reason'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'SỐ TIỀN') {
                                    let array = []
                                    array.push(data.items[i].value1)
                                    array.push(data.items[i].value2)
                                    array.sort(function (a, b) { return a - b });
                                    userFind['SalaryIncrease'] = { [Op.between]: array }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'NHÂN VIÊN') {
                                    let arrayStaff = []
                                    let tblRewardPunishmentRStaff = mtblRewardPunishmentRStaff(db);
                                    tblRewardPunishmentRStaff.belongsTo(mtblDMNhanvien(db), { foreignKey: 'StaffID', sourceKey: 'StaffID', as: 'staff' })
                                    await tblRewardPunishmentRStaff.findAll({
                                        where: { StaffID: data.items[i]['searchFields'] },
                                        include: [{
                                            model: mtblDMNhanvien(db),
                                            required: false,
                                            as: 'staff'
                                        },],
                                    }).then(inc => {
                                        inc.forEach(item => {
                                            arrayStaff.push(item.RewardPunishmentID)
                                        })
                                    })
                                    userFind['ID'] = { [Op.in]: arrayStaff }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                            }
                        }
                    }
                    let stt = 1;
                    let tblRewardPunishment = mtblRewardPunishment(db);
                    tblRewardPunishment.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDStaff', sourceKey: 'IDStaff', as: 'staff' })
                    tblRewardPunishment.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        order: [
                            ['ID', 'DESC']
                        ],
                        include: [{
                            model: mtblDMNhanvien(db),
                            required: false,
                            as: 'staff'
                        },],
                    }).then(async data => {
                        var array = [];
                        for (let i = 0; i < data.length; i++) {
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                date: data[i].Date ? moment(data[i].Date).format('DD/MM/YYYY') : null,
                                // idStaff: data[i].IDStaff ? data[i].IDStaff : null,
                                // staffName: data[i].IDStaff ? data[i].staff.StaffName : '',
                                amountMoney: data[i].SalaryIncrease ? data[i].SalaryIncrease : null,
                                reason: data[i].Reason ? data[i].Reason : null,
                                code: data[i].Code ? data[i].Code : null,
                                status: data[i].Status ? data[i].Status : null,
                                idEmployeeApproval: data[i].IDEmployeeApproval ? data[i].IDEmployeeApproval : null,
                                reasonReject: data[i].ReasonReject ? data[i].ReasonReject : null,
                                type: data[i].Type ? data[i].Type : null,
                            }
                            let arrayStaff = []
                            let tblRewardPunishmentRStaff = mtblRewardPunishmentRStaff(db);
                            tblRewardPunishmentRStaff.belongsTo(mtblDMNhanvien(db), { foreignKey: 'StaffID', sourceKey: 'StaffID', as: 'staff' })
                            await tblRewardPunishmentRStaff.findAll({
                                where: { RewardPunishmentID: data[i].ID },
                                include: [{
                                    model: mtblDMNhanvien(db),
                                    required: false,
                                    as: 'staff'
                                },],
                            }).then(inc => {
                                inc.forEach(item => {
                                    arrayStaff.push({
                                        id: item.staff.ID,
                                        staffName: item.staff.StaffName,
                                        staffCode: item.staff.StaffCode,
                                    })
                                })
                            })
                            obj['staffIDs'] = arrayStaff
                            array.push(obj);
                            stt += 1;
                        }
                        for (var i = 0; i < array.length; i++) {
                            var arrayFile = []
                            await mtblFileAttach(db).findAll({ where: { IDRewardPunishment: array[i].id } }).then(file => {
                                if (file.length > 0) {
                                    for (var e = 0; e < file.length; e++) {
                                        arrayFile.push({
                                            id: file[e].ID,
                                            name: file[e].Name ? file[e].Name : '',
                                            link: file[e].Link ? file[e].Link : '',
                                        })
                                    }
                                }
                            })
                            array[i]['arrayFile'] = arrayFile;
                        }
                        var count = await mtblRewardPunishment(db).count({ where: whereOjb, })
                        var result = {
                            array: array,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                            all: count
                        }
                        res.json(result);
                    })

                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // get_list_name_tbl_reward_punishment
    getListNametblRewardPunishment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblRewardPunishment(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                code: element.Code ? element.Code : '',
                            }
                            array.push(obj);
                        });
                        var result = {
                            array: array,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                        }
                        res.json(result);
                    })

                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    }
}