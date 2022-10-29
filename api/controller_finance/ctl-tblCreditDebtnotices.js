const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblCreditDebtnotices = require('../tables/financemanage/tblCreditDebtnotices')
var mtblCreditsAccounting = require('../tables/financemanage/tblCreditsAccounting')
var mtblNoticesRInvoice = require('../tables/financemanage/tblNoticesRInvoice')
var mtblCurrency = require('../tables/financemanage/tblCurrency')
var mtblDMTaiKhoanKeToan = require('../tables/financemanage/tblDMTaiKhoanKeToan')
var mtblAccountingBooks = require('../tables/financemanage/tblAccountingBooks')
var database = require('../database');
var mModules = require('../constants/modules');
var mtblVayTamUng = require('../tables/financemanage/tblVayTamUng')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var customerData = require('../controller_finance/ctl-apiSpecializedSoftware')

async function getDetailCustomer(id) {
    database.connectDatabase().then(async db => {
        if (db) {
            try {
                let dataCustomer = await customerData.getListCustomerOfPMCM(db)
                var obj = {}
                dataCustomer.forEach(item => {
                    if (item.id == id) {
                        obj = item
                    }
                })
                return obj
            } catch (e) {
                console.log(e + '' + 123);
            }
        }
    })
}
async function getDetailStaff(db, id) {
    let obj = await mtblDMNhanvien(db).findOne({
        where: {
            ID: id,
        }
    })
    return obj

}
async function getDetailPartner(id) {
    dataPartner = [{
        id: "2",
        partnerCode: "LOCK LOCK",
        name: "Công ty TNHH Lock & Lock",
        tax: "01245782110",
        address: "Số 72A Nguyễn Trãi phường Thượng Đỉnh Thanh Xuân Hà Nội",
        mobile: "0823145678",
        fax: "045784124",
        email: "locklockvn@gmail",
    },
    {
        id: "3",
        partnerCode: "HOA PHAT",
        name: "Công ty TNHH Hòa Phát ",
        tax: "012345678",
        address: "Số 12 Bạch Mai Hà Nội",
        mobile: "089745120",
        fax: "023145216",
        email: "hoaphat123@gmail.com",
    },
    {
        id: "4",
        partnerCode: "MEDIA MART",
        name: "Siêu thị điện máy xanh media mart",
        tax: "012345801",
        address: "Số 1 Trương Định Hà Nội",
        mobile: "089724152",
        fax: "021465741",
        email: "mediamart4546@gmail.com",
    },
    {
        id: "5",
        partnerCode: "GLOMED",
        name: "Công ty dược phẩm Glomed  ",
        tax: "012465563",
        address: "Số 34 Huỳnh Thúc Kháng Hà Nội",
        mobile: "012568523",
        fax: "012457821",
        email: "glomeddp@gmail.com",
    },
    {
        id: "6",
        partnerCode: "THUONG ĐINH",
        name: "Công ty giầy Thượng Đỉnh",
        tax: "012489660",
        address: "Số 2 Kim Ngưu Hà Nội",
        mobile: "021565635",
        fax: "014653225",
        email: "thuongdinhgiay@gmail.com",
    },
    {
        id: "7",
        partnerCode: "GIAY THANG LONG",
        name: "Công ty TNHH giày Thăng Long",
        tax: "012457821",
        address: "Số 2A Phường Khương Trung Thanh Xuân Hà Nội",
        mobile: "012465623",
        fax: "01774125",
        email: "giaytot@gmail.com",
    },
    {
        id: "8",
        partnerCode: "VINH DOAN",
        name: "Công ty cổ phần Vĩnh Đoàn",
        tax: "012458990",
        address: "Số 60 Vĩnh Tuy Hai Bà Trưng Hà Nội",
        mobile: "021565650",
        fax: "0158555245",
        email: "vinhdoan123@gmail.com",
    },
    {
        id: "9",
        partnerCode: "SINO VANLOCK",
        name: "Công ty sản xuất thiết bị điện Sino vanlock",
        tax: "0124456685",
        address: "SỐ 10 nguyễn Văn Cừ Long Biên Hà Nội",
        mobile: "0154878741",
        fax: "0157878865",
        email: "sinovanlock@gmail.com",
    },
    {
        id: "10",
        partnerCode: "TRUNG NGUYEN",
        name: "Tập đoàn cà phê Trung Nguyên",
        tax: "0125748546",
        address: "Thị Cấm Phường Xuân Phương Nam Từ Liêm Hà Nội",
        mobile: "045654565",
        fax: "013245422",
        email: "trugnnguyen@gmail.com",
    },

    ]
    var obj = {}
    dataPartner.forEach(item => {
        if (item.id == id) {
            obj = item
        }
    })
    return obj

}
async function deleteRelationshiptblCreditDebtnotices(db, listID) {
    await mtblAccountingBooks(db).destroy({ where: { IDnotices: { [Op.in]: listID } } })
    await mtblCreditsAccounting(db).destroy({ where: { IDCreditDebtnotices: { [Op.in]: listID } } })
    await mtblNoticesRInvoice(db).destroy({ where: { IDnotices: { [Op.in]: listID } } })

    await mtblCreditDebtnotices(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
async function handleCodeNumber(str) {
    var endCode = '';
    var behind = Number(str.slice(3, 10)) + 1
    if (behind < 10)
        endCode = '000' + behind
    if (behind >= 10 && behind < 100)
        endCode = '00' + behind
    if (behind >= 100 && behind < 1000)
        endCode = '0' + behind
    if (behind >= 1000)
        endCode = behind

    return str.slice(0, 3) + endCode
}
async function createAccountingBooks(db, listCredit, listDebit, idPayment, reason, number) {
    if (!number) {
        await mtblCreditDebtnotices(db).findOne({ where: { ID: idPayment } }).then(data => {
            number = data ? data.VoucherNumber : ''
        })
    }
    let now = moment().format('YYYY-MM-DD');
    for (var i = 0; i < listDebit.length; i++) {
        await mtblAccountingBooks(db).create({
            // CreateDate: now,
            // EntryDate: now,
            IDAccounting: listDebit[i].debtAccount.id,
            DebtIncurred: listDebit[i].amountOfMoney,
            CreditIncurred: 0,
            IDnotices: idPayment,
            Reason: reason,
            Number: number,
        })
    }
    for (var j = 0; j < listCredit.length; j++) {
        await mtblAccountingBooks(db).create({
            CreateDate: now,
            EntryDate: now,
            IDAccounting: listCredit[j].hasAccount.id,
            CreditIncurred: listCredit[j].amountOfMoney,
            DebtIncurred: 0,
            IDnotices: idPayment,
            Reason: reason,
            Number: number,
        })
    }
}
async function getDetailCustomer(id) {
    database.connectDatabase().then(async db => {
        if (db) {
            try {
                let dataCustomer = await customerData.getListCustomerOfPMCM(db)
                var obj = {}
                dataCustomer.forEach(item => {
                    if (item.id == id) {
                        obj = item
                    }
                })
                return obj
            } catch (e) {
                console.log(e + '' + 123);
            }
        }
    })

}
async function createLoanAdvances(db, IDnoticesCD, loanAdvanceIDs, type) {
    if (loanAdvanceIDs.length > 0 && type == 'debit') {
        for (var i = 0; i < loanAdvanceIDs.length; i++) {
            await mtblVayTamUng(db).update({
                Status: 'Chờ hoàn ứng',
                IDnoticesCD: IDnoticesCD,
            }, {
                where: { ID: loanAdvanceIDs[i] }
            })
        }
    } else if (loanAdvanceIDs.length > 0 && type == 'spending') {
        for (var i = 0; i < loanAdvanceIDs.length; i++) {
            await mtblVayTamUng(db).update({
                Status: 'Đã hoàn ứng',
                IDnoticesCD: IDnoticesCD,
            }, {
                where: { ID: loanAdvanceIDs[i] }
            })
        }
    }
}
async function updateLoanAdvances(db, IDpayment, loanAdvanceIDs) {
    let payment = await mtblCreditDebtnotices(db).findOne({ where: { ID: IDpayment } })
    await mtblVayTamUng(db).update({
        Status: 'Tạo phiếu chi',
        IDnoticesCD: null,
    }, {
        where: { IDnoticesCD: IDpayment }
    })
    if (loanAdvanceIDs.length > 0 && payment.Type == 'debit') {
        for (var i = 0; i < loanAdvanceIDs.length; i++) {
            await mtblVayTamUng(db).update({
                Status: 'Chờ hoàn ứng',
                IDnoticesCD: IDpayment,
            }, {
                where: { ID: loanAdvanceIDs[i] }
            })
        }
    } else if (loanAdvanceIDs.length > 0 && payment.Type == 'spending') {
        for (var i = 0; i < loanAdvanceIDs.length; i++) {
            await mtblVayTamUng(db).update({
                Status: 'Đã hoàn ứng',
                IDnoticesCD: IDpayment,
            }, {
                where: { ID: loanAdvanceIDs[i] }
            })
        }
    }
}
module.exports = {
    deleteRelationshiptblCreditDebtnotices,
    //  get_detail_tbl_credit_debt_notices
    detailtblCreditDebtnotices: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblCreditDebtnotices = mtblCreditDebtnotices(db);
                    tblCreditDebtnotices.belongsTo(mtblCurrency(db), { foreignKey: 'IDCurrency', sourceKey: 'IDCurrency', as: 'currency' })
                    tblCreditDebtnotices.findOne({
                        where: { ID: body.id },
                        include: [
                            {
                                model: mtblCurrency(db),
                                required: false,
                                as: 'currency'
                            },
                        ],
                    }).then(async data => {
                        if (data) {
                            let dataCus = await getDetailCustomer(data.IDCustomer)
                            var obj = {
                                id: data.ID,
                                type: data.Type ? data.Type : '',
                                idCurrency: data.IDCurrency ? data.IDCurrency : null,
                                applicantReceiverName: data.ApplicantReceiverName ? data.ApplicantReceiverName : '',
                                // fullNameCurrency: data.currency ? data.currency.FullName : null,
                                currencyName: data.currency ? data.currency.ShortName : '',
                                date: data.Date ? data.Date : null,
                                voucherNumber: data.VoucherNumber ? data.VoucherNumber : '',
                                idCustomer: data.IDCustomer ? data.IDCustomer : null,
                                customerName: dataCus ? dataCus.name : '',
                                customerAddress: dataCus ? dataCus.address : '',
                                customerCode: dataCus ? dataCus.customerCode : '',
                                amount: data.Amount ? data.Amount : null,
                                amountWords: data.AmountWords ? data.AmountWords : '',
                                reason: data.Reason ? data.Reason : '',
                                idManager: data.IDManager ? data.IDManager : null,
                                idAccountant: data.IDAccountant ? data.IDAccountant : null,
                                idTreasurer: data.IDTreasurer ? data.IDTreasurer : null,
                                idEstablishment: data.IDEstablishment ? data.IDEstablishment : null,
                                idSubmitter: data.IDSubmitter ? data.IDSubmitter : null,
                                idPartner: data.IDPartner ? data.IDPartner : null,
                                isUndefined: data.Undefined ? data.Undefined : null,
                            }
                            var listCredit = []
                            var listDebit = []
                            var listInvoiceID = []
                            await mtblNoticesRInvoice(db).findAll({ where: { IDnotices: data.ID } }).then(data => {
                                data.forEach(item => {
                                    listInvoiceID.push(Number(item.IDSpecializedSoftware))
                                })
                            })
                            let tblCreditsAccounting = mtblCreditsAccounting(db);
                            tblCreditsAccounting.belongsTo(mtblDMTaiKhoanKeToan(db), { foreignKey: 'IDAccounting', sourceKey: 'IDAccounting', as: 'acc' })
                            await tblCreditsAccounting.findAll({
                                include: [
                                    {
                                        model: mtblDMTaiKhoanKeToan(db),
                                        required: false,
                                        as: 'acc'
                                    },
                                ],
                                where: {
                                    IDCreditDebtnotices: data.ID,
                                    type: "CREDIT"
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    listCredit.push({
                                        hasAccount: {
                                            id: item.acc ? item.acc.ID : '',
                                            accountingName: item.acc ? item.acc.AccountingName : '',
                                            accountingCode: item.acc ? item.acc.AccountingCode : '',
                                        },
                                        amountOfMoney: item.Amount,
                                    })
                                })
                            })
                            await tblCreditsAccounting.findAll({
                                include: [
                                    {
                                        model: mtblDMTaiKhoanKeToan(db),
                                        required: false,
                                        as: 'acc'
                                    },
                                ],
                                where: {
                                    IDCreditDebtnotices: data.ID,
                                    type: "DEBIT"
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    listDebit.push({
                                        debtAccount: {
                                            id: item.acc ? item.acc.ID : '',
                                            accountingName: item.acc ? item.acc.AccountingName : '',
                                            accountingCode: item.acc ? item.acc.AccountingCode : '',
                                        },
                                        amountOfMoney: item.Amount,
                                    })
                                })
                            })
                            obj['arrayCredit'] = listCredit
                            obj['arrayDebit'] = listDebit
                            obj['listInvoiceID'] = listInvoiceID
                            if (data.IDStaff) {
                                let staff = await mtblDMNhanvien(db).findOne({
                                    where: { ID: data.IDStaff }
                                })
                                obj['object'] = {
                                    name: staff ? staff.StaffName : '',
                                    code: staff ? staff.StaffCode : '',
                                    address: staff ? staff.Address : '',
                                    id: data.IDStaff,
                                    displayName: '[' + (staff ? staff.StaffCode : '') + '] ' + (staff ? staff.StaffName : ''),
                                    type: 'staff',
                                }
                            } else if (data.IDPartner) {
                                let dataPartner = await getDetailPartner(data.IDPartner)
                                obj['object'] = {
                                    name: dataPartner ? dataPartner.name : '',
                                    code: dataPartner ? dataPartner.partnerCode : '',
                                    address: dataPartner ? dataPartner.address : '',
                                    displayName: '[' + (dataPartner ? dataPartner.partnerCode : '') + '] ' + (dataPartner ? dataPartner.name : ''),
                                    id: data.IDPartner,
                                    type: 'partner',
                                }
                            } else {
                                let dataCus = await getDetailCustomer(data.IDCustomer)
                                obj['object'] = {
                                    name: dataCus ? dataCus.name : '',
                                    code: dataCus ? dataCus.customerCode : '',
                                    displayName: '[' + (dataCus ? dataCus.customerCode : '') + '] ' + (dataCus ? dataCus.name : ''),
                                    address: dataCus ? dataCus.address : '',
                                    id: data.IDCustomer,
                                    type: 'customer',
                                }
                            }
                            let loanAdvanceIDs = []
                            await mtblVayTamUng(db).findAll({ where: { IDnoticesCD: body.id } }).then(data => {
                                data.forEach(item => {
                                    loanAdvanceIDs.push(Number(item.ID))
                                })
                            })
                            obj['loanAdvanceIDs'] = loanAdvanceIDs;
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
    // add_tbl_credit_debt_notices
    addtblCreditDebtnotices: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var listCredit = JSON.parse(body.listCredit)
                    var listDebit = JSON.parse(body.listDebit)
                    var listInvoiceID = JSON.parse(body.listInvoiceID)
                    let objCreate = {
                        Type: body.type ? body.type : '',
                        ApplicantReceiverName: body.applicantReceiverName ? body.applicantReceiverName : '',
                        IDCurrency: body.idCurrency ? body.idCurrency : null,
                        Date: body.date ? body.date : null,
                        VoucherNumber: body.voucherNumber ? body.voucherNumber : 'GBN/GBC',
                        Amount: body.amount ? body.amount : null,
                        AmountWords: body.amountWords ? body.amountWords : '',
                        Reason: body.reason ? body.reason : '',
                        IDManager: body.idManager ? body.idManager : null,
                        IDAccountant: body.idAccountant ? body.idAccountant : null,
                        IDTreasurer: body.idTreasurer ? body.idTreasurer : null,
                        IDEstablishment: body.idEstablishment ? body.idEstablishment : null,
                        IDSubmitter: body.idSubmitter ? body.idSubmitter : null,
                        // Undefined: body.isUndefined ? body.isUndefined : null,
                    }
                    body.object = JSON.parse(body.object)
                    if (body.object.type == 'staff')
                        objCreate['IDStaff'] = body.object.id
                    else if (body.object.type == 'partner')
                        objCreate['IDPartner'] = body.object.id
                    else
                        objCreate['IDCustomer'] = body.object.id
                    mtblCreditDebtnotices(db).create(objCreate).then(async data => {
                        //  Hoàn ứng tạm ứng
                        if (body.loanAdvanceIDs) {
                            body.loanAdvanceIDs = JSON.parse(body.loanAdvanceIDs)
                            // for (let idNo = 0; idNo < body.loanAdvanceIDs.length; idNo++)
                            await createLoanAdvances(db, data.ID, body.loanAdvanceIDs, body.type)
                        }
                        if (body.loanAdvanceID) {
                            await mtblVayTamUng(db).update({
                                Status: 'Chờ hoàn ứng',
                                IDnoticesCD: data.ID,
                            }, {
                                where: { ID: body.loanAdvanceID }
                            })
                        }
                        // ------------------------------------------------------------------------------------------------------------
                        await createAccountingBooks(db, listCredit, listDebit, data.ID, body.reason ? body.reason : '', voucherNumber)
                        for (var i = 0; i < listInvoiceID.length; i++) {
                            await mtblNoticesRInvoice(db).create({
                                IDnotices: data.ID,
                                IDSpecializedSoftware: listInvoiceID[i],
                            })
                        }
                        for (var i = 0; i < listCredit.length; i++) {
                            await mtblCreditsAccounting(db).create({
                                IDCreditDebtnotices: data.ID,
                                IDAccounting: listCredit[i].hasAccount.id,
                                Type: "CREDIT",
                                Amount: listCredit[i].amountOfMoney ? listCredit[i].amountOfMoney : 0,
                            })
                        }
                        for (var j = 0; j < listDebit.length; j++) {
                            await mtblCreditsAccounting(db).create({
                                IDCreditDebtnotices: data.ID,
                                IDAccounting: listDebit[j].debtAccount.id,
                                Type: "DEBIT",
                                Amount: listDebit[j].amountOfMoney ? listDebit[j].amountOfMoney : 0,
                            })
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
    // update_tbl_credit_debt_notices
    updatetblCreditDebtnotices: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    var listCredit = JSON.parse(body.listCredit)
                    var listDebit = JSON.parse(body.listDebit)
                    var listInvoiceID = JSON.parse(body.listInvoiceID)
                    if (body.loanAdvanceIDs) {
                        body.loanAdvanceIDs = JSON.parse(body.loanAdvanceIDs)
                        // for (let idNo = 0; idNo < body.loanAdvanceIDs.length; idNo++) {
                        await updateLoanAdvances(db, body.id, body.loanAdvanceIDs)

                        // }
                    }
                    if (listCredit.length > 0 && listDebit.length > 0) {
                        await mtblCreditsAccounting(db).destroy({ where: { IDCreditDebtnotices: body.id } })
                        for (var i = 0; i < listCredit.length; i++) {
                            await mtblAccountingBooks(db).destroy({ where: { IDAccounting: listCredit[i].hasAccount.id } })
                            await mtblCreditsAccounting(db).create({
                                IDCreditDebtnotices: body.id,
                                IDAccounting: listCredit[i].hasAccount.id,
                                Type: "CREDIT",
                                Amount: listCredit[i].amountOfMoney ? listCredit[i].amountOfMoney : 0,
                            })
                        }
                        for (var j = 0; j < listDebit.length; j++) {
                            await mtblAccountingBooks(db).destroy({ where: { IDAccounting: listDebit[j].debtAccount.id } })

                            await mtblCreditsAccounting(db).create({
                                IDCreditDebtnotices: body.id,
                                IDAccounting: listDebit[j].debtAccount.id,
                                Type: "DEBIT",
                                Amount: listDebit[j].amountOfMoney ? listDebit[j].amountOfMoney : 0,
                            })
                        }
                    }
                    await createAccountingBooks(db, listCredit, listDebit, body.id, body.reason ? body.reason : '', null)
                    for (var i = 0; i < listInvoiceID.length; i++) {
                        await mtblNoticesRInvoice(db).destroy({ where: { ID: body.id } })
                        await mtblNoticesRInvoice(db).create({
                            IDnotices: body.id,
                            IDSpecializedSoftware: listInvoiceID[i],
                        })
                    }

                    update.push({ key: 'Undefined', value: body.isUndefined ? body.isUndefined : false });
                    if (body.type || body.type === '')
                        update.push({ key: 'Type', value: body.type });
                    if (body.applicantReceiverName || body.applicantReceiverName === '')
                        update.push({ key: 'ApplicantReceiverName', value: body.applicantReceiverName });
                    if (body.voucherNumber || body.voucherNumber === '')
                        update.push({ key: 'VoucherNumber', value: body.voucherNumber });
                    if (body.amountWords || body.amountWords === '')
                        update.push({ key: 'AmountWords', value: body.amountWords });
                    if (body.reason || body.reason === '')
                        update.push({ key: 'Reason', value: body.reason });
                    if (body.idCurrency || body.idCurrency === '') {
                        if (body.idCurrency === '')
                            update.push({ key: 'IDCurrency', value: null });
                        else
                            update.push({ key: 'IDCurrency', value: body.idCurrency });
                    }
                    if (body.date || body.date === '') {
                        if (body.date === '')
                            update.push({ key: 'Date', value: null });
                        else
                            update.push({ key: 'Date', value: body.date });
                    }
                    if (body.idCustomer || body.idCustomer === '') {
                        if (body.idCustomer === '')
                            update.push({ key: 'IDCustomer', value: null });
                        else
                            update.push({ key: 'IDCustomer', value: body.idCustomer });
                    }
                    if (body.idCustomer || body.idCustomer === '') {
                        if (body.idCustomer === '')
                            update.push({ key: 'IDPartner', value: null });
                        else
                            update.push({ key: 'IDPartner', value: body.idCustomer });
                    }
                    if (body.amount || body.amount === '') {
                        if (body.amount === '')
                            update.push({ key: 'Amount', value: null });
                        else
                            update.push({ key: 'Amount', value: body.amount });
                    }
                    if (body.idManager || body.idManager === '') {
                        if (body.idManager === '')
                            update.push({ key: 'IDManager', value: null });
                        else
                            update.push({ key: 'IDManager', value: body.idManager });
                    }
                    if (body.idAccountant || body.idAccountant === '') {
                        if (body.idAccountant === '')
                            update.push({ key: 'IDAccountant', value: null });
                        else
                            update.push({ key: 'IDAccountant', value: body.idAccountant });
                    }
                    if (body.idTreasurer || body.idTreasurer === '') {
                        if (body.idTreasurer === '')
                            update.push({ key: 'IDTreasurer', value: null });
                        else
                            update.push({ key: 'IDTreasurer', value: body.idTreasurer });
                    }
                    if (body.idEstablishment || body.idEstablishment === '') {
                        if (body.idEstablishment === '')
                            update.push({ key: 'IDEstablishment', value: null });
                        else
                            update.push({ key: 'IDEstablishment', value: body.idEstablishment });
                    }
                    if (body.idSubmitter || body.idSubmitter === '') {
                        if (body.idSubmitter === '')
                            update.push({ key: 'IDSubmitter', value: null });
                        else
                            update.push({ key: 'IDSubmitter', value: body.idSubmitter });
                    }
                    database.updateTable(update, mtblCreditDebtnotices(db), body.id).then(response => {
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
    // delete_tbl_credit_debt_notices
    deletetblCreditDebtnotices: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblCreditDebtnotices(db, listID);
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
    // get_list_tbl_credit_debt_notices
    getListtblCreditDebtnotices: (req, res) => {
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
                    let tblCreditDebtnotices = mtblCreditDebtnotices(db);
                    tblCreditDebtnotices.belongsTo(mtblCurrency(db), { foreignKey: 'IDCurrency', sourceKey: 'IDCurrency', as: 'currency' })

                    tblCreditDebtnotices.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: { Type: body.type },
                        order: [
                            ['ID', 'DESC']
                        ],
                        include: [
                            {
                                model: mtblCurrency(db),
                                required: false,
                                as: 'currency'
                            },
                        ],
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            let dataCus = await getDetailCustomer(data[i].IDCustomer)
                            let dataStaff = await getDetailStaff(db, data[i].IDStaff)
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                type: data[i].Type ? data[i].Type : '',
                                idCurrency: data[i].IDCurrency ? data[i].IDCurrency : null,
                                fullNameCurrency: data[i].currency ? data[i].currency.FullName : null,
                                shortNameCurrency: data[i].currency ? data[i].currency.ShortName : null,
                                date: data[i].Date ? moment(data[i].Date).format('DD/MM/YYYY') : null,
                                voucherNumber: data[i].VoucherNumber ? data[i].VoucherNumber : '',
                                idCustomer: data[i].IDCustomer ? data[i].IDCustomer : null,
                                customerName: dataCus.name ? dataCus.name : dataStaff.StaffName,
                                staffName: dataStaff ? dataStaff.StaffName : '',
                                amount: data[i].Amount ? data[i].Amount : null,
                                amountWords: data[i].AmountWords ? data[i].AmountWords : '',
                                reason: data[i].Reason ? data[i].Reason : '',
                                idManager: data[i].IDManager ? data[i].IDManager : null,
                                idAccountant: data[i].IDAccountant ? data[i].IDAccountant : null,
                                idTreasurer: data[i].IDTreasurer ? data[i].IDTreasurer : null,
                                idEstablishment: data[i].IDEstablishment ? data[i].IDEstablishment : null,
                                idSubmitter: data[i].IDSubmitter ? data[i].IDSubmitter : null,
                                idPartner: data[i].IDPartner ? data[i].IDPartner : null,
                            }
                            var listCredit = []
                            var listDebit = []
                            let tblCreditsAccounting = mtblCreditsAccounting(db);
                            tblCreditsAccounting.belongsTo(mtblDMTaiKhoanKeToan(db), { foreignKey: 'IDAccounting', sourceKey: 'IDAccounting', as: 'acc' })
                            await tblCreditsAccounting.findAll({
                                include: [
                                    {
                                        model: mtblDMTaiKhoanKeToan(db),
                                        required: false,
                                        as: 'acc'
                                    },
                                ],
                                where: {
                                    IDCreditDebtnotices: data[i].ID,
                                    type: "CREDIT"
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    listCredit.push({
                                        hasAccount: {
                                            id: item.acc ? item.acc.ID : '',
                                            accountingName: item.acc ? item.acc.AccountingName : '',
                                            accountingCode: item.acc ? item.acc.AccountingCode : '',
                                        },
                                        amountOfMoney: item.Amount,
                                    })
                                })
                            })
                            await tblCreditsAccounting.findAll({
                                include: [
                                    {
                                        model: mtblDMTaiKhoanKeToan(db),
                                        required: false,
                                        as: 'acc'
                                    },
                                ],
                                where: {
                                    IDCreditDebtnotices: data[i].ID,
                                    type: "DEBIT"
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    listDebit.push({
                                        debtAccount: {
                                            id: item.acc ? item.acc.ID : '',
                                            accountingName: item.acc ? item.acc.AccountingName : '',
                                            accountingCode: item.acc ? item.acc.AccountingCode : '',
                                        },
                                        amountOfMoney: item.Amount,
                                    })
                                })
                            })
                            obj["arrayCredit"] = listCredit
                            obj["arrayDebit"] = listDebit
                            array.push(obj);
                            stt += 1;
                        }
                        var count = await mtblCreditDebtnotices(db).count({ where: { Type: body.type } })
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
    // get_automatically_increasing_voucher_number_credit_debt_notices
    getAutomaticallyIncreasingVoucherNumberCDN: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var voucherNumber = '';
                    if (body.type == 'spending') {
                        voucherNumber = await mModules.automaticCode(mtblCreditDebtnotices(db), 'VoucherNumber', 'GBC', 'spending')
                    } else {
                        voucherNumber = await mModules.automaticCode(mtblCreditDebtnotices(db), 'VoucherNumber', 'GBN', 'debit')
                    }
                    var result = {
                        voucherNumber: voucherNumber,
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
    // check_duplicate_voucher_number_credit_debt_notices
    checkDuplicateVoucherNumberCDN: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var check = false;
                    if (body.voucherNumber)
                        await mtblCreditDebtnotices(db).findOne({
                            where: { VoucherNumber: body.voucherNumber }
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
}