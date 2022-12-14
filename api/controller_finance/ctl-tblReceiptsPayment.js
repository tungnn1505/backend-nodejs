const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Sequelize = require('sequelize');
const axios = require('axios');

const Result = require('../constants/result');
var moment = require('moment');
var mtblReceiptsPayment = require('../tables/financemanage/tblReceiptsPayment')
var mtblPaymentAccounting = require('../tables/financemanage/tblPaymentAccounting')
var mtblVanPhongPham = require('../tables/qlnb/tblVanPhongPham')
var database = require('../database');
var mtblDMTaiKhoanKeToan = require('../tables/financemanage/tblDMTaiKhoanKeToan')
var mtblInvoice = require('../tables/financemanage/tblInvoice')
var mtblPaymentRPayment = require('../tables/financemanage/tblPaymentRPayment')
var mtblPaymentRInvoice = require('../tables/financemanage/tblPaymentRInvoice')
var mtblInvoiceRCurrency = require('../tables/financemanage/tblInvoiceRCurrency')
var mtblRate = require('../tables/financemanage/tblRate')
var mtblCurrency = require('../tables/financemanage/tblCurrency')
var mtblVayTamUng = require('../tables/financemanage/tblVayTamUng')
var mtblAccountingBooks = require('../tables/financemanage/tblAccountingBooks')
var mtblTaiSan = require('../tables/qlnb/tblTaiSan')
var mtblDeNghiThanhToan = require('../tables/qlnb/tblDeNghiThanhToan')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblCustomer = require('../tables/financemanage/tblCustomer')
var customerData = require('../controller_finance/ctl-apiSpecializedSoftware')
var mtblCoQuanNhaNuoc = require('../tables/financemanage/tblCoQuanNhaNuoc')
var mtblYeuCauMuaSam = require('../tables/qlnb/tblYeuCauMuaSam')
var mtblFileAttach = require('../tables/constants/tblFileAttach');
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblDMChiNhanh = require('../tables/constants/tblDMChiNhanh')
var mtblYeuCauMuaSamDetail = require('../tables/qlnb/tblYeuCauMuaSamDetail')
var mtblDMHangHoa = require('../tables/qlnb/tblDMHangHoa');

