const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblInvoice = require('../tables/financemanage/tblInvoice')
var database = require('../database');
const axios = require('axios');
var mtblCurrency = require('../tables/financemanage/tblCurrency')
var mtblInvoiceRCurrency = require('../tables/financemanage/tblInvoiceRCurrency')
var dataExport = require('../controller_finance/ctl-apiSpecializedSoftware')
var mtblRate = require('../tables/financemanage/tblRate')
async function deleteRelationshiptblInvoice(db, listID) {
    await mtblInvoice(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}
var mtblPaymentRInvoice = require('../tables/financemanage/tblPaymentRInvoice')
var mtblReceiptsPayment = require('../tables/financemanage/tblReceiptsPayment')
var mtblDMUser = require('../tables/constants/tblDMUser');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblCustomer = require('../tables/financemanage/tblCustomer');
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblDMChiNhanh = require('../tables/constants/tblDMChiNhanh')

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
    await database.connectDatabase().then(async db => {
        for (let a = 0; a < arrayResult.length; a++) {
            let totelMoney = await calculateMoneyFollowVND(db, arrayResult[a].type, arrayResult[a].total, arrayResult[a].date)
            arrayResult['totalMoneyVND'] = totelMoney
        }
    })
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
                Date: {
                    [Op.substring]: date
                },
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
                        Date: {
                            [Op.substring]: searchNow
                        },
                        IDCurrency: currency.ID
                    },
                    order: [
                        ['ID', 'DESC']
                    ],
                }).then(Rate => {
                    if (Rate)
                        exchangeRate = Rate.ExchangeRate
                })
            }
        })
    result = ((exchangeRate ? exchangeRate : 1) * total)
    return result
}
async function getExchangeRateFromDate(db, typeMoney, date) {
    let exchangeRate = 1;
    let result = {};
    let currency = await mtblCurrency(db).findOne({
        where: { ShortName: typeMoney }
    })
    if (currency)
        await mtblRate(db).findOne({
            where: {
                Date: {
                    [Op.substring]: date
                },
                IDCurrency: currency.ID
            },
            order: [
                ['ID', 'DESC']
            ],
        }).then(async Rate => {
            if (Rate)
                result = {
                    typeMoney: typeMoney,
                    exchangeRate: Rate.ExchangeRate,
                }
            else {
                let searchNow = moment().format('YYYY-MM-DD');
                await mtblRate(db).findOne({
                    where: {
                        Date: {
                            [Op.substring]: searchNow
                        },
                        IDCurrency: currency.ID
                    },
                    order: [
                        ['ID', 'DESC']
                    ],
                }).then(Rate => {
                    if (Rate)
                        result = {
                            typeMoney: typeMoney,
                            exchangeRate: Rate.ExchangeRate,
                        }
                })
            }
        })
    return result
}


