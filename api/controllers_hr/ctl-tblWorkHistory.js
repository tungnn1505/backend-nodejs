const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblWorkHistory = require('../tables/hrmanage/tblWorkHistory')
var database = require('../database');
async function deleteRelationshiptblWorkHistory(db, listID) {
    await mtblWorkHistory(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblWorkHistory,
    //  get_detail_tbl_work_history
    detailtblWorkHistory: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblWorkHistory(db).findOne({
                        where: { ID: body.id },
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                dateStart: data.DateStart ? data.DateStart : '',
                                dateEnd: data.DateEnd ? data.DateEnd : '',
                                status: data.Status ? data.Status : '',
                                describe: data.Describe ? data.Describe : '',
                                workPlace: data.WorkPlace ? data.WorkPlace : '',
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
    // add_tbl_work_history
    addtblWorkHistory: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblWorkHistory(db).create({
                        DateStart: body.dateStart ? body.dateStart : null,
                        DateEnd: body.dateEnd ? body.dateEnd : null,
                        Status: body.status ? body.status : null,
                        Describe: body.describe ? body.describe : null,
                        IDNhanVien: body.idNhanVien ? body.idNhanVien : null,
                        WorkPlace: body.workPlace ? body.workPlace : '',
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
    // update_tbl_work_history
    updatetblWorkHistory: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.dateEnd || body.dateEnd === '') {
                        if (body.dateEnd === '')
                            update.push({ key: 'DateEnd', value: null });
                        else
                            update.push({ key: 'DateEnd', value: body.dateEnd });
                    }
                    if (body.dateStart || body.dateStart === '') {
                        if (body.dateStart === '')
                            update.push({ key: 'DateStart', value: null });
                        else
                            update.push({ key: 'DateStart', value: body.dateStart });
                    }
                    if (body.idNhanVien || body.idNhanVien === '') {
                        if (body.idNhanVien === '')
                            update.push({ key: 'IDNhanVien', value: null });
                        else
                            update.push({ key: 'IDNhanVien', value: body.idNhanVien });
                    }
                    if (body.workPlace || body.workPlace === '')
                        update.push({ key: 'WorkPlace', value: body.workPlace });
                    if (body.status || body.status === '')
                        update.push({ key: 'Status', value: body.status });
                    if (body.describe || body.describe === '')
                        update.push({ key: 'Describe', value: body.describe });
                    database.updateTable(update, mtblWorkHistory(db), body.id).then(response => {
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
    // delete_tbl_work_history
    deletetblWorkHistory: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblWorkHistory(db, listID);
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
    // get_list_tbl_work_history
    getListtblWorkHistory: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    if (body.dataSearch) {
                        // var data = JSON.parse(body.dataSearch)

                        // if (data.search) {
                        //     where = [
                        //         { FullName: { [Op.like]: '%' + data.search + '%' } },
                        //         { Address: { [Op.like]: '%' + data.search + '%' } },
                        //         { CMND: { [Op.like]: '%' + data.search + '%' } },
                        //         { EmployeeCode: { [Op.like]: '%' + data.search + '%' } },
                        //     ];
                        // } else {
                        //     where = [
                        //         { FullName: { [Op.ne]: '%%' } },
                        //     ];
                        // }
                        // whereOjb = { [Op.or]: where };
                        // if (data.items) {
                        //     for (var i = 0; i < data.items.length; i++) {
                        //         let userFind = {};
                        //         if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                        //             userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                        //             if (data.items[i].conditionFields['name'] == 'And') {
                        //                 whereOjb[Op.and] = userFind
                        //             }
                        //             if (data.items[i].conditionFields['name'] == 'Or') {
                        //                 whereOjb[Op.or] = userFind
                        //             }
                        //             if (data.items[i].conditionFields['name'] == 'Not') {
                        //                 whereOjb[Op.not] = userFind
                        //             }
                        //         }
                        //     }
                        // }
                    }
                    let stt = 1;
                    if (body.idNhanVien) {
                        mtblWorkHistory(db).findAll({
                            offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                            limit: Number(body.itemPerPage),
                            where: { IDNhanVien: body.idNhanVien },
                            order: [
                                ['ID', 'DESC']
                            ],
                        }).then(async data => {
                            var array = [];
                            data.forEach(element => {
                                var obj = {
                                    stt: stt,
                                    id: Number(element.ID),
                                    dateStart: element.DateStart ? moment(element.DateStart).format('DD/MM/YYYY') : '',
                                    dateEnd: element.DateEnd ? moment(element.DateEnd).format('DD/MM/YYYY') : '',
                                    status: element.Status ? element.Status : '',
                                    describe: element.Describe ? element.Describe : '',
                                    workPlace: element.WorkPlace ? element.WorkPlace : '',
                                }
                                array.push(obj);
                                stt += 1;
                            });
                            var count = await mtblWorkHistory(db).count({ where: whereOjb, })
                            var result = {
                                array: array,
                                status: Constant.STATUS.SUCCESS,
                                message: Constant.MESSAGE.ACTION_SUCCESS,
                                all: count
                            }
                            res.json(result);
                        })
                    } else {
                        mtblWorkHistory(db).findAll({
                            offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                            limit: Number(body.itemPerPage),
                            where: whereOjb,
                        }).then(async data => {
                            var array = [];
                            data.forEach(element => {
                                var obj = {
                                    stt: stt,
                                    id: Number(element.ID),
                                    dateStart: element.DateStart ? moment(element.DateStart).format('DD/MM/YYYY') : '',
                                    dateEnd: element.DateEnd ? moment(element.DateEnd).format('DD/MM/YYYY') : '',
                                    status: element.Status ? element.Status : '',
                                    describe: element.Describe ? element.Describe : '',
                                }
                                array.push(obj);
                                stt += 1;
                            });
                            var count = await mtblWorkHistory(db).count({ where: whereOjb, })
                            var result = {
                                array: array,
                                status: Constant.STATUS.SUCCESS,
                                message: Constant.MESSAGE.ACTION_SUCCESS,
                                all: count
                            }
                            res.json(result);
                        })
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
}