async function deleteRelationshiptblReceiptsPayment(db, listID) {
    // Tr??? l???i ti???n
    var payment = await mtblPaymentRPayment(db).findAll({
        where: {
            IDPayment: {
                [Op.in]: listID
            }
        }
    })
    await mtblPaymentRInvoice(db).findAll({
        where: {
            IDPayment: {
                [Op.in]: listID
            }
        }
    }).then(async data => {
        for (let d = 0; d < data.length; d++) {
            let payment = await mtblReceiptsPayment(db).findOne({
                where: {
                    ID: data[d].IDPayment
                }
            })
            if (data[d].IDSpecializedSoftware) {
                let objPmcm = {
                    "id": data[d].IDSpecializedSoftware,
                    "status": 2
                }
                console.log(objPmcm);
                await axios.post(`???http://ageless-ldms-api.vnsolutiondev.com/api/v1/receipt/changestatus_pmtc`, objPmcm).then(async data => {
                    console.log(data);
                })
                console.log('----------------------------------------?????i api PMCM---------------------------------------');
                let inv = await mtblInvoice(db).findOne({
                    where: {
                        IDSpecializedSoftware: data[d].IDSpecializedSoftware
                    }
                })
                if (inv)
                    await mtblInvoice(db).update({
                        Status: 'Ch??? thanh to??n',
                        PayDate: null,
                        Payments: null,
                        PaidAmount: inv.PaidAmount - data[d].Amount,
                        UnpaidAmount: inv.PaidAmount + data[d].Amount,
                    }, {
                        where: {
                            IDSpecializedSoftware: data[d].IDSpecializedSoftware
                        }
                    })
                    // let invoice = await mtblInvoice(db).findOne({
                    //     where: {
                    //         IDSpecializedSoftware: data[d].IDSpecializedSoftware
                    //     }
                    // })
                    // let invoiceOld = await mtblInvoiceRCurrency(db).findAll({
                    //     where: {
                    //         InvoiceID: invoice ? invoice.ID : null,
                    //         CurrencyID: payment ? payment.IDCurrency : null,
                    //     }
                    // })
                    // for (let item of invoiceOld) {
                    //     if (payment) {
                    //         let paidAmount = Number(item.PaidAmount ? item.PaidAmount : 0) - Number(data[d].Amount ? data[d].Amount : 0);
                    //         let unpaidAmount = Number(item.UnpaidAmount ? item.UnpaidAmount : 0) + Number(data[d].Amount ? data[d].Amount : 0)
                    //         await mtblInvoiceRCurrency(db).update({
                    //             UnpaidAmount: unpaidAmount,
                    //             PaidAmount: paidAmount,
                    //             Status: 'Ch??? thanh to??n'
                    //         }, {
                    //             where: {
                    //                 InvoiceID: item.InvoiceID,
                    //                 CurrencyID: item.CurrencyID,
                    //             }
                    //         })
                    //     }
                    // }
            }
        }
    })
    await mtblPaymentRInvoice(db).destroy({
        where: {
            IDPayment: {
                [Op.in]: listID
            }
        }
    })
    if (payment) {
        for (var i = 0; i < payment.length; i++) {
            let paymentUpdate = await mtblReceiptsPayment(db).findOne({
                where: { ID: payment[i].IDPaymentR }
            })
            await mtblReceiptsPayment(db).update({
                UnpaidAmount: paymentUpdate.UnpaidAmount + (payment[i].Amount ? payment[i].Amount : 0),
                PaidAmount: paymentUpdate.PaidAmount - (payment[i].Amount ? payment[i].Amount : 0),
                Unknown: true,
            }, {
                where: {
                    ID: payment[i].IDPaymentR
                }
            })
        }
    }
    await mtblCoQuanNhaNuoc(db).destroy({
        where: {
            ReceiptsPaymentID: {
                [Op.in]: listID
            }
        }
    })
    await mtblPaymentRPayment(db).destroy({
        where: {
            IDPayment: {
                [Op.in]: listID
            }
        }
    })
    await mtblTaiSan(db).update({
        IDReceiptsPayment: null
    }, {
        where: {
            IDReceiptsPayment: {
                [Op.in]: listID
            }
        }
    })
    await mtblAccountingBooks(db).destroy({
        where: {
            IDPayment: {
                [Op.in]: listID
            }
        }
    })
    let arrayCustomerID = []
    await mtblReceiptsPayment(db).findAll({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    }).then(async data => {
        for (var i = 0; i < data.length; i++) {
            if (data[i] && data[i].Type == 'payment') {
                await mtblDeNghiThanhToan(db).update({
                    IDReceiptsPayment: null,
                    Status: 'Ch??? t???o phi???u chi',
                }, {
                    where: {
                        IDReceiptsPayment: data[i].ID
                    }
                })
            } else if (data[i] && data[i].Type == 'inventoryReceiving') {
                await mtblDeNghiThanhToan(db).update({
                    IDReceipts: null,
                    Status: 'Ch??? nh???p kho',
                }, {
                    where: {
                        IDReceipts: data[i].ID
                    }
                })
            }
            if (data[i].Type == 'payment')
                await mtblVayTamUng(db).update({
                    IDReceiptsPayment: null,
                    Status: 'T???o phi???u chi'
                }, {
                    where: {
                        IDReceiptsPayment: data[i].ID
                    }
                })
            else
                await mtblVayTamUng(db).update({
                    IDReceiptsPayment: null,
                    Status: 'Ch??? ho??n ???ng'
                }, {
                    where: {
                        IDReceiptsPayment: data[i].ID
                    }
                })
                // Th??m m???i s??? ti???n kh??ng x??c ?????nh
            arrayCustomerID.push(data[i].IDCustomer)
        }
    })
    await mtblPaymentRPayment(db).destroy({
        where: {
            IDPayment: {
                [Op.in]: listID
            }
        }
    })
    await mtblPaymentAccounting(db).destroy({
        where: {
            IDReceiptsPayment: {
                [Op.in]: listID
            }
        }
    })
    await mtblReceiptsPayment(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
    for (item of arrayCustomerID)
        await updateUnspecifiedAmountOfCustomer(db, item)
}
async function handleCodeNumber(str, type) {
    var endCode = '';
    var behind = '';
    var headerCode = '';
    if (type == 'receipt') {
        automaticCode = 'PT0001'
        behind = Number(str.slice(2, 10)) + 1
        headerCode = str.slice(0, 2)
    } else if (type == 'payment') {
        automaticCode = 'PC0001'
        behind = Number(str.slice(2, 10)) + 1
        headerCode = str.slice(0, 2)
    } else if (type == 'debit') {
        automaticCode = 'GBN0001'
        behind = Number(str.slice(3, 11)) + 1
        headerCode = str.slice(0, 3)
    } else if (type == 'spending') {
        automaticCode = 'GBC0001'
        behind = Number(str.slice(3, 11)) + 1
        headerCode = str.slice(0, 3)
    } else if (type == 'accounting') {
        automaticCode = 'PKT0001'
        behind = Number(str.slice(3, 11)) + 1
        headerCode = str.slice(0, 3)
    } else if (type == 'inventoryReceiving') {
        automaticCode = 'PKT0001'
        behind = Number(str.slice(3, 11)) + 1
        headerCode = str.slice(0, 3)
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
async function createRate(db, exchangeRate, idCurrency) {
    let check;
    let searchNow = moment().format('YYYY-MM-DD');
    if (idCurrency)
        check = await mtblRate(db).findOne({
            where: {
                Date: {
                    [Op.substring]: searchNow
                },
                IDCurrency: idCurrency,
            }
        })
    if (check)
        mtblRate(db).update({
            ExchangeRate: exchangeRate ? exchangeRate : null,
        }, { where: { ID: check.ID } })
    else
        mtblRate(db).create({
            IDCurrency: idCurrency ? idCurrency : null,
            Date: searchNow,
            ExchangeRate: exchangeRate ? exchangeRate : null,
        })
}
async function deleteAndCreateAllPayment(db, id, listUndefinedID, withdrawalMoney) {
    // X??a b???n ghi c??, c??ng l???i ti???n cho b???n ghi c??
    var payment = await mtblPaymentRPayment(db).findAll({
        where: {
            IDPayment: id
        }
    })
    if (payment) {
        for (var i = 0; i < payment.length; i++) {
            let paymentUpdate = await mtblReceiptsPayment(db).findOne({
                where: { ID: payment[i].IDPaymentR }
            })
            await mtblReceiptsPayment(db).update({
                UnpaidAmount: paymentUpdate.UnpaidAmount + (payment[i].Amount ? payment[i].Amount : 0),
                PaidAmount: paymentUpdate.PaidAmount - (payment[i].Amount ? payment[i].Amount : 0),
            }, {
                where: {
                    ID: payment[i].IDPaymentR
                }
            })
        }
    }
    await mtblPaymentRPayment(db).destroy({
        where: {
            IDPayment: id
        }
    })
    listUndefinedID.sort()
    for (var i = 0; i < listUndefinedID.length; i++) {
        if (withdrawalMoney > 0) {
            await mtblReceiptsPayment(db).findOne({
                where: {
                    ID: listUndefinedID[i]
                }
            }).then(async data => {
                if (withdrawalMoney >= data.UnpaidAmount) {
                    withdrawalMoney = withdrawalMoney - data.UnpaidAmount
                    await mtblPaymentRPayment(db).create({
                        IDPayment: id,
                        IDPaymentR: listUndefinedID[i],
                        Amount: data.UnpaidAmount,
                    })
                    await mtblReceiptsPayment(db).update({
                        UnpaidAmount: 0,
                        PaidAmount: data.UnpaidAmount + data.PaidAmount,
                    }, {
                        where: {
                            ID: listUndefinedID[i]
                        }
                    })
                } else {
                    await mtblPaymentRPayment(db).create({
                        IDPayment: id,
                        IDPaymentR: listUndefinedID[i],
                        Amount: withdrawalMoney,
                    })
                    await mtblReceiptsPayment(db).update({
                        UnpaidAmount: data.UnpaidAmount - withdrawalMoney,
                        PaidAmount: withdrawalMoney,
                        Unknown: false,
                    }, {
                        where: {
                            ID: listUndefinedID[i]

                        }
                    })
                    withdrawalMoney = 0
                }
            })
        }
    }
}
async function checkUpdateError(db, listUndefinedID, withdrawalMoney) {
    let check = 0;
    for (var i = 0; i < listUndefinedID.length; i++) {
        await mtblReceiptsPayment(db).findOne({
            where: {
                ID: listUndefinedID[i]
            }
        }).then(async data => {
            check += data.UnpaidAmount
        })
    }
    if (check < withdrawalMoney)
        return false
    else
        return true
}

async function createLoanAdvances(db, IDpayment, loanAdvanceIDs, type) {
    if (loanAdvanceIDs.length > 0 && type == 'payment') {
        for (var i = 0; i < loanAdvanceIDs.length; i++) {
            await mtblVayTamUng(db).update({
                Status: 'Ch??? ho??n ???ng',
                IDReceiptsPayment: IDpayment,
            }, {
                where: { ID: loanAdvanceIDs[i] }
            })
        }
    } else if (loanAdvanceIDs.length > 0 && type == 'receipt') {
        for (var i = 0; i < loanAdvanceIDs.length; i++) {
            await mtblVayTamUng(db).update({
                Status: '???? ho??n ???ng',
                IDReceiptsPayment: IDpayment,
            }, {
                where: { ID: loanAdvanceIDs[i] }
            })
        }
    }
}
async function updateLoanAdvances(db, IDpayment, loanAdvanceIDs) {
    let payment = await mtblReceiptsPayment(db).findOne({ where: { ID: IDpayment } })
    await mtblVayTamUng(db).update({
        Status: 'T???o phi???u chi',
        IDReceiptsPayment: null,
    }, {
        where: { IDReceiptsPayment: IDpayment }
    })
    if (loanAdvanceIDs.length > 0 && payment.Type == 'payment') {
        for (var i = 0; i < loanAdvanceIDs.length; i++) {
            await mtblVayTamUng(db).update({
                Status: 'Ch??? ho??n ???ng',
                IDReceiptsPayment: IDpayment,
            }, {
                where: { ID: loanAdvanceIDs[i] }
            })
        }
    } else if (loanAdvanceIDs.length > 0 && payment.Type == 'receipt') {
        for (var i = 0; i < loanAdvanceIDs.length; i++) {
            await mtblVayTamUng(db).update({
                Status: '???? ho??n ???ng',
                IDReceiptsPayment: IDpayment,
            }, {
                where: { ID: loanAdvanceIDs[i] }
            })
        }
    }
}
async function createAccountingBooks(db, listCredit, listDebit, idPayment, reason, number) {
    if (!number) {
        await mtblReceiptsPayment(db).findOne({ where: { ID: idPayment } }).then(data => {
            number = data ? data.CodeNumber : ''
        })
    }
    let now = moment().format('YYYY-MM-DD');
    for (var i = 0; i < listDebit.length; i++) {
        await mtblAccountingBooks(db).create({
            CreateDate: now,
            EntryDate: now,
            IDAccounting: listDebit[i].debtAccount.id,
            DebtIncurred: listDebit[i].amountOfMoney,
            CreditIncurred: 0,
            IDPayment: idPayment,
            Reason: reason,
            Number: number,
            ClauseType: 'Debit',
            Contents: listDebit[i].content,
        })
    }
    for (var j = 0; j < listCredit.length; j++) {
        await mtblAccountingBooks(db).create({
            CreateDate: now,
            EntryDate: now,
            IDAccounting: listCredit[j].hasAccount.id,
            CreditIncurred: listCredit[j].amountOfMoney,
            DebtIncurred: 0,
            IDPayment: idPayment,
            Reason: reason,
            Number: number,
            ClauseType: 'Credit',
            Contents: listCredit[j].content,
        })
    }
}
async function getDetailCustomer(db, id) {
    let dataCustomer = await customerData.getListCustomerOfPMCM(db, id)
    return dataCustomer[0]
}
async function getDetailStaff(id) {
    dataStaff = [

        {
            id: 1,
            staffCode: 'NV001',
            fullName: 'NGUY???N TH??? THU',
            gender: 'N???',
            birthday: '20/03/1992',
            cmndNumber: '125457789',
            address: 'S??? 13 Ho??ng Mai H?? N???i',
            mobile: '065817845',
            email: 'thu123@gmail.com',
            departmentName: 'Ban MKT',
            branchName: 'Vi???t Nam',
        },
        {
            id: 2,
            staffCode: 'NV002',
            fullName: 'Nguy???n Anh Tu???n',
            gender: 'Nam',
            birthday: '15/04/1994',
            cmndNumber: '123789210',
            address: 'S??? 21A Kim Ng??u Ho??ng Mai Hai B?? Tr??ng H?? N???i',
            mobile: '067812345',
            email: 'tuanna@gmail.com',
            departmentName: 'Ban s??ng ch???',
            branchName: 'Vi???t Nam',
        },
        {
            id: 3,
            staffCode: 'NV003',
            fullName: 'L?? TH??? TH???O',
            gender: 'N???',
            birthday: '25/10/1997',
            cmndNumber: '125654421',
            address: 'S??? 203 Minh Khai H?? N???i',
            mobile: '0989705248',
            email: 'lethao.nap@gmail.com',
            departmentName: 'Ban k??? to??n',
            branchName: 'Vi???t Nam',
        },
        {
            id: 4,
            staffCode: 'NV004',
            fullName: 'Ph???m ?????c Anh',
            gender: 'Nam',
            birthday: '10/05/1985',
            cmndNumber: '121012351',
            address: 'S??? 2 ????o T???n H?? N???i',
            mobile: '0365412784',
            email: 'anhduc12@gmail.com',
            departmentName: 'Ban s??ng ch???',
            branchName: 'Vi???t Nam',
        },
        {
            id: 5,
            staffCode: 'NV005',
            fullName: 'Tr???n Qu???nh Trang',
            gender: 'N???',
            birthday: '18/03/1991',
            cmndNumber: '125317451',
            address: 'S??? 23 Tam Trinh Ho??ng Mai H?? N???i',
            mobile: '0368451274',
            email: 'trang123@gmail.com',
            departmentName: 'Ban NH1',
            branchName: 'Vi???t Nam',
        },
        {
            id: 6,
            staffCode: 'NV006',
            fullName: 'Nguy???n Th??? Thu Trang',
            gender: 'N???',
            birthday: '20/09/1988',
            cmndNumber: '12612468',
            address: 'S??? 1B Ng?? 286 L??nh Nam Ho??ng Mai H?? N???i',
            mobile: '098714521',
            email: 'thutrang@gmail.com',
            departmentName: 'Ban K??? to??n',
            branchName: 'Vi???t Nam',
        },
        {
            id: 7,
            staffCode: 'NV007',
            fullName: 'V?? V??n Chi???n',
            gender: 'Nam',
            birthday: '16/06/1990',
            cmndNumber: '125781423',
            address: 'S??? 25 Ng???c L??m Long Bi??n H?? N???i',
            mobile: '083654127',
            email: 'vvchien@gmail.com',
            departmentName: 'Ban S??ng ch???',
            branchName: 'Vi???t Nam',
        },
        {
            id: 8,
            staffCode: 'NV008',
            fullName: 'l?? Th??? Ng???c Di???p',
            gender: 'N???',
            birthday: '25/10/1996',
            cmndNumber: '125021342',
            address: 'S??? 3B H??ng M?? H?? N???i',
            mobile: '012784125',
            email: 'diephn@gmail.com',
            departmentName: 'Ban S??ng ch???',
            branchName: 'Vi???t Nam',
        },
        {
            id: 9,
            staffCode: 'NV009',
            fullName: 'V?? Quang Minh',
            gender: 'Nam',
            birthday: '06/06/1980',
            cmndNumber: '126120412',
            address: 'S??? 86 Th??i H?? H?? N???i',
            mobile: '086234517',
            email: 'vuminh@gmail.com',
            departmentName: 'Ban NH2',
            branchName: 'Vi???t Nam',
        },
        {
            id: 10,
            staffCode: 'NV010',
            fullName: 'Nguy???n Th??? Thu H??',
            gender: 'N???',
            birthday: '14/02/1985',
            cmndNumber: '121453245',
            address: 'S??? 26 H??ng Chi???u H?? N???i',
            mobile: '089631242',
            email: 'thuha12@gmail.com',
            departmentName: 'Ban K??? to??n',
            branchName: 'Vi???t Nam',
        },
    ]
    var obj = {}
    dataStaff.forEach(item => {
        if (item.id == id) {
            obj = item
        }
    })
    return obj

}
async function getDetailPartner(id) {
    dataPartner = [{
            id: "2",
            partnerCode: "LOCK LOCK",
            name: "C??ng ty TNHH Lock & Lock",
            tax: "01245782110",
            address: "S??? 72A Nguy???n Tr??i ph?????ng Th?????ng ?????nh Thanh Xu??n H?? N???i",
            mobile: "0823145678",
            fax: "045784124",
            email: "locklockvn@gmail",
        },
        {
            id: "3",
            partnerCode: "HOA PHAT",
            name: "C??ng ty TNHH H??a Ph??t ",
            tax: "012345678",
            address: "S??? 12 B???ch Mai H?? N???i",
            mobile: "089745120",
            fax: "023145216",
            email: "hoaphat123@gmail.com",
        },
        {
            id: "4",
            partnerCode: "MEDIA MART",
            name: "Si??u th??? ??i???n m??y xanh media mart",
            tax: "012345801",
            address: "S??? 1 Tr????ng ?????nh H?? N???i",
            mobile: "089724152",
            fax: "021465741",
            email: "mediamart4546@gmail.com",
        },
        {
            id: "5",
            partnerCode: "GLOMED",
            name: "C??ng ty d?????c ph???m Glomed  ",
            tax: "012465563",
            address: "S??? 34 Hu???nh Th??c Kh??ng H?? N???i",
            mobile: "012568523",
            fax: "012457821",
            email: "glomeddp@gmail.com",
        },
        {
            id: "6",
            partnerCode: "THUONG ??INH",
            name: "C??ng ty gi???y Th?????ng ?????nh",
            tax: "012489660",
            address: "S??? 2 Kim Ng??u H?? N???i",
            mobile: "021565635",
            fax: "014653225",
            email: "thuongdinhgiay@gmail.com",
        },
        {
            id: "7",
            partnerCode: "GIAY THANG LONG",
            name: "C??ng ty TNHH gi??y Th??ng Long",
            tax: "012457821",
            address: "S??? 2A Ph?????ng Kh????ng Trung Thanh Xu??n H?? N???i",
            mobile: "012465623",
            fax: "01774125",
            email: "giaytot@gmail.com",
        },
        {
            id: "8",
            partnerCode: "VINH DOAN",
            name: "C??ng ty c??? ph???n V??nh ??o??n",
            tax: "012458990",
            address: "S??? 60 V??nh Tuy Hai B?? Tr??ng H?? N???i",
            mobile: "021565650",
            fax: "0158555245",
            email: "vinhdoan123@gmail.com",
        },
        {
            id: "9",
            partnerCode: "SINO VANLOCK",
            name: "C??ng ty s???n xu???t thi???t b??? ??i???n Sino vanlock",
            tax: "0124456685",
            address: "S??? 10 nguy???n V??n C??? Long Bi??n H?? N???i",
            mobile: "0154878741",
            fax: "0157878865",
            email: "sinovanlock@gmail.com",
        },
        {
            id: "10",
            partnerCode: "TRUNG NGUYEN",
            name: "T???p ??o??n c?? ph?? Trung Nguy??n",
            tax: "0125748546",
            address: "Th??? C???m Ph?????ng Xu??n Ph????ng Nam T??? Li??m H?? N???i",
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

// C???p nh???t l???i s??? ti???n kh??ng x??c ?????nh c???a kh??ch h??ng
async function updateUnspecifiedAmountOfCustomer(db, id) {
    await mtblReceiptsPayment(db).findAll({
        where: {
            IDCustomer: id
        }
    }).then(async rePay => {
        let unspecifiedAmount = 0;
        for (item of rePay) {
            unspecifiedAmount += (item.UnpaidAmount ? item.UnpaidAmount : 0)
        }
        await mtblCustomer(db).update({
            AmountUnspecified: unspecifiedAmount
        }, {
            where: {
                IDSpecializedSoftware: id
            }
        })
    })

}
async function createTBLCoQuanNhaNuoc(db, date, voucherNumber, moneyNumber, type, receiptsPaymentID) {
    await mtblCoQuanNhaNuoc(db).create({
        Date: date,
        VoucherNumber: voucherNumber,
        MoneyNumber: moneyNumber,
        Type: type,
        Status: 'M???i',
        ReceiptsPaymentID: receiptsPaymentID,
    })
}
var mtblDMNhaCungCap = require('../tables/qlnb/tblDMNhaCungCap');
// 
async function addUpTheAmountForCreditsAndDelete(db, receiptsPaymentID, currencyID) {
    await mtblPaymentRInvoice(db).findAll({
        where: {
            IDPayment: receiptsPaymentID
        }
    }).then(async data => {
        for (let item of data) {
            let invoiceOld = await mtblInvoice(db).findOne({
                where: {
                    IDSpecializedSoftware: item.IDSpecializedSoftware
                }
            })
            if (invoiceOld.ID) {
                // l???y l???i tr???ng th??i ch??? thanh to??n cho invoice khi x??a
                await mtblInvoice(db).update({
                        Status: 'Ch??? thanh to??n',
                        PayDate: null,
                        Payments: null,
                        PaidAmount: invoiceOld.PaidAmount - item.Amount,
                        UnpaidAmount: invoiceOld.UnpaidAmount + item.Amount,
                    }, {
                        where: {
                            ID: invoiceOld.ID
                        }
                    })
                    // let InCurr = await mtblInvoiceRCurrency(db).findOne({
                    //     where: {
                    //         InvoiceID: invoiceOld.ID,
                    //         CurrencyID: currencyID,
                    //     }
                    // })
                    // if (InCurr)
                    //     await mtblInvoiceRCurrency(db).update({
                    //         UnpaidAmount: Number(InCurr.UnpaidAmount ? InCurr.UnpaidAmount : 0) + Number(item.Amount ? item.Amount : 0),
                    //         PaidAmount: Number(InCurr.PaidAmount ? InCurr.PaidAmount : 0) - Number(item.Amount ? item.Amount : 0),
                    //         Status: 'Ch??? thanh to??n'
                    //     }, {
                    //         where: {
                    //             InvoiceID: invoiceOld.ID,
                    //             CurrencyID: currencyID,
                    //         }
                    //     })
            }
        }
    })
    await mtblPaymentRInvoice(db).destroy({
        where: {
            IDPayment: receiptsPaymentID
        }
    })
}

async function isCheckAndUpdateInvoicePaid(db, invoiceID, receiptsPaymentID) {
    let checkStatusOfInvoice = true
        // check t???t c??? c??c invoice c???a currency ???? thanh to??n h???t ch??a
    await mtblInvoiceRCurrency(db).findAll({
            where: {
                InvoiceID: invoiceID,
            }
        }).then(data => {
            for (let inv of data) {
                if (inv.Status == 'Ch??? thanh to??n')
                    checkStatusOfInvoice = false
            }
        })
        // c???p nh???t trang th??i ?????ng th???i cho invoice ????? hi???n th??? d??? li???u tr???ng th??i
    if (checkStatusOfInvoice == true) {
        let payment = await mtblReceiptsPayment(db).findOne({
            where: {
                ID: receiptsPaymentID
            }
        })
        let Payments = 'Ti???n m???t'
        if (payment.Type == "debit") {
            Payments = 'Chuy???n kho???n'
        } else if (payment.Type == "spending") {
            Payments = 'Chuy???n kho???n'
        }
        await mtblInvoice(db).update({
            Payments: Payments,
            PayDate: payment.Date,
            Status: '???? thanh to??n'
        }, {
            where: {
                ID: invoiceID
            }
        })
    } else {
        await mtblInvoice(db).update({
            Payments: null,
            PayDate: null,
            Status: 'Ch??? thanh to??n'
        }, {
            where: {
                ID: invoiceID
            }
        })
    }
}

// t??nh to??n s??? ti???n l???i ???? thanh to??n, ch??a thanh to??n credit khi t???o phi???u thu
async function recalculateTheAmountOfCredit(db, amount, listCreditID, receiptsPaymentID, type, currencyID) {
    console.log(amount, listCreditID, receiptsPaymentID, type, currencyID);
    if (type == 'update')
        await addUpTheAmountForCreditsAndDelete(db, receiptsPaymentID, currencyID)
        // reListCreditID = listCreditID.reverse() // ?????i v??? tr?? ng?????c l???i c??c ph???n t??? trong m???ng
        // listCreditID = listCreditID.sort(function(a, b) { return a - b })
    amount = Number(amount)
    for (let i = 0; i < listCreditID.length; i++) {
        let creditID = listCreditID[i]
        await mtblInvoice(db).findOne({
            where: {
                IDSpecializedSoftware: creditID
            }
        }).then(async data => {
            // let invoiceRCurrency = await mtblInvoiceRCurrency(db).findOne({
            //     where: {
            //         CurrencyID: currencyID,
            //         InvoiceID: data.ID,
            //     }
            // })
            if (data.ID && amount > 0) {
                let paidAmount = data ? data.PaidAmount : 0
                let unpaidAmount = data ? data.UnpaidAmount : 0
                let initialAmount = data ? data.InitialAmount : 0
                    // ------------------------------------------------------------------------------------------------------------------------------
                console.log(amount, unpaidAmount);
                if (unpaidAmount >= amount) {
                    await mtblPaymentRInvoice(db).create({
                        IDPayment: receiptsPaymentID,
                        IDSpecializedSoftware: creditID,
                        Amount: amount,
                    })
                    let status = 'Ch??? thanh to??n'
                    if ((unpaidAmount - amount) == 0) {
                        status = '???? thanh to??n'
                    }
                    await mtblInvoice(db).update({
                            Status: status,
                            PaidAmount: data.PaidAmount + amount,
                            UnpaidAmount: data.UnpaidAmount - amount,
                        }, {
                            where: {
                                ID: data.ID
                            }
                        })
                        // c???p nh???t trang th??i ?????ng th???i cho invoice ????? hi???n th??? d??? li???u tr???ng th??i
                    amount = 0;
                } else {
                    await mtblPaymentRInvoice(db).create({
                        IDPayment: receiptsPaymentID,
                        IDSpecializedSoftware: creditID,
                        Amount: unpaidAmount,
                    })
                    await mtblInvoice(db).update({
                        InitialAmount: data ? data.InitialAmount : 0,
                        UnpaidAmount: 0,
                        PaidAmount: initialAmount,
                        Status: '???? thanh to??n',
                    }, {
                        where: {
                            ID: data.ID
                        }
                    })
                    amount -= unpaidAmount
                }
                // await isCheckAndUpdateInvoicePaid(db, data.ID, receiptsPaymentID)
            }
        })
    }
}


async function allotmentInvoiceOrCredit(db, array, receiptsPaymentID, type = 'create') {
    for (let item of array) {
        await mtblInvoice(db).findOne({
            where: {
                IDSpecializedSoftware: item.id
            }
        }).then(async data => {
            if (data) {
                let unpaidAmount = data ? data.UnpaidAmount : 0
                let paidAmount = data ? data.PaidAmount : 0
                let status = 'Ch??? thanh to??n'
                if ((unpaidAmount - item.paymentAmount) == 0) {
                    status = '???? thanh to??n'
                }
                await mtblPaymentRInvoice(db).create({
                    IDPayment: receiptsPaymentID,
                    IDSpecializedSoftware: item.id,
                    Amount: item.paymentAmount,
                })
                if (type = 'create')
                    await mtblInvoice(db).update({
                        UnpaidAmount: unpaidAmount - item.paymentAmount,
                        PaidAmount: paidAmount + item.paymentAmount,
                        Status: status,
                    }, {
                        where: {
                            ID: data.ID,
                        }
                    })
                    // await isCheckAndUpdateInvoicePaid(db, data.ID, receiptsPaymentID)
            }
        })
    }
}
module.exports = {
    deleteRelationshiptblReceiptsPayment,
    //  get_detail_tbl_receipts_payment
    detailtblReceiptsPayment: async(req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblReceiptsPayment = mtblReceiptsPayment(db);
                    tblReceiptsPayment.findOne({
                        where: { ID: body.id },
                    }).then(async data => {
                        if (data) {
                            var listInvoiceID = []
                            var listCreditID = []
                            await mtblPaymentRInvoice(db).findAll({ where: { IDPayment: data.ID } }).then(async data => {
                                for (let item of data) {
                                    let invoice = await mtblInvoice(db).findOne({
                                        where: {
                                            IDSpecializedSoftware: item.IDSpecializedSoftware
                                        }
                                    })
                                    if (invoice && invoice.IsInvoice) {
                                        listInvoiceID.push(Number(item.IDSpecializedSoftware))
                                    } else if (invoice && !invoice.IsInvoice) {
                                        listCreditID.push(Number(item.IDSpecializedSoftware))
                                    }
                                }
                            })
                            var currency = await mtblRate(db).findOne({
                                where: { IDCurrency: data.IDCurrency },
                                order: [
                                    ['ID', 'DESC']
                                ]
                            })
                            var currencyName = await mtblCurrency(db).findOne({
                                where: { ID: data.IDCurrency },
                                order: [
                                    ['ID', 'DESC']
                                ]
                            })
                            var obj = {
                                id: data.ID,
                                type: data.Type ? data.Type : '',
                                rpType: data.RPType ? data.RPType : '',
                                applicantReceiverName: data.ApplicantReceiverName ? data.ApplicantReceiverName : '',
                                voucherNumber: data.VoucherNumber ? data.VoucherNumber : null,
                                voucherDate: data.VoucherDate ? data.VoucherDate : null,
                                codeNumber: data.CodeNumber ? data.CodeNumber : '',
                                idCurrency: data.IDCurrency ? data.IDCurrency : null,
                                currencyName: currencyName ? currencyName.ShortName : '',
                                exchangeRate: currency ? currency.ExchangeRate : 0,
                                date: data.Date ? data.Date : null,
                                idCustomer: data.IDCustomer ? data.IDCustomer : null,
                                address: data.Address ? data.Address : '',
                                amount: data.Amount ? data.Amount : null,
                                amountWords: data.AmountWords ? data.AmountWords : '',
                                reason: data.Reason ? data.Reason : '',
                                idManager: data.IDManager ? data.IDManager : null,
                                idAccountant: data.IDAccountant ? data.IDAccountant : null,
                                idTreasurer: data.IDTreasurer ? data.IDTreasurer : null,
                                treasurerName: 'Nguy???n Th??? Thu Trang',
                                idEstablishment: data.IDEstablishment ? data.IDEstablishment : null,
                                idSubmitter: data.IDSubmitter ? data.IDSubmitter : null,
                                licenseNumber: data.LicenseNumber ? data.LicenseNumber : '',
                                licenseDate: data.LicenseDate ? data.LicenseDate : null,
                                unpaidAmount: data.UnpaidAmount ? data.UnpaidAmount : null,
                                paidAmount: data.PaidAmount ? data.PaidAmount : null,
                                initialAmount: data.InitialAmount ? data.InitialAmount : null,
                                withdrawal: data.Withdrawal ? data.Withdrawal : null,
                                exchangeRate: data.ExchangeRate ? data.ExchangeRate : 1,
                                isUndefined: data.Unknown,
                                staffID: data.IDStaff ? data.IDStaff : null,
                                staffName: 'Ch??a c?? d??? li???u' ? 'Ch??a c?? d??? li???u' : null,
                            }
                            let where = {}
                            if (data.Type == 'payment') {
                                where = { IDReceiptsPayment: data.ID }
                            } else {
                                where = { IDReceipts: data.ID }
                            }
                            await mtblDeNghiThanhToan(db).findOne({
                                where: where
                            }).then(async payment => {
                                if (payment) {
                                    let arrayRequestShopping = []
                                    let stt = 1;
                                    let tblYeuCauMuaSam = mtblYeuCauMuaSam(db); // b???t bu???c
                                    let tblDMBoPhan = mtblDMBoPhan(db); // b???t bu???c
                                    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'NhanVien' })
                                    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDPheDuyet1', sourceKey: 'IDPheDuyet1', as: 'PheDuyet1' })
                                    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDPheDuyet2', sourceKey: 'IDPheDuyet2', as: 'PheDuyet2' })
                                    tblYeuCauMuaSam.belongsTo(tblDMBoPhan, { foreignKey: 'IDPhongBan', sourceKey: 'IDPhongBan', as: 'phongban' })
                                    tblDMBoPhan.belongsTo(mtblDMChiNhanh(db), { foreignKey: 'IDChiNhanh', sourceKey: 'IDChiNhanh', as: 'chinhanh' })
                                    let tblYeuCauMuaSamDetail = mtblYeuCauMuaSamDetail(db);
                                    tblYeuCauMuaSam.hasMany(tblYeuCauMuaSamDetail, { foreignKey: 'IDYeuCauMuaSam', as: 'line' })
                                    var arrayFile = []
                                    await tblYeuCauMuaSam.findAll({
                                        order: [
                                            ['ID', 'DESC']
                                        ],
                                        include: [{
                                                model: tblDMBoPhan,
                                                required: false,
                                                as: 'phongban',
                                                include: [{
                                                    model: mtblDMChiNhanh(db),
                                                    required: false,
                                                    as: 'chinhanh',
                                                }]
                                            },
                                            {
                                                model: mtblDMNhanvien(db),
                                                required: false,
                                                as: 'NhanVien'
                                            },
                                            {
                                                model: mtblDMNhanvien(db),
                                                required: false,
                                                as: 'PheDuyet1',
                                            },
                                            {
                                                model: mtblDMNhanvien(db),
                                                required: false,
                                                as: 'PheDuyet2',
                                            },
                                            {
                                                model: tblYeuCauMuaSamDetail,
                                                required: false,
                                                as: 'line'
                                            },
                                        ],
                                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                                        limit: Number(body.itemPerPage),
                                        where: {
                                            IDPaymentOrder: payment.ID
                                        }
                                    }).then(async data => {
                                        data.forEach(element => {
                                            var reasonReject = '';
                                            if (element.ReasonReject1) {
                                                reasonReject = 'Ng?????i ph?? duy???t tr?????c ???? t??? ch???i: ' + element.ReasonReject1
                                            }
                                            if (element.ReasonReject2) {
                                                reasonReject = 'Ng?????i ph?? duy???t sau ???? t??? ch???i: ' + element.ReasonReject2
                                            }
                                            if (element.ReasonReject) {
                                                reasonReject = 'Ng?????i mua ???? t??? ch???i: ' + element.ReasonReject
                                            }
                                            var obj = {
                                                stt: stt,
                                                id: Number(element.ID),
                                                type: element.Type ? element.Type : '',
                                                requestCode: element.RequestCode ? element.RequestCode : '',
                                                idNhanVien: element.IDNhanVien ? element.IDNhanVien : null,
                                                nameIDNhanVien: element.NhanVien ? element.NhanVien.StaffName : null,
                                                idPhongBan: element.IDPhongBan ? element.IDPhongBan : null,
                                                codePhongBan: element.phongban ? element.phongban.DepartmentCode : null,
                                                namePhongBan: element.phongban ? element.phongban.DepartmentName : null,
                                                branchName: element.phongban ? element.phongban.chinhanh ? element.phongban.chinhanh.BranchName : '' : '',
                                                requireDate: element.RequireDate ? moment(element.RequireDate).format('DD/MM/YYYY') : null,
                                                reason: element.Reason ? element.Reason : '',
                                                status: element.Status ? element.Status : '',
                                                assetName: element.AssetName ? element.AssetName : '',
                                                idPheDuyet1: element.IDPheDuyet1 ? element.IDPheDuyet1 : null,
                                                idNhaCungCap: element.IDSupplier ? Number(element.IDSupplier) : null,
                                                namePheDuyet1: element.PheDuyet1 ? element.PheDuyet1.StaffName : null,
                                                idPheDuyet2: element.IDPheDuyet2 ? element.IDPheDuyet2 : null,
                                                namePheDuyet2: element.PheDuyet2 ? element.PheDuyet2.StaffName : null,
                                                reasonReject: reasonReject,
                                                line: element.line,
                                            }
                                            arrayRequestShopping.push(obj);
                                            stt += 1;
                                        });
                                        for (var i = 0; i < arrayRequestShopping.length; i++) {
                                            var arrayTaiSan = []
                                            var arrayFile = []
                                            var total = 0;
                                            for (var j = 0; j < arrayRequestShopping[i].line.length; j++) {
                                                if (arrayRequestShopping[i].type == 'T??i s???n') {
                                                    await mtblDMHangHoa(db).findOne({ where: { ID: arrayRequestShopping[i].line[j].IDDMHangHoa } }).then(data => {
                                                        var price = arrayRequestShopping[i].line[j].Price ? arrayRequestShopping[i].line[j].Price : 0
                                                        var amount = arrayRequestShopping[i].line[j].Amount ? arrayRequestShopping[i].line[j].Amount : 0

                                                        if (data) {
                                                            total += amount * price
                                                            arrayTaiSan.push({
                                                                name: data.Name,
                                                                code: data.Code,
                                                                remainingAmount: data.RemainingAmount ? data.RemainingAmount : 0,
                                                                amount: amount,
                                                                unitPrice: price,
                                                                id: arrayRequestShopping[i].line[j].ID,
                                                                assetName: arrayRequestShopping[i].line[j].AssetName ? arrayRequestShopping[i].line[j].AssetName : '',
                                                                unit: data.Unit
                                                            })
                                                        }
                                                    })
                                                } else {
                                                    await mtblVanPhongPham(db).findOne({ where: { ID: arrayRequestShopping[i].line[j].IDVanPhongPham } }).then(data => {
                                                        var price = arrayRequestShopping[i].line[j].Price ? arrayRequestShopping[i].line[j].Price : 0
                                                        var amount = arrayRequestShopping[i].line[j].Amount ? arrayRequestShopping[i].line[j].Amount : 0

                                                        if (data) {
                                                            total += amount * price
                                                            arrayTaiSan.push({
                                                                name: data.VPPName ? data.VPPName : '',
                                                                code: data.VPPCode ? data.VPPCode : '',
                                                                remainingAmount: data.RemainingAmount ? data.RemainingAmount : 0,
                                                                amount: amount,
                                                                unitPrice: price,
                                                                id: arrayRequestShopping[i].line[j].ID,
                                                                assetName: arrayRequestShopping[i].line[j].AssetName ? arrayRequestShopping[i].line[j].AssetName : '',
                                                                unit: data.Unit
                                                            })
                                                        }
                                                    })
                                                }
                                            }
                                            arrayRequestShopping[i]['price'] = total;
                                            await mtblFileAttach(db).findAll({ where: { IDYeuCauMuaSam: arrayRequestShopping[i].id } }).then(file => {
                                                if (file.length > 0) {
                                                    for (var e = 0; e < file.length; e++) {
                                                        arrayFile.push({
                                                            name: file[e].Name ? file[e].Name : '',
                                                            link: file[e].Link ? file[e].Link : '',
                                                            id: file[e].id
                                                        })
                                                    }
                                                }
                                            })
                                            arrayRequestShopping[i]['arrayTaiSan'] = arrayTaiSan;
                                            arrayRequestShopping[i]['arrayFile'] = arrayFile;

                                        }
                                    })
                                    await mtblFileAttach(db).findAll({ where: { IDDeNghiThanhToan: payment.ID } }).then(file => {
                                        if (file.length > 0) {
                                            for (var e = 0; e < file.length; e++) {
                                                arrayFile.push({
                                                    name: file[e].Name ? file[e].Name : '',
                                                    link: file[e].Link ? file[e].Link : '',
                                                    id: file[e].ID,
                                                })
                                            }
                                        }
                                    })
                                    obj['paymentOrder'] = {
                                        id: payment.ID,
                                        code: payment.PaymentOrderCode,
                                        arrayFile: arrayFile,
                                        arrayRequest: arrayRequestShopping
                                    }
                                }
                            })
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
                            } else if (data.SupplierID) {
                                let dataSupplier = await mtblDMNhaCungCap(db).findOne({
                                    where: {
                                        ID: data.SupplierID
                                    }
                                })
                                obj['object'] = {
                                    name: dataSupplier ? dataSupplier.SupplierName : '',
                                    code: dataSupplier ? dataSupplier.SupplierCode : '',
                                    address: dataSupplier ? dataSupplier.Address : '',
                                    displayName: '[' + (dataSupplier ? dataSupplier.SupplierCode : '') + '] ' + (dataSupplier ? dataSupplier.SupplierName : ''),
                                    id: data.SupplierID,
                                    type: 'supplier',
                                }
                            } else {
                                let dataCus = await getDetailCustomer(db, data.IDCustomer)
                                obj['object'] = {
                                    name: dataCus ? dataCus.name : '',
                                    code: dataCus ? dataCus.customerCode : '',
                                    displayName: '[' + (dataCus ? dataCus.customerCode : '') + '] ' + (dataCus ? dataCus.name : ''),
                                    address: dataCus ? dataCus.address : '',
                                    id: data.IDCustomer,
                                    type: 'customer',
                                }
                            }
                            let arrayCredit = []
                            let arraydebit = []
                            let tblPaymentAccounting = mtblPaymentAccounting(db);
                            tblPaymentAccounting.belongsTo(mtblDMTaiKhoanKeToan(db), { foreignKey: 'IDAccounting', sourceKey: 'IDAccounting', as: 'acc' })
                            await tblPaymentAccounting.findAll({
                                include: [{
                                    model: mtblDMTaiKhoanKeToan(db),
                                    required: false,
                                    as: 'acc'
                                }, ],
                                where: {
                                    IDReceiptsPayment: data.ID,
                                    type: "CREDIT"
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    arrayCredit.push({
                                        hasAccount: {
                                            id: item.acc ? item.acc.ID : '',
                                            accountingName: item.acc ? item.acc.AccountingName : '',
                                            accountingCode: item.acc ? item.acc.AccountingCode : '',
                                        },
                                        amountOfMoney: item.Amount,
                                        content: item.Contents,
                                    })
                                })
                            })
                            await tblPaymentAccounting.findAll({
                                include: [{
                                    model: mtblDMTaiKhoanKeToan(db),
                                    required: false,
                                    as: 'acc'
                                }, ],
                                where: {
                                    IDReceiptsPayment: data.ID,
                                    type: "DEBIT"
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    arraydebit.push({
                                        debtAccount: {
                                            id: item.acc ? item.acc.ID : '',
                                            accountingName: item.acc ? item.acc.AccountingName : '',
                                            accountingCode: item.acc ? item.acc.AccountingCode : '',
                                        },
                                        amountOfMoney: item.Amount,
                                        content: item.Contents,
                                    })
                                })
                            })
                            obj['arrayCredit'] = arrayCredit
                            obj['arrayDebit'] = arraydebit
                            obj['listInvoiceID'] = listInvoiceID
                            obj['listCreditID'] = listCreditID
                            let unspecifiedAmount = 0;
                            await mtblCustomer(db).findOne({
                                where: {
                                    IDSpecializedSoftware: (data.IDCustomer ? data.IDCustomer : null)
                                }
                            }).then(cus => {
                                if (cus)
                                    unspecifiedAmount = cus.AmountUnspecified
                            })
                            obj['unspecifiedAmount'] = unspecifiedAmount
                            let loanAdvanceIDs = []
                            await mtblVayTamUng(db).findAll({ where: { IDReceiptsPayment: body.id } }).then(data => {
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
    // add_tbl_receipts_payment
    addtblReceiptsPayment: async(req, res) => {
        let body = req.body;
        var listInvoiceID = []
        var listCreditID = []
        var allotment = []
        if (body.listInvoiceID)
            listInvoiceID = JSON.parse(body.listInvoiceID)
        if (body.allotment)
            allotment = JSON.parse(body.allotment)
        if (body.listCreditID)
            listCreditID = JSON.parse(body.listCreditID)
        var listCredit = body.listCredit ? JSON.parse(body.listCredit) : []
        var listDebit = body.listDebit ? JSON.parse(body.listDebit) : []
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await createRate(db, body.exchangeRate, body.idCurrency)
                    let unpaidAmount = 0;
                    if (Number(body.amountInvCre ? body.amountInvCre : 0) < Number(body.amount))
                        unpaidAmount = body.amount ? Math.abs(Number(body.amountInvCre ? body.amountInvCre : 0) - Number(body.amount)) : 0;
                    let paidAmount = body.amountInvCre ? body.amountInvCre : 0;
                    let unknown = true
                    if (body.type != 'accounting') {
                        unknown = unpaidAmount == 0 ? false : true
                    }
                    let objCreate = {
                        Type: body.type ? body.type : '',
                        RPType: body.rpType ? body.rpType : '',
                        ApplicantReceiverName: body.applicantReceiverName ? body.applicantReceiverName : '',
                        CodeNumber: body.voucherNumber ? body.voucherNumber : 'PT/PC',
                        IDCurrency: body.idCurrency ? body.idCurrency : null,
                        Date: body.date ? body.date : null,
                        Address: body.address ? body.address : '',
                        Amount: body.amount ? body.amount : null,
                        AmountWords: body.amountWords ? body.amountWords : '',
                        Reason: body.reason ? body.reason : '',
                        IDManager: body.idManager ? body.idManager : null,
                        IDAccountant: body.idAccountant ? body.idAccountant : null,
                        IDTreasurer: body.idTreasurer ? body.idTreasurer : null,
                        IDEstablishment: body.idEstablishment ? body.idEstablishment : null,
                        IDSubmitter: body.idSubmitter ? body.idSubmitter : null,
                        VoucherNumber: body.voucherNumber ? body.voucherNumber : 'PT/PC',
                        VoucherDate: body.voucherDate ? body.voucherDate : null,
                        // S??? ti???n ban ?????u
                        InitialAmount: body.amount ? body.amount : null,
                        // s??? ti???n ???? d??ng
                        PaidAmount: paidAmount,
                        //  s??? ti???n ch??a d??ng
                        UnpaidAmount: paidAmount != 0 ? unpaidAmount : (body.amount ? body.amount : 0),
                        Withdrawal: body.withdrawal ? body.withdrawal : null,
                        Unknown: unknown,
                        ExchangeRate: body.exchangeRate ? body.exchangeRate : 0,
                    }
                    body.object = JSON.parse(body.object)
                    if (body.object.type == 'staff')
                        objCreate['IDStaff'] = body.object.id
                    else if (body.object.type == 'partner')
                        objCreate['IDPartner'] = body.object.id
                    else if (body.object.type == 'supplier')
                        objCreate['SupplierID'] = body.object.id
                    else
                        objCreate['IDCustomer'] = body.object.id
                    await mtblReceiptsPayment(db).create(objCreate).then(async data => {
                        let amountMin = 0
                        if (allotment.length > 0) {
                            await allotmentInvoiceOrCredit(db, allotment, data.ID)
                        } else {
                            if (body.type == 'accounting') {
                                if (Number(body.invoiceTotal) > Number(body.creditTotal)) {
                                    amountMin = body.creditTotal ? body.creditTotal : 0
                                } else {
                                    amountMin = body.invoiceTotal ? body.invoiceTotal : 0
                                }
                                await recalculateTheAmountOfCredit(db, amountMin, listCreditID, data.ID, 'create', body.idCurrency ? body.idCurrency : null)
                                await recalculateTheAmountOfCredit(db, amountMin, listInvoiceID, data.ID, 'create', body.idCurrency ? body.idCurrency : null)
                            } else {
                                await recalculateTheAmountOfCredit(db, body.amount ? body.amount : 0, listInvoiceID, data.ID, 'create', body.idCurrency ? body.idCurrency : null)
                            }
                        }
                        if (body.object.type == 'cqnn' && body.object.id == 11) {
                            let typeCoQuanNhaNuoc = 'debtNotices'
                            if (body.type && body.type == 'receipt') {
                                typeCoQuanNhaNuoc = 'withdraw'
                            } else if (body.type && body.type == 'payment') {
                                typeCoQuanNhaNuoc = 'payment'
                            } else if (body.type && body.type == 'debit') {
                                typeCoQuanNhaNuoc = 'debtNotices'
                            } else if (body.type && body.type == 'spending') {
                                typeCoQuanNhaNuoc = 'withdraw'
                            }
                            await createTBLCoQuanNhaNuoc(db, body.date ? body.date : null, body.voucherNumber ? body.voucherNumber : 'PT/PC', body.amount ? body.amount : null, typeCoQuanNhaNuoc, data ? data.ID : null)
                        }
                        if (body.assetLiquidationIDs) {
                            body.assetLiquidationIDs = JSON.parse(body.assetLiquidationIDs)
                            for (var i = 0; i < body.assetLiquidationIDs.length; i++) {
                                await mtblTaiSan(db).update({
                                    IDReceiptsPayment: data.ID
                                }, {
                                    where: { ID: body.assetLiquidationIDs[i] }
                                })

                            }
                        }
                        if (body.paymentOrderID) {
                            if (body.type == 'payment') {
                                await mtblDeNghiThanhToan(db).update({
                                    IDReceiptsPayment: data.ID,
                                    Status: '???? t???o phi???u chi',
                                }, {
                                    where: { ID: body.paymentOrderID }
                                })
                            } else {
                                await mtblDeNghiThanhToan(db).update({
                                    IDReceipts: data.ID,
                                    Status: 'Ch??? t???o phi???u chi',
                                }, {
                                    where: { ID: body.paymentOrderID }
                                })
                            }

                        }
                        // -------------------------------------------------------------------------------------------------------------------------
                        if (body.object.type == 'customer') {
                            var withdrawalMoney = (body.withdrawal ? Number(body.withdrawal) : 0);
                            await mtblReceiptsPayment(db).findAll({
                                where: {
                                    IDCustomer: body.object.id,
                                    UnpaidAmount: {
                                        [Op.ne]: 0
                                    },
                                },
                                order: [
                                    ['ID', 'ASC']
                                ],
                            }).then(async paymentR => {
                                for (let item of paymentR) {
                                    if (withdrawalMoney > 0) {
                                        // Tr?????ng h???p n???u ti???n r??t l???n h??n ho???c b???ng s??? ti???n ch??a thanh to??n
                                        if (withdrawalMoney > item.UnpaidAmount) {
                                            withdrawalMoney = withdrawalMoney - item.UnpaidAmount
                                                // T???o tr?????c khi update
                                            await mtblPaymentRPayment(db).create({
                                                    IDPayment: data.ID,
                                                    IDPaymentR: item.ID,
                                                    Amount: item.UnpaidAmount,
                                                })
                                                // C???p nh???t s??? ti???n thanh to??n v?? kh??ng thanh to??n c???a phi???u
                                            await mtblReceiptsPayment(db).update({
                                                UnpaidAmount: 0,
                                                PaidAmount: item.InitialAmount,
                                            }, {
                                                where: {
                                                    ID: item.ID

                                                }
                                            })
                                        }
                                        // Tr?????ng h???p n???u ti???n r??t nh??? h??n s??? ti???n ch??a thanh to??n
                                        else {
                                            await mtblPaymentRPayment(db).create({
                                                IDPayment: data.ID,
                                                IDPaymentR: item.ID,
                                                Amount: withdrawalMoney,
                                            })
                                            await mtblReceiptsPayment(db).update({
                                                Unknown: false,
                                                UnpaidAmount: item.UnpaidAmount - withdrawalMoney,
                                                PaidAmount: item.PaidAmount + withdrawalMoney,
                                            }, {
                                                where: {
                                                    ID: item.ID

                                                }
                                            })
                                            withdrawalMoney = 0
                                        }
                                    }
                                }
                            })
                        }
                        // -------------------------------------------------------------------------------------------------------------------------------
                        await createAccountingBooks(db, listCredit, listDebit, data.ID, body.reason ? body.reason : '', body.voucherNumber)
                        if (body.loanAdvanceIDs) {
                            body.loanAdvanceIDs = JSON.parse(body.loanAdvanceIDs)
                            await createLoanAdvances(db, data.ID, body.loanAdvanceIDs, body.type)
                        }
                        if (body.loanAdvanceID) {
                            await mtblVayTamUng(db).update({
                                Status: 'Ch??? ho??n ???ng',
                                IDReceiptsPayment: data.ID,
                            }, {
                                where: { ID: body.loanAdvanceID }
                            })
                        }
                        // -------------------------------------------------------------------------------------------------------------------------------
                        for (var i = 0; i < listCredit.length; i++) {
                            await mtblPaymentAccounting(db).create({
                                IDReceiptsPayment: data.ID,
                                IDAccounting: listCredit[i].hasAccount.id,
                                Type: "CREDIT",
                                Amount: listCredit[i].amountOfMoney ? listCredit[i].amountOfMoney : 0,
                                Contents: listCredit[i].content ? listCredit[i].content : '',
                            })
                        }
                        for (var j = 0; j < listDebit.length; j++) {
                            await mtblPaymentAccounting(db).create({
                                IDReceiptsPayment: data.ID,
                                IDAccounting: listDebit[j].debtAccount.id,
                                Type: "DEBIT",
                                Amount: listDebit[j].amountOfMoney ? listDebit[j].amountOfMoney : 0,
                                Contents: listDebit[j].content ? listDebit[j].content : '',
                            })
                        }
                        if (body.object.type == 'customer')
                            await updateUnspecifiedAmountOfCustomer(db, body.object.id)
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
    // update_tbl_receipts_payment
    updatetblReceiptsPayment: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];

                    var listInvoiceID = body.listInvoiceID ? JSON.parse(body.listInvoiceID) : []
                    var listCreditID = body.listCreditID ? JSON.parse(body.listCreditID) : []
                    var listCredit = body.listCredit ? JSON.parse(body.listCredit) : []
                    var listDebit = body.listDebit ? JSON.parse(body.listDebit) : []
                    await createRate(db, body.exchangeRate, body.idCurrency)
                    await mtblAccountingBooks(db).destroy({ where: { IDPayment: body.id } })
                    var withdrawalMoney = (body.withdrawal ? Number(body.withdrawal) : 0);
                    body.object = JSON.parse(body.object)
                    let type = body.object.type
                    if (listCredit.length > 0 && listDebit.length > 0) {
                        await mtblPaymentAccounting(db).destroy({ where: { IDReceiptsPayment: body.id } })
                        for (var i = 0; i < listCredit.length; i++) {

                            await mtblPaymentAccounting(db).create({
                                IDReceiptsPayment: body.id,
                                IDAccounting: listCredit[i].hasAccount.id,
                                Type: "CREDIT",
                                Amount: listCredit[i].amountOfMoney ? listCredit[i].amountOfMoney : 0,
                                Contents: listCredit[i].content ? listCredit[i].content : '',
                            })
                        }
                        for (var j = 0; j < listDebit.length; j++) {
                            await mtblPaymentAccounting(db).create({
                                IDReceiptsPayment: body.id,
                                IDAccounting: listDebit[j].debtAccount.id,
                                Type: "DEBIT",
                                Amount: listDebit[j].amountOfMoney ? listDebit[j].amountOfMoney : 0,
                                Contents: listDebit[j].content ? listDebit[j].content : '',
                            })
                        }
                    }
                    if (body.loanAdvanceIDs) {
                        body.loanAdvanceIDs = JSON.parse(body.loanAdvanceIDs)
                        await updateLoanAdvances(db, body.id, body.loanAdvanceIDs)
                    }
                    await createAccountingBooks(db, listCredit, listDebit, body.id, body.reason ? body.reason : '', null)
                    if (body.amountInvCre || body.amountInvCre === '') {
                        let unpaidAmount = 0;
                        if (Number(body.amountInvCre ? body.amountInvCre : 0) < Number(body.amount))
                            unpaidAmount = body.amount ? Math.abs(Number(body.amountInvCre ? body.amountInvCre : 0) - Number(body.amount)) : 0;
                        let paidAmount = body.amountInvCre ? body.amountInvCre : 0;
                        update.push({ key: 'InitialAmount', value: (body.amount ? body.amount : null) });
                        update.push({ key: 'PaidAmount', value: paidAmount });
                        update.push({ key: 'UnpaidAmount', value: (paidAmount != 0 ? unpaidAmount : (body.amount ? body.amount : 0)) });
                    }
                    if (body.type || body.type === '')
                        update.push({ key: 'Type', value: body.type });

                    // t???o b???n ghi thanh to??n c?? quan nh?? n?????c
                    await mtblCoQuanNhaNuoc(db).destroy({
                        where: {
                            ReceiptsPaymentID: body.id
                        }
                    })
                    if (body.object.type == 'customer' && body.object.id == 11) {

                        let typeCoQuanNhaNuoc = 'debtNotices'
                        if (body.type && body.type == 'receipt') {
                            typeCoQuanNhaNuoc = 'withdraw'
                        } else if (body.type && body.type == 'payment') {
                            typeCoQuanNhaNuoc = 'payment'
                        } else if (body.type && body.type == 'debit') {
                            typeCoQuanNhaNuoc = 'debtNotices'
                        } else if (body.type && body.type == 'spending') {
                            typeCoQuanNhaNuoc = 'withdraw'
                        }
                        await createTBLCoQuanNhaNuoc(db, body.date ? body.date : null, body.voucherNumber ? body.voucherNumber : 'PT/PC', body.amount ? body.amount : null, typeCoQuanNhaNuoc, body.id)
                    }
                    // ----------------------------------------------------------------------------------------------------------

                    if (body.applicantReceiverName || body.applicantReceiverName === '')
                        update.push({ key: 'ApplicantReceiverName', value: body.applicantReceiverName });
                    update.push({ key: 'Unknown', value: body.isUndefined });
                    if (body.withdrawal || body.withdrawal === '')
                        update.push({ key: 'Withdrawal', value: body.withdrawal });
                    if (body.voucherNumber || body.voucherNumber === '') {
                        update.push({ key: 'VoucherNumber', value: body.voucherNumber });
                        update.push({ key: 'CodeNumber', value: body.voucherNumber });
                    }
                    if (body.address || body.address === '')
                        update.push({ key: 'Address', value: body.address });
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
                    if (body.exchangeRate || body.exchangeRate === '') {
                        if (body.exchangeRate === '')
                            update.push({ key: 'ExchangeRate', value: null });
                        else
                            update.push({ key: 'ExchangeRate', value: body.exchangeRate });
                    }
                    if (body.voucherDate || body.voucherDate === '') {
                        if (body.voucherDate === '')
                            update.push({ key: 'VoucherDate', value: null });
                        else
                            update.push({ key: 'VoucherDate', value: body.voucherDate });
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
                    if (body.amount || body.amount === '') {
                        if (body.amount === '') {
                            update.push({ key: 'Amount', value: null });
                            update.push({ key: 'InitialAmount', value: null });
                        } else {
                            update.push({ key: 'Amount', value: body.amount });
                            update.push({ key: 'InitialAmount', value: body.amount });
                        }
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
                    if (body.object.type == 'staff')
                        update.push({ key: 'IDStaff', value: body.object.id });
                    else if (body.object.type == 'partner')
                        update.push({ key: 'IDPartner', value: body.object.id });
                    else if (body.object.type == 'supplier')
                        update.push({ key: 'SupplierID', value: body.object.id });
                    else
                        update.push({ key: 'IDCustomer', value: body.object.id });
                    let customerID = body.object.id
                    await database.updateTable(update, mtblReceiptsPayment(db), body.id).then(async response => {
                        if (response == 1) {
                            let detail = await mtblReceiptsPayment(db).findOne({
                                where: {
                                    ID: body.id
                                }
                            })
                            await addUpTheAmountForCreditsAndDelete(db, body.id, detail ? detail.IDCurrency : null)
                            let amountMin = body.amount ? body.amount : 0
                            var allotment = []
                            if (body.allotment)
                                allotment = JSON.parse(body.allotment)
                            if (allotment.length > 0) {
                                await allotmentInvoiceOrCredit(db, allotment, body.id, 'update')
                            } else {
                                if (body.type == 'accounting') {
                                    if (Number(body.invoiceTotal) > Number(body.creditTotal)) {
                                        amountMin = body.creditTotal ? body.creditTotal : 0
                                    } else {
                                        amountMin = body.invoiceTotal ? body.invoiceTotal : 0
                                    }
                                    await recalculateTheAmountOfCredit(db, amountMin, listCreditID, body.id, 'create', detail ? detail.IDCurrency : null)
                                    await recalculateTheAmountOfCredit(db, amountMin, listInvoiceID, body.id, 'create', detail ? detail.IDCurrency : null)
                                } else {
                                    await recalculateTheAmountOfCredit(db, amountMin, listInvoiceID, body.id, 'create', detail ? detail.IDCurrency : null)
                                }
                            }
                            if (type == "customer") {
                                let listUndefinedID = [];
                                await mtblReceiptsPayment(db).findAll({
                                    where: {
                                        IDCustomer: customerID,
                                        UnpaidAmount: {
                                            [Op.ne]: 0
                                        },
                                    },
                                    order: [
                                        ['ID', 'DESC']
                                    ],
                                }).then(und => {
                                    for (let item of und) {
                                        listUndefinedID.push(item.ID)
                                    }
                                })
                                await deleteAndCreateAllPayment(db, body.id, listUndefinedID, withdrawalMoney)
                                await updateUnspecifiedAmountOfCustomer(db, customerID)
                            }
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
    // delete_tbl_receipts_payment
    deletetblReceiptsPayment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblReceiptsPayment(db, listID);
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
    // get_list_tbl_receipts_payment
    getListtblReceiptsPayment: (req, res) => {
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
                                { Type: body.type },
                                {
                                    CodeNumber: {
                                        [Op.like]: '%' + data.search + '%'
                                    }
                                },
                            ]
                            whereObj[Op.and] = where
                        } else {
                            where = {
                                Type: body.type
                            };
                            whereObj[Op.and] = where
                        }
                        if (data.items.length >= 1) {
                            arraySearchAnd.push({ Type: body.type })
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'S??? TI???N') {
                                    let array = []
                                    array.push(data.items[i].value1)
                                    array.push(data.items[i].value2)
                                    array.sort(function(a, b) { return a - b });
                                    userFind['Amount'] = {
                                        [Op.between]: array
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
                                if (data.items[i].fields['name'] === 'N???I DUNG') {
                                    userFind['Reason'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
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
                                if (data.items[i].fields['name'] === 'S??? CH???NG T???') {
                                    userFind['CodeNumber'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
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
                                if (data.items[i].fields['name'] === '?????I T?????NG') {
                                    if (data.items[i]['searchFields'].type == 'staff')
                                        userFind['IDStaff'] = data.items[i]['searchFields'].id
                                    else if (data.items[i]['searchFields'].type == 'partner')
                                        userFind['IDPartner'] = data.items[i]['searchFields'].id
                                    else if (data.items[i]['searchFields'].type == 'supplier')
                                        userFind['SupplierID'] = data.items[i]['searchFields'].id
                                    else
                                        userFind['IDCustomer'] = data.items[i]['searchFields'].id
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
                                if (data.items[i].fields['name'] === 'NG??Y T???O ????N') {
                                    let startDate = moment(data.items[i]['startDate']).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss')
                                    let endDate = moment(data.items[i]['endDate']).add(23 + 7, 'hours').format('YYYY-MM-DD HH:mm:ss')
                                    userFind['Date'] = {
                                        [Op.between]: [startDate, endDate]
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
                            if (arraySearchOr.length > 0)
                                whereObj[Op.or] = arraySearchOr
                            if (arraySearchAnd.length > 0)
                                whereObj[Op.and] = arraySearchAnd
                            if (arraySearchNot.length > 0)
                                whereObj[Op.not] = arraySearchNot
                        }
                    }
                    let stt = 1;
                    let tblReceiptsPayment = mtblReceiptsPayment(db);
                    tblReceiptsPayment.belongsTo(mtblCurrency(db), { foreignKey: 'IDCurrency', sourceKey: 'IDCurrency', as: 'currency' })
                    tblReceiptsPayment.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereObj,
                        order: [
                            ['ID', 'DESC']
                        ],
                        include: [{
                            model: mtblCurrency(db),
                            required: false,
                            as: 'currency'
                        }, ],
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            let dataCus = await getDetailCustomer(db, data[i].IDCustomer)
                            let dataStaff = await getDetailStaff(data[i].IDStaff)
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                type: data[i].Type ? data[i].Type : '',
                                rpType: data[i].RPType ? data[i].RPType : '',
                                applicantReceiverName: data[i].ApplicantReceiverName ? data[i].ApplicantReceiverName : '',
                                codeNumber: data[i].CodeNumber ? data[i].CodeNumber : '',
                                voucherNumber: data[i].VoucherNumber ? data[i].VoucherNumber : '',
                                voucherDate: data[i].VoucherDate ? data[i].VoucherDate : null,
                                idCurrency: data[i].IDCurrency ? data[i].IDCurrency : '',
                                nameCurrency: data[i].currency ? data[i].currency.ShortName : null,
                                date: data[i].Date ? moment(data[i].Date).format('DD/MM/YYYY') : null,
                                idCustomer: data[i].IDCustomer ? data[i].IDCustomer : null,
                                customerName: dataCus ? dataCus.name : dataStaff.fullName,
                                staffName: dataStaff.fullName,
                                address: data[i].Address ? data[i].Address : '',
                                amount: data[i].Amount ? data[i].Amount : null,
                                amountWords: data[i].AmountWords ? data[i].AmountWords : '',
                                reason: data[i].Reason ? data[i].Reason : '',
                                idManager: data[i].IDManager ? data[i].IDManager : null,
                                idManager: '',
                                idAccountant: data[i].IDAccountant ? data[i].IDAccountant : null,
                                nameAccountant: '',
                                idTreasurer: data[i].IDTreasurer ? data[i].IDTreasurer : null,
                                nameTreasurer: '',
                                idEstablishment: data[i].IDEstablishment ? data[i].IDEstablishment : null,
                                nameEstablishment: '',
                                idSubmitter: data[i].IDSubmitter ? data[i].IDSubmitter : null,
                                nameSubmitter: '',
                            }
                            if (data[i].IDStaff) {
                                let staff = await mtblDMNhanvien(db).findOne({
                                    where: { ID: data[i].IDStaff }
                                })
                                obj['object'] = {
                                    name: staff ? staff.StaffName : '',
                                    code: staff ? staff.StaffCode : '',
                                    address: staff ? staff.Address : '',
                                    id: data[i].IDStaff,
                                    displayName: '[' + (staff ? staff.StaffCode : '') + '] ' + (staff ? staff.StaffName : ''),
                                    type: 'staff',
                                }
                            } else if (data[i].IDPartner) {
                                let dataPartner = await getDetailPartner(data[i].IDPartner)
                                obj['object'] = {
                                    name: dataPartner ? dataPartner.name : '',
                                    code: dataPartner ? dataPartner.partnerCode : '',
                                    address: dataPartner ? dataPartner.address : '',
                                    displayName: '[' + (dataPartner ? dataPartner.partnerCode : '') + '] ' + (dataPartner ? dataPartner.name : ''),
                                    id: data[i].IDPartner,
                                    type: 'partner',
                                }
                            } else if (data[i].SupplierID) {
                                let dataSupplier = await mtblDMNhaCungCap(db).findOne({
                                    where: {
                                        ID: data[i].SupplierID
                                    }
                                })
                                obj['object'] = {
                                    name: dataSupplier ? dataSupplier.SupplierName : '',
                                    code: dataSupplier ? dataSupplier.SupplierCode : '',
                                    address: dataSupplier ? dataSupplier.Address : '',
                                    displayName: '[' + (dataSupplier ? dataSupplier.SupplierCode : '') + '] ' + (dataSupplier ? dataSupplier.SupplierName : ''),
                                    id: data[i].SupplierID,
                                    type: 'supplier',
                                }
                            } else
                                obj['object'] = {
                                    name: dataCus ? dataCus.name : '',
                                    code: dataCus ? dataCus.customerCode : '',
                                    displayName: '[' + (dataCus ? dataCus.customerCode : '') + '] ' + (dataCus ? dataCus.name : ''),
                                    address: dataCus ? dataCus.address : '',
                                    id: data[i].IDCustomer,
                                    type: 'customer',
                                }
                            obj['objectName'] = obj['object'].displayName
                            let arrayCredit = []
                            let arraydebit = []
                            let tblPaymentAccounting = mtblPaymentAccounting(db);
                            tblPaymentAccounting.belongsTo(mtblDMTaiKhoanKeToan(db), { foreignKey: 'IDAccounting', sourceKey: 'IDAccounting', as: 'acc' })
                            await tblPaymentAccounting.findAll({
                                include: [{
                                    model: mtblDMTaiKhoanKeToan(db),
                                    required: false,
                                    as: 'acc'
                                }, ],
                                where: {
                                    IDReceiptsPayment: data[i].ID,
                                    type: "CREDIT"
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    arrayCredit.push({
                                        nameAccount: item.acc ? item.acc.AccountingCode : '',
                                        nameAccount: item.acc ? item.acc.AccountingCode : '',
                                        amountOfMoney: item.Amount,
                                    })
                                })
                            })
                            await tblPaymentAccounting.findAll({
                                include: [{
                                    model: mtblDMTaiKhoanKeToan(db),
                                    required: false,
                                    as: 'acc'
                                }, ],
                                where: {
                                    IDReceiptsPayment: data[i].ID,
                                    type: "DEBIT"
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    arraydebit.push({
                                        nameAccount: item.acc ? item.acc.AccountingCode : '',
                                        amountOfMoney: item.Amount,
                                    })
                                })
                            })
                            obj['arrayCredit'] = arrayCredit
                            obj['arrayDebit'] = arraydebit
                            let wherePayment = {}
                            if (data[i].Type == 'payment') {
                                wherePayment = { IDReceiptsPayment: data[i].ID }
                            } else {
                                wherePayment = { IDReceipts: data[i].ID }
                            }
                            await mtblDeNghiThanhToan(db).findOne({
                                where: wherePayment
                            }).then(payment => {
                                if (payment)
                                    obj['paymentOrderID'] = payment.ID
                            })
                            array.push(obj);
                            stt += 1;
                        }
                        var count = await mtblReceiptsPayment(db).count({ where: whereObj })
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
    // get_list_name_tbl_receipts_payment
    getListNametblReceiptsPayment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblReceiptsPayment(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                Reason: element.Reason ? element.Reason : '',
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
    // get_list_receipts_payment_unknown
    getListReceiptsPaymentUnknown: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let stt = 1;
                    let listUndefinedID = [];
                    let idCurrency;
                    if (body.receiptID) {
                        await mtblPaymentRPayment(db).findAll({ where: { IDPayment: body.receiptID } }).then(data => {
                            data.forEach(item => {
                                listUndefinedID.push(Number(item.IDPaymentR))
                            })
                        })
                        idCurrency = await mtblReceiptsPayment(db).findOne({
                            where: {
                                ID: body.receiptID
                            }
                        })
                    }
                    let tblReceiptsPayment = mtblReceiptsPayment(db);
                    tblReceiptsPayment.belongsTo(mtblCurrency(db), { foreignKey: 'IDCurrency', sourceKey: 'IDCurrency', as: 'currency' })
                    tblReceiptsPayment.findAll({
                        where: {
                            [Op.or]: [{
                                [Op.and]: {
                                    IDCustomer: body.idCustomer,
                                    UnpaidAmount: {
                                        [Op.ne]: 0
                                    },
                                }
                            }, {
                                ID: {
                                    [Op.in]: listUndefinedID
                                }
                            }],
                            ID: {
                                [Op.ne]: (body.receiptID ? body.receiptID : null)
                            },
                            Type: body.type,
                            IDCurrency: body.currencyID ? body.currencyID : null
                        },
                        order: [
                            ['ID', 'DESC']
                        ],
                        include: [{
                            model: mtblCurrency(db),
                            required: false,
                            as: 'currency'
                        }, ],
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            let amount = 0;
                            if (body.receiptID) {
                                await mtblPaymentRPayment(db).findOne({
                                    where: {
                                        IDPaymentR: data[i].ID,
                                        IDPayment: body.receiptID,
                                    }
                                }).then(data => {
                                    amount = data ? data.Amount : 0;
                                })
                            }
                            let type = "Phi???u chi";
                            if (body.type == "receipt") {
                                type = "Phi???u thu"
                            } else if (body.type == "debit") {
                                type = "Gi???y b??o n???"
                            } else if (body.type == "spending") {
                                type = "Gi???y b??o c??"
                            }
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                codeNumber: data[i].CodeNumber ? data[i].CodeNumber : '',
                                unpaidAmount: data[i].UnpaidAmount ? data[i].UnpaidAmount : 0,
                                paidAmount: data[i].PaidAmount ? data[i].PaidAmount : 0,
                                initialAmount: data[i].InitialAmount ? data[i].InitialAmount : 0,
                                amount: amount,
                                reason: data[i].Reason ? data[i].Reason : '',
                                date: data[i].Date ? moment(data[i].Date).format('DD/MM/YYYY') : 0,
                                idCurrency: data[i].IDCurrency ? data[i].IDCurrency : 0,
                                shortNameCurrency: data[i].currency ? data[i].currency.ShortName : 0,
                                fullNameCurrency: data[i].currency ? data[i].currency.FullName : 0,
                                type: type,
                            }
                            array.unshift(obj);
                            stt += 1;
                        }
                        let arrayAmountMoney = []
                        await mtblCurrency(db).findAll().then(async data => {
                            for (var i = 0; i < data.length; i++) {
                                await mtblReceiptsPayment(db).findAll({
                                    attributes: [
                                        [Sequelize.fn('SUM', Sequelize.col('UnpaidAmount')), 'total_amount'],
                                    ],
                                    // group: ['ID', 'Unknown', 'Withdrawal', 'InitialAmount', 'PaidAmount', 'UnpaidAmount', 'VoucherDate', 'VoucherNumber', 'IDManager', 'Reason', 'AmountWords', 'Amount', 'Address', 'IDCustomer', 'Date', 'IDCurrency', 'CodeNumber', 'Type'],
                                    where: {
                                        IDCurrency: data[i].ID,
                                        IDCustomer: body.idCustomer,
                                        Type: body.type
                                    }
                                }).then(payment => {
                                    var obj = {
                                        type: data[i].ShortName ? data[i].ShortName : '',
                                        total: payment[0].dataValues.total_amount ? payment[0].dataValues.total_amount : 0
                                    }
                                    if (obj.total != 0)
                                        arrayAmountMoney.push(obj)
                                })
                            }
                        })
                        var count = await tblReceiptsPayment.count({
                            where: {
                                IDCustomer: body.idCustomer,
                                // Unknown: true,
                            },
                        })
                        var result = {
                            array: array,
                            totalMoney: 0,
                            all: count,
                            totalMoney: arrayAmountMoney,
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
    // get_list_receipts_payment_unknown_from_customer
    getListReceiptsPaymentUnknownFromCustomer: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let stt = 1;
                    let tblReceiptsPayment = mtblReceiptsPayment(db);
                    tblReceiptsPayment.belongsTo(mtblCurrency(db), { foreignKey: 'IDCurrency', sourceKey: 'IDCurrency', as: 'currency' })
                    tblReceiptsPayment.findAll({
                        where: {
                            IDCustomer: body.idCustomer,
                            UnpaidAmount: {
                                [Op.ne]: 0
                            },
                            Type: {
                                [Op.ne]: 'accounting'
                            }
                        },
                        order: [
                            ['ID', 'DESC']
                        ],
                        include: [{
                            model: mtblCurrency(db),
                            required: false,
                            as: 'currency'
                        }, ],
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                codeNumber: data[i].CodeNumber ? data[i].CodeNumber : '',
                                unpaidAmount: data[i].UnpaidAmount ? data[i].UnpaidAmount : 0,
                                paidAmount: data[i].PaidAmount ? data[i].PaidAmount : 0,
                                initialAmount: data[i].InitialAmount ? data[i].InitialAmount : 0,
                                amount: data[i].Amount ? data[i].Amount : 0,
                                reason: data[i].Reason ? data[i].Reason : '',
                                date: data[i].Date ? moment(data[i].Date).format('DD/MM/YYYY') : null,
                                idCurrency: data[i].IDCurrency ? data[i].IDCurrency : 0,
                                shortNameCurrency: data[i].currency ? data[i].currency.ShortName : 0,
                                fullNameCurrency: data[i].currency ? data[i].currency.FullName : 0,
                                // type: "Phi???u thu",
                            }
                            array.unshift(obj);
                            stt += 1;
                        }
                        let arrayAmountMoney = []
                        await mtblCurrency(db).findAll().then(async data => {
                            for (var i = 0; i < data.length; i++) {
                                await mtblReceiptsPayment(db).findAll({
                                    attributes: [
                                        [Sequelize.fn('SUM', Sequelize.col('UnpaidAmount')), 'total_amount'],
                                    ],
                                    // group: ['ID', 'Unknown', 'Withdrawal', 'InitialAmount', 'PaidAmount', 'UnpaidAmount', 'VoucherDate', 'VoucherNumber', 'IDManager', 'Reason', 'AmountWords', 'Amount', 'Address', 'IDCustomer', 'Date', 'IDCurrency', 'CodeNumber', 'Type'],
                                    where: {
                                        IDCurrency: data[i].ID,
                                        IDCustomer: body.idCustomer,
                                    }
                                }).then(payment => {
                                    var obj = {
                                        type: data[i].ShortName ? data[i].ShortName : '',
                                        total: payment[0].dataValues.total_amount ? payment[0].dataValues.total_amount : 0
                                    }
                                    if (obj.total != 0)
                                        arrayAmountMoney.push(obj)
                                })
                            }
                        })
                        var count = await tblReceiptsPayment.count({
                            where: {
                                IDCustomer: body.idCustomer,
                                Unknown: true,
                            },
                        })
                        var result = {
                            array: array,
                            totalMoney: 0,
                            all: count,
                            totalMoney: arrayAmountMoney,
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
    // get_automatically_increasing_voucher_number
    getAutomaticallyIncreasingVoucherNumber: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let check = null;
                    await mtblReceiptsPayment(db).findAll({
                        where: { Type: body.type },
                        order: [
                            ['CodeNumber', 'ASC']
                        ],
                    }).then(data => {
                        for (item of data) {
                            if (body.type == 'receipt') {
                                if (item.CodeNumber.length == 6 && Number(item.CodeNumber.slice(2, 6)) != null) {
                                    check = item
                                }
                            } else if (body.type == 'payment') {
                                if (item.CodeNumber.length == 6 && Number(item.CodeNumber.slice(2, 6)) != null) {
                                    check = item
                                }
                            } else if (body.type == 'debit') {
                                if (item.CodeNumber.length == 7 && Number(item.CodeNumber.slice(3, 7)) != null) {
                                    check = item
                                }
                            } else if (body.type == 'spending') {
                                if (item.CodeNumber.length == 7 && Number(item.CodeNumber.slice(3, 7)) != null) {
                                    check = item
                                }
                            } else if (body.type == 'accounting') {
                                if (item.CodeNumber.length == 7 && Number(item.CodeNumber.slice(3, 7)) != null) {
                                    check = item
                                }
                            } else if (body.type == 'inventoryReceiving') {
                                if (item.CodeNumber.length == 7 && Number(item.CodeNumber.slice(3, 7)) != null) {
                                    check = item
                                }
                            }
                        }
                    })
                    var automaticCode = 'PT0001';
                    if (!check && body.type == 'receipt') {
                        automaticCode = 'PT0001'
                    } else if (!check && body.type == 'payment') {
                        automaticCode = 'PC0001'
                    } else if (!check && body.type == 'debit') {
                        automaticCode = 'GBN0001'
                    } else if (!check && body.type == 'spending') {
                        automaticCode = 'GBC0001'
                    } else if (!check && body.type == 'inventoryReceiving') {
                        automaticCode = 'PNK0001'
                    } else if (!check && body.type == 'accounting') {
                        automaticCode = 'PKT0001'
                    } else {
                        automaticCode = await handleCodeNumber(check ? check.CodeNumber : null, body.type)
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
    // check_duplicate_voucher_number
    checkDuplicateVoucherNumber: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var check = false;
                    let where = {}
                    if (body.voucherNumber)
                        where['VoucherNumber'] = body.voucherNumber
                    if (body.id)
                        where['ID'] = {
                            [Op.ne]: body.id
                        }
                    await mtblReceiptsPayment(db).findOne({
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
}