const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblMinWageConfig = require('../tables/hrmanage/tblMinWageConfig')
var database = require('../database');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
async function deleteRelationshiptblMinWageConfig(db, listID) {
    await mtblMinWageConfig(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblMinWageConfig,
    //  get_detail_tbl_min_wage_config
    detailtblMinWageConfig: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblMinWageConfig(db).findOne({ where: { ID: body.id } }).then(data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                name: data.Name,
                                code: data.Code,
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
    // add_tbl_min_wage_config
    addtblMinWageConfig: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let startDate = null;
                    if (body.startDate) {
                        body.startDate = body.startDate + '-01'
                        startDate = moment(body.startDate).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS')
                    }
                    mtblMinWageConfig(db).create({
                        MinimumWage: body.minimumWage ? body.minimumWage : null,
                        StartDate: startDate,
                        EndDate: body.endDate ? body.endDate : null,
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
    // update_tbl_min_wage_config
    updatetblMinWageConfig: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.minimumWage || body.minimumWage === '') {
                        if (body.minimumWage === '')
                            update.push({ key: 'MinimumWage', value: null });
                        else
                            update.push({ key: 'MinimumWage', value: body.minimumWage });
                    }
                    if (body.startDate || body.startDate === '') {
                        if (body.startDate === '')
                            update.push({ key: 'StartDate', value: null });
                        else {
                            body.startDate = body.startDate + '-01'
                            let startDate = moment(body.startDate).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS')
                            update.push({ key: 'StartDate', value: startDate });
                        }
                    }
                    if (body.endDate || body.endDate === '') {

                        if (body.endDate === '')
                            update.push({ key: 'EndDate', value: null });
                        else
                            update.push({ key: 'EndDate', value: body.endDate });
                    }
                    database.updateTable(update, mtblMinWageConfig(db), body.id).then(response => {
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
    // delete_tbl_min_wage_config
    deletetblMinWageConfig: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblMinWageConfig(db, listID);
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
    // get_list_tbl_min_wage_config
    getListtblMinWageConfig: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let arraySearchAnd = [];
                    let arraySearchOr = [];
                    let arraySearchNot = [];
                    var whereObj = {};
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            where = [
                                { StartDate: { [Op.like]: '%' + data.search + '%' } },
                            ];
                        } else {
                            where = [
                                { ID: { [Op.ne]: null } },
                            ];
                        }
                        whereObj[Op.and] = where
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'NGÀY ÁP DỤNG') {
                                    let date = moment(data.items[i]['searchFields']).add(14, 'hours').format('YYYY-MM-DD')
                                    userFind['StartDate'] = {
                                        [Op.substring]: '%' + date + '%'
                                    }
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

                        }
                    }
                    // if (userObj.length > 0)
                    //     arraySearchOr.push(userObj)
                    if (arraySearchOr.length > 0)
                        whereObj[Op.or] = arraySearchOr
                    if (arraySearchAnd.length > 0)
                        whereObj[Op.and] = arraySearchAnd
                    if (arraySearchNot.length > 0)
                        whereObj[Op.not] = arraySearchNot
                    let stt = 1;
                    mtblMinWageConfig(db).findAll({
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
                                minimumWage: element.MinimumWage ? element.MinimumWage : null,
                                startDate: element.StartDate ? moment(element.StartDate).format('MM/YYYY') : null,
                                endDate: element.EndDate ? element.EndDate : null,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblMinWageConfig(db).count({ where: whereObj, })
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
    // get_list_name_tbl_min_wage_config
    getListNametblMinWageConfig: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblMinWageConfig(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                minimumWage: element.MinimumWage ? element.MinimumWage : '',
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
    //  calculate_salary_increase
    calculateSalaryIncrease: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let staff = await mtblDMNhanvien(db).findOne({
                        order: [
                            ['ID', 'DESC']
                        ],
                        where: { ID: body.staffID }
                    })
                    if (staff) {
                        var result = {
                            wage: Number((staff.ProductivityWages ? staff.ProductivityWages : 0)) + Number(body.increase),
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                        }
                        res.json(result);
                    } else {
                        res.json(Result.NO_DATA_RESULT)

                    }
                } catch (error) {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
}