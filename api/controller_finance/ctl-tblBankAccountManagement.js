const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblBankAccountManagement = require('../tables/financemanage/tblBankAccountManagement')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var database = require('../database');
async function deleteRelationshiptblBankAccountManagement(db, listID) {
    await mtblBankAccountManagement(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblBankAccountManagement,
    //  get_detail_tbl_bank_account_management
    detailtblBankAccountManagement: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblBankAccountManagement = mtblBankAccountManagement(db);
                    tblBankAccountManagement.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDEmployee', sourceKey: 'IDEmployee', as: 'employee' })
                    mtblBankAccountManagement(db).findOne({
                        where: { ID: body.id },
                        include: [
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'employee'
                            },
                        ],
                    }).then(data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                name: data.Name ? data.Name : '',
                                branchName: data.BranchName ? data.BranchName : '',
                                idEmployee: data.IDEmployee ? data.IDEmployee : '',
                                nameEmployee: data.IDEmployee ? data.employee.StaffName : '',
                                accountNumber: data.AccountNumber ? data.AccountNumber : '',
                                surplus: data.Surplus ? data.Surplus : 0,
                            }
                            var result = {
                                obj: obj,
                                status: Constant.STATUS.SUCCESS,
                                message: Constant.MESSAGE.ACTION_SUCCESS,
                            }
                            res.json(result);
                        } else {
                            res.json(Result.NO_DATA_RESULT)

                        }

                    })
                } catch (error) {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // add_tbl_bank_account_management
    addtblBankAccountManagement: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblBankAccountManagement(db).create({
                        Name: body.name ? body.name : '',
                        BranchID: body.branchID ? body.branchID : '',
                        IDEmployee: body.idEmployee ? body.idEmployee : null,
                        AccountNumber: body.accountNumber ? body.accountNumber : '',
                        Surplus: body.surplus ? body.surplus : 0,
                    }).then(data => {
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
    // update_tbl_bank_account_management
    updatetblBankAccountManagement: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.name || body.name === '')
                        update.push({ key: 'Name', value: body.name });
                    if (body.branchName || body.branchName === '')
                        update.push({ key: 'BranchName', value: body.branchName });
                    if (body.idEmployee || body.idEmployee === '') {
                        if (body.idEmployee === '')
                            update.push({ key: 'IDEmployee', value: null });
                        else
                            update.push({ key: 'IDEmployee', value: body.idEmployee });
                    }
                    if (body.accountNumber || body.accountNumber === '')
                        update.push({ key: 'AccountNumber', value: body.accountNumber });
                    if (body.surplus || body.surplus === '') {
                        if (body.surplus === '')
                            update.push({ key: 'Surplus', value: null });
                        else
                            update.push({ key: 'Surplus', value: body.surplus });
                    }
                    database.updateTable(update, mtblBankAccountManagement(db), body.id).then(response => {
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
    // delete_tbl_bank_account_management
    deletetblBankAccountManagement: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblBankAccountManagement(db, listID);
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
    // get_list_tbl_bank_account_management
    getListtblBankAccountManagement: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    // if (body.dataSearch) {
                    //     var data = JSON.parse(body.dataSearch)

                    //     if (data.search) {
                    //         where = [
                    //             { FullName: { [Op.like]: '%' + data.search + '%' } },
                    //             { Address: { [Op.like]: '%' + data.search + '%' } },
                    //             { CMND: { [Op.like]: '%' + data.search + '%' } },
                    //             { EmployeeCode: { [Op.like]: '%' + data.search + '%' } },
                    //         ];
                    //     } else {
                    //         where = [
                    //             { FullName: { [Op.ne]: '%%' } },
                    //         ];
                    //     }
                    //     whereOjb = {
                    //         [Op.and]: [{ [Op.or]: where }],
                    //         [Op.or]: [{ ID: { [Op.ne]: null } }],
                    //     };
                    //     if (data.items) {
                    //         for (var i = 0; i < data.items.length; i++) {
                    //             let userFind = {};
                    //             if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                    //                 userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                    //                 if (data.items[i].conditionFields['name'] == 'And') {
                    //                     whereOjb[Op.and].push(userFind)
                    //                 }
                    //                 if (data.items[i].conditionFields['name'] == 'Or') {
                    //                     whereOjb[Op.or].push(userFind)
                    //                 }
                    //                 if (data.items[i].conditionFields['name'] == 'Not') {
                    //                     whereOjb[Op.not] = userFind
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                    let stt = 1;
                    mtblBankAccountManagement(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        // where: whereOjb,
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                name: element.Name ? element.Name : '',
                                branchName: element.BranchName ? element.BranchName : '',
                                idEmployee: element.IDEmployee ? element.IDEmployee : '',
                                nameEmployee: element.IDEmployee ? element.employee.StaffName : '',
                                accountNumber: element.AccountNumber ? element.AccountNumber : '',
                                surplus: element.Surplus ? element.Surplus : 0,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblBankAccountManagement(db).count()
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
    // get_list_name_tbl_bank_account_management
    getListNametblBankAccountManagement: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblBankAccountManagement(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                name: element.Name ? element.Name : '',
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