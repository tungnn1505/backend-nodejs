const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblKhoanTienKhongXacDinh = require('../tables/financemanage/tblKhoanTienKhongXacDinh')
var database = require('../database');
async function deleteRelationshiptblKhoanTienKhongXacDinh(db, listID) {
    await mtblKhoanTienKhongXacDinh(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblKhoanTienKhongXacDinh,
    //  get_detail_tbl_khoantien_khongxacdinh
    detailtblKhoanTienKhongXacDinh: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblKhoanTienKhongXacDinh(db).findOne({ where: { ID: body.id } }).then(data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                paymentCode: data.PaymentCode ? data.PaymentCode : '',
                                idKhachHang: data.IDKhachHang ? data.IDKhachHang : null,
                                contents: data.Contents ? data.Contents : '',
                                totalCost: data.TotalCost ? data.TotalCost : '',
                                typeCost: data.TypeCost ? data.TypeCost : '',
                                date: data.Date ? data.Date : '',
                                paymentFile: data.PaymentFile ? data.PaymentFile : '',
                                status: data.Status ? data.Status : '',
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
    // add_tbl_khoantien_khongxacdinh
    addtblKhoanTienKhongXacDinh: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblKhoanTienKhongXacDinh(db).create({
                        PaymentCode: body.paymentCode ? body.paymentCode : '',
                        IDKhachHang: body.idKhachHang ? body.idKhachHang : null,
                        Contents: body.contents ? body.contents : '',
                        TotalCost: body.totalCost ? body.totalCost : '',
                        TypeCost: body.typeCost ? body.typeCost : '',
                        Date: body.date ? body.date : '',
                        PaymentFile: body.paymentFile ? body.paymentFile : '',
                        Status: body.status ? body.status : '',
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
    // update_tbl_khoantien_khongxacdinh
    updatetblKhoanTienKhongXacDinh: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.paymentCode || body.paymentCode === '')
                        update.push({ key: 'PaymentCode', value: body.paymentCode });
                    if (body.idKhachHang || body.idKhachHang === '') {
                        if (body.idKhachHang === '')
                            update.push({ key: 'IDKhachHang', value: null });
                        else
                            update.push({ key: 'IDKhachHang', value: body.idKhachHang });
                    }
                    if (body.contents || body.contents === '')
                        update.push({ key: 'contents', value: body.contents });
                    if (body.totalCost || body.totalCost === '') {
                        if (body.totalCost === '')
                            update.push({ key: 'TotalCost', value: null });
                        else
                            update.push({ key: 'TotalCost', value: body.totalCost });
                    }
                    if (body.typeCost || body.typeCost === '')
                        update.push({ key: 'TypeCost', value: body.typeCost });
                    if (body.date || body.date === '') {
                        if (body.date === '')
                            update.push({ key: 'Date', value: null });
                        else
                            update.push({ key: 'Date', value: body.date });
                    }
                    if (body.paymentFile || body.paymentFile === '')
                        update.push({ key: 'PaymentFile', value: body.paymentFile });
                    if (body.status || body.status === '')
                        update.push({ key: 'Status', value: body.status });
                    database.updateTable(update, mtblKhoanTienKhongXacDinh(db), body.id).then(response => {
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
    // delete_tbl_khoantien_khongxacdinh
    deletetblKhoanTienKhongXacDinh: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblKhoanTienKhongXacDinh(db, listID);
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
    // get_list_tbl_khoantien_khongxacdinh
    getListtblKhoanTienKhongXacDinh: (req, res) => {
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
                    mtblKhoanTienKhongXacDinh(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                paymentCode: element.PaymentCode ? element.PaymentCode : '',
                                idKhachHang: element.IDKhachHang ? element.IDKhachHang : null,
                                contents: element.Contents ? element.Contents : '',
                                totalCost: element.TotalCost ? element.TotalCost : '',
                                typeCost: element.TypeCost ? element.TypeCost : '',
                                date: element.Date ? element.Date : '',
                                paymentFile: element.PaymentFile ? element.PaymentFile : '',
                                status: element.Status ? element.Status : '',
                                name: element.Name ? element.Name : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblKhoanTienKhongXacDinh(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_khoantien_khongxacdinh
    getListNametblKhoanTienKhongXacDinh: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblKhoanTienKhongXacDinh(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                paymentCode: element.PaymentCode ? element.PaymentCode : '',
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