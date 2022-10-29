const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Sequelize = require('sequelize');

const Result = require('../constants/result');
var moment = require('moment');
var mtblReceiptsPayment = require('../tables/financemanage/tblReceiptsPayment')
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var fs = require('fs');
var xl = require('excel4node');
var database = require('../database');
var mtblCurrency = require('../tables/financemanage/tblCurrency')
var mtblRate = require('../tables/financemanage/tblRate')
var mtblVayTamUng = require('../tables/financemanage/tblVayTamUng')
var mtblPaymentRInvoice = require('../tables/financemanage/tblPaymentRInvoice')

data = [{
    id: 1,
    createdDate: '01/05/2020',
    refNumber: 'REF0001',
    invoiceNumber: 'INV0001',
    arrayMoney: [{
        total: '1000000',
        typeMoney: 'VND',
    },
    {
        total: '100',
        typeMoney: 'USD',
    },

    ],
    statusName: 'Đã thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 1',
    request: '',
    departmentName: 'Sáng chế',
    departmentID: 10025,
},
{
    id: 2,
    createdDate: '02/05/2021',
    refNumber: 'REF0002',
    invoiceNumber: 'INV0002',
    arrayMoney: [{
        total: '1100000',
        typeMoney: 'VND',
    },
    {
        total: '10',
        typeMoney: 'USD',
    },
    ],
    statusName: 'Đã thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 2',
    request: 'Yêu cầu xóa',
    departmentName: 'KẾ TOÁN',
    departmentID: 10026,
},
{
    id: 3,
    createdDate: '03/05/2021',
    refNumber: 'REF0003',
    invoiceNumber: 'INV0003',
    arrayMoney: [{
        total: '1200000',
        typeMoney: 'VND',
    },

    ],
    statusName: 'Đã thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 3',
    request: 'Yêu cầu sửa',
    departmentName: 'Sáng chế',
    departmentID: 10025,
},
{
    id: 4,
    createdDate: '04/05/2021',
    refNumber: 'REF0004',
    invoiceNumber: 'INV0004',
    arrayMoney: [{
        total: '1300000',
        typeMoney: 'VND',
    },
    {
        total: '100',
        typeMoney: 'USD',
    },

    ],
    statusName: 'Đã thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 4',
    request: 'Yêu cầu sửa',
    departmentName: 'HÀNH CHÍNH NHÂN SỰ',
    departmentID: 10027,

},
{
    id: 5,
    createdDate: '05/05/2020',
    refNumber: 'REF0005',
    invoiceNumber: 'INV0005',
    arrayMoney: [{
        total: '1400000',
        typeMoney: 'VND',
    },

    ],
    statusName: 'Đã thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 5',
    request: '',
    departmentName: 'Sáng chế',
    departmentID: 10025,
},
{
    id: 6,
    createdDate: '06/05/2020',
    refNumber: 'REF0006',
    invoiceNumber: 'INV0006',
    arrayMoney: [{
        total: '1500000',
        typeMoney: 'VND',
    },
    {
        total: '100',
        typeMoney: 'USD',
    },
    ],
    statusName: 'Đã thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 6',
    request: 'Yêu cầu xóa',
    departmentName: 'Sáng chế',
    departmentID: 10025,
},
{
    id: 7,
    createdDate: '07/05/2021',
    refNumber: 'REF0007',
    invoiceNumber: 'INV0007',
    arrayMoney: [{
        total: '1600000',
        typeMoney: 'VND',
    },

    ],
    statusName: 'Chờ thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 7',
    request: 'Yêu cầu xóa',
    departmentName: 'KẾ TOÁN',
    departmentID: 10026,
},
{
    id: 8,
    createdDate: '08/05/2020',
    refNumber: 'REF0008',
    invoiceNumber: 'INV0008',
    arrayMoney: [{
        total: '100',
        typeMoney: 'USD',
    },

    ],
    statusName: 'Chờ thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 8',
    request: 'Yêu cầu sửa',
    departmentName: 'Sáng chế',
    departmentID: 10025,
},
{
    id: 9,
    createdDate: '09/05/2020',
    refNumber: 'REF0009',
    invoiceNumber: 'INV0009',
    arrayMoney: [{
        total: '2000000',
        typeMoney: 'VND',
    },
    {
        total: '130',
        typeMoney: 'USD',
    },

    ],
    statusName: 'Chờ thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 9',
    request: 'Yêu cầu sửa',
    departmentName: 'Ban NH3',
    departmentID: 10035,
},
{
    id: 10,
    createdDate: '10/05/2020',
    refNumber: 'REF0010',
    invoiceNumber: 'INV0010',
    arrayMoney: [{
        total: '123',
        typeMoney: 'VND',
    },],
    statusName: 'Chờ thanh toán',
    idCustomer: 1,
    customerName: 'Công ty tnhh An Phú',
    content: 'Demo 10',
    request: 'Yêu cầu sửa',
    departmentName: 'Ban NH3',
    departmentID: 10035,
},
];
function convertNumber(number) {
    if (number < 10) {
        return '0' + number
    } else
        return number
}
function checkDuplicate(array, elm) {
    var check = false;
    array.forEach(item => {
        if (item === elm) check = true;
    })
    return check;
}
async function calculateTheTotalAmountOfEachCurrency(array) {
    let arrayResult = []
    let arrayCheck = []
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].arrayMoney.length; j++) {
            if (!checkDuplicate(arrayCheck, array[i].arrayMoney[j].typeMoney)) {
                arrayCheck.push(array[i].arrayMoney[j].typeMoney)
                arrayResult.push({
                    total: Number(array[i].arrayMoney[j].total),
                    type: array[i].arrayMoney[j].typeMoney,
                    date: array[i].createdDate,
                })
            } else {
                arrayResult.forEach(element => {
                    if (element.type == array[i].arrayMoney[j].typeMoney) {
                        element.total += Number(array[i].arrayMoney[j].total)
                    }
                })
            }
        }
    }
    return arrayResult
}
async function calculateMoneyFollowVND(db, typeMoney, total, date) {
    let exchangeRate = 1;
    let result = 0;
    let currency = await mtblCurrency(db).findOne({
        where: { ShortName: typeMoney }
    })
    if (currency)
        await mtblRate(db).findOne({
            where: {
                Date: { [Op.substring]: date.slice(6, 10) + '-' + date.slice(3, 5) + '-' + date.slice(0, 2) },
                IDCurrency: currency.ID
            },
            order: [
                ['ID', 'DESC']
            ],
        }).then(async Rate => {
            if (Rate)
                exchangeRate = Rate.ExchangeRate
            else {
                let searchNow = moment().format('YYYY-MM-DD');
                await mtblRate(db).findOne({
                    where: {
                        Date: { [Op.substring]: searchNow },
                        IDCurrency: currency.ID
                    },
                    order: [
                        ['ID', 'DESC']
                    ],
                }).then(Rate => {
                    if (Rate)
                        exchangeRate = Rate.ExchangeRate
                    else {

                    }
                })
            }
        })
    result = ((exchangeRate ? exchangeRate : 1) * total)
    return result
}
async function getDataInvoiceFromDepartmentFollowYear(db, departmentID, year) {
    let totalMoneyVND = 0
    try {
        let dataResult = []
        for (let d = 0; d < data.length; d++) {
            let checkMonth = data[d].createdDate.slice(3, 10)
            if (data[d].departmentID == departmentID && checkMonth == year) {
                dataResult.push(data[d])
            }
        }
        let totalMoney = await calculateTheTotalAmountOfEachCurrency(dataResult)
        for (let a = 0; a < totalMoney.length; a++) {
            totalMoneyVND += await calculateMoneyFollowVND(db, totalMoney[a].type, totalMoney[a].total, totalMoney[a].date)
        }
    } catch (error) {
        console.log(error);
    }

    return totalMoneyVND
}
async function getCurrencyFromMonth(db, month) {
    let result = 0;
    let count = 0;
    await mtblRate(db).findAll({
        where: {
            Date: { [Op.substring]: month },
            IDCurrency: 11, // tỉ giá tiền USD
        }
    }).then(data => {
        data.forEach(item => {
            result += Number(item.ExchangeRate)
            count += 1
        })
    })
    return count ? (result / count) : 0
}

