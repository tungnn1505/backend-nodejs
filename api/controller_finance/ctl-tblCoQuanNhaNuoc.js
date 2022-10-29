const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblCoQuanNhaNuoc = require('../tables/financemanage/tblCoQuanNhaNuoc')
var ctlReceiptsPayment = require('../controller_finance/ctl-tblReceiptsPayment')
var database = require('../database');
const axios = require('axios');
async function deleteRelationshiptblCoQuanNhaNuoc(db, listID) {
    try {
        let arrReceiptsPayment = []
        await mtblCoQuanNhaNuoc(db).findAll({
            where: {
                ID: { [Op.in]: listID },
            }
        }).then(async data => {
            for (item of data) {
                arrReceiptsPayment.push(item.ReceiptsPaymentID)
                if (item.Date) {
                    let month = Number(item.Date.slice(5, 7));
                    let year = Number(item.Date.slice(0, 4));
                    await mtblCoQuanNhaNuoc(db).destroy({
                        where: {
                            ID: { [Op.in]: listID }
                        }
                    })
                    await deleteAndCreatePeriodBalanceFollowMonth(db, month, year)
                }
            }
        })
        await ctlReceiptsPayment.deleteRelationshiptblReceiptsPayment(db, arrReceiptsPayment)
    } catch (error) {
        console.log(error);
        var result = {
            status: Constant.STATUS.FAIL,
            message: 'Xóa lỗi. Liên hệ quản trị!',
        }
        res.json(result)

    }

}
dataCQNN = [
    {
        id: 1,
        invoiceNumber: 'INV0001',
        paymentSACode: 'TTCCNN0001',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '01/02/2021',
        content: 'Thanh toán cho TTCCNN0001',
        total: '1000000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
        fileAttach: '',
        typeVoucher: 'Phiếu chi',
        numberVoucher: 'PC0012',
        note: ''
    },
    {
        id: 2,
        invoiceNumber: 'INV0002',
        paymentSACode: 'TTCCNN0002',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '02/02/2021',
        content: 'Thanh toán cho TTCCNN0002',
        total: '1200000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
        fileAttach: '',
        typeVoucher: 'Giấy báo nợ',
        numberVoucher: 'GBN0002',
        note: ''
    },
    {
        id: 3,
        invoiceNumber: 'INV0003',
        paymentSACode: 'TTCCNN0003',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '03/02/2021',
        content: 'Thanh toán cho TTCCNN0003',
        total: '1300000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
        fileAttach: '',
        typeVoucher: 'Biên lai',
        numberVoucher: 'BL0002',
        note: ''
    },
    {
        id: 4,
        invoiceNumber: 'INV0004',
        paymentSACode: 'TTCCNN0004',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '04/02/2021',
        content: 'Thanh toán cho TTCCNN0004',
        total: '4000000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
        fileAttach: '',
        typeVoucher: 'Biên lai',
        numberVoucher: 'BL0021',
        note: ''
    },
    {
        id: 5,
        invoiceNumber: 'INV0005',
        paymentSACode: 'TTCCNN0005',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '05/02/2021',
        content: 'Thanh toán cho TTCCNN0005',
        total: '1500000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
        fileAttach: '',
        typeVoucher: 'Biên lai',
        numberVoucher: 'BL0022',
        note: ''
    },
    {
        id: 6,
        invoiceNumber: 'INV0006',
        paymentSACode: 'TTCCNN0006',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '06/02/2021',
        content: 'Thanh toán cho TTCCNN0006',
        total: '1600000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
        fileAttach: '',
        typeVoucher: 'Giấy báo nợ',
        numberVoucher: 'GBN0015',
        note: ''
    },
    {
        id: 7,
        invoiceNumber: 'INV0007',
        paymentSACode: 'TTCCNN0007',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '07/02/2021',
        content: 'Thanh toán cho TTCCNN0007',
        total: '1700000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
        fileAttach: '',
        typeVoucher: 'Phiếu chi',
        numberVoucher: 'PC0009',
        note: ''
    },
    {
        id: 8,
        invoiceNumber: 'INV0008',
        paymentSACode: 'TTCCNN0008',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '08/02/2021',
        content: 'Thanh toán cho TTCCNN0008',
        total: '1800000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
        fileAttach: '',
        typeVoucher: 'Phiếu chi',
        numberVoucher: 'PC0011',
        note: ''
    },
    {
        id: 9,
        invoiceNumber: 'INV0009',
        paymentSACode: 'TTCCNN0009',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '09/02/2021',
        content: 'Thanh toán cho TTCCNN0009',
        total: '1900000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
        fileAttach: '',
        typeVoucher: 'Phiếu chi',
        numberVoucher: 'PC0031',
        note: ''
    },
    {
        id: 10,
        invoiceNumber: 'INV0010',
        paymentSACode: 'TTCCNN0010',
        paymentSAName: 'Thanh toán cơ quan nhà nước HN',
        customerName: 'Công ty tnhh Is Tech Vina',
        partnerID: '2',
        createdDate: '10/02/2021',
        content: 'Thanh toán cho TTCCNN0010',
        total: '1200000',
        unit: 'VND',
        statusName: 'Chờ thanh toán',
        fileAttach: '',
        typeVoucher: 'Giấy báo nợ',
        numberVoucher: 'GBN0007',
        note: 'Thanh toán cho giấy báo nợ GBN0007'
    },
]
dataFLCQNN = [
    {
        id: 1,
        createdDate: '01/02/2021',
        code: 'BL0001',
        idCQNC: 1,
        amountReceipts: 1000000,
        invoiceNumber: 'INV0001',
    },
    {
        id: 2,
        createdDate: '02/02/2021',
        code: 'BL0002',
        idCQNC: 2,
        amountReceipts: 1200000,
        invoiceNumber: 'INV0002',

    },
    {
        id: 3,
        createdDate: '03/02/2021',
        code: 'BL0003',
        idCQNC: 3,
        amountReceipts: 1300000,
        invoiceNumber: 'INV0003',

    },
    {
        id: 4,
        createdDate: '04/02/2021',
        code: 'BL0004',
        idCQNC: 4,
        amountReceipts: 1400000,
        invoiceNumber: 'INV0004',

    },
    {
        id: 5,
        createdDate: '05/02/2021',
        code: 'BL0005',
        idCQNC: 5,
        amountReceipts: 1500000,
        invoiceNumber: 'INV0005',

    },
    {
        id: 6,
        createdDate: '06/02/2021',
        code: 'BL0006',
        idCQNC: 6,
        amountReceipts: 1600000,
        invoiceNumber: 'INV0006',

    },
    {
        id: 7,
        createdDate: '08/02/2021',
        code: 'BL0008',
        idCQNC: 8,
        amountReceipts: 1800000,
        invoiceNumber: 'INV0007',

    },
    {
        id: 8,
        createdDate: '08/02/2021',
        code: 'BL0008',
        idCQNC: 8,
        amountReceipts: 1800000,
        invoiceNumber: 'INV0008',

    },
    {
        id: 9,
        createdDate: '09/02/2021',
        code: 'BL0009',
        idCQNC: 9,
        amountReceipts: 1900000,
        invoiceNumber: 'INV0009',

    },
    {
        id: 10,
        createdDate: '10/02/2021',
        code: 'BL0010',
        idCQNC: 10,
        amountReceipts: 1110000,
        invoiceNumber: 'INV00010',

    },
]
async function handleCodeNumber(str, type) {
    var endCode = '';
    var behind = '';
    var headerCode = '';
    if (type == 'payment') {
        automaticCode = 'PC0001'
        behind = Number(str.slice(2, 10)) + 1
        headerCode = str.slice(0, 2)
    } else if (type == 'debtNotices') {
        automaticCode = 'GBN0001'
        behind = Number(str.slice(3, 10)) + 1
        headerCode = str.slice(0, 3)
    } else if (type == 'withdraw') {
        automaticCode = 'RQ0001'
        behind = Number(str.slice(2, 11)) + 1
        headerCode = str.slice(0, 2)
    }
    if (behind < 10)
        endCode = '000' + behind
    if (behind >= 10 && behind < 100)
        endCode = '00' + behind
    if (behind >= 100 && behind < 1000)
        endCode = '0' + behind
    if (behind >= 1000)
        endCode = behind

    return headerCode + endCode
}
async function convertNumber(number) {
    if (number < 10) {
        return '0' + number
    } else
        return number
}
async function getMoneyFollowMonthAndType(db, month, type) {
    let totalResult = 0;
    await mtblCoQuanNhaNuoc(db).findAll({
        where: {
            Date: { [Op.substring]: month },
            Type: type,
        }
    }).then(data => {
        for (item of data) {
            totalResult += Number(item.MoneyNumber)
        }
    })
    return totalResult
}
async function createDataPeriodBalanceFollowYear(db, year, moneyNumber, montFrom = 2) {
    // tạo dữ liệu theo năm
    let endingBalance = moneyNumber;
    for (let month = montFrom; month <= 12; month++) {
        let paymentMoney = await getMoneyFollowMonthAndType(db, year + '-' + await convertNumber(month - 1), 'payment');
        let debtNoticesMoney = await getMoneyFollowMonthAndType(db, year + '-' + await convertNumber(month - 1), 'debtNotices');
        let withdrawMoney = await getMoneyFollowMonthAndType(db, year + '-' + await convertNumber(month - 1), 'withdraw');
        let invoiceMoney = await getMoneyFollowMonthAndType(db, year + '-' + await convertNumber(month - 1), 'invoice');
        endingBalance = Number(endingBalance) + Number(paymentMoney) + Number(debtNoticesMoney) - Number(invoiceMoney) + Number(withdrawMoney)
        await mtblCoQuanNhaNuoc(db).create({
            Date: '2021-' + await convertNumber(month) + '-01',
            MoneyNumber: endingBalance,
            Type: 'period',
        })
    }
}
async function deleteAndCreatePeriodBalanceFollowMonth(db, month, year) {
    await mtblCoQuanNhaNuoc(db).destroy({
        where: {
            Type: 'period',
            Date: {
                [Op.gte]: year + '-' + await convertNumber(month + 1) + '-01'
            },
        }
    })
    let moneyNumber = 0;
    await mtblCoQuanNhaNuoc(db).findOne({
        where: {
            Type: 'period',
            Date: {
                [Op.substring]: year + '-' + await convertNumber(month)
            }
        }
    }).then(data => {
        if (data)
            moneyNumber = data.MoneyNumber
    })
    await createDataPeriodBalanceFollowYear(db, year, moneyNumber, month + 1)
}
var mtblCurrency = require('../tables/financemanage/tblCurrency')
var mtblRate = require('../tables/financemanage/tblRate')

