const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDMLoaiTaiKhoanKeToan = require('../tables/financemanage/tblDMLoaiTaiKhoanKeToan')
var mtblDMTaiKhoanKeToan = require('../tables/financemanage/tblDMLoaiTaiKhoanKeToan')
var database = require('../database');
async function deleteRelationshiptblDMLoaiTaiKhoanKeToan(db, listID) {
    await mtblDMTaiKhoanKeToan(db).update({
        IDLoaiTaiKhoanKeToan: null
    }, {
        where: {
            IDLoaiTaiKhoanKeToan: { [Op.in]: listID }
        }
    })
    await mtblDMLoaiTaiKhoanKeToan(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblDMLoaiTaiKhoanKeToan,
    // add_tbl_dm_loaitaikhoan_ketoan
    addtblDMLoaiTaiKhoanKeToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let check = await mtblDMLoaiTaiKhoanKeToan(db).findOne({
                        where: {
                            TypeName: body.typeName
                        }
                    })
                    if (check) {
                        var result = {
                            status: Constant.STATUS.FAIL,
                            message: "Tên tài khoản kế toán đã tồn tại. Vui lòng kiểm tra lại !",
                        }
                        res.json(result);
                        return
                    }
                    mtblDMLoaiTaiKhoanKeToan(db).create({
                        TypeName: body.typeName ? body.typeName : '',
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
    // update_tbl_dm_loaitaikhoan_ketoan
    updatetblDMLoaiTaiKhoanKeToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    console.log(body);
                    if (body.typeName || body.typeName === '')
                        update.push({ key: 'TypeName', value: body.typeName });
                    database.updateTable(update, mtblDMLoaiTaiKhoanKeToan(db), body.id).then(response => {
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
    // delete_tbl_dm_loaitaikhoan_ketoan
    deletetblDMLoaiTaiKhoanKeToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDMLoaiTaiKhoanKeToan(db, listID);
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
    // get_list_tbl_dm_loaitaikhoan_ketoan
    getListtblDMLoaiTaiKhoanKeToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereObj = {};
                    let arraySearchAnd = [];
                    let arraySearchOr = [];
                    let arraySearchNot = [];
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            where = [
                                { TypeName: { [Op.like]: '%' + data.search + '%' } },
                            ];
                            whereObj[Op.and] = where
                        } else {
                            where = [
                                { TypeName: { [Op.ne]: '%%' } },
                            ];
                            whereObj[Op.and] = where
                        }
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'TÊN LOẠI TÀI KHOẢN') {
                                    userFind['TypeName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                            }
                            if (arraySearchOr.length > 0)
                                whereObj[Op.or] = arraySearchOr
                            if (arraySearchAnd.length > 0)
                                whereObj[Op.and] = arraySearchAnd
                            if (arraySearchNot.length > 0)
                                whereObj[Op.not] = arraySearchNot
                        }
                    }
                    let stt = 1;
                    mtblDMLoaiTaiKhoanKeToan(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereObj,
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                typeName: element.TypeName ? element.TypeName : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblDMLoaiTaiKhoanKeToan(db).count({ where: whereObj, })
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
    // get_list_name_tbl_dm_loaitaikhoan_ketoan
    getListNametblDMLoaiTaiKhoanKeToan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMLoaiTaiKhoanKeToan(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                typeName: element.TypeName ? element.TypeName : '',
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