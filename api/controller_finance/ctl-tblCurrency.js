const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblCurrency = require('../tables/financemanage/tblCurrency')
var mtblRate = require('../tables/financemanage/tblRate')
var database = require('../database');
async function deleteRelationshiptblCurrency(db, listID) {
    await mtblCurrency(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblCurrency,
    //  get_detail_tbl_currency
    detailtblCurrency: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let stt = 1;
                    let tblRate = mtblRate(db);
                    tblRate.belongsTo(mtblCurrency(db), { foreignKey: 'IDCurrency', sourceKey: 'IDCurrency', as: 'currency' })
                    var array = [];
                    await tblRate.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: { IDCurrency: body.id },
                        order: [
                            ['Date', 'DESC']
                        ],
                        include: [
                            {
                                model: mtblCurrency(db),
                                required: false,
                                as: 'currency'
                            },
                        ],
                    }).then(async data => {
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                date: element.Date ? moment(element.Date).format('DD/MM/YYYY') : '',
                                exchangeRate: element.ExchangeRate ? element.ExchangeRate : '',
                                fullNameCurrency: element.currency.FullName ? element.currency.FullName : '',
                                shortNameCurrency: element.currency.ShortName ? element.currency.ShortName : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                    })
                    var count = await mtblRate(db).count({ where: { IDCurrency: body.id }, })
                    var result = {
                        array: array,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                        all: count,
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
    // add_tbl_currency
    addtblCurrency: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let check = await mtblCurrency(db).findOne({
                        where: {
                            [Op.or]: [{
                                ShortName: body.shortName,
                            }]
                        }
                    })
                    if (check) {
                        var result = {
                            status: Constant.STATUS.FAIL,
                            message: 'Trùng tên tiền tệ. Vui lòng kiểm tra lại !',
                        }
                        res.json(result);
                        return
                    }
                    mtblCurrency(db).create({
                        ShortName: body.shortName ? body.shortName : '',
                        FullName: body.fullName ? body.fullName : '',
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
    // update_tbl_currency
    updatetblCurrency: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.shortName || body.shortName === '')
                        update.push({ key: 'ShortName', value: body.shortName });
                    if (body.fullName || body.fullName === '')
                        update.push({ key: 'FullName', value: body.fullName });
                    database.updateTable(update, mtblCurrency(db), body.id).then(response => {
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
    // delete_tbl_currency
    deletetblCurrency: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblCurrency(db, listID);
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
    // get_list_tbl_currency
    getListtblCurrency: (req, res) => {
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
                                { ShortName: { [Op.like]: '%' + data.search + '%' } },
                                { FullName: { [Op.like]: '%' + data.search + '%' } },
                            ];
                            whereObj[Op.or] = where
                        } else {
                            where = [
                                { ID: { [Op.ne]: null } },
                            ];
                            whereObj[Op.or] = where
                        }
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'TÊN VIẾT TẮT') {
                                    userFind['ShortName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                                if (data.items[i].fields['name'] === 'TÊN ĐẦY ĐỦ') {
                                    userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                    let now = moment().format('DD-MM-YYYY');
                    let searchNow = moment().format('YYYY-MM-DD');
                    mtblCurrency(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereObj,
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            let rateNow = 0;
                            await mtblRate(db).findOne({
                                where: {
                                    Date: { [Op.substring]: searchNow },
                                    IDCurrency: data[i].ID
                                }
                            }).then(Rate => {
                                if (Rate)
                                    rateNow = Rate.ExchangeRate ? Rate.ExchangeRate : 1
                            })
                            var obj = {
                                stt: stt,
                                id: Number(data[[i]].ID),
                                date: now,
                                exchangeRate: rateNow,
                                shortName: data[[i]].ShortName ? data[[i]].ShortName : '',
                                fullName: data[[i]].FullName ? data[[i]].FullName : '',
                            }
                            array.push(obj);
                            stt += 1;
                        }
                        var count = await mtblCurrency(db).count({ where: whereObj, })
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
    // get_list_name_tbl_currency
    getListNametblCurrency: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblCurrency(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                fullName: element.FullName ? element.FullName : '',
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
    // get_list_tbl_currency_from_date
    getListtblCurrencyFromDate: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereObj = {};
                    let stt = 1;
                    console.log(body);
                    let searchNow = moment(body.date).format('YYYY-MM-DD');
                    mtblCurrency(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereObj,
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            let rateNow = 0;
                            await mtblRate(db).findOne({
                                where: {
                                    Date: { [Op.substring]: searchNow },
                                    IDCurrency: data[i].ID
                                }
                            }).then(Rate => {
                                if (Rate)
                                    rateNow = Rate.ExchangeRate ? Rate.ExchangeRate : 1
                            })
                            var obj = {
                                stt: stt,
                                id: Number(data[[i]].ID),
                                date: searchNow,
                                exchangeRate: rateNow,
                                shortName: data[[i]].ShortName ? data[[i]].ShortName : '',
                                fullName: data[[i]].FullName ? data[[i]].FullName : '',
                            }
                            array.push(obj);
                            stt += 1;
                        }
                        var count = await mtblCurrency(db).count({ where: whereObj, })
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
}