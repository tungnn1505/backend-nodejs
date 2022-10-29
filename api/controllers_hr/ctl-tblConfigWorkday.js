const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblConfigWorkday = require('../tables/hrmanage/tblConfigWorkday')
var database = require('../database');
var mtblNghiLe = require('../tables/hrmanage/tblNghiLe')
var mModules = require('../constants/modules');

async function deleteRelationshiptblConfigWorkday(db, listID) {
    await mtblConfigWorkday(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
var sql = require("mssql");
async function convertNumber(number) {
    if (number < 10) {
        return '0' + number
    }
    else
        return number
}
async function getListHoliday(db, year, month, dateFinal) {
    let arrayResult = []
    await mtblNghiLe(db).findAll({
        where: {
            [Op.or]: {
                DateStartHoliday: {
                    [Op.substring]: year + '-' + await convertNumber(month)
                },
                DateEndHoliday: {
                    [Op.substring]: year + '-' + await convertNumber(month)
                },
            },
        }
    }).then(data => {
        data.forEach(element => {
            let dateStart = moment(element.DateStartHoliday).add(7, 'hours').date()
            let dateEnd = moment(element.DateEndHoliday).add(7, 'hours').date()
            let dateEndMonth = moment(element.DateEndHoliday).add(7, 'hours').month()
            dateEndMonth += 1
            if (dateEndMonth != month) {
                dateEnd = dateFinal
            }
            for (var i = dateStart; i <= dateEnd; i++) {
                arrayResult.push(i)
            }
        })
    })
    return arrayResult
}
module.exports = {
    deleteRelationshiptblConfigWorkday,
    // add_tbl_config_workday
    addtblConfigWorkday: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    body.array = JSON.parse(body.array);
                    for (var i = 0; i < body.array.length; i++) {
                        var check = await mtblConfigWorkday(db).findOne({
                            where: {
                                Date: moment(body.array[i]).add(14, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS')
                            }
                        })
                        if (!check)
                            await mtblConfigWorkday(db).create({
                                Date: body.array[i] ? body.array[i] : null,
                            })
                    }
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
    // update_tbl_config_workday
    updatetblConfigWorkday: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = []

                    await mtblConfigWorkday(db).findAll({
                        where: { Date: { [Op.substring]: body.year + '-' + await convertNumber(body.month) } },
                        order: [
                            ['Date', 'DESC']
                        ],
                    }).then(data => {
                        data.forEach(element => {
                            listID.push(element.ID)
                        })
                    })
                    await deleteRelationshiptblConfigWorkday(db, listID);
                    body.arrDate = JSON.parse(body.arrDate);
                    for (var i = 0; i < body.arrDate.length; i++) {
                        await mtblConfigWorkday(db).create({
                            Date: body.arrDate[i] ? body.arrDate[i] : null,
                        })
                    }
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
    // delete_tbl_config_workday
    deletetblConfigWorkday: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = []
                    body.arrDate = JSON.parse(body.arrDate);
                    for (var i = 0; i < body.arrDate.length; i++) {
                        await mtblConfigWorkday(db).findAll({
                            where: { Date: { [Op.substring]: body.arrDate[i].year + '-' + await convertNumber(body.arrDate[i].month) } },
                            order: [
                                ['Date', 'DESC']
                            ],
                        }).then(data => {
                            data.forEach(element => {
                                listID.push(element.ID)
                            })
                        })
                    }
                    await deleteRelationshiptblConfigWorkday(db, listID);
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
    // get_list_tbl_config_workday
    getListtblConfigWorkday: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var config = database.config;
                    var query = `Select DISTINCT (select YEAR(Date) AS Year) as year, (SELECT MONTH(Date) AS Month) as month from tblConfigWorkday group by ID,Date, Note order by year DESC, month DESC`;
                    sql.connect(config, async function (err) {
                        var request = new sql.Request();
                        request.query(query, async function (err, recordsets) {
                            if (err) console.log(err)
                            var array = [];
                            var stt = 1;
                            for (var i = 0; i < recordsets.recordsets[0].length; i++) {
                                var arrayDate = [];
                                var year = recordsets.recordsets[0][i].year
                                var month = recordsets.recordsets[0][i].month
                                await mtblConfigWorkday(db).findAll({
                                    where: { Date: { [Op.substring]: year + '-' + await convertNumber(month) } },
                                    order: [
                                        ['Date', 'DESC']
                                    ],
                                }).then(data => {
                                    data.forEach(element => {
                                        arrayDate.push(element.Date)
                                    });
                                })
                                array.push({
                                    stt: stt,
                                    year: year,
                                    month: month,
                                    arrayDate: arrayDate,
                                    count: arrayDate.length,
                                })
                                stt += 1;
                            }
                            var result = {
                                stt: stt,
                                status: Constant.STATUS.SUCCESS,
                                message: '',
                                array: array,
                                count: recordsets.recordsets[0].length,
                            }
                            res.json(result)
                        })
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
}