async function getDataInvoiceByCondition(db, itemPerPage, page, whereObj = {}, paymentID = null) {
    let arrayResult = [];
    let totalMoneyVND = 0;
    let totalMoney = [];
    let arrayCurrency = []
    let arrInvoiceIDPMCM = []
    let arrayWhere = {}
    let arrayUpdate = []
    if (paymentID) {
        await mtblPaymentRInvoice(db).findAll({
            where: {
                IDPayment: paymentID
            }
        }).then(data => {
            for (let item of data) {
                arrInvoiceIDPMCM.push(item.IDSpecializedSoftware)
            }
        })
        arrayWhere = {
            [Op.or]: [
                whereObj,
                {
                    IDSpecializedSoftware: { [Op.in]: arrInvoiceIDPMCM },
                    IsInvoice: whereObj.IsInvoice
                }
            ]
        }
    } else {
        arrayWhere = whereObj
    }
    let tblInvoice = mtblInvoice(db);
    let tblDMUser = mtblDMUser(db);
    let tblDMNhanvien = mtblDMNhanvien(db);
    let tblDMBoPhan = mtblDMBoPhan(db);
    tblInvoice.belongsTo(mtblCustomer(db), { foreignKey: 'IDCustomer', sourceKey: 'IDCustomer', as: 'cus' })
    tblDMUser.belongsTo(tblDMNhanvien, { foreignKey: 'IDNhanvien', sourceKey: 'IDNhanvien', as: 'staff' })
    tblDMBoPhan.belongsTo(mtblDMChiNhanh(db), { foreignKey: 'IDChiNhanh', sourceKey: 'IDChiNhanh', as: 'branch' })
    tblDMNhanvien.belongsTo(tblDMBoPhan, { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'department' })
    tblInvoice.belongsTo(tblDMUser, { foreignKey: 'UserID', sourceKey: 'UserID', as: 'user' })
    await tblInvoice.findAll(
        {
            include: [
                {
                    model: mtblCustomer(db),
                    required: false,
                    as: 'cus'
                },
                {
                    model: tblDMUser,
                    required: false,
                    as: 'user',
                    include: [
                        {
                            model: tblDMNhanvien,
                            required: false,
                            as: 'staff',
                            include: [
                                {
                                    model: tblDMBoPhan,
                                    required: false,
                                    as: 'department',
                                    include: [
                                        {
                                            model: mtblDMChiNhanh(db),
                                            required: false,
                                            as: 'branch'
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            offset: Number(itemPerPage) * (Number(page) - 1),
            limit: Number(itemPerPage),
            where: arrayWhere,
        }
    ).then(async data => {
        for (let i = 0; i < data.length; i++) {
            if (!checkDuplicate(arrayCurrency, data[i].TypeMoney)) {
                arrayCurrency.push(data[i].TypeMoney)
                totalMoney.push({
                    total: Number(data[i].MoneyTotal ? data[i].MoneyTotal : 0),
                    type: data[i].TypeMoney
                })
            } else {
                for (let item of totalMoney) {
                    if (data[i].TypeMoney == item.type) {
                        item.total += Number(data[i].MoneyTotal ? data[i].MoneyTotal : 0)
                    }
                }
            }
            let refNumber = ''
            if (data[i].RefNumber) {
                let arrayRef = JSON.parse(data[i].RefNumber)
                for (let i = 0; i < arrayRef.length; i++) {
                    if (i >= (arrayRef.length - 1)) {
                        if (arrayRef[i].agelessRef)
                            refNumber += arrayRef[i].agelessRef
                    } else
                        if (arrayRef[i].agelessRef)
                            refNumber += arrayRef[i].agelessRef + ', '
                }
            }
            let createdDate = moment(data[i].CreatedDate).format("YYYY-MM-DD")
            let rate = await mtblRate(db).findOne({
                where: {
                    IDCurrency: data[i].CurrencyID ? data[i].CurrencyID : null,
                    Date: {
                        [Op.substring]: createdDate
                    },
                }
            })
            let paymentAmount = 0
            if (paymentID)
                await mtblPaymentRInvoice(db).findOne({
                    where: {
                        IDSpecializedSoftware: data[i].IDSpecializedSoftware,
                        IDPayment: paymentID
                    }
                }).then(data => {
                    paymentAmount = data ? data.Amount : 0
                })
            let obj = {
                id: data[i].IDSpecializedSoftware ? data[i].IDSpecializedSoftware : null,
                createdDate: createdDate,
                refNumber: refNumber,
                rate: rate ? rate.ExchangeRate : null,
                invoiceNumber: data[i].InvoiceNumber,
                typeMoney: data[i].TypeMoney,
                moneyTotal: data[i].MoneyTotal,
                total: data[i].InitialAmount ? data[i].InitialAmount : 0,
                totalMoneyDisplay: data[i].MoneyTotal,
                statusName: data[i].Status,
                idCustomer: data[i].IDCustomer,
                initialAmount: data[i].InitialAmount ? data[i].InitialAmount : 0,
                paidAmount: data[i].PaidAmount ? data[i].PaidAmount : 0,
                unpaidAmount: data[i].UnpaidAmount ? data[i].UnpaidAmount : 0,
                remainingAmount: data[i].UnpaidAmount ? data[i].UnpaidAmount : 0,
                paymentAmount: paymentAmount,
                customerName: data[i].IDCustomer ? data[i].cus.Name : '',
                customerAddress: data[i].IDCustomer ? data[i].cus.Address : '',
                content: data[i].Contents,
                request: data[i].Request,
                userID: data[i].UserID,
                userName: data[i].UserID ? data[i].user.Username : '',
                employeeName: data[i].UserID ? (data[i].user.IDNhanvien ? data[i].user.staff.StaffName : '') : '',
                employeeCode: data[i].UserID ? (data[i].user.IDNhanvien ? data[i].user.staff.StaffCode : '') : '',
                departmentName: data[i].UserID ? (data[i].user.staff ? (data[i].user.staff.IDBoPhan ? data[i].user.staff.department.DepartmentName : null) : null) : '',
                departmentID: data[i].UserID ? (data[i].user.staff ? data[i].user.staff.IDBoPhan : null) : '',
                branchName: data[i].UserID ? (data[i].user.staff ? (data[i].user.staff.IDBoPhan ? (data[i].user.staff.department.IDChiNhanh ? data[i].user.staff.department.branch.BranchName : null) : null) : null) : null,
                branchID: data[i].UserID ? (data[i].user.staff ? data[i].user.staff.IDBoPhan : (data[i].user.staff.department.IDChiNhanh ? data[i].user.staff.department.IDChiNhanh : null)) : '',
                AccountID: data[i] ? data[i].AccountID : null,
                AccountName: data[i].AccountName,
            }
            totalMoneyVND += await calculateMoneyFollowVND(db, data[i].TypeMoney, data[i].MoneyTotal, createdDate)

            let tblPaymentRInvoice = mtblPaymentRInvoice(db)
            tblPaymentRInvoice.belongsTo(mtblReceiptsPayment(db), { foreignKey: 'IDPayment', sourceKey: 'IDPayment', as: 'payment' })
            let arrayReceiptPayment = []
            await tblPaymentRInvoice.findAll({
                where: {
                    IDSpecializedSoftware: data[i].ID
                },
                include: [{
                    model: mtblReceiptsPayment(db),
                    required: false,
                    as: 'payment'
                },],
            }).then(invoice => {
                if (invoice && invoice.length > 0) {
                    for (let item of invoice) {
                        arrayReceiptPayment.push({
                            receiptPaymentID: item.IDPayment,
                            receiptPaymentName: item.payment ? item.payment.CodeNumber : ''
                        })
                    }
                }
            })
            obj['arrayReceiptPayment'] = arrayReceiptPayment
            console.log(arrInvoiceIDPMCM);
            if (checkDuplicate(arrInvoiceIDPMCM, data[i].IDSpecializedSoftware)) {
                arrayUpdate.push(obj)
            } else {
                arrayResult.push(obj)
                arrayUpdate.push(obj)
            }
        }
    })
    var count = await mtblInvoice(db).count({
        where: whereObj
    })
    var result = {
        array: arrayResult,
        arrayCreate: arrayResult,
        arrayUpdate: arrayUpdate,
        status: Constant.STATUS.SUCCESS,
        message: Constant.MESSAGE.ACTION_SUCCESS,
        all: count,
        totalMoney: totalMoney,
        totalMoneyVND: totalMoneyVND,
    }
    return result
}
module.exports = {
    getDataInvoiceByCondition,
    deleteRelationshiptblInvoice,
    // get_list_tbl_invoice
    getListtblInvoice: async (req, res) => {
        var body = req.body
        try {
            database.connectDatabase().then(async db => {
                let result = await getDataInvoiceByCondition(db, body.itemPerPage, body.page, { IsInvoice: true })
                res.json(result);
            })
        } catch (error) {
            console.log(error);
            res.json(Result.SYS_ERROR_RESULT)
        }
    },
}