async function getListTypeMoneyFollowYear(db, year) {
    let arrayResult = []
    await mtblReceiptsPayment(db).findAll({
        where: [
            { type: 'receipt' },
            {
                [Op.or]: [
                    { Date: { [Op.substring]: year } },
                    { Date: { [Op.substring]: (Number(year) - 1) } },
                ]
            }
        ]
    }).then(data => {
        data.forEach(item => {
            if (!checkDuplicate(arrayResult, item.IDCurrency))
                arrayResult.push(item.IDCurrency)
        })
    })
    return arrayResult
}

async function getMoneyRevenueFollowMonthAndTypeMoney(db, month, idTypeMoney) {
    let result = 0;
    let listID = []
    await mtblPaymentRInvoice(db).findAll().then(async data => {
        for (let d = 0; d < data.length; d++) {
            if (data[d].IDPayment)
                listID.push(data[d].IDPayment)
        }
    })
    await mtblReceiptsPayment(db).findAll({
        where: {
            IDCurrency: idTypeMoney,
            type: 'receipt',
            Date: { [Op.substring]: month },
            ID: { [Op.in]: listID },
        }
    }).then(data => {
        data.forEach(item => {
            result += item.Amount
        })
    })
    return result
}

async function getAverageRateFollowYear(db, year, idCurrency) {
    let result = 0;
    await mtblRate(db).findAll({
        where: {
            Date: { [Op.substring]: year },
            IDCurrency: idCurrency,
        }
    }).then(data => {
        data.forEach(element => {
            result += element.ExchangeRate
        })
    })
    let count = await mtblRate(db).count({
        where: {
            Date: { [Op.substring]: year },
            IDCurrency: idCurrency,
        }
    })
    return result / count
}
async function getAverageRateFollowMonth(db, month, idCurrency) {
    let result = 0;
    await mtblRate(db).findAll({
        where: {
            Date: { [Op.substring]: month },
            IDCurrency: idCurrency,
        }
    }).then(data => {
        data.forEach(element => {
            result += element.ExchangeRate
        })
    })
    let count = await mtblRate(db).count({
        where: {
            Date: { [Op.substring]: month },
            IDCurrency: idCurrency,
        }
    })
    return count != 0 ? (result / count) : 0
}
async function getDetailInvoice(id) {
    let detail = {};
    for (let d = 0; d < data.length; d++) {
        if (data[d].id == id)
            detail = data[d]
    }
    return detail
}
async function getRevenueDataYear(db, year, listIDWhere, departmentID) {
    //  lấy doanh thu của năm ngoái
    let lastYearAverage = 0;
    await mtblReceiptsPayment(db).findAll({
        where: {
            type: 'receipt',
            Date: { [Op.substring]: year },
            ID: { [Op.in]: listIDWhere },
        }
    }).then(async data => {
        for (let d = 0; d < data.length; d++) {
            let rate = await getAverageRateFollowYear(db, year, data[d].IDCurrency)
            await mtblPaymentRInvoice(db).findAll({
                where: {
                    IDPayment: data[d].ID
                }
            }).then(async Invoice => {
                for (let invoice = 0; invoice < Invoice.length; invoice++) {
                    let objInvoice = await getDetailInvoice(Invoice[invoice].IDSpecializedSoftware)
                    if (objInvoice.departmentID == departmentID) {
                        lastYearAverage += (data[d].Amount * rate)
                    }
                }
            })
        }
    })
    return lastYearAverage
}
async function getRevenueDataMonth(db, month, listIDWhere, departmentID) {
    let monthlyRevenue = 0;
    await mtblReceiptsPayment(db).findAll({
        where: {
            type: 'receipt',
            Date: { [Op.substring]: month },
            ID: { [Op.in]: listIDWhere },
        }
    }).then(async data => {
        for (let d = 0; d < data.length; d++) {
            await mtblPaymentRInvoice(db).findAll({
                where: {
                    IDPayment: data[d].ID
                }
            }).then(async Invoice => {
                for (let invoice = 0; invoice < Invoice.length; invoice++) {
                    let rate = await getAverageRateFollowMonth(db, month, data[d].IDCurrency)

                    let objInvoice = await getDetailInvoice(Invoice[invoice].IDSpecializedSoftware)
                    if (objInvoice.departmentID == departmentID) {
                        monthlyRevenue += (data[d].Amount * rate)
                    }
                }
            })
        }
    })
    return monthlyRevenue
}
module.exports = {
    // TỔNG HỢP DOANH THU SHTT
    // get_data_report_aggregate_revenue_shtt
    getDataReportAggregateRevenueSHTT: async (req, res) => {
        var body = req.body
        var obj = {
            "paging": {
                "pageSize": 10,
                "currentPage": 1,
            },
            "type": body.type
        }
        // await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
        database.connectDatabase().then(async db => {
            if (db) {
                if (data) {
                    let arrayResult = []
                    let arrayHeader = []
                    arrayHeader.push('STT')
                    arrayHeader.push('NỘI DUNG')
                    let arrayHeaderExcel = []
                    let objTotal = {}
                    for (let month = 1; month <= 12; month++) {
                        arrayHeader.push('THÁNG ' + convertNumber(month) + '/' + body.year)
                    }
                    let stt = 1
                    await mtblDMBoPhan(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async department => {
                        let stt = 1;
                        for (let dp = 0; dp < department.length; dp++) {
                            let obj = {
                                stt: stt,
                                departmentName: department[dp].DepartmentName,
                            }
                            arrayHeaderExcel.push('1')
                            arrayHeaderExcel.push('2')
                            for (let month = 1; month <= 12; month++) {
                                let year = await getDataInvoiceFromDepartmentFollowYear(db, department[dp].ID, convertNumber(month) + '/' + (Number(body.year) - 1))
                                let lastYear = await getDataInvoiceFromDepartmentFollowYear(db, department[dp].ID, convertNumber(month) + '/' + body.year)
                                obj['monthBefore' + convertNumber(month)] = year;
                                obj['monthAfter' + convertNumber(month)] = lastYear;
                                obj['difference' + month] = lastYear - year;
                                obj['ratio' + month] = Math.round((year != 0 ? (lastYear - year) / year : 0) * 10000) / 100;
                                arrayHeaderExcel.push('THÁNG ' + convertNumber(month) + '/' + (Number(body.year) - 1))
                                arrayHeaderExcel.push('THÁNG ' + convertNumber(month) + '/' + body.year)
                                arrayHeaderExcel.push('CHÊNH LỆCH')
                                arrayHeaderExcel.push('TỈ LỆ (%)')
                                objTotal['monthBefore' + convertNumber(month)] = Number(objTotal['monthBefore' + convertNumber(month)] ? objTotal['monthBefore' + convertNumber(month)] : 0) + year;
                                objTotal['monthAfter' + convertNumber(month)] = Number(objTotal['monthAfter' + convertNumber(month)] ? objTotal['monthAfter' + convertNumber(month)] : 0) + lastYear;
                                objTotal['difference' + month] = Number(objTotal['difference' + month] ? objTotal['difference' + month] : 0) + (lastYear - year);
                                objTotal['ratio' + month] = Math.round((objTotal['monthBefore' + convertNumber(month)] != 0 ? (objTotal['monthAfter' + convertNumber(month)] - objTotal['monthBefore' + convertNumber(month)]) / objTotal['monthBefore' + convertNumber(month)] : 0) * 10000) / 100;
                            }
                            arrayResult.push(obj)
                            stt += 1
                        }
                        let obj = {
                            stt: null,
                            departmentName: 'Tỉ giá',
                        }
                        for (let month = 1; month <= 12; month++) {
                            //  11 - USD
                            let lastRate = await getAverageRateFollowMonth(db, body.year + '-' + convertNumber(month), 11);
                            let rate = await getAverageRateFollowMonth(db, (Number(body.year) - 1) + '-' + convertNumber(month), 11);
                            lastRate = Math.round(lastRate * 100) / 100
                            rate = Math.round(rate * 100) / 100
                            obj['monthBefore' + convertNumber(month)] = rate;
                            obj['monthAfter' + convertNumber(month)] = lastRate;
                            obj['difference' + month] = lastRate - rate;
                            obj['ratio' + month] = rate ? (Math.round(((lastRate - rate) / rate) * 10000) / 100) : 0;
                        }
                        arrayResult.push(obj)
                        objTotal['stt'] = null
                        objTotal['departmentName'] = 'Tổng doanh thu'
                        arrayResult.unshift(objTotal)
                    })
                    let result = {
                        arrayResult: arrayResult,
                        arrayHeader: arrayHeader,
                        arrayHeaderExcel: arrayHeaderExcel,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // DOANH THU TRÊN TIỀN VỀ
    // get_data_report_money_revenue
    getDataReportMoneyRevenue: async (req, res) => {
        var body = req.body
        var obj = {
            "paging": {
                "pageSize": 10,
                "currentPage": 1,
            },
            "type": body.type
        }
        // await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
        database.connectDatabase().then(async db => {
            if (db) {
                if (data) {
                    let arrayResult = {}
                    let objResult = {}
                    let arrayHeader = []
                    arrayHeader.push('STT')
                    arrayHeader.push('NỘI DUNG')
                    objResult['stt'] = 1
                    objResult['name'] = 'Doanh thu trên tiền về'
                    let arrayCurrencyID = await getListTypeMoneyFollowYear(db, '2021')
                    let arrayCurrency = []
                    let arrayTotal = {}
                    let result = {}
                    if (!body.month) {
                        for (let month = 1; month <= 12; month++) {
                            arrayHeader.push('THÁNG ' + convertNumber(month) + '/' + (Number(body.year) - 1))
                            arrayHeader.push('THÁNG ' + convertNumber(month) + '/' + body.year)
                            let arrayMonthBefore = [];
                            let arrayMonthAfter = [];
                            for (let type = 0; type < arrayCurrencyID.length; type++) {
                                let objCurrency = await mtblCurrency(db).findOne({
                                    where: {
                                        ID: arrayCurrencyID[type]
                                    }
                                })
                                if (objCurrency) {
                                    if (!checkDuplicate(arrayCurrency, objCurrency.ShortName)) {
                                        arrayCurrency.push(objCurrency.ShortName)
                                    }
                                    let valueBefore = await getMoneyRevenueFollowMonthAndTypeMoney(db, (Number(body.year) - 1) + '-' + convertNumber(month), arrayCurrencyID[type])
                                    let valueAfter = await getMoneyRevenueFollowMonthAndTypeMoney(db, body.year + '-' + convertNumber(month), arrayCurrencyID[type])
                                    objResult[objCurrency.ShortName + 'b' + month] = valueBefore
                                    objResult[objCurrency.ShortName + 'a' + month] = valueAfter
                                    arrayMonthBefore.push({
                                        key: objCurrency.ShortName + 'b' + month,
                                        name: objCurrency.ShortName,
                                        value: valueBefore,
                                    })
                                    arrayMonthAfter.push({
                                        key: objCurrency.ShortName + 'a' + month,
                                        name: objCurrency.ShortName,
                                        value: valueAfter,
                                    })
                                }
                            }
                            arrayResult['monthBefore' + convertNumber(month)] = arrayMonthBefore
                            arrayResult['monthAfter' + convertNumber(month)] = arrayMonthAfter
                            let valueBefore = ''
                            for (let arrInd = 0; arrInd < arrayMonthBefore.length; arrInd++) {
                                let typeMoney = arrayMonthBefore[arrInd].name == 'VND' ? 'đ' : (arrayMonthBefore[arrInd].name == 'USD' ? '$' : '?')
                                if (arrInd == arrayMonthBefore.length - 1) {
                                    valueBefore += arrayMonthBefore[arrInd].value + typeMoney

                                } else {
                                    valueBefore += arrayMonthBefore[arrInd].value + typeMoney + ' + '
                                }
                            }
                            let valueAfter = ''
                            for (let arrInd = 0; arrInd < arrayMonthAfter.length; arrInd++) {
                                let typeMoney = arrayMonthAfter[arrInd].name == 'VND' ? 'đ' : (arrayMonthAfter[arrInd].name == 'USD' ? '$' : '?')
                                if (arrInd == arrayMonthAfter.length - 1) {
                                    valueAfter += arrayMonthAfter[arrInd].value + typeMoney

                                } else {
                                    valueAfter += arrayMonthAfter[arrInd].value + typeMoney + ' + '
                                }
                            }

                            arrayTotal['monthBefore' + convertNumber(month)] = valueBefore
                            arrayTotal['monthAfter' + convertNumber(month)] = valueAfter
                        }
                        result = {
                            arrayTotal: arrayTotal,
                            arrayData: [objResult],
                            arrayResult: arrayResult,
                            arrayHeader: arrayHeader,
                            arrayCurrency: arrayCurrency,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                        }
                    } else {
                        let month = body.month.slice(5, 7); // January
                        let year = Number(body.month.slice(0, 4));
                        arrayHeader.push('THÁNG ' + month + '/' + (year - 1))
                        arrayHeader.push('THÁNG ' + month + '/' + year)
                        let arrayMonthBefore = [];
                        let arrayMonthAfter = [];
                        for (let type = 0; type < arrayCurrencyID.length; type++) {
                            let objCurrency = await mtblCurrency(db).findOne({
                                where: {
                                    ID: arrayCurrencyID[type]
                                }
                            })
                            if (objCurrency) {
                                if (!checkDuplicate(arrayCurrency, objCurrency.ShortName)) {
                                    arrayCurrency.push(objCurrency.ShortName)
                                }
                                let valueBefore = await getMoneyRevenueFollowMonthAndTypeMoney(db, (year - 1) + '-' + month, arrayCurrencyID[type])
                                let valueAfter = await getMoneyRevenueFollowMonthAndTypeMoney(db, year + '-' + month, arrayCurrencyID[type])
                                objResult['monthBefore'] = valueBefore
                                objResult['monthAfter'] = valueAfter
                                arrayMonthBefore.push({
                                    key: objCurrency.ShortName + 'befor',
                                    name: objCurrency.ShortName,
                                    value: valueBefore,
                                })
                                arrayMonthAfter.push({
                                    key: objCurrency.ShortName + 'after',
                                    name: objCurrency.ShortName,
                                    value: valueAfter,
                                })
                            }
                        }
                        arrayResult['monthBefore'] = arrayMonthBefore
                        arrayResult['monthAfter'] = arrayMonthAfter
                        let valueBefore = ''
                        for (let arrInd = 0; arrInd < arrayMonthBefore.length; arrInd++) {
                            let typeMoney = arrayMonthBefore[arrInd].name == 'VND' ? 'đ' : (arrayMonthBefore[arrInd].name == 'USD' ? '$' : '?')
                            if (arrInd == arrayMonthBefore.length - 1) {
                                valueBefore += arrayMonthBefore[arrInd].value + typeMoney
                            } else {
                                valueBefore += arrayMonthBefore[arrInd].value + typeMoney + ' + '
                            }
                        }
                        let valueAfter = ''
                        for (let arrInd = 0; arrInd < arrayMonthAfter.length; arrInd++) {
                            let typeMoney = arrayMonthAfter[arrInd].name == 'VND' ? 'đ' : (arrayMonthAfter[arrInd].name == 'USD' ? '$' : '?')
                            if (arrInd == arrayMonthAfter.length - 1) {
                                valueAfter += arrayMonthAfter[arrInd].value + typeMoney

                            } else {
                                valueAfter += arrayMonthAfter[arrInd].value + typeMoney + ' + '
                            }
                        }
                        arrayTotal['monthBefore'] = valueBefore
                        arrayTotal['monthAfter'] = valueAfter
                        result = {
                            arrayTotal: arrayTotal,
                            arrayData: [objResult],
                            arrayResult: arrayResult,
                            arrayHeader: arrayHeader,
                            arrayCurrency: arrayCurrency,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                        }
                    }

                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // DOANH THU BÌNH QUÂN THÁNG CỦA CÁC BAN HOẶC CẢ CÔNG TY THEO NĂM
    // get_data_report_average_revenue
    getDataReportAverageRevenue: async (req, res) => {
        var body = req.body
        var obj = {
            "paging": {
                "pageSize": 10,
                "currentPage": 1,
            },
            "type": body.type
        }
        // await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
        database.connectDatabase().then(async db => {
            if (db) {
                if (data) {
                    let yearNow = Number(moment().format('YYYY'));
                    yearNow = yearNow - 1
                    let arrayResult = []
                    await mtblDMBoPhan(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async department => {
                        let stt = 1;
                        let lastYearAverageTotal = 0;
                        let monthlyRevenueTotal = 0;
                        let differenceTotal = 0;
                        for (let dp = 0; dp < department.length; dp++) {
                            let listID = []
                            let monthlyRevenue = 0;
                            let lastYearAverage = 0;
                            await mtblPaymentRInvoice(db).findAll().then(async data => {
                                for (let d = 0; d < data.length; d++) {
                                    if (data[d].IDPayment && !checkDuplicate(listID, data[d].IDPayment))
                                        listID.push(data[d].IDPayment)
                                }
                            })
                            //  lấy doanh thu của năm ngoái
                            await mtblReceiptsPayment(db).findAll({
                                where: {
                                    type: 'receipt',
                                    Date: { [Op.substring]: yearNow },
                                    ID: { [Op.in]: listID },
                                }
                            }).then(async data => {
                                for (let d = 0; d < data.length; d++) {
                                    let rate = await getAverageRateFollowYear(db, yearNow, data[d].IDCurrency)
                                    rate = Math.round(rate * 100) / 100
                                    await mtblPaymentRInvoice(db).findAll({
                                        where: {
                                            IDPayment: data[d].ID
                                        }
                                    }).then(async Invoice => {
                                        for (let invoice = 0; invoice < Invoice.length; invoice++) {
                                            let objInvoice = await getDetailInvoice(Invoice[invoice].IDSpecializedSoftware)
                                            if (objInvoice.departmentID == department[dp].ID) {
                                                lastYearAverage += (data[d].Amount * rate)
                                            }
                                        }
                                    })
                                }
                            })
                            //  lấy doanh thui binhg quân của thnags năm hiện tại
                            await mtblReceiptsPayment(db).findAll({
                                where: {
                                    type: 'receipt',
                                    Date: { [Op.substring]: body.date },
                                    ID: { [Op.in]: listID },
                                }
                            }).then(async data => {
                                for (let d = 0; d < data.length; d++) {
                                    let rate = await getAverageRateFollowMonth(db, body.date, data[d].IDCurrency)
                                    rate = Math.round(rate * 100) / 100
                                    await mtblPaymentRInvoice(db).findAll({
                                        where: {
                                            IDPayment: data[d].ID
                                        }
                                    }).then(async Invoice => {
                                        for (let invoice = 0; invoice < Invoice.length; invoice++) {
                                            let objInvoice = await getDetailInvoice(Invoice[invoice].IDSpecializedSoftware)
                                            if (objInvoice.departmentID == department[dp].ID) {
                                                monthlyRevenue += (data[d].Amount * rate)
                                            }
                                        }
                                    })
                                }
                            })
                            lastYearAverageTotal += lastYearAverage;
                            monthlyRevenueTotal += monthlyRevenue;
                            differenceTotal += (monthlyRevenue - lastYearAverage);
                            let obj = {
                                stt: stt,
                                departmentName: department[dp].DepartmentName,
                                lastYearAverage: Math.round(lastYearAverage * 100) / 100,
                                monthlyRevenue: monthlyRevenue,
                                difference: monthlyRevenue - lastYearAverage,
                                ratio: lastYearAverage != 0 ? ((monthlyRevenue - lastYearAverage) / lastYearAverage) : 0,
                            }
                            arrayResult.push(obj)
                            stt += 1
                        }
                        if (body.type == 'company') {
                            arrayResult = []
                            let obj = {
                                stt: 1,
                                departmentName: 'Doanh thu tiền về',
                                lastYearAverage: lastYearAverageTotal,
                                monthlyRevenue: monthlyRevenueTotal,
                                difference: differenceTotal,
                                ratio: lastYearAverageTotal != 0 ? ((monthlyRevenueTotal - lastYearAverageTotal) / lastYearAverageTotal) : 0,
                            }
                            arrayResult.push(obj)
                            obj = {
                                // stt: 1,
                                departmentName: 'Tổng cộng',
                                lastYearAverage: lastYearAverageTotal,
                                monthlyRevenue: monthlyRevenueTotal,
                                difference: differenceTotal,
                                ratio: lastYearAverageTotal != 0 ? ((monthlyRevenueTotal - lastYearAverageTotal) / lastYearAverageTotal) : 0,
                            }
                            arrayResult.push(obj)
                        } else {
                            let obj = {
                                // stt: 1,
                                departmentName: 'Tổng cộng',
                                lastYearAverage: lastYearAverageTotal,
                                monthlyRevenue: monthlyRevenueTotal,
                                difference: differenceTotal,
                                ratio: lastYearAverageTotal != 0 ? ((monthlyRevenueTotal - lastYearAverageTotal) / lastYearAverageTotal) : 0,
                            }
                            arrayResult.push(obj)
                        }
                    })
                    let result = {
                        arrayResult: arrayResult,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // TỔNG HỢP DOANH THU 12 THÁNG NĂM YYYY
    // get_data_report_aggregate_revenue_year
    getDataReportAggregateRevenueYear: async (req, res) => {
        var body = req.body
        var obj = {
            "paging": {
                "pageSize": 10,
                "currentPage": 1,
            },
            "type": body.type
        }
        // await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
        database.connectDatabase().then(async db => {
            if (db) {
                if (data) {
                    let arrayResult = []
                    let monthLast = body.date.slice(5, 7); // January
                    let yearLast = Number(body.date.slice(0, 4));
                    await mtblDMBoPhan(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async department => {
                        let stt = 1;
                        let lastYearAverageTotal = 0;
                        let monthlyRevenueTotal = 0;
                        let differenceTotal = 0;
                        for (let dp = 0; dp < department.length; dp++) {
                            let listID = []
                            let monthlyRevenue = 0;
                            let lastYearAverage = 0;
                            await mtblPaymentRInvoice(db).findAll().then(async data => {
                                for (let d = 0; d < data.length; d++) {
                                    if (data[d].IDPayment && !checkDuplicate(listID, data[d].IDPayment))
                                        listID.push(data[d].IDPayment)
                                }
                            })
                            //  lấy doanh thu của năm ngoái
                            await mtblReceiptsPayment(db).findAll({
                                where: {
                                    type: 'receipt',
                                    Date: { [Op.substring]: (yearLast - 1) + '-' + monthLast },
                                    ID: { [Op.in]: listID },
                                }
                            }).then(async data => {
                                for (let d = 0; d < data.length; d++) {
                                    let rate = await getAverageRateFollowYear(db, data[d].Date, data[d].IDCurrency)
                                    await mtblPaymentRInvoice(db).findAll({
                                        where: {
                                            IDPayment: data[d].ID
                                        }
                                    }).then(async Invoice => {
                                        for (let invoice = 0; invoice < Invoice.length; invoice++) {
                                            let objInvoice = await getDetailInvoice(Invoice[invoice].IDSpecializedSoftware)
                                            if (objInvoice.departmentID == department[dp].ID) {
                                                lastYearAverage += (data[d].Amount * rate)
                                            }
                                        }
                                    })
                                }
                            })
                            //  lấy doanh thui binhg quân của thnags năm hiện tại
                            await mtblReceiptsPayment(db).findAll({
                                where: {
                                    type: 'receipt',
                                    Date: { [Op.substring]: body.date },
                                    ID: { [Op.in]: listID },
                                }
                            }).then(async data => {
                                console.log(data.length);
                                for (let d = 0; d < data.length; d++) {
                                    let rate = await getAverageRateFollowMonth(db, data[d].Date, data[d].IDCurrency)
                                    if (rate == 0) {
                                        rate = 1
                                    }
                                    await mtblPaymentRInvoice(db).findAll({
                                        where: {
                                            IDPayment: data[d].ID
                                        }
                                    }).then(async Invoice => {
                                        for (let invoice = 0; invoice < Invoice.length; invoice++) {
                                            let objInvoice = await getDetailInvoice(Invoice[invoice].IDSpecializedSoftware)
                                            if (objInvoice.departmentID == department[dp].ID) {
                                                monthlyRevenue += (data[d].Amount * rate)
                                            }
                                        }
                                    })
                                }
                            })
                            lastYearAverageTotal += lastYearAverage;
                            monthlyRevenueTotal += monthlyRevenue;
                            differenceTotal += (monthlyRevenue - lastYearAverage);
                            let obj = {
                                stt: stt,
                                departmentName: department[dp].DepartmentName,
                                lastYearAverage: Math.round(lastYearAverage * 100) / 100,
                                monthlyRevenue: monthlyRevenue,
                                difference: monthlyRevenue - lastYearAverage,
                                ratio: lastYearAverage != 0 ? ((monthlyRevenue - lastYearAverage) / lastYearAverage) : 0,
                            }
                            arrayResult.push(obj)
                            stt += 1
                        }
                        let obj = {
                            // stt: 1,
                            departmentName: 'TỔNG DOANH THU',
                            lastYearAverage: lastYearAverageTotal,
                            monthlyRevenue: monthlyRevenueTotal,
                            difference: differenceTotal,
                            ratio: lastYearAverageTotal != 0 ? ((monthlyRevenueTotal - lastYearAverageTotal) / lastYearAverageTotal) : 0,
                        }
                        arrayResult.unshift(obj)
                        let lastRate = await getAverageRateFollowMonth(db, body.date, 11);
                        let rate = await getAverageRateFollowMonth(db, (yearLast - 1) + '-' + monthLast, 11);
                        obj = {
                            // stt: null,
                            departmentName: 'Tỉ giá',
                            lastYearAverage: rate,
                            monthlyRevenue: lastRate,
                            difference: lastRate - rate,
                            ratio: rate != 0 ? Math.round(((lastRate - rate) / rate) * 10000) / 100 : 0,
                        }
                        arrayResult.push(obj)
                    })
                    let result = {
                        arrayResult: arrayResult,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // DOANH THU TIÊN VỀ VND
    // get_data_report_average_revenue_vnd
    getDataReportAverageRevenueVND: async (req, res) => {
        var body = req.body
        var obj = {
            "paging": {
                "pageSize": 10,
                "currentPage": 1,
            },
            "type": body.type
        }
        // await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
        database.connectDatabase().then(async db => {
            if (db) {
                if (data) {
                    let arrayResult = []
                    let month = Number(body.date.slice(5, 7)); // January
                    let year = Number(body.date.slice(0, 4));
                    await mtblDMBoPhan(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async department => {
                        let lastYearAverageTotal = 0;
                        let monthlyRevenueTotal = 0;
                        let differenceTotal = 0;
                        for (let dp = 0; dp < department.length; dp++) {
                            let listID = []
                            let monthlyRevenue = 0;
                            let lastYearAverage = 0;
                            await mtblPaymentRInvoice(db).findAll().then(async data => {
                                for (let d = 0; d < data.length; d++) {
                                    if (data[d].IDPayment && !checkDuplicate(listID, data[d].IDPayment))
                                        listID.push(data[d].IDPayment)
                                }
                            })
                            await mtblReceiptsPayment(db).findAll({
                                where: {
                                    type: 'receipt',
                                    Date: { [Op.substring]: (year - 1) + '-' + convertNumber(month) },
                                    ID: { [Op.in]: listID },
                                }
                            }).then(async data => {
                                for (let d = 0; d < data.length; d++) {
                                    let rate = await getAverageRateFollowYear(db, (year - 1) + '-' + convertNumber(month), data[d].IDCurrency)
                                    rate = Math.round(rate * 100) / 100
                                    await mtblPaymentRInvoice(db).findAll({
                                        where: {
                                            IDPayment: data[d].ID
                                        }
                                    }).then(async Invoice => {
                                        for (let invoice = 0; invoice < Invoice.length; invoice++) {
                                            let objInvoice = await getDetailInvoice(Invoice[invoice].IDSpecializedSoftware)
                                            if (objInvoice.departmentID == department[dp].ID) {
                                                lastYearAverage += (data[d].Amount * rate)
                                            }
                                        }
                                    })
                                }
                            })
                            //  lấy doanh thui binhg quân của thnags năm hiện tại
                            await mtblReceiptsPayment(db).findAll({
                                where: {
                                    type: 'receipt',
                                    Date: { [Op.substring]: body.date },
                                    ID: { [Op.in]: listID },
                                }
                            }).then(async data => {
                                for (let d = 0; d < data.length; d++) {
                                    let rate = await getAverageRateFollowMonth(db, body.date, data[d].IDCurrency)
                                    rate = Math.round(rate * 100) / 100
                                    await mtblPaymentRInvoice(db).findAll({
                                        where: {
                                            IDPayment: data[d].ID
                                        }
                                    }).then(async Invoice => {
                                        for (let invoice = 0; invoice < Invoice.length; invoice++) {
                                            let objInvoice = await getDetailInvoice(Invoice[invoice].IDSpecializedSoftware)
                                            if (objInvoice.departmentID == department[dp].ID) {
                                                monthlyRevenue += (data[d].Amount * rate)
                                            }
                                        }
                                    })
                                }
                            })
                            lastYearAverageTotal += lastYearAverage;
                            monthlyRevenueTotal += monthlyRevenue;
                            differenceTotal += (monthlyRevenue - lastYearAverage);
                        }

                        let obj = {
                            // stt: 1,
                            departmentName: 'Doanh thu tiền về',
                            lastYearAverage: lastYearAverageTotal,
                            monthlyRevenue: monthlyRevenueTotal,
                            difference: differenceTotal,
                            ratio: lastYearAverageTotal != 0 ? ((monthlyRevenueTotal - lastYearAverageTotal) / lastYearAverageTotal) : 0,
                        }
                        arrayResult.push(obj)
                    })
                    let result = {
                        arrayResult: arrayResult,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // BẢNG SO SÁNH DOANH THU BÌNH QUÂN
    // get_data_reqort_average_sales_comparison_table
    getDataReportAverageSalesComparison: async (req, res) => {
        var body = req.body
        var obj = {
            "paging": {
                "pageSize": 10,
                "currentPage": 1,
            },
            "type": body.type
        }
        // await axios.post(`http://ageless-ldms-api.vnsolutiondev.com/api/v1/invoice/share`, obj).then(data => {
        database.connectDatabase().then(async db => {
            if (db) {
                if (data) {
                    let arrayResult = []
                    await mtblDMBoPhan(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async department => {
                        let stt = 1;
                        for (let dp = 0; dp < department.length; dp++) {
                            let listID = []
                            let valueBefore = 0;
                            let valueAfter = 0;
                            let count = 0;
                            await mtblPaymentRInvoice(db).findAll().then(async data => {
                                for (let d = 0; d < data.length; d++) {
                                    if (data[d].IDPayment && !checkDuplicate(listID, data[d].IDPayment))
                                        listID.push(data[d].IDPayment)
                                }
                            })
                            if (!body.monthBeforeStart && body.monthAfterStart) {
                                let monthStart = Number(body.monthAfterStart.slice(5, 7)); // January
                                let monthEnd = Number(body.monthAfterEnd.slice(5, 7)); // January
                                let year = Number(body.monthAfterStart.slice(0, 4));
                                valueBefore = await getDataInvoiceFromDepartmentFollowYear(db, department[dp].ID, monthStart + '/' + year)
                                console.log(valueBefore);
                                for (let month = monthStart; month <= monthEnd; month++) {
                                    valueAfter += await getDataInvoiceFromDepartmentFollowYear(db, department[dp].ID, convertNumber(month) + '/' + year)
                                    count += 1;
                                }
                            } else if (body.monthBeforeStart && body.monthAfterStart) {
                                let monthStartBefore = Number(body.monthBeforeStart.slice(5, 7)); // January
                                let monthEndBefore = Number(body.monthBeforeEnd.slice(5, 7)); // January
                                let yearBefore = Number(body.monthAfterStart.slice(0, 4));
                                let monthStartAfter = Number(body.monthAfterStart.slice(5, 7)); // January
                                let monthEndAfter = Number(body.monthBeforeEnd.slice(5, 7)); // January
                                let yearAfter = Number(body.monthAfterStart.slice(0, 4));
                                for (let monthBefore = monthStartBefore; monthBefore <= monthEndBefore; monthBefore++) {
                                    valueBefore += await getDataInvoiceFromDepartmentFollowYear(db, department[dp].ID, convertNumber(monthBefore) + '/' + yearBefore)
                                    count += 1;
                                }
                                for (let monthAfter = monthStartAfter; monthAfter <= monthEndAfter; monthAfter++) {
                                    valueAfter += await getDataInvoiceFromDepartmentFollowYear(db, department[dp].ID, convertNumber(monthAfter) + '/' + yearAfter)
                                    count += 1;
                                }
                            } else {
                                let monthBefore = Number(body.monthBefore.slice(5, 7));
                                let yearBefore = Number(body.monthBefore.slice(0, 4));
                                let monthAfter = Number(body.monthAfter.slice(5, 7));
                                let yearAfter = Number(body.monthAfter.slice(0, 4));
                                count += 1;
                                valueBefore += await getDataInvoiceFromDepartmentFollowYear(db, department[dp].ID, convertNumber(monthBefore) + '/' + yearBefore)
                                valueAfter += await getDataInvoiceFromDepartmentFollowYear(db, department[dp].ID, convertNumber(monthAfter) + '/' + yearAfter)
                            }
                            let obj = {
                                stt: stt,
                                departmentName: department[dp].DepartmentName,
                                valueBefore: Math.round(valueBefore * 100) / count / 100,
                                valueAfter: valueAfter / count,
                                difference: valueAfter / count - valueBefore / count,
                                ratio: valueBefore != 0 ? ((valueAfter / count - valueBefore / count) / (valueBefore / count)) * 100 : 0,
                            }
                            arrayResult.push(obj)
                            stt += 1
                        }
                    })
                    let result = {
                        arrayResult: arrayResult,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                    }
                    res.json(result);
                } else {
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
}