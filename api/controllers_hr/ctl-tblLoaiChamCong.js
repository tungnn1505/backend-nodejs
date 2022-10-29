const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblLoaiChamCong = require('../tables/hrmanage/tblLoaiChamCong')
var mtblNghiLe = require('../tables/hrmanage/tblNghiLe')
var database = require('../database');
var mtblNghiPhep = require('../tables/hrmanage/tblNghiPhep')

async function deleteRelationshiptblLoaiChamCong(db, listID) {
    await mtblNghiPhep(db).update({
        IDLoaiChamCong: null,
    }, {
        where: {
            IDLoaiChamCong: {
                [Op.in]: listID
            }
        }
    })
    await mtblNghiLe(db).update({
        IDLoaiChamCong: null,
    }, {
        where: {
            IDLoaiChamCong: {
                [Op.in]: listID
            }
        }
    })
    await mtblLoaiChamCong(db).destroy({
        // tblChamCong
        // tblNghiPhep
        // tblNghiLe
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}
module.exports = {
    deleteRelationshiptblLoaiChamCong,
    //  get_detail_tbl_loaichamcong
    detailtblLoaiChamCong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblLoaiChamCong(db).findOne({ where: { ID: body.id } }).then(data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                name: data.Name,
                                code: data.Code,
                                decription: data.Description,
                                type: data.Type,
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
    // add_tbl_loaichamcong
    addtblLoaiChamCong: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let check = await mtblLoaiChamCong(db).findOne({
                        where: [{ Code: body.code }, { Type: body.type }]
                    })
                    if (!check)
                        mtblLoaiChamCong(db).create({
                            Code: body.code ? body.code : '',
                            Name: body.name ? body.name : '',
                            Description: body.description ? body.description : '',
                            Type: body.type ? body.type : '',
                            Compensation: body.isCompensation ? body.isCompensation : false,
                            SalaryIsAllowed: body.isSalaryIsAllowed ? body.isSalaryIsAllowed : false,
                        }).then(data => {
                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: Constant.MESSAGE.ACTION_SUCCESS,
                            }
                            res.json(result);
                        })
                    else {
                        var result = {
                            status: Constant.STATUS.FAIL,
                            message: "Mã này đã tồn tại. Vui lòng kiểm tra lại",
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
    // update_tbl_loaichamcong
    updatetblLoaiChamCong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.code || body.code === '')
                        update.push({ key: 'Code', value: body.code });
                    if (body.name || body.name === '')
                        update.push({ key: 'Name', value: body.name });
                    if (body.description || body.description === '')
                        update.push({ key: 'Description', value: body.description });
                    if (body.type || body.type === '')
                        update.push({ key: 'Type', value: body.type });
                    if (body.isCompensation || body.isCompensation === '')
                        update.push({ key: 'Compensation', value: body.isCompensation });
                    if (body.isSalaryIsAllowed || body.isSalaryIsAllowed === '')
                        update.push({ key: 'SalaryIsAllowed', value: body.isSalaryIsAllowed });
                    database.updateTable(update, mtblLoaiChamCong(db), body.id).then(response => {
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
    // delete_tbl_loaichamcong
    deletetblLoaiChamCong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblLoaiChamCong(db, listID);
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
    // get_list_tbl_loaichamcong
    getListtblLoaiChamCong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            where = [{
                                    Code: {
                                        [Op.like]: '%' + data.search + '%'
                                    }
                                },
                                {
                                    Name: {
                                        [Op.like]: '%' + data.search + '%'
                                    }
                                },

                            ];
                        } else {
                            where = [{
                                    Name: {
                                        [Op.ne]: '%%'
                                    }
                                },

                            ];
                        }
                        whereOjb = {
                            [Op.and]: [{
                                [Op.or]: where
                            }, {
                                [Op.or]: { Type: body.type }
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
                                if (data.items[i].fields['name'] === 'TÊN LOẠI' || data.items[i].fields['name'] === 'TÊN LOẠI NGHỈ LỄ') {
                                    userFind['Name'] = {
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
                                if (data.items[i].fields['name'] === 'MÃ LOẠI' || data.items[i].fields['name'] === 'MÃ LOẠI NGHỈ LỄ') {
                                    userFind['Code'] = {
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
                            }
                        }
                    }
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        // if (data.search) {
                        //     where = [
                        //         { Name: { [Op.like]: '%' + data.search + '%' } },
                        //         { Code: { [Op.like]: '%' + data.search + '%' } },
                        //         { Decription: { [Op.like]: '%' + data.search + '%' } },
                        //     ];
                        // } else {
                        //     where = [
                        //         { Name: { [Op.ne]: '%%' } },
                        //     ];
                        // }
                        // let whereOjb = { [Op.or]: where };
                        // if (data.items) {
                        //     for (var i = 0; i < data.items.length; i++) {
                        //         let userFind = {};
                        //         if (data.items[i].fields['name'] === 'TÊN LOẠI CHẤM CÔNG') {
                        //             userFind['Name'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                        //             if (data.items[i].conditionFields['name'] == 'And') {
                        //                 whereOjb[Op.and] = userFind
                        //             }
                        //             if (data.items[i].conditionFields['name'] == 'Or') {
                        //                 whereOjb[Op.or] = userFind
                        //             }
                        //             if (data.items[i].conditionFields['name'] == 'Not') {
                        //                 whereOjb[Op.not] = rFind                        //             }
                        //         }
                        //     }
                        // }
                    }
                    let stt = 1;
                    mtblLoaiChamCong(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                name: element.Name ? element.Name : '',
                                code: element.Code ? element.Code : '',
                                description: element.Description ? element.Description : '',
                                type: element.Type ? element.Type : '',
                                isSalaryIsAllowed: element.SalaryIsAllowed ? element.SalaryIsAllowed : false,
                                isCompensation: element.Compensation ? element.Compensation : false,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblLoaiChamCong(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_loaichamcong
    getListNametblLoaiChamCong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblLoaiChamCong(db).findAll({ where: { Type: body.type } }).then(data => {
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