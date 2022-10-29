const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDMTaiKhoanKeToan = require('../tables/tblDMTaiKhoanKeToan')
var database = require('../database');
async function deleteRelationshiptblDMTaiKhoanKeToan(db, listID) {
    await mtblDMTaiKhoanKeToan(db).destroy({
        where: {
            IDLaborBook: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblDMTaiKhoanKeToan,
    // add_tbl_dmtaikhoan_ketoan
    addtblDMTaiKhoanKeToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMTaiKhoanKeToan(db).create({
                        AccountingCodeI: body.accountingCodeI ? body.accountingCodeI : '',
                        AccountingCodeII: body.accountingCodeII ? body.accountingCodeII : '',
                        AccountingName: body.accountingName ? body.accountingName : '',
                        IDLoaiTaiKhoanKeToan: body.idLoaiTaiKhoanKeToan ? body.idLoaiTaiKhoanKeToan : '',
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
    // update_tbl_dmtaikhoan_ketoan
    updatetblDMTaiKhoanKeToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.accountingCodeI || body.accountingCodeI === '')
                        update.push({ key: 'AccountingCodeI', value: body.accountingCodeI });
                    if (body.accountingCodeII || body.accountingCodeII === '')
                        update.push({ key: 'AccountingCodeII', value: body.accountingCodeII });
                    if (body.accountingName || body.accountingName === '')
                        update.push({ key: 'AccountingName', value: body.accountingName });
                    if (body.idLoaiTaiKhoanKeToan || body.idLoaiTaiKhoanKeToan === '') {
                        if (body.idLoaiTaiKhoanKeToan === '')
                            update.push({ key: 'IDLoaiTaiKhoanKeToan', value: null });
                        else
                            update.push({ key: 'IDLoaiTaiKhoanKeToan', value: body.idLoaiTaiKhoanKeToan });
                    }
                    database.updateTable(update, mtblDMTaiKhoanKeToan(db), body.id).then(response => {
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
    // delete_tbl_dmtaikhoan_ketoan
    deletetblDMTaiKhoanKeToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            let body = req.body;
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDMTaiKhoanKeToan(db, listID);
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
    // get_list_tbl_dmtaikhoan_ketoan
    getListtblDMTaiKhoanKeToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var data = JSON.parse(body.dataSearch)

                    if (data.search) {
                        where = [
                            { FullName: { [Op.like]: '%' + data.search + '%' } },
                            { Address: { [Op.like]: '%' + data.search + '%' } },
                            { CMND: { [Op.like]: '%' + data.search + '%' } },
                            { EmployeeCode: { [Op.like]: '%' + data.search + '%' } },
                        ];
                    } else {
                        where = [
                            { FullName: { [Op.ne]: '%%' } },
                        ];
                    }
                    let whereOjb = { [Op.or]: where };
                    if (data.items) {
                        for (var i = 0; i < data.items.length; i++) {
                            let userFind = {};
                            if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                                userFind['accountingName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                    mtblDMTaiKhoanKeToan(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                    }).then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                accountingCodeI: element.AccountingCodeI ? element.AccountingCodeI : '',
                                accountingCodeII: element.AccountingCodeII ? element.AccountingCodeII : '',
                                accountingName: element.AccountingName ? element.AccountingName : '',
                                idLoaiTaiKhoanKeToan: element.IDLoaiTaiKhoanKeToan ? element.IDLoaiTaiKhoanKeToan : '',
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
    // get_list_name_tbl_dmtaikhoan_ketoan
    getListNametblDMTaiKhoanKeToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMTaiKhoanKeToan(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                accountingName: element.AccountingName ? element.AccountingName : '',
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