module.exports = {
    deleteRelationshiptblCoQuanNhaNuoc,
    //  add_tbl_state_agencies
    // detailtblCoQuanNhaNuoc: (req, res) => {
    //     let body = req.body;
    //     database.connectDatabase().then(async db => {
    //         if (db) {
    //             try {
    //                 mtblCoQuanNhaNuoc(db).findOne({ where: { ID: body.id } }).then(data => {
    //                     if (data) {
    //                         var obj = {
    //                             id: data.ID,
    //                             name: data.Name,
    //                             code: data.Code,
    //                         }
    //                         var result = {
    //                             obj: obj,
    //                             status: Constant.STATUS.SUCCESS,
    //                             message: Constant.MESSAGE.ACTION_SUCCESS,
    //                         }
    //                         res.json(result);
    //                     } else {
    //                         res.json(Result.NO_DATA_RESULT)

    //                     }

    //                 })
    //             } catch (error) {
    //                 res.json(Result.SYS_ERROR_RESULT)
    //             }
    //         } else {
    //             res.json(Constant.MESSAGE.USER_FAIL)
    //         }
    //     })
    // },
    // add_tbl_state_agencies
    addtblCoQuanNhaNuoc: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // 3 type: debtNotices, payment, withdraw
                    mtblCoQuanNhaNuoc(db).create({
                        IDSpecializedSoftware: body.idSpecializedSoftware ? body.idSpecializedSoftware : null,
                        Date: body.date ? body.date : null,
                        VoucherNumber: body.voucherNumber ? body.voucherNumber : null,
                        MoneyNumber: body.moneyNumber ? body.moneyNumber : null,
                        Note: body.note ? body.note : null,
                        Type: body.type ? body.type : null,
                        Status: 'Mới',
                    }).then(async data => {
                        if (body.date) {
                            let month = Number(body.date.slice(5, 7));
                            let year = Number(body.date.slice(0, 4));
                            await deleteAndCreatePeriodBalanceFollowMonth(db, month, year)
                        }
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
    // update_tbl_state_agencies
    updatetblCoQuanNhaNuoc: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.voucherNumber || body.voucherNumber === '')
                        update.push({ key: 'VoucherNumber', value: body.voucherNumber });
                    if (body.note || body.note === '')
                        update.push({ key: 'Note', value: body.note });
                    if (body.type || body.type === '')
                        update.push({ key: 'Type', value: body.type });
                    if (body.idSpecializedSoftware || body.idSpecializedSoftware === '') {
                        if (body.idSpecializedSoftware === '')
                            update.push({ key: 'IDSpecializedSoftware', value: null });
                        else
                            update.push({ key: 'IDSpecializedSoftware', value: body.idSpecializedSoftware });
                    }
                    if (body.date || body.date === '') {
                        if (body.date === '')
                            update.push({ key: 'Date', value: null });
                        else
                            update.push({ key: 'Date', value: body.date });
                    }
                    if (body.moneyNumber || body.moneyNumber === '') {
                        if (body.moneyNumber === '')
                            update.push({ key: 'MoneyNumber', value: null });
                        else
                            update.push({ key: 'MoneyNumber', value: body.moneyNumber });
                    }
                    database.updateTable(update, mtblCoQuanNhaNuoc(db), body.id).then(response => {
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
    // delete_tbl_state_agencies
    deletetblCoQuanNhaNuoc: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblCoQuanNhaNuoc(db, listID);
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
    // get_list_tbl_state_agencies
    getListtblCoQuanNhaNuoc: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            var obj = {
                "paging":
                {
                    "pageSize": body.itemPerPage ? body.itemPerPage : 0,
                    "currentPage": body.page ? body.page : 0
                },
                "type": body.type
            }
            if (dataCQNN) {
                let array = []
                for (let item of dataCQNN) {
                    if (item.typeVoucher == 'Biên lai')
                        array.push(item)
                }
                var result = {
                    array: array,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                    all: 10
                }
                res.json(result);
            }
            else {
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // get_list_name_tbl_state_agencies
    getListNametblCoQuanNhaNuoc: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblCoQuanNhaNuoc(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                soChungTu: element.SoChungTu ? element.SoChungTu : '',
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
    // track_receipts
    trackReceipts: (req, res) => {
        let body = req.body;
        let array = [];
        let obj = {};
        let totalmoneyNC = 0;
        let totalckNC = 0;
        let totalsttbl = 0;
        let sdktcs = 0;
        let sdktcsCQNN = 0;
        let kq = 0;
        let sdq = 0;
        dataSearch = JSON.parse(body.dataSearch)
        database.connectDatabase().then(async db => {
            try {
                let stt = 1;
                for (var i = 0; i < dataFLCQNN.length; i++) {
                    let check = await mtblCoQuanNhaNuoc(db).findOne({
                        where: {
                            VoucherNumber: dataFLCQNN[i].code
                        }
                    })
                    if (!check)
                        await mtblCoQuanNhaNuoc(db).create({
                            IDSpecializedSoftware: dataFLCQNN[i].idCQNC ? dataFLCQNN[i].idCQNC : null,
                            Date: dataFLCQNN[i].createdDate ? moment(dataFLCQNN[i].createdDate).add(7, 'hours').format('DD/MM/YYYY') : null,
                            VoucherNumber: dataFLCQNN[i].code ? dataFLCQNN[i].code : null,
                            MoneyNumber: dataFLCQNN[i].amountReceipts ? dataFLCQNN[i].amountReceipts : null,
                            Note: null,
                            Type: 'invoice',
                            // Status: 'Mới',
                        })
                }
                var whereOjb = [];
                let yearNow = Number(moment().format('YYYY'));
                const currentYear = new Date().getFullYear()

                if (dataSearch.selection == 'first_six_months') {
                    await mtblCoQuanNhaNuoc(db).findOne({
                        where: {
                            Type: 'period',
                            Date: {
                                [Op.substring]: yearNow + '-01'
                            }
                        }
                    }).then(data => {
                        if (data)
                            sdktcs = data.MoneyNumber ? data.MoneyNumber : 0
                    })
                    const startedDate = new Date(currentYear + "-01-01 14:00:00");
                    const endDate = new Date(currentYear + "-06-30 14:00:00");
                    whereOjb.push({
                        Date: {
                            [Op.between]: [startedDate, endDate]
                        }
                    })
                } else if (dataSearch.selection == 'last_six_months') {
                    await mtblCoQuanNhaNuoc(db).findOne({
                        where: {
                            Type: 'period',
                            Date: {
                                [Op.substring]: yearNow + '-07'
                            }
                        }
                    }).then(data => {
                        if (data)
                            sdktcs = data.MoneyNumber ? data.MoneyNumber : 0
                    })
                    let startedDate = new Date(currentYear + "-06-01 07:00:00");
                    let endDate = new Date(currentYear + "-12-30 24:00:00");
                    whereOjb.push({
                        Date: {
                            [Op.between]: [startedDate, endDate]
                        }
                    })
                } else if (dataSearch.selection == 'one_quarter') {
                    await mtblCoQuanNhaNuoc(db).findOne({
                        where: {
                            Type: 'period',
                            Date: {
                                [Op.substring]: yearNow + '-01'
                            }
                        }
                    }).then(data => {
                        if (data)
                            sdktcs = data.MoneyNumber ? data.MoneyNumber : 0
                    })
                    let startedDate = new Date(currentYear + "-01-01 07:00:00");
                    let endDate = new Date(currentYear + "-04-01 00:00:00");
                    whereOjb.push({
                        Date: {
                            [Op.between]: [startedDate, endDate]
                        }
                    })
                } else if (dataSearch.selection == 'two_quarter') {
                    await mtblCoQuanNhaNuoc(db).findOne({
                        where: {
                            Type: 'period',
                            Date: {
                                [Op.substring]: yearNow + '-04'
                            }
                        }
                    }).then(data => {
                        if (data)
                            sdktcs = data.MoneyNumber ? data.MoneyNumber : 0
                    })
                    let startedDate = new Date(currentYear + "-04-01 07:00:00");
                    let endDate = new Date(currentYear + "-07-01 00:00:00");
                    whereOjb.push({
                        Date: {
                            [Op.between]: [startedDate, endDate]
                        }
                    })
                } else if (dataSearch.selection == 'three_quarter') {
                    await mtblCoQuanNhaNuoc(db).findOne({
                        where: {
                            Type: 'period',
                            Date: {
                                [Op.substring]: yearNow + '-07'
                            }
                        }
                    }).then(data => {
                        if (data)
                            sdktcs = data.MoneyNumber ? data.MoneyNumber : 0
                    })
                    let startedDate = new Date(currentYear + "-07-01 07:00:00");
                    let endDate = new Date(currentYear + "-10-01 00:00:00");
                    whereOjb.push({
                        Date: {
                            [Op.between]: [startedDate, endDate]
                        }
                    })
                } else if (dataSearch.selection == 'four_quarter') {
                    await mtblCoQuanNhaNuoc(db).findOne({
                        where: {
                            Type: 'period',
                            Date: {
                                [Op.substring]: yearNow + '-10'
                            }
                        }
                    }).then(data => {
                        if (data)
                            sdktcs = data.MoneyNumber ? data.MoneyNumber : 0
                    })
                    let startedDate = new Date(currentYear + "-10-01 07:00:00");
                    let endDate = new Date(currentYear + "-12-30 24:00:00");
                    whereOjb.push({
                        Date: {
                            [Op.between]: [startedDate, endDate]
                        }
                    })
                } else if (dataSearch.selection == 'last_year') {
                    await mtblCoQuanNhaNuoc(db).findOne({
                        where: {
                            Type: 'period',
                            Date: {
                                [Op.substring]: (yearNow - 1) + '-07'
                            }
                        }
                    }).then(data => {
                        if (data)
                            sdktcs = data.MoneyNumber ? data.MoneyNumber : 0
                    })
                    let startedDate = new Date((currentYear - 1) + "-01-01 07:00:00");
                    let endDate = new Date((currentYear - 1) + "-12-30 24:00:00");
                    whereOjb.push({
                        Date: {
                            [Op.between]: [startedDate, endDate]
                        }
                    })
                } else if (dataSearch.selection == 'this_year') {
                    await mtblCoQuanNhaNuoc(db).findOne({
                        where: {
                            Type: 'period',
                            Date: {
                                [Op.substring]: yearNow + '-01'
                            }
                        }
                    }).then(data => {
                        if (data)
                            sdktcs = data.MoneyNumber ? data.MoneyNumber : 0
                    })
                    let startedDate = new Date(currentYear + "-01-01 07:00:00");
                    let endDate = new Date(currentYear + "-12-30 24:00:00");
                    whereOjb.push({
                        Date: {
                            [Op.between]: [startedDate, endDate]
                        }
                    })
                } else if (dataSearch.dateFrom && dataSearch.dateTo) {
                    if (dataSearch.dateFrom)
                        await mtblCoQuanNhaNuoc(db).findOne({
                            where: {
                                Type: 'period',
                                Date: {
                                    [Op.substring]: (yearNow) + '-' + moment(dataSearch.dateFrom).format('MM')
                                }
                            }
                        }).then(data => {
                            if (data)
                                sdktcs = data.MoneyNumber ? data.MoneyNumber : 0
                        })
                    dataSearch.dateTo = moment(dataSearch.dateTo).add(2, 'days').format('YYYY-MM-DD')
                    whereOjb.push({
                        Date: {
                            [Op.between]: [dataSearch.dateFrom, dataSearch.dateTo]
                        }
                    })
                }
                whereOjb.push({
                    Type: {
                        [Op.ne]: 'period'
                    }
                })
                console.log(whereOjb);
                await mtblCoQuanNhaNuoc(db).findAll({
                    where: whereOjb,
                    order: [
                        ['Date', 'ASC']
                    ],
                }).then(data => {
                    let sdktcsCQNN = sdktcs;
                    for (item of data) {
                        totalmoneyNC += (item.Type == 'payment' ? item.MoneyNumber : null)
                        totalckNC += (item.Type == 'debtNotices' ? item.MoneyNumber : null)
                        sdq += (item.Type == 'withdraw' ? item.MoneyNumber : null)
                        totalsttbl += (item.Type == 'invoice' ? item.MoneyNumber : null)
                        array.push({
                            stt: stt,
                            id: item.ID,
                            soCT: item.VoucherNumber ? item.VoucherNumber : '',
                            ngayCT: item.Date ? moment(item.Date).add(7, 'hours').format('DD/MM/YYYY') : null,
                            moneyNC: item.Type == 'payment' ? item.MoneyNumber : null,
                            ckNC: item.Type == 'debtNotices' ? item.MoneyNumber : null,
                            rq: item.Type == 'withdraw' ? item.MoneyNumber : null,
                            invoiceNumber: item.Type == 'invoice' ? item.MoneyNumber : null,
                            sttbl: item.Type == 'invoice' ? item.MoneyNumber : null,
                            sdck: sdktcsCQNN + (item.Type == 'payment' ? Number(item.MoneyNumber) : 0) + (item.Type == 'debtNotices' ? Number(item.MoneyNumber) : 0) - (item.Type == 'invoice' ? Number(item.MoneyNumber) : 0) + (item.Type == 'withdraw' ? Number(item.MoneyNumber) : 0),
                        })
                        sdktcsCQNN = sdktcsCQNN + (item.Type == 'payment' ? Number(item.MoneyNumber) : 0) + (item.Type == 'debtNotices' ? Number(item.MoneyNumber) : 0) - (item.Type == 'invoice' ? Number(item.MoneyNumber) : 0) + (item.Type == 'withdraw' ? Number(item.MoneyNumber) : 0)
                        stt += 1;
                    }
                })

                obj = {
                    sdktcs: sdktcs,
                    sdcsks: sdktcs + totalmoneyNC + totalckNC - totalsttbl + sdq,
                    kq: kq,
                    totalRQ: sdq,
                    totalmoneyNC: totalmoneyNC,
                    totalckNC: totalckNC,
                    totalsttbl: totalsttbl,
                }
                obj['lines'] = array;
                var result = {
                    obj: obj,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                }
                res.json(result);
            } catch (error) {
                console.log(error);
            }

        })
    },
    // get_automatically_increasing_voucher_number_cqnn
    getAutomaticallyIncreasingVoucherNumberCQNN: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var check = await mtblCoQuanNhaNuoc(db).findOne({
                        where: { Type: body.type },
                        order: [
                            ['ID', 'DESC']
                        ],
                    })
                    var automaticCode = 'PC0001';
                    if (!check && body.type == 'payment') {
                        automaticCode = 'PC0001'
                    } else if (!check && body.type == 'debtNotices') {
                        automaticCode = 'GBN0001'
                    } else if (!check && body.type == 'withdraw') {
                        automaticCode = 'RQ0001'
                    } else {
                        automaticCode = await handleCodeNumber(check ? check.VoucherNumber : null, body.type)
                    }
                    var result = {
                        voucherNumber: automaticCode,
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
    // check_duplicate_voucher_number_cqnn
    checkDuplicateVoucherNumberCQNN: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var check = false;
                    let where = {}
                    if (body.voucherNumber)
                        where['VoucherNumber'] = body.voucherNumber
                    if (body.id)
                        where['ID'] = { [Op.ne]: body.id }
                    await mtblCoQuanNhaNuoc(db).findOne({
                        where: where
                    }).then(data => {
                        if (data) {
                            check = true
                        }
                    })
                    var result = {
                        check: check,
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
    // save_previous_period_balance
    savePreviousPeriodBalance: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // await mtblCoQuanNhaNuoc(db).destroy({
                    //     where: {
                    //         Type: 'period',
                    //     }
                    // })
                    // let yearNow = Number(moment().format('YYYY'));
                    // let checkExit = await mtblCoQuanNhaNuoc(db).findOne({
                    //     where: {
                    //         Type: 'period',
                    //         Date: '2021-01-01',
                    //     }
                    // })
                    // if (!checkExit)
                    //     await mtblCoQuanNhaNuoc(db).create({
                    //         Date: '2021-01-01',
                    //         MoneyNumber: body.moneyNumber ? body.moneyNumber : null,
                    //         Type: 'period',
                    //     })
                    // else {
                    //     await mtblCoQuanNhaNuoc(db).update({
                    //         MoneyNumber: body.moneyNumber ? body.moneyNumber : null,
                    //     }, {
                    //         where: {
                    //             ID: checkExit.ID,
                    //         }
                    //     })
                    // }
                    // // tạo dữ liệu theo năm
                    // for (let year = 2021; year <= yearNow; year++) {
                    //     await createDataPeriodBalanceFollowYear(db, year, body.moneyNumber)
                    // }
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
}