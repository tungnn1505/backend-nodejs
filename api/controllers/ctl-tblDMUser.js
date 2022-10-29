const Op = require('sequelize').Op;
const Constant = require('../constants/constant');
const Result = require('../constants/result');
var moment = require('moment');
var mtblDMUser = require('../tables/constants/tblDMUser');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblDMPermission = require('../tables/constants/tblDMPermission');
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblDMChiNhanh = require('../tables/constants/tblDMChiNhanh')
var database = require('../database');
let jwt = require('jsonwebtoken');
var mtblRRoleUser = require('../tables/constants/tblRRoleUser');
var mtblRole = require('../tables/constants/tblRole')

async function deleteRelationshiptblDMUser(db, listID) {
    await mtblRRoleUser(db).destroy({
        where: {
            UserID: {
                [Op.in]: listID
            }
        }
    })
    await mtblDMUser(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}
async function getPermissionForUser(userID) {
    let array = []
    await database.connectDatabase().then(async db => {
        if (db) {
            await mtblDMUser(db).findOne({
                where: { ID: userID },
            }).then(async data => {
                if (data) {
                    let permissions = data.Permissions ? JSON.parse(data.Permissions) : {}
                    if (permissions.permissionTS) {
                        for (let ts = 0; ts < permissions.permissionTS.length; ts++) {
                            if (permissions.permissionTS[ts].completed == true) {
                                array.push(permissions.permissionTS[ts].key)
                            }
                        }
                    }
                }

            })
        }
    })
    return array
}
module.exports = {
    getPermissionForUser,
    deleteRelationshiptblDMUser,
    // get_detail_tbl_dmuser
    getDetailtblDMUser: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let whereOjb = [];
                    // Một nhiều
                    let tblDMUser = mtblDMUser(db); // bắt buộc
                    tblDMUser.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanvien', sourceKey: 'IDNhanvien' })
                    tblDMUser.belongsTo(mtblDMPermission(db), { foreignKey: 'IDPermission', sourceKey: 'IDPermission' })
                    let count = await tblDMUser.count({ where: whereOjb })
                    tblDMUser.findOne({
                        include: [{
                            model: mtblDMNhanvien(db),
                            required: false,
                        },
                        {
                            model: mtblDMPermission(db),
                            required: false,
                        }
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: { ID: body.id },
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var obj = {
                            id: Number(data.ID),
                            userName: data.Username ? data.Username : '',
                            password: data.Password ? data.Password : '',
                            idNhanvien: data.IDNhanvien ? data.IDNhanvien : null,
                            staffName: data.tblDMNhanvien ? data.tblDMNhanvien.StaffName : '',
                            staffCode: data.tblDMNhanvien ? data.tblDMNhanvien.StaffCode : '',
                            idSpecializedSoftware: data.IDSpecializedSoftware ? data.IDSpecializedSoftware : null,
                            nameSpecializedSoftware: data.NameSpecializedSoftware ? data.NameSpecializedSoftware : null,
                            active: data.Active ? 'Có hiệu lực' : 'Vô hiệu hóa',
                            idPermission: data.IDPermission ? data.IDPermission : null,
                            permissionName: data.tblDMPermission ? data.tblDMPermission.PermissionName : '',
                            permissions: data.Permissions ? JSON.parse(data.Permissions) : '',
                        }
                        let tblRRoleUser = mtblRRoleUser(db);
                        tblRRoleUser.belongsTo(mtblRole(db), { foreignKey: 'RoleID', sourceKey: 'RoleID', as: 'role' })
                        await tblRRoleUser.findAll({
                            where: { UserID: data.ID },
                            include: [{
                                model: mtblRole(db),
                                required: false,
                                as: 'role'
                            },],
                        }).then(user => {
                            let users = []
                            for (let u = 0; u < user.length; u++) {
                                users.push({
                                    id: user[u].RoleID,
                                    name: user[u].RoleID ? user[u].role.Name : '',
                                })
                            }
                            obj['roleIDs'] = users
                        })
                        var result = {
                            obj: obj,
                            count: count,
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
    // add_tbl_dmuser
    addtblDMUser: (req, res) => {
        let body = req.body;
        let roleIDs = JSON.parse(body.roleIDs)
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var check = await mtblDMUser(db).findOne({ where: { Username: body.username } })
                    let permissions = {}
                    if (roleIDs.length > 0) {
                        await mtblRole(db).findOne({
                            where: { ID: roleIDs[0].id }
                        }).then(role => {
                            if (role && role.Permissions) {
                                let permissionsData = JSON.parse(role.Permissions)
                                permissions = permissionsData
                            }
                        })
                    }
                    for (let i = 0; i < roleIDs.length; i++) {
                        await mtblRole(db).findOne({
                            where: { ID: roleIDs[i].id }
                        }).then(role => {
                            if (role && role.Permissions) {
                                let permissionsData = JSON.parse(role.Permissions)
                                for (let ts = 0; ts < permissionsData.permissionTS.length; ts++) {
                                    if (permissionsData.permissionTS[ts].completed) {
                                        permissions.permissionTS[ts].completed == true
                                    }
                                }
                                for (let ns = 0; ns < permissionsData.permissionNS.length; ns++) {
                                    if (permissionsData.permissionNS[ns].completed) {
                                        permissions.permissionNS[ns].completed == true
                                    }
                                }
                                for (let tc = 0; tc < permissionsData.permissionTC.length; tc++) {
                                    if (permissionsData.permissionTC[tc].completed) {
                                        permissions.permissionTC[tc].completed == true
                                    }
                                }
                            }
                        })
                    }
                    console.log(permissions);
                    permissions = JSON.stringify(permissions)
                    if (!check) {
                        mtblDMUser(db).create({
                            Username: body.username ? body.username : '',
                            Password: body.password ? body.password : '123456a$',
                            IDNhanvien: body.idNhanvien ? body.idNhanvien : null,
                            Active: body.active ? body.active : '',
                            // IDPermission: body.idPermission ? body.idPermission : null,
                            IDSpecializedSoftware: body.idSpecializedSoftware ? body.idSpecializedSoftware : null,
                            NameSpecializedSoftware: body.specializedSoftwareName ? body.specializedSoftwareName : '',
                            Permissions: permissions,
                        }).then(async data => {
                            for (let i = 0; i < roleIDs.length; i++) {
                                await mtblRRoleUser(db).create({
                                    RoleID: roleIDs[i].id,
                                    UserID: data.ID,
                                })
                            }
                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: Constant.MESSAGE.ACTION_SUCCESS,
                            }
                            res.json(result);
                        })
                    } else {
                        var result = {
                            status: Constant.STATUS.FAIL,
                            message: Constant.MESSAGE.USER_FAIL,
                        }
                        res.json(result);
                    }
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // update_tbl_dmuser
    updatetblDMUser: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let permissions = '';
                    let update = [];
                    let roleIDs = JSON.parse(body.roleIDs)
                    if (roleIDs.length > 0) {
                        await mtblRole(db).findOne({
                            where: { ID: roleIDs[0].id }
                        }).then(role => {
                            if (role && role.Permissions) {
                                let permissionsData = JSON.parse(role.Permissions)
                                permissions = permissionsData
                            }
                        })
                    }
                    for (let i = 0; i < roleIDs.length; i++) {
                        await mtblRole(db).findOne({
                            where: { ID: roleIDs[i].id }
                        }).then(role => {
                            if (role && role.Permissions) {
                                let permissionsData = JSON.parse(role.Permissions)
                                for (let ts = 0; ts < permissionsData.permissionTS.length; ts++) {
                                    if (permissionsData.permissionTS[ts].completed == true) {
                                        permissions.permissionTS[ts].completed = true
                                    }
                                }
                                for (let ns = 0; ns < permissionsData.permissionNS.length; ns++) {
                                    if (permissionsData.permissionNS[ns].completed) {
                                        permissions.permissionNS[ns].completed = true
                                    }
                                }
                                for (let tc = 0; tc < permissionsData.permissionTC.length; tc++) {
                                    if (permissionsData.permissionTC[tc].completed) {
                                        permissions.permissionTC[tc].completed = true
                                    }
                                }
                            }
                        })
                    }
                    permissions = JSON.stringify(permissions)
                    update.push({ key: 'Permissions', value: permissions });
                    await mtblRRoleUser(db).destroy({
                        where: {
                            UserID: body.id,
                        }
                    })
                    for (let i = 0; i < roleIDs.length; i++) {
                        await mtblRRoleUser(db).create({
                            RoleID: roleIDs[i].id,
                            UserID: body.id,
                        })
                    }
                    if (body.username || body.username === '')
                        update.push({ key: 'Username', value: body.username });
                    if (body.idSpecializedSoftware || body.idSpecializedSoftware === '')
                        update.push({ key: 'IDSpecializedSoftware', value: body.idSpecializedSoftware });
                    if (body.specializedSoftwareName || body.specializedSoftwareName === '')
                        update.push({ key: 'NameSpecializedSoftware', value: body.specializedSoftwareName });
                    if (body.password || body.password === '')
                        update.push({ key: 'Password', value: body.password });
                    if (body.idNhanvien || body.idNhanvien === '') {
                        if (body.idNhanvien === '')
                            update.push({ key: 'IDNhanvien', value: null });
                        else
                            update.push({ key: 'IDNhanvien', value: body.idNhanvien });
                    }
                    // if (body.idPermission || body.idPermission === '') {
                    //     if (body.idPermission === '')
                    //         update.push({ key: 'IDPermission', value: null });
                    //     else
                    //         update.push({ key: 'IDPermission', value: body.idPermission });
                    // }
                    if (body.active || body.active === '')
                        update.push({ key: 'Active', value: body.active });
                    database.updateTable(update, mtblDMUser(db), body.id).then(response => {
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
    // update_permission_for_tbl_dmuser
    updatePermissionFortblDMUser: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblDMUser(db).update({
                        Permissions: body.permissions ? body.permissions : '',
                    }, { where: { ID: body.id } })
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
    // update_data_option_for_tbl_dmuser
    updateDataOptionFortblDMUser: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let dataOption = []
                    let arrayOptionUser = []
                    let checkDuplicate = false;
                    body.dataOptions = JSON.parse(body.dataOptions)
                    await mtblDMUser(db).findOne({
                        where: {
                            ID: body.userID
                        }
                    }).then(user => {
                        if (user) {
                            arrayOptionUser = user.DataOption ? JSON.parse(user.DataOption) : []
                            for (let item of arrayOptionUser) {
                                if (item.key == body.type) {
                                    item.array = body.dataOptions
                                    checkDuplicate = true
                                }
                            }
                        }
                    })
                    if (checkDuplicate) {
                        dataOption = arrayOptionUser
                    } else {
                        arrayOptionUser.push({
                            key: body.type,
                            array: body.dataOptions,
                        })
                        dataOption = arrayOptionUser
                    }
                    await mtblDMUser(db).update({
                        DataOption: JSON.stringify(dataOption),
                    }, { where: { ID: body.userID } })
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
    // get_data_option
    getDataOption: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let arrayResult = []
                    await mtblDMUser(db).findOne({
                        where: {
                            ID: body.userID
                        }
                    }).then(data => {
                        if (data) {
                            let dataArr = data.DataOption ? JSON.parse(data.DataOption) : []
                            for (let item of dataArr) {
                                if (item.key == body.type) {
                                    arrayResult = item.array
                                    break;
                                }
                            }
                        }
                    })
                    var result = {
                        array: arrayResult,
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
    // delete_tbl_dmuser
    deletetblDMUser: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDMUser(db, listID);
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
    // get_list_tbl_dmuser
    getListtblDMUser: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let whereOjb = [];
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)
                        if (data.search) {
                            var permission = [];
                            await mtblDMPermission(db).findAll({
                                order: [
                                    ['ID', 'DESC']
                                ],
                                where: {
                                    [Op.or]: [{
                                        PermissionName: {
                                            [Op.like]: '%' + data.search + '%'
                                        }
                                    },]
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    permission.push(item.ID);
                                })
                            })
                            var active = ''
                            if (data.search.toUpperCase() == 'CÓ HIỆU LỰC' || data.search.toUpperCase() == 'VÔ HIỆU HÓA')
                                active = data.search.toUpperCase() == 'CÓ HIỆU LỰC' ? true : false
                            let employeeIDS = [];
                            await mtblDMNhanvien(db).findAll({
                                where: {
                                    [Op.or]: [{
                                        StaffName: {
                                            [Op.like]: '%' + data.search + '%'
                                        }
                                    },
                                    {
                                        StaffCode: {
                                            [Op.like]: '%' + data.search + '%'
                                        }
                                    },
                                    ]
                                },
                                order: [
                                    ['ID', 'DESC']
                                ],
                            }).then(data => {
                                data.forEach(item => {
                                    employeeIDS.push(item.ID);
                                })
                            })
                            if (active !== '')
                                where = [{
                                    IDPermission: {
                                        [Op.in]: permission
                                    }
                                },
                                {
                                    Username: {
                                        [Op.like]: '%' + data.search + '%'
                                    }
                                },
                                { Active: active },
                                {
                                    IDNhanvien: {
                                        [Op.in]: employeeIDS
                                    }
                                },
                                ];
                            else
                                where = [{
                                    IDPermission: {
                                        [Op.in]: permission
                                    }
                                },
                                {
                                    Username: {
                                        [Op.like]: '%' + data.search + '%'
                                    }
                                },
                                // { Active: active },
                                {
                                    [Op.and]: {
                                        IDNhanvien: {
                                            [Op.in]: employeeIDS
                                        }
                                    }
                                },
                                ];
                            console.log(where);
                        } else {
                            where = [{
                                Username: {
                                    [Op.ne]: '%%'
                                }
                            },];
                        }
                        whereOjb = {
                            [Op.or]: where
                        };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'TÊN ĐẦY ĐỦ') {
                                    let employeeIDS = [];
                                    await mtblDMNhanvien(db).findAll({
                                        where: {
                                            [Op.or]: [{
                                                StaffName: {
                                                    [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                                }
                                            },]
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            employeeIDS.push(item.ID);
                                        })
                                    })
                                    userFind['IDNhanvien'] = {
                                        [Op.in]: employeeIDS
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'MÃ NHÂN VIÊN') {
                                    let employeeIDS = [];
                                    await mtblDMNhanvien(db).findAll({
                                        where: {
                                            [Op.or]: [{
                                                StaffCode: {
                                                    [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                                }
                                            },]
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            employeeIDS.push(item.ID);
                                        })
                                    })
                                    userFind['IDNhanvien'] = {
                                        [Op.in]: employeeIDS
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'TÊN ĐĂNG NHẬP') {
                                    userFind['Username'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'TRẠNG THÁI') {
                                    var active;
                                    if (data.items[i]['searchFields'].toUpperCase() == 'CÓ HIỆU LỰC')
                                        active = true
                                    if (data.items[i]['searchFields'].toUpperCase() == 'VÔ HIỆU HÓA')
                                        active = false
                                    userFind['Active'] = active
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'QUYỀN THỰC HIỆN') {
                                    var permission = [];
                                    await mtblDMPermission(db).findAll({
                                        where: {
                                            [Op.or]: [{
                                                PermissionName: {
                                                    [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                                }
                                            },]
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            permission.push(item.ID);
                                        })
                                    })
                                    userFind['IDPermission'] = {
                                        [Op.in]: permission
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                            }
                        }
                    }
                    // Một nhiều
                    let tblDMUser = mtblDMUser(db); // bắt buộc
                    tblDMUser.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanvien', sourceKey: 'IDNhanvien' })
                    tblDMUser.belongsTo(mtblDMPermission(db), { foreignKey: 'IDPermission', sourceKey: 'IDPermission' })
                    let count = await tblDMUser.count({ where: whereOjb })
                    tblDMUser.findAll({
                        include: [{
                            model: mtblDMNhanvien(db),
                            required: false,
                        },
                        {
                            model: mtblDMPermission(db),
                            required: false,
                        }
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        let stt = 1
                        for (let i = 0; i < data.length; i++) {
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                userName: data[i].Username ? data[i].Username : '',
                                password: data[i].Password ? data[i].Password : '',
                                idNhanvien: data[i].IDNhanvien ? data[i].IDNhanvien : null,
                                staffName: data[i].tblDMNhanvien ? data[i].tblDMNhanvien.StaffName : '',
                                staffCode: data[i].tblDMNhanvien ? data[i].tblDMNhanvien.StaffCode : '',
                                idSpecializedSoftware: data[i].IDSpecializedSoftware ? data[i].IDSpecializedSoftware : null,
                                nameSpecializedSoftware: data[i].NameSpecializedSoftware ? data[i].NameSpecializedSoftware : null,
                                active: data[i].Active ? 'Có hiệu lực' : 'Vô hiệu hóa',
                                idPermission: data[i].IDPermission ? data[i].IDPermission : null,
                                permissionName: data[i].tblDMPermission ? data[i].tblDMPermission.PermissionName : '',
                            }
                            let tblRRoleUser = mtblRRoleUser(db);
                            tblRRoleUser.belongsTo(mtblRole(db), { foreignKey: 'RoleID', sourceKey: 'RoleID', as: 'role' })
                            await tblRRoleUser.findAll({
                                where: { UserID: data[i].ID },
                                include: [{
                                    model: mtblRole(db),
                                    required: false,
                                    as: 'role'
                                },],
                            }).then(user => {
                                let users = []
                                for (let u = 0; u < user.length; u++) {
                                    users.push({
                                        id: user[u].RoleID,
                                        name: user[u].RoleID ? user[u].role.Name : '',
                                    })
                                }
                                obj['roleIDs'] = users
                            })
                            array.push(obj);
                            stt += 1;
                        }
                        var result = {
                            array: array,
                            count: count,
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
    // get_list_name_tbl_dmuser
    getListNametblDMUser: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMUser(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                username: element.Username ? element.Username : '',
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
    },
    login: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            try {
                let tblDMUser = mtblDMUser(db);
                let tblDMNhanvien = mtblDMNhanvien(db);
                let tblDMBoPhan = mtblDMBoPhan(db);
                tblDMUser.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanvien', sourceKey: 'IDNhanvien', as: 'nv' })
                tblDMUser.belongsTo(mtblDMPermission(db), { foreignKey: 'IDPermission', sourceKey: 'IDPermission', as: 'pms' })
                tblDMNhanvien.belongsTo(tblDMBoPhan, { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bp' })
                tblDMBoPhan.belongsTo(mtblDMChiNhanh(db), { foreignKey: 'IDChiNhanh', sourceKey: 'IDChiNhanh', as: 'chinhanh' })

                var data = await tblDMUser.findOne({
                    where: { UserName: body.userName, Password: body.password },
                    include: [{
                        model: tblDMNhanvien,
                        required: false,
                        as: 'nv',
                        include: [{
                            model: tblDMBoPhan,
                            required: false,
                            as: 'bp',
                            include: [{
                                model: mtblDMChiNhanh(db),
                                required: false,
                                as: 'chinhanh'
                            },],
                        }],
                    },
                    {
                        model: mtblDMPermission(db),
                        required: false,
                        as: 'pms',
                    }
                    ],
                })
                if (data) {
                    if (!data.Active) {
                        return res.json(Result.LOGIN_FAIL)
                    }
                    var obj = {
                        id: data.ID,
                        userName: data.Username,
                        password: data.Password,
                        idNhanVien: data.IDNhanvien,
                        idSpecializedSoftware: data.IDSpecializedSoftware ? data.IDSpecializedSoftware : null,
                        specializedSoftwareName: data.NameSpecializedSoftware ? data.NameSpecializedSoftware : '',
                        staffName: data.nv ? data.nv.StaffName : '',
                        staffCode: data.nv ? data.nv.StaffCode : '',
                        departmentCode: data.nv ? data.nv.bp ? data.nv.bp.DepartmentCode : '' : '',
                        permissionName: data.pms ? data.pms.PermissionName : '',
                        departmentName: data.nv ? data.nv.bp ? data.nv.bp.DepartmentName : '' : '',
                        departmentID: data.nv ? data.nv.bp ? data.nv.bp.ID : null : null,
                        branchCode: data.nv ? data.nv.bp ? data.nv.bp.chinhanh ? data.nv.bp.chinhanh.BranchCode : '' : '' : '',
                        branchName: data.nv ? data.nv.bp ? data.nv.bp.chinhanh ? data.nv.bp.chinhanh.BranchName : '' : '' : '',
                        branchID: data.nv ? data.nv.bp ? data.nv.bp.chinhanh ? data.nv.bp.chinhanh.ID : null : null : null,
                        permissions: data.Permissions ? data.Permissions : '',
                    }
                    payload = {
                        "Username": req.body.userName,
                        // standard fields
                        // - Xác thực người tạo
                        "iss": "Tungnn",
                    }
                    // payload = { username: 'haidn', password: '123456a$' }
                    let token = jwt.sign(payload,
                        'abcdxys', { expiresIn: '30d' }
                    );
                    let tblRRoleUser = mtblRRoleUser(db);
                    tblRRoleUser.belongsTo(mtblRole(db), { foreignKey: 'RoleID', sourceKey: 'RoleID', as: 'role' })
                    await tblRRoleUser.findAll({
                        where: { UserID: data.ID },
                        include: [{
                            model: mtblRole(db),
                            required: false,
                            as: 'role'
                        },],
                    }).then(user => {
                        let objRole = {}
                        for (let u = 0; u < user.length; u++) {
                            let key = user[u].role.Name
                            objRole[key] = true
                        }
                        obj['role'] = objRole

                    })
                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: '',
                        obj: obj,
                        token: token
                    }
                    res.json(result);
                } else {
                    res.json(Result.LOGIN_FAIL)

                }
            } catch (error) {
                console.log(error);
                res.json(Result.SYS_ERROR_RESULT)
            }
        }, error => {
            res.json(error)
        })
    },
    // saveIPClientLogin: (req, res) => {
    //     let body = req.body;
    //     database.connectDatabase().then(async db => {
    //         try {
    //             let listIP = await mtblDMUser(db).findOne({ where: { ID: body.userID } })
    //             let stringListIP = listIP ? listIP + body.ip : body.ip
    //             await mtblDMUser(db).update({
    //                 ListIP: stringListIP
    //             }, {
    //                 where: { ID: body.userID }
    //             })
    //             var result = {
    //                 status: Constant.STATUS.SUCCESS,
    //                 message: Constant.MESSAGE.ACTION_SUCCESS,
    //             }
    //             res.json(result);
    //         } catch (error) {
    //             console.log(error);
    //             res.json(Result.SYS_ERROR_RESULT)
    //         }
    //     })
    // },
    // loginWithIP: (req, res) => {
    //     let body = req.body;
    //     database.connectDatabase().then(async db => {
    //         try {
    //             let tblDMUser = mtblDMUser(db);
    //             let tblDMNhanvien = mtblDMNhanvien(db);
    //             let tblDMBoPhan = mtblDMBoPhan(db);
    //             tblDMUser.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanvien', sourceKey: 'IDNhanvien', as: 'nv' })
    //             tblDMUser.belongsTo(mtblDMPermission(db), { foreignKey: 'IDPermission', sourceKey: 'IDPermission', as: 'pms' })
    //             tblDMNhanvien.belongsTo(tblDMBoPhan, { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bp' })
    //             tblDMBoPhan.belongsTo(mtblDMChiNhanh(db), { foreignKey: 'IDChiNhanh', sourceKey: 'IDChiNhanh', as: 'chinhanh' })

    //             var data = await tblDMUser.findOne({
    //                 where: { ListIP: body.userName, Password: body.password },
    //                 include: [
    //                     {
    //                         model: tblDMNhanvien,
    //                         required: false,
    //                         as: 'nv',
    //                         include: [
    //                             {
    //                                 model: tblDMBoPhan,
    //                                 required: false,
    //                                 as: 'bp',
    //                                 include: [
    //                                     {
    //                                         model: mtblDMChiNhanh(db),
    //                                         required: false,
    //                                         as: 'chinhanh'
    //                                     },
    //                                 ],
    //                             }
    //                         ],
    //                     },
    //                     {
    //                         model: mtblDMPermission(db),
    //                         required: false,
    //                         as: 'pms',
    //                     }
    //                 ],
    //             })
    //             if (data) {
    //                 if (!data.Active) {
    //                     return res.json(Result.LOGIN_FAIL)
    //                 }
    //                 var obj = {
    //                     id: data.ID,
    //                     userName: data.Username,
    //                     password: data.Password,
    //                     idNhanVien: data.IDNhanvien,
    //                     idSpecializedSoftware: data.IDSpecializedSoftware ? data.IDSpecializedSoftware : null,
    //                     specializedSoftwareName: data.NameSpecializedSoftware ? data.NameSpecializedSoftware : '',
    //                     staffName: data.nv ? data.nv.StaffName : '',
    //                     staffCode: data.nv ? data.nv.StaffCode : '',
    //                     departmentCode: data.nv ? data.nv.bp ? data.nv.bp.DepartmentCode : '' : '',
    //                     permissionName: data.pms ? data.pms.PermissionName : '',
    //                     departmentName: data.nv ? data.nv.bp ? data.nv.bp.DepartmentName : '' : '',
    //                     departmentID: data.nv ? data.nv.bp ? data.nv.bp.ID : null : null,
    //                     branchCode: data.nv ? data.nv.bp ? data.nv.bp.chinhanh ? data.nv.bp.chinhanh.BranchCode : '' : '' : '',
    //                     branchName: data.nv ? data.nv.bp ? data.nv.bp.chinhanh ? data.nv.bp.chinhanh.BranchName : '' : '' : '',
    //                     branchID: data.nv ? data.nv.bp ? data.nv.bp.chinhanh ? data.nv.bp.chinhanh.ID : null : null : null,
    //                 }
    //                 payload = {
    //                     "Username": req.body.userName,
    //                     // standard fields
    //                     // - Xác thực người tạo
    //                     "iss": "Tungnn",
    //                 }
    //                 let token = jwt.sign(payload,
    //                     'abcdxys',
    //                     {}
    //                 );
    //                 var result = {
    //                     status: Constant.STATUS.SUCCESS,
    //                     message: '',
    //                     obj: obj,
    //                     token: token
    //                 }
    //                 res.json(result);
    //             } else {
    //                 res.json(Result.LOGIN_FAIL)

    //             }
    //         } catch (error) {
    //             console.log(error);
    //             res.json(Result.SYS_ERROR_RESULT)
    //         }
    //     }, error => {
    //         res.json(error)
    //     })
    // },
}