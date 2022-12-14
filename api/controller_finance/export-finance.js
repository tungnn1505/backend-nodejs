const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Sequelize = require('sequelize');
var mModules = require('../constants/modules');
const Result = require('../constants/result');
var moment = require('moment');
var mtblReceiptsPayment = require('../tables/financemanage/tblReceiptsPayment')
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var fs = require('fs');
var xl = require('excel4node');
var database = require('../database');
const JSZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const path = require('path');
const libre = require('libreoffice-convert-win');
var mModules = require('../constants/modules');
var mtblPaymentAccounting = require('../tables/financemanage/tblPaymentAccounting')
var mtblDMTaiKhoanKeToan = require('../tables/financemanage/tblDMTaiKhoanKeToan')
var mtblCurrency = require('../tables/financemanage/tblCurrency')
var mtblRate = require('../tables/financemanage/tblRate')
var customerData = require('../controller_finance/ctl-apiSpecializedSoftware')

async function getAverageVotesFromDepartment(departmentID) {
    let result = 0;
    let arrayStaffID = []
    await mtblDMNhanvien(db).findAll({
        where: {
            IDBoPhan: departmentID
        }
    }).then(data => {
        data.forEach(element => {
            arrayStaffID.push(element.ID)
        });
    })
    await mtblReceiptsPayment(db).findAll({
        where: {

        }
    })

}
let styleHearderTitle = {
    font: {
        // color: '#FF0800',
        size: 12,
        bold: true,
        name: 'Times New Roman',
    },
    alignment: {
        wrapText: true,
        // ngang
        horizontal: 'center',
    },
    border: {
        left: {
            style: 'thin',
            color: '#000000' // HTML style hex value
        },
        right: {
            style: 'thin',
            color: '#000000'
        },
        top: {
            style: 'thin',
            color: '#000000'
        },
        bottom: {
            style: 'thin',
            color: '#000000'
        },
    },
    // numberFormat: '$#,##0.00; ($#,##0.00); -',
}
let styleHearderText = {
    font: {
        // color: '#FF0800',
        size: 10,
        bold: true,
        name: 'Times New Roman',
    },
    alignment: {
        wrapText: true,
        horizontal: 'center',
    },
    border: {
        left: {
            style: 'thin',
            color: '#000000' // HTML style hex value
        },
        right: {
            style: 'thin',
            color: '#000000'
        },
        top: {
            style: 'thin',
            color: '#000000'
        },
        bottom: {
            style: 'thin',
            color: '#000000'
        },
    },
    // numberFormat: '$#,##0.00; ($#,##0.00); -',
}
let styleHearderNumber = {
    font: {
        // color: '#FF0800',
        size: 12,
        bold: true,
        name: 'Times New Roman',
    },
    numberFormat: '#,##0; (#,##0); 0',
    alignment: {
        wrapText: true,
        horizontal: 'right',
        vertical: 'center',
    },
    border: {
        left: {
            style: 'thin',
            color: '#000000' // HTML style hex value
        },
        right: {
            style: 'thin',
            color: '#000000'
        },
        top: {
            style: 'thin',
            color: '#000000'
        },
        bottom: {
            style: 'thin',
            color: '#000000'
        },
    },
}
let styleCellText = {
    font: {
        size: 8,
        bold: true,
        name: 'Times New Roman',
    },
    alignment: {
        wrapText: true,
        // ngang
        horizontal: 'center',
    },
    border: {
        left: {
            style: 'thin',
            color: '#000000' // HTML style hex value
        },
        right: {
            style: 'thin',
            color: '#000000'
        },
        top: {
            style: 'thin',
            color: '#000000'
        },
        bottom: {
            style: 'thin',
            color: '#000000'
        },
    },
}
let stylecellNumber = {
    font: {
        // color: '#FF0800',
        size: 12,
        bold: false,
        name: 'Times New Roman',
    },
    numberFormat: '#,##0; (#,##0); 0',
    alignment: {
        wrapText: true,
        // ngang
        horizontal: 'right',
        // D???c
        vertical: 'center',
    },
    border: {
        left: {
            style: 'thin',
            color: '#000000' // HTML style hex value
        },
        right: {
            style: 'thin',
            color: '#000000'
        },
        top: {
            style: 'thin',
            color: '#000000'
        },
        bottom: {
            style: 'thin',
            color: '#000000'
        },
    },
}
let stylecellNumberSpecial = {
    font: {
        // color: '#FF0800',
        size: 12,
        bold: false,
        name: 'Times New Roman',
    },
    numberFormat: '#,##0.00; (#,##0.00); -',
    alignment: {
        wrapText: true,
        // ngang
        horizontal: 'right',
        // D???c
        vertical: 'center',
    },
    border: {
        left: {
            style: 'thin',
            color: '#000000' // HTML style hex value
        },
        right: {
            style: 'thin',
            color: '#000000'
        },
        top: {
            style: 'thin',
            color: '#000000'
        },
        bottom: {
            style: 'thin',
            color: '#000000'
        },
    },
}
let stylePublic = {
    border: {
        left: {
            style: 'thin',
            color: '#000000' // HTML style hex value
        },
        right: {
            style: 'thin',
            color: '#000000'
        },
        top: {
            style: 'thin',
            color: '#000000'
        },
        bottom: {
            style: 'thin',
            color: '#000000'
        },
    },
}
async function getDetailCustomer(id) {
    let dataCustomer = await customerData.getListCustomerOfPMCM()
    var obj = {}
    dataCustomer.forEach(item => {
        if (item.id == id) {
            obj = item
        }
    })
    return obj

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
async function getDetailReceiptsPayment(db, idPayment) {
    let objResult = {}
    try {
        let tblReceiptsPayment = mtblReceiptsPayment(db);
        await tblReceiptsPayment.findOne({
            where: { ID: idPayment },
        }).then(async data => {
            if (data) {
                let obj = {
                    "NG??Y": data.Date ? moment(data.Date).add(7, 'hours').format('DD') : null,
                    "TH??NG": data.Date ? moment(data.Date).add(7, 'hours').format('MM') : null,
                    "N??M": data.Date ? moment(data.Date).add(7, 'hours').format('YYYY') : null,
                    "S??? PHI???U": data.VoucherNumber ? data.VoucherNumber : '',
                    "?????A CH???": data.Address ? data.Address : '',
                    "L?? DO": data.Reason ? data.Reason : '',
                    "S??? TI???N": data.Amount ? data.Amount : null,
                    // "S??? PHI???U": data.CodeNumber ? data.CodeNumber : null,
                    "S??? TI???N B???NG CH???": data.AmountWords ? data.AmountWords : '',
                };
                let objName = ''
                if (data.IDStaff) {
                    let staff = await mtblDMNhanvien(db).findOne({
                        where: { ID: data.IDStaff }
                    })
                    objName = '[' + (staff ? staff.StaffCode : '') + '] ' + (staff ? staff.StaffName : '');
                } else if (data.IDPartner) {
                    let dataPartner = await getDetailPartner(data.IDPartner)
                    objName = '[' + (dataPartner ? dataPartner.partnerCode : '') + '] ' + (dataPartner ? dataPartner.name : '');
                } else {
                    let dataCus = await getDetailCustomer(data.IDCustomer)
                    objName = '[' + (dataCus ? dataCus.customerCode : '') + '] ' + (dataCus ? dataCus.name : '');
                }
                obj['?????I T?????NG'] = objName
                let nameCredit = ''
                let namedebit = ''
                let tblPaymentAccounting = mtblPaymentAccounting(db);
                tblPaymentAccounting.belongsTo(mtblDMTaiKhoanKeToan(db), { foreignKey: 'IDAccounting', sourceKey: 'IDAccounting', as: 'acc' })
                await tblPaymentAccounting.findAll({
                    include: [{
                        model: mtblDMTaiKhoanKeToan(db),
                        required: false,
                        as: 'acc'
                    },],
                    where: {
                        IDReceiptsPayment: data.ID,
                        type: "CREDIT"
                    }
                }).then(data => {
                    for (let d = 0; d < data.length; d++) {
                        if (d < data.length.length - 1)
                            nameCredit += (data[d].acc ? data[d].acc.AccountingCode : '') + ', '
                        else
                            nameCredit += (data[d].acc ? data[d].acc.AccountingCode : '')
                    }
                })
                await tblPaymentAccounting.findAll({
                    include: [{
                        model: mtblDMTaiKhoanKeToan(db),
                        required: false,
                        as: 'acc'
                    },],
                    where: {
                        IDReceiptsPayment: data.ID,
                        type: "DEBIT"
                    }
                }).then(data => {
                    for (let d = 0; d < data.length; d++) {
                        if (d < data.length.length - 1)
                            namedebit += (data[d].acc ? data[d].acc.AccountingCode : '') + ', '
                        else
                            namedebit += (data[d].acc ? data[d].acc.AccountingCode : '')
                    }
                })
                obj['N??? TK'] = namedebit
                obj['C?? TK'] = nameCredit
                obj['type'] = data.Type
                objResult = obj
            }
        })
    } catch (error) {
        console.log(error);
    }
    return objResult
}
function convertNumber(number) {
    if (number < 10) {
        return '0' + number
    } else
        return number
}
async function getExchangeRateFromDate(typeMoney, date) {
    let result = {};
    await database.connectDatabase().then(async db => {
        let currency = await mtblCurrency(db).findOne({
            where: { ShortName: typeMoney }
        })
        if (currency)
            await mtblRate(db).findOne({
                where: {
                    Date: { [Op.substring]: date },
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
                    console.log(123456);
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
                            result = {
                                typeMoney: typeMoney,
                                exchangeRate: Rate.ExchangeRate,
                            }
                    })
                }
            })
    })
    return result
}
module.exports = {
    // report_average_votes
    reportAverageVotes: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMBoPhan(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async department => {
                        for (let d = 0; d < department.length; d++) {
                            let receipt = await mtblReceiptsPayment(db).findAll({})
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
    // T???NG H???P DOANH THU SHTT
    // export_excel_report_aggregate_revenue
    exportExcelReportAggregateRevenue: (req, res) => {
        var wb = new xl.Workbook();
        var body = req.body
        let data = JSON.parse(body.data)
        console.log(body);
        // Create a reusable style
        styleHearderText['fill'] = {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#CCFFFF',
            fgColor: '#CCFFFF',
        }
        var styleHearderT = wb.createStyle(styleHearderText);
        var styleHearderN = wb.createStyle(styleHearderNumber);
        var stylecellT = wb.createStyle(styleCellText);
        var stylecellN = wb.createStyle(stylecellNumber);
        let arrayHeader = data.arrayHeader
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // Add Worksheets to the workbook
                    var ws = wb.addWorksheet('Sheet 1');
                    ws.column(1).setWidth(5);
                    ws.row(1).setHeight(25);
                    ws.row(2).setHeight(25);
                    ws.row(3).setHeight(25);
                    ws.row(4).setHeight(25);
                    ws.cell(1, 1, 1, 6, true)
                        .string('T???NG H???P DOANH THU SHTT N??M ' + body.year)
                        .style(styleHearderTitle);
                    stylePublic['font'] = {
                        size: 11,
                        bold: true,
                        underline: true,
                        name: 'Times New Roman',
                    }
                    stylePublic['alignment'] = {
                        wrapText: true,
                        // ngang
                        // horizontal: 'center',
                        // D???c
                        // vertical: 'center',
                    }
                    ws.cell(2, 1, 2, 6, true)
                        .string('DOANH THU TR??N DEBINOTE')
                        .style(stylePublic);
                    var row = 1
                    for (let width = 2; width < 1000; width++) {
                        ws.column(width).setWidth(20);
                        // ws.row(width).setWidth(20);
                    }
                    for (let hd = 0; hd < arrayHeader.length; hd++) {
                        if (hd < 2) {
                            ws.cell(3, row)
                                .string(arrayHeader[hd])
                                .style(styleHearderT);
                            styleCellText['fill'] = {
                                type: 'pattern',
                                patternType: 'solid',
                                bgColor: '#FFFF99',
                                fgColor: '#FFFF99',
                            }
                            let style = wb.createStyle(styleCellText)
                            ws.cell(4, row)
                                .number(hd + 1)
                                .style(style);
                            row += 1
                        } else {
                            ws.cell(3, row, 3, row + 3, true)
                                .string(arrayHeader[hd])
                                .style(styleHearderT);
                            styleCellText['fill'] = {
                                type: 'pattern',
                                patternType: 'solid',
                                bgColor: '#FFC000',
                                fgColor: '#FFC000',
                            }
                            let style1 = wb.createStyle(styleCellText)
                            ws.cell(4, row)
                                .string(arrayHeader[hd])
                                .style(style1);
                            styleCellText['fill'] = {
                                type: 'pattern',
                                patternType: 'solid',
                                bgColor: '#92D050',
                                fgColor: '#92D050',
                            }
                            let style2 = wb.createStyle(styleCellText)
                            ws.cell(4, row + 1)
                                .string(arrayHeader[hd])
                                .style(style2);
                            styleCellText['fill'] = {
                                type: 'pattern',
                                patternType: 'solid',
                                bgColor: '#FFFF99',
                                fgColor: '#FFFF99',
                            }
                            let style3 = wb.createStyle(styleCellText)
                            ws.cell(4, row + 2)
                                .string('CH??NH L???CH')
                                .style(style3);
                            ws.cell(4, row + 3)
                                .string('T??? L??? (%)')
                                .style(style3);
                            row += 4
                        }
                    }
                    row = 5
                    let stt = 1;
                    for (let arr = 0; arr < data.arrayResult.length; arr++) {
                        ws.cell(row, 1).number(stt).style(stylecellT)
                        stt += 1
                        stylePublic['font'] = {
                            size: 12,
                            // bold: true,
                            // underline: true,
                            name: 'Times New Roman',
                        }
                        stylePublic['alignment'] = {
                            wrapText: true,
                            // ngang
                            horizontal: 'left',
                            // D???c
                            vertical: 'center',
                        }
                        ws.cell(row, 2).string(data.arrayResult[arr]['departmentName']).style(stylePublic)
                        let checkCol = 2;
                        for (let col = 1; col <= 12; col++) {
                            let monthBefore = 'monthBefore' + convertNumber(col)
                            let monthAfter = 'monthAfter' + convertNumber(col)
                            let difference = 'difference' + col
                            let ratio = 'ratio' + col
                            ws.cell(row, col + checkCol).string(data.arrayResult[arr][monthBefore].toString()).style(stylecellN)
                            ws.cell(row, col + checkCol + 1).string(data.arrayResult[arr][monthAfter].toString()).style(stylecellN)
                            ws.cell(row, col + checkCol + 2).string(data.arrayResult[arr][difference].toString()).style(stylecellN)
                            ws.cell(row, col + checkCol + 3).string(data.arrayResult[arr][ratio].toString()).style(stylecellN)
                            checkCol += 3
                        }
                        row += 1
                    }
                    ws.column(2).setWidth(30);
                    await wb.write('C:/images_services/ageless_sendmail/' + 'B???ng t???ng h???p doanh thi tr??n debinote n??m ' + body.year + '.xlsx');
                    setTimeout(() => {
                        var result = {
                            link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/' + 'B???ng t???ng h???p doanh thi tr??n debinote n??m ' + body.year + '.xlsx',
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                        }
                        res.json(result);
                    }, 500);

                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // DOANH THU TR??N TI???N V???
    // export_excel_report_money_revenue
    exportExcelReportMoneyRevenue: (req, res) => {
        var wb = new xl.Workbook();
        // Create a reusable style
        styleHearderText['alignment'] = {
            wrapText: true,
            horizontal: 'center',
            // D???c
            vertical: 'center',
        }
        var styleHearderT = wb.createStyle(styleHearderText);
        var styleHearderN = wb.createStyle(styleHearderNumber);
        var stylecellT = wb.createStyle(styleCellText);
        var stylecellN = wb.createStyle(stylecellNumber);
        let body = req.body;
        body.data = body.data.replace(/plus/g, '+');
        let data = JSON.parse(body.data);
        let arrayHeader = data.arrayHeader
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // Add Worksheets to the workbook
                    var ws = wb.addWorksheet('Sheet 1');
                    ws.column(1).setWidth(5);
                    ws.row(1).setHeight(25);
                    ws.row(2).setHeight(25);
                    ws.row(3).setHeight(25);
                    ws.row(4).setHeight(25);
                    ws.cell(1, 1, 1, 6, true)
                        .string('DOANH THU TR??N TI???N V??? N??M ' + body.year)
                        .style(styleHearderTitle);
                    var row = 1
                    for (let width = 2; width < 1000; width++) {
                        ws.column(width).setWidth(20);
                    }
                    // D??ng ????? render ra hearder v?? d??ng find d??? li???u
                    let numberTypeMoney = data.arrayCurrency.length;
                    for (let hd = 0; hd < arrayHeader.length; hd++) {
                        if (hd < 2) {
                            ws.cell(3, row, 4, row, true)
                                .string(arrayHeader[hd])
                                .style(styleHearderT);
                            row += 1
                        } else {
                            if (hd % 2 == 0) {
                                styleHearderText['fill'] = {
                                    type: 'pattern',
                                    patternType: 'solid',
                                    bgColor: '#FFC000',
                                    fgColor: '#FFC000',
                                }
                                styleHearderT = wb.createStyle(styleHearderText);
                                styleCellText['fill'] = {
                                    type: 'pattern',
                                    patternType: 'solid',
                                    bgColor: '#FFC000',
                                    fgColor: '#FFC000',
                                }
                                ws.cell(3, row, 3, row + 1, true)
                                    .string(arrayHeader[hd])
                                    .style(styleHearderT);
                                let style = wb.createStyle(styleCellText)
                                for (let i = 0; i < data.arrayCurrency.length; i++) {
                                    ws.cell(4, row + i)
                                        .string(data.arrayCurrency[i])
                                        .style(style);
                                }
                            } else {
                                styleHearderText['fill'] = {
                                    type: 'pattern',
                                    patternType: 'solid',
                                    bgColor: '#92D050',
                                    fgColor: '#92D050',
                                }
                                styleCellText['fill'] = {
                                    type: 'pattern',
                                    patternType: 'solid',
                                    bgColor: '#92D050',
                                    fgColor: '#92D050',
                                }
                                styleHearderT = wb.createStyle(styleHearderText);
                                ws.cell(3, row, 3, row + 1, true)
                                    .string(arrayHeader[hd])
                                    .style(styleHearderT);
                                let style = wb.createStyle(styleCellText)
                                for (let i = 0; i < data.arrayCurrency.length; i++) {
                                    ws.cell(4, row + i)
                                        .string(data.arrayCurrency[i])
                                        .style(style);
                                }
                            }
                            row += numberTypeMoney
                        }
                    }
                    let stt = 1;
                    row = 5
                    ws.cell(row, 1).number(stt).style(stylecellT)
                    stylePublic['font'] = {
                        size: 12,
                        // bold: true,
                        // underline: true,
                        name: 'Times New Roman',
                    }
                    stylePublic['alignment'] = {
                        wrapText: true,
                        // ngang
                        horizontal: 'left',
                        // D???c
                        vertical: 'center',
                    }
                    let checkCol = 3;
                    let checkTotal = 3;
                    console.log(data.arrayResult);
                    ws.cell(row, 2).string('Doanh thu ti???n v???').style(stylePublic)
                    for (let col = 1; col <= 12; col++) {
                        let monthBefore = 'monthBefore' + convertNumber(col)
                        let monthAfter = 'monthAfter' + convertNumber(col)
                        for (let arrIndex = 0; arrIndex < numberTypeMoney; arrIndex++) {
                            ws.cell(row, checkCol + arrIndex).number(data.arrayResult[monthBefore][arrIndex].value).style(stylecellN)
                        }
                        checkCol += numberTypeMoney
                        for (let arrIndex = 0; arrIndex < numberTypeMoney; arrIndex++) {
                            ws.cell(row, checkCol + arrIndex).number(data.arrayResult[monthAfter][arrIndex].value).style(stylecellN)
                        }
                        checkCol += numberTypeMoney
                        stylePublic['font'] = {
                            size: 12,
                            // bold: true,
                            // underline: true,
                            name: 'Times New Roman',
                        }
                        stylePublic['alignment'] = {
                            wrapText: true,
                            // ngang
                            horizontal: 'center',
                            // D???c
                            vertical: 'center',
                        }
                        ws.cell(row + 1, 1).string('').style(stylePublic)
                        ws.cell(row + 1, 2).string('C???ng').style(stylePublic)
                        ws.cell(row + 1, checkTotal, row + 1, checkTotal + 1, true).string(data.arrayTotal[monthBefore]).style(stylePublic)
                        ws.cell(row + 1, checkTotal + 2, row + 1, checkTotal + 3, true).string(data.arrayTotal[monthAfter]).style(stylePublic)
                        checkTotal += 4
                    }
                    ws.column(2).setWidth(30);
                    await wb.write('C:/images_services/ageless_sendmail/' + 'Doanh thu ti???n v??? n??m ' + body.year + '.xlsx');
                    setTimeout(() => {
                        var result = {
                            link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/' + 'Doanh thu ti???n v??? n??m ' + body.year + '.xlsx',
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                        }
                        res.json(result);
                    }, 500);

                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // DOANH THU B??NH QU??N TH??NG C???A C??C BAN HO???C C??? C??NG TY THEO N??M
    // export_excel_report_average_monthly_revenue_by_year
    exportExcelReportAverageMonthlyRevenueByYear: (req, res) => {
        let body = req.body;
        let data = JSON.parse(body.data)
        console.log(body);
        let month = body.date.slice(5, 7); // January
        let year = Number(body.date.slice(0, 4));
        let yearLast = Number(body.date.slice(0, 4)) - 1;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let values = {
                        year: year,
                        yearLast: yearLast,
                        month: month + '/' + year,
                        data: data.arrayResult,
                    };
                    console.log(values);
                    let path = 'C:/images_services/ageless_sendmail/'
                    await mModules.convertDataAndRenderExcelFile(values, path + 'template-average-monthly-revenue-by-year.xlsx', path + 'Doanh thu b??nh qu??n th??ng c???a c??c ban theo n??m.xlsx')
                    setTimeout(() => {
                        var result = {
                            link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/' + 'Doanh thu b??nh qu??n th??ng c???a c??c ban theo n??m.xlsx',
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                        }
                        res.json(result);
                    }, 3000);
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // pour_data_into_work_file_and_convert_to_pdf
    pourDataIntoWorkFileAndConvertToPDF: async (req, res) => {
        let body = req.body;
        var objKey = {}
        let date;
        if (body.id)
            await database.connectDatabase().then(async db => {
                if (db) {
                    objKey = await getDetailReceiptsPayment(db, body.id)
                }
            })
        else {
            let objRequest = JSON.parse(body.obj)
            date = objRequest.date
            let type = 'receipt'
            if (objRequest.typeVoucher == 'payment') {
                type = 'payment'
            } else if (objRequest.typeVoucher == 'debit') {
                type = 'debit'
            } else if (objRequest.typeVoucher == 'spending') {
                type = 'spending'
            } else if (objRequest.typeVoucher == 'accounting') {
                type = 'accounting'
            } else if (objRequest.typeVoucher == 'inventoryReceiving') {
                type = 'inventoryReceiving'
            }
            let debtAccount = ''
            let creditAccount = ''
            let arrayAccount = []
            let sttAccount = 1;
            for (let debt = 0; debt < objRequest.debtFormArr.length; debt++) {
                arrayAccount.push({
                    stt: sttAccount,
                    explain: objRequest.debtFormArr[debt].content,
                    accountName: objRequest.debtFormArr[debt].debtAccount ? objRequest.debtFormArr[debt].debtAccount.accountingCode : '',
                    debt: mModules.transform(objRequest.debtFormArr[debt].amountOfMoney),
                    credit: '',
                })
                if (objRequest.debtFormArr[debt].debtAccount != '') {
                    if (debt < objRequest.debtFormArr.length - 1)
                        debtAccount += objRequest.debtFormArr[debt].debtAccount.accountingCode + ', '
                    else
                        debtAccount += objRequest.debtFormArr[debt].debtAccount.accountingCode
                }
                sttAccount += 1;
            }
            for (let cre = 0; cre < objRequest.hasFormArr.length; cre++) {
                arrayAccount.push({
                    stt: sttAccount,
                    explain: objRequest.hasFormArr[cre].content,
                    accountName: objRequest.hasFormArr[cre].hasAccount ? objRequest.hasFormArr[cre].hasAccount.accountingCode : '',
                    debt: '',
                    credit: mModules.transform(objRequest.hasFormArr[cre].amountOfMoney),
                })
                if (objRequest.hasFormArr[cre].hasAccount) {
                    if (cre < objRequest.hasFormArr.length - 1)
                        creditAccount += objRequest.hasFormArr[cre].hasAccount.accountingCode + ', '
                    else
                        creditAccount += objRequest.hasFormArr[cre].hasAccount.accountingCode
                }
                sttAccount += 1;
            }
            objKey = {
                "NG??Y": objRequest.date ? moment(objRequest.date).add(7, 'hours').format('DD') : null,
                "TH??NG": objRequest.date ? moment(objRequest.date).add(7, 'hours').format('MM') : null,
                "N??M": objRequest.date ? moment(objRequest.date).add(7, 'hours').format('YYYY') : null,
                "S??? PHI???U": objRequest.voucherNumber ? objRequest.voucherNumber : '',
                "?????A CH???": objRequest.address ? objRequest.address : '',
                "L?? DO": objRequest.reason ? objRequest.reason : '',
                "S??? TI???N": objRequest.moneyNumber ? mModules.transform(objRequest.moneyNumber) : null,
                "S??? TI???N B???NG CH???": objRequest.moneyText ? objRequest.moneyText : '',
                "?????I T?????NG": objRequest.object ? objRequest.object.displayName : '',
                "N??? TK": debtAccount,
                "C?? TK": creditAccount,
                "type": type,
                "LO???I TI???N": objRequest.idCurrency ? objRequest.idCurrency.shortName : '',
                "arrayAccount": arrayAccount,
            }
            if (objKey != {} && objKey.type == 'inventoryReceiving') {
                objKey['arrayAccount'] = objRequest.listInventoryReceiving
            }
        }
        let type = '02-TT.docx'
        let nameFile = 'Phi???u chi.docx'
        let nameFilePDF = 'Phi???u chi pdf.pdf'
        if (objKey != {} && objKey.type == 'receipt') {
            type = '01-TT.docx'
            nameFile = 'Phi???u thu.docx'
            nameFilePDF = 'Phi???u thu pdf.pdf'
            objKey['S??? TI???N'] = objKey['S??? TI???N'] + ' ' + objKey['LO???I TI???N']
        } else if (objKey != {} && objKey.type == 'spending') {
            type = '03-TT.docx'
            nameFile = 'Gi???y b??o c??.docx'
            nameFilePDF = 'Gi???y b??o c?? pdf.pdf'
            objKey["S??? TI???N QUY ?????I"] = objKey["S??? TI???N"]
            objKey["NG??Y"] = objKey["NG??Y"] + '/' + objKey["TH??NG"] + '/' + objKey["N??M"]
            objKey['S??? TI???N'] = objKey['S??? TI???N'] + ' ' + objKey['LO???I TI???N']
        } else if (objKey != {} && objKey.type == 'debit') {
            type = '04-TT.docx'
            nameFile = 'Gi???y b??o n???.docx'
            nameFilePDF = 'Gi???y b??o n??? pdf.pdf'
            objKey["NG??Y"] = objKey["NG??Y"] + '/' + objKey["TH??NG"] + '/' + objKey["N??M"]
            objKey["S??? TI???N QUY ?????I"] = objKey["S??? TI???N"]
        }
        else if (objKey != {} && objKey.type == 'payment') {
            type = '02-TT.docx'
            nameFile = 'Phi???u chi.docx'
            nameFilePDF = 'Phi???u chi pdf.pdf'
            objKey['S??? TI???N'] = objKey['S??? TI???N'] + ' ' + objKey['LO???I TI???N']
        }
        else if (objKey != {} && objKey.type == 'accounting') {
            type = '05-TT.docx'
            nameFile = 'Phi???u k??? to??n.docx'
            nameFilePDF = 'Phi???u k??? to??n.pdf'
            objKey["NG??Y"] = objKey["NG??Y"] + '/' + objKey["TH??NG"] + '/' + objKey["N??M"]
            objKey['S??? TI???N'] = objKey['S??? TI???N'] + ' ' + objKey['LO???I TI???N']
        }
        else if (objKey != {} && objKey.type == 'inventoryReceiving') {
            type = '06-TT.docx'
            nameFile = 'Phi???u nh???p kho.docx'
            nameFilePDF = 'Phi???u nh???p kho.pdf'
            objKey['S??? TI???N'] = objKey['S??? TI???N'] + ' ' + objKey['LO???I TI???N']
            let total = 0;
            for (let item of objKey['arrayAccount']) {
                total += item.totalPrice
            }
            objKey['T???NG TI???N'] = total
            console.log(total);
            objKey['S??? TI???N B???NG CH???'] = await mModules.readMoney(total.toString())
        }
        var pathTo = 'C:/images_services/ageless_sendmail/'
        fs.readFile(pathTo + type, 'binary', async function (err, data) {
            try {
                if (err) {
                    console.log(err);
                    var result = {
                        status: Constant.STATUS.FAIL,
                        message: 'File kh??ng t???n t???i. Vui l??ng c???u h??nh l???i!',
                    }
                    res.json(result);
                } else {
                    var zip = new JSZip(data);
                    var doc = new Docxtemplater().loadZip(zip)
                    //set the templateVariables
                    doc.setData(objKey);
                    doc.render()
                    var buf = doc.getZip().generate({ type: 'nodebuffer' });
                    fs.writeFileSync(path.resolve(pathTo, nameFile), buf);
                    var pathlink = pathTo + nameFile;
                    var pathEx = pathTo + nameFilePDF;
                    await mModules.convertDocxToPDF(pathlink, pathEx)
                    setTimeout(() => {
                        var result = {
                            link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/' + nameFilePDF,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                        }
                        res.json(result);
                    }, 2000);

                }
            } catch (error) {
                console.log(error);
                res.json('L???i file export. Vui l??ng c???u h??nh l???i!')
            }
        });
    },
    // xu???t file b??o c??o
    // push_data_to_excel_template
    pushDataToExcelTemplate: async (req, res) => {
        let body = req.body;
        body.data = body.data.replace(/plus/g, '+');
        let data = JSON.parse(body.data)
        try {
            let path = 'C:/images_services/ageless_sendmail/'
            var objKey = {}
            let readName = ''
            let writeName = ''
            if (body.type == '12-months-revenue') {
                readName = 'tonghopdoanhthu12thang.xlsx'
                writeName = 'T???ng h???p doanh thu 12 th??ng.xlsx'
                let month = body.date.slice(5, 7); // January
                let year = Number(body.date.slice(0, 4));
                let yearLast = Number(body.date.slice(0, 4)) - 1;
                objKey = {
                    year: year,
                    yearLast: yearLast,
                    month: month,
                    data: data.arrayResult,
                };
            } else if (body.type == 'revenue-in-vnd') {
                readName = 'doanhthutienve.xlsx'
                writeName = 'Doanh thu ti???n v??? VND.xlsx'
                let month = body.date.slice(5, 7); // January
                let year = Number(body.date.slice(0, 4));
                let yearLast = Number(body.date.slice(0, 4)) - 1;
                objKey = {
                    year: year,
                    yearLast: yearLast,
                    month: month,
                    data: data.arrayResult,
                    total: data.arrayTotal,
                };
            } else if (body.type == 'compare-average-revenue') {
                readName = 'Doanhthubinhquantheothang.xlsx'
                writeName = 'B???ng so s??nh doanh thu b??nh qu??n th??ng.xlsx'
                let obj = JSON.parse(body.obj)
                objKey = {
                    data: data.arrayResult,
                    obj: obj,
                };
            }
            await mModules.convertDataAndRenderExcelFile(objKey, path + readName, path + writeName)
            setTimeout(() => {
                var result = {
                    link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/' + writeName,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                }
                res.json(result);
            }, 3000);
        } catch (error) {
            console.log(error);
            res.json('L???i file export. Vui l??ng c???u h??nh l???i!')
        }
    },
}