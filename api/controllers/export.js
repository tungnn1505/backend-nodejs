var docxConverter = require('docx-pdf');
const Constant = require('../constants/constant');
const Result = require('../constants/result');
var mtblYeuCauMuaSam = require('../tables/qlnb/tblYeuCauMuaSam')
var mtblYeuCauMuaSamDetail = require('../tables/qlnb/tblYeuCauMuaSamDetail')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblDMHangHoa = require('../tables/qlnb/tblDMHangHoa');
var mtblDMLoaiTaiSan = require('../tables/qlnb/tblDMLoaiTaiSan');
var mtblFileAttach = require('../tables/constants/tblFileAttach');
var mtblVanPhongPham = require('../tables/qlnb/tblVanPhongPham')

// Require library
var xl = require('excel4node');
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')

// Create a new instance of a Workbook class
var database = require('../database');
var fs = require('fs');
const PDFNetEndpoint = (main, pathname, res) => {
    PDFNet.runWithCleanup(main)
        .then(() => {
            PDFNet.shutdown();
            fs.readFile(pathname, (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    res.end(`Error getting the file: ${err}.`);
                } else {
                    fs.writeFileSync(pathname, data);
                }
            });
        })
        .catch((error) => {
            res.statusCode = 500;
            console.log(error);
        });
};
const { PDFNet } = require('@pdftron/pdfnet-node');
var fs = require("fs")
const path = require('path');
const unoconv = require('awesome-unoconv');
const libre = require('libreoffice-convert-win');
var moment = require('moment');
var mtblDMChiNhanh = require('../tables/constants/tblDMChiNhanh')

function transform(amount, decimalCount = 2, decimal = '.', thousands = ',') {
    if (amount >= 100) {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? '-' : '';

        let i = parseInt(
            (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
        ).toString();
        let j = i.length > 3 ? i.length % 3 : 0;

        return (
            negativeSign +
            (j ? i.substr(0, j) + thousands : '') +
            i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands)
        );
    } else {
        return amount.toString();
    }
}

async function getDetailYCMS(db, id) {
    let obj = {}
    let tblYeuCauMuaSam = mtblYeuCauMuaSam(db); // bắt buộc
    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'NhanVien' })
    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDPheDuyet1', sourceKey: 'IDPheDuyet1', as: 'PheDuyet1' })
    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDPheDuyet2', sourceKey: 'IDPheDuyet2', as: 'PheDuyet2' })
    tblYeuCauMuaSam.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDPhongBan', sourceKey: 'IDPhongBan', as: 'phongban' })
    let tblYeuCauMuaSamDetail = mtblYeuCauMuaSamDetail(db);
    tblYeuCauMuaSam.hasMany(tblYeuCauMuaSamDetail, { foreignKey: 'IDYeuCauMuaSam', as: 'line' })
    await tblYeuCauMuaSam.findOne({
        order: [
            ['ID', 'DESC']
        ],
        include: [{
            model: mtblDMBoPhan(db),
            required: false,
            as: 'phongban'
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
        where: { ID: id }
    }).then(async data => {
        obj = {
            id: Number(data.ID),
            idNhanVien: data.IDNhanVien ? data.IDNhanVien : null,
            nameNhanVien: data.NhanVien ? data.NhanVien.StaffName : null,
            idPhongBan: data.IDPhongBan ? data.IDPhongBan : null,
            codePhongBan: data.phongban ? data.phongban.DepartmentCode : null,
            namePhongBan: data.phongban ? data.phongban.DepartmentName : null,
            requireDate: data.RequireDate ? moment(data.RequireDate).format('DD/MM/YYYY') : null,
            reason: data.Reason ? data.Reason : '',
            status: data.Status ? data.Status : '',
            idPheDuyet1: data.IDPheDuyet1 ? data.IDPheDuyet1 : null,
            namePheDuyet1: data.PheDuyet1 ? data.PheDuyet1.StaffName : null,
            idPheDuyet2: data.IDPheDuyet2 ? data.IDPheDuyet2 : null,
            namePheDuyet2: data.PheDuyet2 ? data.PheDuyet2.StaffName : null,
            type: data.Type ? data.Type : '',
            line: data.line
        }
        var arrayTaiSan = []
        var arrayVPP = []
        var arrayFile = []
        var total = 0;
        for (var j = 0; j < obj.line.length; j++) {
            if (data.Type == 'Tài sản') {
                var price = obj.line[j].Price ? obj.line[j].Price : 0
                var amount = obj.line[j].Amount ? obj.line[j].Amount : 0
                total += amount * price
                let tblDMHangHoa = mtblDMHangHoa(db);
                tblDMHangHoa.belongsTo(mtblDMLoaiTaiSan(db), { foreignKey: 'IDDMLoaiTaiSan', sourceKey: 'IDDMLoaiTaiSan', as: 'loaiTaiSan' })
                await tblDMHangHoa.findOne({
                    where: {
                        ID: obj.line[j].IDDMHangHoa,
                    },
                    include: [{
                        model: mtblDMLoaiTaiSan(db),
                        required: false,
                        as: 'loaiTaiSan'
                    },],
                }).then(data => {
                    if (data)
                        arrayTaiSan.push({
                            id: Number(data.ID),
                            name: data.Name,
                            code: data.Code,
                            amount: obj.line[j] ? obj.line[j].Amount : 0,
                            nameLoaiTaiSan: data.loaiTaiSan ? data.loaiTaiSan.Name : '',
                            idLine: obj.line[j].ID,
                            amount: amount,
                            unitPrice: price,
                            remainingAmount: 0,
                        })
                })
            } else {
                await mtblVanPhongPham(db).findOne({ where: { ID: obj.line[j].IDVanPhongPham } }).then(data => {
                    var price = obj.line[j].Price ? obj.line[j].Price : 0
                    var amount = obj.line[j].Amount ? obj.line[j].Amount : 0

                    if (data) {
                        total += amount * price
                        arrayVPP.push({
                            name: data.VPPName ? data.VPPName : '',
                            code: data.VPPCode ? data.VPPCode : '',
                            amount: amount,
                            unitPrice: price,
                            remainingAmount: data.RemainingAmount ? data.RemainingAmount : 0,
                            id: Number(obj.line[j].IDVanPhongPham),
                        })
                    }
                })
            }
        }
        obj['price'] = total;
        await mtblFileAttach(db).findAll({ where: { IDYeuCauMuaSam: obj.id } }).then(file => {
            if (file.length > 0) {
                for (var e = 0; e < file.length; e++) {
                    arrayFile.push({
                        name: file[e].Name ? file[e].Name : '',
                        link: file[e].Link ? file[e].Link : '',
                        id: file[e].ID
                    })
                }
            }
        })
        obj['arrayTaiSan'] = arrayTaiSan.length > 0 ? arrayTaiSan : arrayVPP;
        // obj['arrayVPP'] = arrayVPP;
        obj['arrayFile'] = arrayFile;
    })
    return obj
}
let styleHearderTitle = {
    font: {
        // color: '#FF0800',
        size: 18,
        bold: true,
        name: 'Times New Roman',
    },
    alignment: {
        wrapText: true,
        // ngang
        horizontal: 'center',
        // Dọc
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
        // ngang
        horizontal: 'center',
        // Dọc
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
    // numberFormat: '$#,##0.00; ($#,##0.00); -',
}
let styleHearderNumber = {
    font: {
        // color: '#FF0800',
        size: 10,
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
        size: 9,
        bold: false,
        name: 'Times New Roman',
    },
    alignment: {
        wrapText: true,
        // ngang
        horizontal: 'center',
        // Dọc
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
let stylecellNumber = {
    font: {
        // color: '#FF0800',
        size: 9,
        bold: false,
        name: 'Times New Roman',
    },
    numberFormat: '#,##0; (#,##0); 0',
    alignment: {
        wrapText: true,
        // ngang
        horizontal: 'right',
        // Dọc
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
        size: 9,
        bold: false,
        name: 'Times New Roman',

    },
    numberFormat: '#,##0.00; (#,##0.00); -',
    alignment: {
        wrapText: true,
        // ngang
        horizontal: 'right',
        // Dọc
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

function getDateFinal(monthYear) {
    var month = Number(monthYear.slice(5, 7)); // January
    var year = Number(monthYear.slice(0, 4));
    var date = new Date(year, month, 0);
    var dateFinal = Number(date.toISOString().slice(8, 10))
    dateFinal += 1
    return dateFinal
}
var mModules = require('../constants/modules');
function convertNumber(number) {
    if (number < 10) {
        return '0' + number
    } else
        return number
}
module.exports = {
    // convert_docx_to_pdf
    convertDocxToPDF: (req, res) => {
        let body = req.body;
        try {
            // var pathlink = 'C:/images_services/ageless_sendmail/002.docx'
            var pathlink = 'C:/images_services/ageless_sendmail/' + body.link.slice(47, 100);
            const extend = '.pdf'
            var pathEx = 'C:/images_services/ageless_sendmail/export_pdf_file.pdf'
            const file = fs.readFileSync(pathlink);
            // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
            libre.convert(file, extend, undefined, (err, done) => {
                if (err) {
                    console.log(`Error converting file: ${err}`);
                }
                // Here in done you have pdf file which you can save or transfer in another stream
                fs.writeFileSync(pathEx, done);
                var result = {
                    link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/export_pdf_file.pdf',
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                }
                res.json(result);
            });
            // const main = async () => {
            //     const pdfdoc = await PDFNet.PDFDoc.create();
            //     await pdfdoc.initSecurityHandler();
            //     await PDFNet.Convert.toPdf(pdfdoc, path);
            //     // const page = await doc.pageCreate();
            //     // doc.pagePushBack(page);
            //     pdfdoc.save(
            //         'C:/images_services/ageless_sendmail/export-file-pdf.pdf',
            //         PDFNet.SDFDoc.SaveOptions.e_linearized,
            //     );
            // };
            // // add your own license key as the second parameter, e.g. PDFNet.runWithCleanup(main, 'YOUR_LICENSE_KEY')
            // // PDFNet.runWithCleanup(main).catch(function (error) {
            // //     console.log('Error: ' + JSON.stringify(error));
            // // }).then(function () { PDFNet.shutdown(); });
            // PDFNetEndpoint(main, 'C:/images_services/ageless_sendmail/export-file-pdf.pdf', res);

        } catch (error) {
            console.log(error);
            res.json(Result.SYS_ERROR_RESULT)
        }

    },
    // export_to_file_excel, yêu cầu mua sắm
    exportToFileExcel: (req, res) => {
        var wb = new xl.Workbook();
        // Create a reusable style
        var styleHearder = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 14,
                bold: true,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
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
            }
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var stylecell = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
                vertical: 'center',
            },
            border: {
                left: {
                    style: 'thin', //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
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
            }
        });
        var stylecellNumber = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'right',
                // Dọc
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
            }
        });
        let body = req.body;
        let data = JSON.parse(body.data);
        let arrayHeader = [
            'STT',
            'LOẠI YÊU CẦU',
            'Mã YCMS',
            'NHÂN VIÊN',
            'NGÀY ĐỀ XUẤT',
            'MÃ TS/TB/LK',
            'TÊN TS/TB/LK',
            'ĐƠN GIÁ',
            'SỐ LƯỢNG',
            'SỐ TỒN',
            'TỔNG TIỀN',
            'IMPORT BÁO GIÁ',
            'LÝ DO MUA',
            // 'TRẠNG THÁI'
        ]
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // Add Worksheets to the workbook
                    var ws = wb.addWorksheet('Sheet 1');
                    var row = 1
                    ws.column(row).setWidth(5);
                    ws.cell(1, 1, 1, 13, true)
                        .string('DANH SÁCH YÊU CẦU MUA SẮM')
                        .style(styleHearder);
                    arrayHeader.forEach(element => {
                        ws.cell(4, row)
                            .string(element)
                            .style(styleHearder);
                        row += 1
                        ws.column(row).setWidth(20);
                    });
                    var row = 0;
                    var checkMaxRow = 1;
                    for (let i = 0; i < data.length; i++) {
                        data[i].arrayTaiSanExport = JSON.parse(data[i].arrayTaiSanExport)
                        data[i].arrayFileExport = JSON.parse(data[i].arrayFileExport)
                        var max = 0;
                        if (i > 0)
                            row = checkMaxRow + 4
                        else
                            row = i + 5
                        if (data[i].arrayTaiSanExport.length >= data[i].arrayFileExport.length) {
                            checkMaxRow += data[i].arrayTaiSanExport.length;
                            max = data[i].arrayTaiSanExport.length;
                        } else {
                            checkMaxRow += data[i].arrayFileExport.length;
                            max = data[i].arrayFileExport.length;
                        }
                        // Tạo dữ liệu trống nếu số lượng tài sản < số lượng file
                        for (var taisan = 0; taisan < max; taisan++) {
                            ws.cell(taisan + row, 6).string(data[i].arrayTaiSanExport[taisan] ? data[i].arrayTaiSanExport[taisan].code : '').style(stylecell)
                            ws.cell(taisan + row, 7).string(data[i].arrayTaiSanExport[taisan] ? data[i].arrayTaiSanExport[taisan].name : '').style(stylecell)
                            ws.cell(taisan + row, 9).string(transform(data[i].arrayTaiSanExport[taisan] ? data[i].arrayTaiSanExport[taisan].amount : 0) + '').style(stylecellNumber)
                            ws.cell(taisan + row, 8).string(transform(data[i].arrayTaiSanExport[taisan] ? data[i].arrayTaiSanExport[taisan].unitPrice : 0) + '').style(stylecellNumber)
                            ws.cell(taisan + row, 10).string(transform(data[i].arrayTaiSanExport[taisan] ? data[i].arrayTaiSanExport[taisan].remainingAmount : 0) + '').style(stylecellNumber)
                        }
                        for (var file = 0; file < max; file++) {
                            ws.cell(file + row, 12).link(data[i].arrayFileExport[file] ? data[i].arrayFileExport[file].link : '', data[i].arrayFileExport[file] ? data[i].arrayFileExport[file].name : '').style(stylecell)
                        }
                        // -----------------------------------------------------------
                        if (data[i].arrayFileExport.length > 0 && data[i].arrayTaiSanExport.length > 0) {
                            ws.cell(row, 1, row + max - 1, 1, true).number(data[i].stt).style(stylecell);
                            ws.cell(row, 2, row + max - 1, 2, true).string(data[i].type).style(stylecell);
                            ws.cell(row, 3, row + max - 1, 3, true).string(data[i].requestCode).style(stylecell);
                            ws.cell(row, 4, row + max - 1, 4, true).string(data[i].nameIDNhanVien).style(stylecell);
                            ws.cell(row, 5, row + max - 1, 5, true).string(data[i].requireDate).style(stylecell);
                            ws.cell(row, 11, row + max - 1, 11, true).string(transform(data[i].price ? data[i].price : 0) + '').style(stylecellNumber);
                            ws.cell(row, 13, row + max - 1, 13, true).string(data[i].reason).style(stylecell);
                            // ws.cell(row, 12, row + max - 1, 12, true).string(data[i].status).style(stylecell);
                        } else {
                            ws.cell(row, 1).number(data[i].stt).style(stylecell);
                            ws.cell(row, 2).string(data[i].type).style(stylecell);
                            ws.cell(row, 3).string(data[i].requestCode).style(stylecell);
                            ws.cell(row, 4).string(data[i].nameIDNhanVien).style(stylecell);
                            ws.cell(row, 5).string(data[i].requireDate).style(stylecell);
                            ws.cell(row, 11).string(transform(data[i].price ? data[i].price : 0) + '').style(stylecellNumber);
                            ws.cell(row, 13,).string(data[i].reason).style(stylecell);
                            // ws.cell(row, 12,).string(data[i].status).style(stylecell);
                        }
                    }
                    await wb.write('C:/images_services/ageless_sendmail/Danh sách yêu cầu mua sắm.xlsx');
                    setTimeout(() => {
                        var result = {
                            link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/Danh sách yêu cầu mua sắm.xlsx',
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
    // export_to_file_excel_payment, đề nghị thanh toán
    exportToFileExcelPayment: (req, res) => {
        var wb = new xl.Workbook();
        // Create a reusable style
        var styleHearder = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 14,
                bold: true,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
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
            }
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var stylecell = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
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
            }
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var stylecellNumber = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'right',
                // Dọc
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
            }
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        let body = req.body;
        let data = JSON.parse(body.data);
        let arrayHeader = [
            'STT',
            'MÃ DNTT',
            'NHÀ CUNG CẤP',
            'BỘ PHẬN',
            'NGƯỜI ĐỀ NGHỊ',
            'NỘI DUNG THANH TOÁN',
            'SỐ TIỀN THANH TOÁN',
            'CHỨNG TỪ',
            // 'NGƯỜI PHÊ DUYỆT TRƯỚC',
            // 'NGƯỜI PHÊ DUYỆT SAU',
        ]
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // Add Worksheets to the workbook
                    var ws = wb.addWorksheet('Sheet 1');
                    var row = 1
                    ws.column(row).setWidth(5);
                    ws.cell(1, 1, 1, 7, true)
                        .string('DANH SÁCH ĐỀ NGHỊ THANH TOÁN')
                        .style(styleHearder);
                    arrayHeader.forEach(element => {
                        ws.cell(4, row)
                            .string(element)
                            .style(styleHearder);
                        row += 1
                        ws.column(row).setWidth(20);
                    });
                    var row = 0;
                    // dùng để check bản ghi chiếm nhiều nhất bao nhiêu dòng
                    var checkMaxRow = 1;
                    for (let i = 0; i < data.length; i++) {
                        data[i].arrayFileExport = JSON.parse(data[i].arrayFileExport)
                        var max = 1;
                        // Hàng lớn nhất của bản ghi trước
                        if (i > 0)
                            row = checkMaxRow + 4
                        // bản ghi đầu tiên
                        else
                            row = i + 5
                        if (data[i].arrayFileExport.length) {
                            checkMaxRow += data[i].arrayFileExport.length;
                            // max dùng để đánh dầu hàng tiếp theo
                            max = data[i].arrayFileExport.length;
                        } else {
                            checkMaxRow += 1;
                        }
                        for (var file = 0; file < max; file++) {
                            ws.cell(file + row, 8).link(data[i].arrayFileExport[file] ? data[i].arrayFileExport[file].link : '', data[i].arrayFileExport[file] ? data[i].arrayFileExport[file].name : '').style(stylecell)
                        }
                        if (data[i].arrayFileExport.length > 0) {
                            ws.cell(row, 1, row + max - 1, 1, true).number(data[i].stt).style(stylecell);
                            ws.cell(row, 4, row + max - 1, 4, true).string(data[i].departmentName).style(stylecell);
                            ws.cell(row, 5, row + max - 1, 5, true).string(data[i].nameNhanVien).style(stylecell);
                            ws.cell(row, 6, row + max - 1, 6, true).string(data[i].contents).style(stylecell);
                            ws.cell(row, 2, row + max - 1, 2, true).string(transform(data[i].paymentOrderCode ? data[i].paymentOrderCode : 0)).style(stylecell);
                            ws.cell(row, 3, row + max - 1, 3, true).string(data[i].supplierName).style(stylecell);
                            ws.cell(row, 7, row + max - 1, 7, true).string(transform(data[i].cost ? data[i].cost : 0)).style(stylecellNumber);
                        } else {
                            ws.cell(row, 1).number(data[i].stt).style(stylecell)
                            ws.cell(row, 4).string(data[i].departmentName).style(stylecell)
                            ws.cell(row, 5).string(data[i].nameNhanVien).style(stylecell)
                            ws.cell(row, 6).string(data[i].contents).style(stylecell)
                            ws.cell(row, 2).string(data[i].paymentOrderCode).style(stylecell)
                            ws.cell(row, 3).string(data[i].supplierName).style(stylecell)
                            ws.cell(row, 7).string(transform(data[i].cost ? data[i].cost : 0)).style(stylecellNumber);
                        }
                    }
                    await wb.write('C:/images_services/ageless_sendmail/Danh sách đề nghị thanh toán.xlsx');
                    setTimeout(() => {
                        var result = {
                            link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/Danh sách đề nghị thanh toán.xlsx',
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
    // export_to_file_import_and_export, báo cáo xuất nhập tồn văn phòng phẩm
    exportToFileImportAndExport: (req, res) => {
        var wb = new xl.Workbook();
        // Create a reusable style
        var styleHearder = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 14,
                bold: true,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
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
            }
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var stylecell = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
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
            }
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var stylecellNumber = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'right',
                // Dọc
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
            }
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        let body = req.body;
        let dateFrom = moment(body.dateFrom).format('DD/MM/YYYY')
        let dateTo = moment(body.dateTo).format('DD/MM/YYYY')
        let data = JSON.parse(body.data);
        let arrayHeader = [
            'STT',
            'MÃ VPP',
            'TÊN VPP',
            'ĐƠN VỊ TÍNH',
            'TỒN ĐẦU KÌ',
            'NHẬP TRONG KÌ',
            'XUẤT TRONG KÌ',
            'TỒN CUỐI KÌ',
        ]
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // Add Worksheets to the workbook
                    var ws = wb.addWorksheet('Sheet 1');
                    var row = 1
                    ws.column(row).setWidth(5);
                    ws.cell(1, 1, 1, 8, true)
                        .string('BÁO CÁO XUẤT NHẬP TỒN VĂN PHÒNG PHẨM ' + dateFrom + ' - ' + dateTo)
                        .style(styleHearder);
                    arrayHeader.forEach(element => {
                        ws.cell(4, row)
                            .string(element)
                            .style(styleHearder);
                        row += 1
                        ws.column(row).setWidth(20);
                    });
                    var row = 0;
                    // dùng để check bản ghi chiếm nhiều nhất bao nhiêu dòng
                    var checkMaxRow = 1;
                    for (let i = 0; i < data.length; i++) {

                        var max = 1;
                        // Hàng lớn nhất của bản ghi trước
                        if (i > 0)
                            row = checkMaxRow + 4
                        // bản ghi đầu tiên
                        else
                            row = i + 5
                        checkMaxRow += 1;
                        ws.cell(row, 1).number(data[i].stt).style(stylecell)
                        ws.cell(row, 2).string(data[i].vppCode).style(stylecell)
                        ws.cell(row, 3).string(data[i].vppName).style(stylecell)
                        ws.cell(row, 4).string(data[i].unit).style(stylecell)
                        ws.cell(row, 5).number(data[i].openingBalance).style(stylecellNumber)
                        ws.cell(row, 6).number(data[i].duringBalance).style(stylecellNumber)
                        ws.cell(row, 7).number(data[i].outputPeriod).style(stylecellNumber)
                        ws.cell(row, 8).number(data[i].closingBalance).style(stylecellNumber)
                    }
                    let dayFrom = moment(body.dateFrom).format('DD\MM\YYYY')
                    let dayTo = moment(body.dateTo).format('DDMM\YYYY')
                    await wb.write('C:/images_services/ageless_sendmail/Báo cáo xuất nhập tồn văn phòng phẩm ' + dayFrom + ' - ' + dayTo + '.xlsx');
                    setTimeout(() => {
                        var result = {
                            link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/Báo cáo xuất nhập tồn văn phòng phẩm ' + dayFrom + ' - ' + dayTo + '.xlsx',
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
    // export_to_file_asset_management, quản lý tài sản
    exportToFileAssetManagement: (req, res) => {
        var wb = new xl.Workbook();
        // Create a reusable style
        var styleHearder = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 14,
                bold: true,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
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
            }
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var stylecell = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
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
            }
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var stylecellNumber = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'right',
                // Dọc
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
            }
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        let body = req.body;
        let data = JSON.parse(body.data);
        let arrayHeader = []
        if (body.type == 'liquidation') {
            arrayHeader = [
                'STT',
                'MÃ NỘI BỘ',
                'TÊN TÀI SẢN',
                'SERIAL TÀI SẢN',
                'LOẠI TÀI SẢN',
                'ĐƠN VỊ',
                'SỐ TIỀN THANH LÝ',
                'NGÀY MUA',
                'NGÀY THANH LÝ',
                'LÝ DO',
                'TÌNH TRẠNG',
            ]
        } else {
            arrayHeader = [
                'STT',
                'MÃ NỘI BỘ',
                'TÊN TÀI SẢN',
                'SERIAL TÀI SẢN',
                'LOẠI TÀI SẢN',
                'ĐƠN VỊ',
                'NGUYÊN GIÁ',
                'GIÁ TRỊ CÒN LẠI',
                'NGÀY MUA',
                'NGÀY HẾT HẠN BẢO HÀNH',
                'BẢO HÀNH CÒN LẠI',
                'TÌNH TRẠNG',
            ]
        }
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // Add Worksheets to the workbook
                    var ws = wb.addWorksheet('Sheet 1');
                    var row = 1
                    ws.column(row).setWidth(5);
                    let type = body.type == 'liquidation' ? 'THANH LÝ' : ''
                    ws.cell(1, 1, 1, 11, true)
                        .string('DANH SÁCH TÀI SẢN ' + type)
                        .style(styleHearder);
                    arrayHeader.forEach(element => {
                        ws.cell(4, row)
                            .string(element)
                            .style(styleHearder);
                        row += 1
                        ws.column(row).setWidth(20);
                    });
                    var row = 0;
                    // dùng để check bản ghi chiếm nhiều nhất bao nhiêu dòng
                    var checkMaxRow = 1;
                    console.log(data);
                    for (let i = 0; i < data.length; i++) {

                        var max = 1;
                        // Hàng lớn nhất của bản ghi trước
                        if (i > 0)
                            row = checkMaxRow + 4
                        // bản ghi đầu tiên
                        else
                            row = i + 5
                        checkMaxRow += 1;
                        if (body.type == 'liquidation') {
                            ws.cell(row, 1).number(data[i].stt).style(stylecellNumber)
                            ws.cell(row, 2).string(data[i].codeDMHangHoa).style(stylecell)
                            ws.cell(row, 3).string(data[i].nameDMHangHoa).style(stylecell)
                            ws.cell(row, 4).string(data[i].serialNumber).style(stylecell)
                            ws.cell(row, 5).string(data[i].nameLoaiTaiSan).style(stylecell)
                            ws.cell(row, 6).string(data[i].unit).style(stylecell)
                            ws.cell(row, 7).number(data[i].liquidationMoney).style(stylecellNumber)
                            ws.cell(row, 8).string(data[i].date).style(stylecell)
                            ws.cell(row, 9).string(data[i].liquidationDate).style(stylecell)
                            ws.cell(row, 10).string(data[i].liquidationReason).style(stylecell)
                            ws.cell(row, 11).string(data[i].status).style(stylecell)
                        } else {
                            ws.cell(row, 1).number(data[i].stt).style(stylecell)
                            ws.cell(row, 2).string(data[i].codeDMHangHoa).style(stylecell)
                            ws.cell(row, 3).string(data[i].nameDMHangHoa).style(stylecell)
                            ws.cell(row, 4).string(data[i].serialNumber).style(stylecell)
                            ws.cell(row, 5).string(data[i].nameLoaiTaiSan).style(stylecell)
                            ws.cell(row, 6).string(data[i].unit).style(stylecell)
                            ws.cell(row, 7).number(data[i].originalPrice).style(stylecellNumber)
                            ws.cell(row, 8).number(data[i].depreciationPrice).style(stylecellNumber)
                            ws.cell(row, 9).string(data[i].date).style(stylecell)
                            ws.cell(row, 10).string(data[i].guaranteDate).style(stylecell)
                            ws.cell(row, 11).number(data[i].guaranteeMonth ? data[i].guaranteeMonth : 0).style(stylecellNumber)
                            ws.cell(row, 12).string(data[i].status).style(stylecell)
                        }

                    }
                    await wb.write('C:/images_services/ageless_sendmail/Danh sách tài sản' + (body.type == 'liquidation' ? ' thanh lý' : '') + '.xlsx');
                    setTimeout(() => {
                        var result = {
                            link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/Danh sách tài sản' + (body.type == 'liquidation' ? ' thanh lý' : '') + '.xlsx',
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
    // export_to_file_stationery, quản lý văn phòng phẩm
    exportToFilestationery: (req, res) => {
        var wb = new xl.Workbook();
        // Create a reusable style
        var styleHearder = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 14,
                bold: true,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
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
            }
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var stylecell = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
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
            }
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var stylecellNumber = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'right',
                // Dọc
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
            }
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        let body = req.body;
        let data = JSON.parse(body.data);
        let arrayHeader = [
            'STT',
            'MÃ VĂN PHÒNG PHẨM',
            'TÊN VĂN PHÒNG PHẨM',
            'ĐƠN VỊ TÍNH',
            'SỐ LƯỢNG TỒN',
        ]
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // Add Worksheets to the workbook
                    var ws = wb.addWorksheet('Sheet 1');
                    var row = 1
                    ws.column(row).setWidth(5);
                    ws.cell(1, 1, 1, 5, true)
                        .string('QUẢN LÝ VĂN PHÒNG PHẨM')
                        .style(styleHearder);
                    arrayHeader.forEach(element => {
                        ws.cell(4, row)
                            .string(element)
                            .style(styleHearder);
                        row += 1
                        ws.column(row).setWidth(20);
                    });
                    var row = 0;
                    // dùng để check bản ghi chiếm nhiều nhất bao nhiêu dòng
                    var checkMaxRow = 1;
                    for (let i = 0; i < data.length; i++) {
                        // Hàng lớn nhất của bản ghi trước
                        if (i > 0)
                            row = checkMaxRow + 4
                        // bản ghi đầu tiên
                        else
                            row = i + 5
                        checkMaxRow += 1;
                        ws.cell(row, 1).number(data[i].stt).style(stylecell)
                        ws.cell(row, 2).string(data[i].vppCode).style(stylecell)
                        ws.cell(row, 3).string(data[i].vppName).style(stylecell)
                        ws.cell(row, 4).string(data[i].unit).style(stylecell)
                        ws.cell(row, 5).number(data[i].amount).style(stylecellNumber)
                    }
                    await wb.write('C:/images_services/ageless_sendmail/Quản lý văn phòng phẩm.xlsx');
                    setTimeout(() => {
                        var result = {
                            link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/Quản lý văn phòng phẩm.xlsx',
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


    // export_to_file_excel_payroll
    exportToFileExcelPayroll: (req, res) => {
        var wb = new xl.Workbook();
        // Create a reusable style
        var styleHearderT = wb.createStyle(styleHearderText);
        var styleHearderN = wb.createStyle(styleHearderNumber);
        var stylecellT = wb.createStyle(styleCellText);
        var stylecellN = wb.createStyle(stylecellNumber);
        let body = req.body;
        let data = JSON.parse(body.data);
        let objInsurance = JSON.parse(body.objInsurance);
        let totalFooter = JSON.parse(body.totalFooter)
        let arrayHeader = [
            'STT',
            'MÃ NHÂN VIÊN',
            'HỌ VÀ TÊN',
            'PHÒNG BAN',
            // 'TỔNG THU NHẬP',
            'LƯƠNG NĂNG SUẤT',
            'LƯƠNG BHXH',
            'GIẢM TRỪ BHXH',
            'GIẢM TRỪ BHYT',
            'GIẢM TRỪ BHTN',
            'GIẢM TRỪ CÔNG ĐOÀN',
            'GT GIA CẢNH',
            'LƯƠNG TÍNH THUẾ TNCN',
            'THUẾ TNCN',
            'TỔNG CÁC KHOẢN TRỪ',
            'THỰC LĨNH',
        ]
        var month = Number(body.dateStart.slice(5, 7)); // January
        var year = Number(body.dateStart.slice(0, 4));
        if (body.dateEnd) {
            monthEnd = Number(body.dateEnd.slice(5, 7));
            yearEnd = Number(body.dateEnd.slice(0, 4));
        }
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // Add Worksheets to the workbook
                    var ws = wb.addWorksheet('Sheet 1');
                    var row = 1
                    ws.column(row).setWidth(5);
                    ws.cell(4, 7, 4, 11, true)
                        .string('CÁC KHOẢN GIẢM TRỪ')
                        .style(styleHearderT);
                    let strFile = '';
                    let strDepartment = ''
                    let strMonth = ''
                    if (!body.dateEnd) {
                        strMonth = 'Tháng: ' + month + '/' + year
                        if (!body.departmentID) {
                            strFile = 'Bảng lương tháng ' + month + '.' + year + '.xlsx'
                            str = 'BẢNG TỔNG HỢP LƯƠNG THÁNG ' + month + ' NĂM ' + year
                        } else {
                            department = await mtblDMBoPhan(db).findOne({ where: { ID: body.departmentID } })
                            let branch = await mtblDMChiNhanh(db).findOne({ where: { ID: department.IDChiNhanh } })
                            strDepartment = 'Bộ phận: ' + department.DepartmentName + ' - ' + (branch ? branch.BranchName : '')
                            strFile = 'Bảng lương tháng ' + month + '.' + year + ' Bộ phận ' + department.DepartmentName + '.xlsx'
                        }
                    } else {
                        strMonth = 'Tháng: ' + month + '/' + year + '-' + monthEnd + '/' + yearEnd
                        if (!body.departmentID) {
                            strFile = 'Bảng lương tháng ' + month + '.' + year + ' - ' + monthEnd + '.' + yearEnd + '.xlsx'
                        } else {
                            let department = await mtblDMBoPhan(db).findOne({ where: { ID: body.departmentID } })
                            let branch = await mtblDMChiNhanh(db).findOne({ where: { ID: department.IDChiNhanh } })
                            strDepartment = 'Bộ phận: ' + department.DepartmentName + ' - ' + (branch ? branch.BranchName : '')
                            strFile = 'Bảng lương tháng ' + month + '.' + year + ' - ' + monthEnd + '.' + yearEnd + ' Bộ phận ' + department.DepartmentName + '.xlsx'

                        }

                    }
                    ws.cell(1, 1, 1, 15, true)
                        .string('BẢNG TỔNG HỢP LƯƠNG')
                        .style(styleHearderTitle);
                    ws.cell(3, 6, 3, 8, true)
                        .string(strMonth)
                        .style(stylecellT);
                    ws.cell(3, 9, 3, 12, true)
                        .string(strDepartment)
                        .style(stylecellT);
                    // push vào các khoản trừ %
                    var arrayReduct = []
                    arrayReduct.push(1)
                    arrayReduct.push(2)
                    arrayReduct.push(3)
                    arrayReduct.push(4)
                    arrayReduct.push(5)
                    arrayReduct.push(6)
                    arrayReduct.push(objInsurance.staffBHXH)
                    arrayReduct.push(objInsurance.staffBHYT)
                    arrayReduct.push(objInsurance.staffBHTN)
                    arrayReduct.push(objInsurance.union)
                    for (var i = 0; i < arrayHeader.length; i++) {
                        if (i <= 5) {
                            ws.cell(4, row, 5, row, true)
                                .string(arrayHeader[i])
                                .style(styleHearderT);
                        } else if (i > 5 && i <= 10) {
                            if (i < 10)
                                ws.cell(5, row)
                                    .string(arrayHeader[i] + ' ' + arrayReduct[i] + '%')
                                    .style(styleHearderT);
                            else if (i = 10) {
                                ws.cell(5, row)
                                    .string(arrayHeader[i])
                                    .style(styleHearderT);
                            } else
                                ws.cell(5, row)
                                    .string(arrayHeader[i])
                                    .style(styleHearderT);
                        } else {
                            ws.cell(4, row, 5, row, true)
                                .string(arrayHeader[i])
                                .style(styleHearderT);
                        }
                        row += 1
                        ws.column(row).setWidth(15);
                    }
                    // console.log(data);
                    for (var i = 0; i < data.length; i++) {
                        ws.cell(6 + i, 1).number(data[i].stt).style(stylecellT)
                        ws.cell(6 + i, 2).string(data[i].staffCode ? data[i].staffCode : '').style(stylecellT)
                        ws.cell(6 + i, 3).string(data[i].staffName ? data[i].staffName : '').style(stylecellT)
                        ws.cell(6 + i, 4).string(data[i].departmentName ? data[i].departmentName : '').style(stylecellT)
                        ws.cell(6 + i, 5).number(data[i].productivityWages ? Number(data[i].productivityWages) : 0).style(stylecellN)
                        ws.cell(6 + i, 6).number(data[i].bhxhSalary ? Number(data[i].bhxhSalary) : 0).style(stylecellN)
                        ws.cell(6 + i, 7).number(Number(data[i].staffBHXH)).style(stylecellN)
                        ws.cell(6 + i, 8).number(Number(data[i].staffBHYT)).style(stylecellN)
                        ws.cell(6 + i, 9).number(Number(data[i].staffBHTN)).style(stylecellN)
                        ws.cell(6 + i, 10).number(Number(data[i].union)).style(stylecellN)
                        ws.cell(6 + i, 11).number(data[i].reduce ? Number(data[i].reduce) : 0).style(stylecellN)
                        ws.cell(6 + i, 12).number(data[i].personalTaxSalary ? Number(data[i].personalTaxSalary) : 0).style(stylecellN)
                        ws.cell(6 + i, 13).number(data[i].personalTax ? Number(data[i].personalTax) : 0).style(stylecellN)
                        ws.cell(6 + i, 14).number(data[i].totalReduce ? Number(data[i].totalReduce) : 0).style(stylecellN)
                        ws.cell(6 + i, 15).number(data[i].realField ? Number(data[i].realField) : 0).style(stylecellN)
                    }
                    // Tổng cộng
                    ws.cell(6 + data.length, 1, 6 + data.length, 4, true)
                        .string('TỔNG CỘNG')
                        .style(styleHearderT);
                    ws.cell(6 + data.length, 5).number(Number(totalFooter.totalProductivityWages)).style(styleHearderN)
                    ws.cell(6 + data.length, 6).number(Number(totalFooter.totalBHXHSalary)).style(styleHearderN)
                    ws.cell(6 + data.length, 7).number(Number(totalFooter.totalStaffBHXH)).style(styleHearderN)
                    ws.cell(6 + data.length, 8).number(Number(totalFooter.totalStaffBHYT)).style(styleHearderN)
                    ws.cell(6 + data.length, 9).number(Number(totalFooter.totalStaffBHTN)).style(styleHearderN)
                    ws.cell(6 + data.length, 10).number(Number(totalFooter.totalUnion)).style(styleHearderN)
                    ws.cell(6 + data.length, 11).number(Number(totalFooter.totelReduce)).style(styleHearderN)
                    ws.cell(6 + data.length, 12).number(Number(totalFooter.totalPersonalTaxSalary)).style(styleHearderN)
                    ws.cell(6 + data.length, 13).number(Number(totalFooter.totalPersonalTax)).style(styleHearderN)
                    ws.cell(6 + data.length, 14).number(Number(totalFooter.totalAllReduce)).style(styleHearderN)
                    ws.cell(6 + data.length, 15).number(Number(totalFooter.totalRealField)).style(styleHearderN)

                    await wb.write('C:/images_services/ageless_sendmail/' + strFile);
                    setTimeout(() => {
                        var result = {
                            link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/' + strFile,
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
    // export_to_file_excel_timekeeping
    exportToFileExcelTimekeeping: async (req, res) => {
        var wb = new xl.Workbook();
        var styleHearderT = wb.createStyle(styleHearderText);
        var styleHearderN = wb.createStyle(styleHearderNumber);
        var stylecellT = wb.createStyle(styleCellText);
        var stylecellN = wb.createStyle(stylecellNumber);
        let body = req.body;
        var row = 0;
        let dateFinal = getDateFinal(body.date)
        var month = Number(body.date.slice(5, 7));
        var year = Number(body.date.slice(0, 4));
        let now = Number(moment().add(7, 'hours').format('MM'));
        let dateNow = Number(moment().add(7, 'hours').format('DD'));
        if (month == now) {
            dateFinal = dateNow
        }
        let data = JSON.parse(body.data);
        let arrayHeader = []
        arrayHeader.push('STT')
        arrayHeader.push('Phòng ban')
        arrayHeader.push('Mã nhân viên')
        arrayHeader.push('Tên nhân viên')
        database.connectDatabase().then(async db => {

            for (let date = 1; date <= dateFinal; date++) {
                arrayHeader.push(convertNumber(date) + '/' + convertNumber(month))
            }
            try {
                var ws = wb.addWorksheet('Sheet 1');
                var row = 1
                ws.column(row).setWidth(5);
                let strFile = '';
                let strDepartment = ''
                if (!body.departmentID) {
                    strFile = 'Bảng chấm công ' + month + '.' + year + '.xlsx'
                } else {
                    let department = await mtblDMBoPhan(db).findOne({ where: { ID: body.departmentID } })
                    let branch = await mtblDMChiNhanh(db).findOne({ where: { ID: department.IDChiNhanh } })
                    strDepartment = 'Bộ phận: ' + department.DepartmentName + ' - ' + (branch ? branch.BranchName : '')
                    strFile = 'Bảng chấm công ' + month + '.' + year + ' Bộ phận ' + department.DepartmentName + '.xlsx'

                }
                let strMonth = 'Tháng: ' + convertNumber(month) + '/' + year
                ws.cell(1, 1, 1, dateFinal + 4, true)
                    .string('BẢNG CHẤM CÔNG')
                    .style(styleHearderTitle);
                let middle = Math.round((dateFinal + 1) / 2)
                ws.cell(3, middle - 2, 3, middle + 1, true)
                    .string(strMonth)
                    .style(stylecellT);
                ws.cell(3, middle + 2, 3, middle + 6, true)
                    .string(strDepartment)
                    .style(stylecellT);
                arrayHeader.forEach(element => {
                    ws.cell(4, row)
                        .string(element)
                        .style(styleHearderT);
                    row += 1
                    ws.column(row).setWidth(7);
                });
                row = 5
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                    ws.cell(row, 1, row + 1, 1, true).number(data[i].stt).style(stylecellT)
                    ws.cell(row, 2, row + 1, 2, true).string(data[i].departmentName).style(stylecellT)
                    ws.cell(row, 3, row + 1, 3, true).string(data[i].staffCode).style(stylecellT)
                    ws.cell(row, 4, row + 1, 4, true).string(data[i].staffName).style(stylecellT)
                    for (let date = 4; date < arrayHeader.length; date++) {
                        let dateMonth = arrayHeader[date]
                        if (data[i][dateMonth]['S'] == 'plus')
                            ws.cell(row, date + 1).string('+').style(stylecellT)
                        else
                            ws.cell(row, date + 1).string(data[i][dateMonth]['S']).style(stylecellT)

                        if (data[i][dateMonth]['C'] == 'plus')
                            ws.cell(row + 1, date + 1).string('+').style(stylecellT)
                        else
                            ws.cell(row + 1, date + 1).string(data[i][dateMonth]['C']).style(stylecellT)
                    }
                    row += 2

                }
                await wb.write('C:/images_services/ageless_sendmail/' + strFile);
                setTimeout(() => {
                    var result = {
                        link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/' + strFile,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                    }
                    res.json(result);
                }, 500);
            } catch (error) {
                console.log(error);
                res.json(Result.SYS_ERROR_RESULT)
            }
        })
    },
    // export_tofile_excel_insurance_premiums
    exportToFileExcelInsutancePremiums: async (req, res) => {
        var wb = new xl.Workbook();
        // Create a reusable style
        var styleHearderT = wb.createStyle(styleHearderText);
        var styleHearderN = wb.createStyle(styleHearderNumber);
        var stylecellT = wb.createStyle(styleCellText);
        var stylecellN = wb.createStyle(stylecellNumber);
        var stylecellNS = wb.createStyle(stylecellNumberSpecial);
        let body = req.body;
        let dataResponse = JSON.parse(body.data);
        var month = Number(body.dateStart.slice(5, 7)); // January
        var year = Number(body.dateStart.slice(0, 4));
        if (body.dateEnd) {
            monthEnd = Number(body.dateEnd.slice(5, 7));
            yearEnd = Number(body.dateEnd.slice(0, 4));
        }
        let arrayHeader = [
            'STT',
            'MÃ NHÂN VIÊN',
            'HỌ VÀ TÊN',
            'PHÒNG BAN',
            'THÁNG ÁP DỤNG',
            'MỨC LƯƠNG TỐI THIỂU',
            'HỆ SỐ LƯƠNG',
            'MỨC LƯƠNG',
            'CT',
            'NV',
            'CT',
            'NV',
            'CT',
            'NV',
            'BHTNLĐ',
            'TỔNG',
        ]
        var month = Number(body.dateStart.slice(5, 7)); // January
        var year = Number(body.dateStart.slice(0, 4));
        try {
            let str = '';
            let strFile = '';
            if (!body.dateEnd) {
                if (!body.departmentID) {
                    strFile = 'Bảng theo dõi đóng bảo hiểm ' + month + '.' + year + '.xlsx'
                } else {
                    await database.connectDatabase().then(async db => {
                        if (db) {
                            let department = await mtblDMBoPhan(db).findOne({ where: { ID: body.departmentID } })
                            strFile = 'Bảng theo dõi đóng bảo hiểm ' + month + '.' + year + ' Bộ phận ' + department.DepartmentName + '.xlsx'
                        }
                    })
                }
            } else {
                if (!body.departmentID) {
                    strFile = 'Bảng theo dõi đóng bảo hiểm ' + month + '.' + year + ' - ' + monthEnd + '.' + yearEnd + '.xlsx'
                } else {
                    await database.connectDatabase().then(async db => {
                        if (db) {
                            let department = await mtblDMBoPhan(db).findOne({ where: { ID: body.departmentID } })
                            strFile = 'Bảng theo dõi đóng bảo hiểm ' + month + '.' + year + ' - ' + monthEnd + '.' + yearEnd + ' Bộ phận ' + department.DepartmentName + '.xlsx'
                        }
                    })
                }

            }
            let department;
            let strDepartment = ''
            if (body.departmentID) {
                await database.connectDatabase().then(async db => {
                    department = await mtblDMBoPhan(db).findOne({ where: { ID: body.departmentID } })
                    let branch = await mtblDMChiNhanh(db).findOne({ where: { ID: department.IDChiNhanh } })
                    strDepartment = 'Bộ phận: ' + department.DepartmentName + ' - ' + (branch ? branch.BranchName : '')
                })
            }
            for (let d = 0; d < dataResponse.length; d++) {
                let strMonth = 'Tháng: ' + dataResponse[d].strMonthExcel
                str = 'BẢNG THEO DÕI ĐÓNG BẢO HIỂM';
                let objInsurance = dataResponse[d].objInsurance
                let totalFooter = dataResponse[d].totalFooter
                data = dataResponse[d].array
                let arrayCheckExcel = dataResponse[d].arrayCheckExcel
                var ws = wb.addWorksheet('sheet-' + (d + 1));
                var row = 1
                ws.column(row).setWidth(5);
                ws.cell(1, 1, 1, 16, true)
                    .string(str)
                    .style(styleHearderTitle);
                ws.cell(3, 6, 3, 8, true)
                    .string(strMonth)
                    .style(stylecellT);
                ws.cell(3, 9, 3, 12, true)
                    .string(strDepartment)
                    .style(stylecellT);
                ws.cell(4, 9, 4, 10, true)
                    .string('BHXH')
                    .style(styleHearderT);
                ws.cell(4, 11, 4, 12, true)
                    .string('BHYT')
                    .style(styleHearderT);
                ws.cell(4, 13, 4, 14, true)
                    .string('BHTN')
                    .style(styleHearderT);
                // // push vào các khoản trừ %
                var arrayReduct = []
                arrayReduct.push(1)
                arrayReduct.push(2)
                arrayReduct.push(3)
                arrayReduct.push(4)
                arrayReduct.push(5)
                arrayReduct.push(6)
                arrayReduct.push(7)
                arrayReduct.push(8)
                arrayReduct.push(objInsurance.companyBHXH)
                arrayReduct.push(objInsurance.staffBHXH)
                arrayReduct.push(objInsurance.companyBHYT)
                arrayReduct.push(objInsurance.staffBHYT)
                arrayReduct.push(objInsurance.companyBHTN)
                arrayReduct.push(objInsurance.staffBHTN)
                arrayReduct.push(objInsurance.staffBHTNLD)
                arrayReduct.push(objInsurance.staffBHXH + objInsurance.companyBHXH + objInsurance.staffBHYT + objInsurance.companyBHYT + objInsurance.staffBHTN + objInsurance.companyBHTN + objInsurance.staffBHTNLD)
                for (var i = 0; i < arrayHeader.length; i++) {
                    if (i <= 7) {
                        ws.cell(4, row, 5, row, true)
                            .string(arrayHeader[i])
                            .style(styleHearderT);
                    } else if (i > 7 && i < 14) {
                        ws.cell(5, row)
                            .string(arrayHeader[i] + ' ' + arrayReduct[i] + '%')
                            .style(styleHearderT);
                    } else {
                        ws.cell(4, row, 5, row, true)
                            .string(arrayHeader[i] + ' ' + arrayReduct[i] + '%')
                            .style(styleHearderT);
                    }
                    row += 1
                    ws.column(row).setWidth(15);
                }
                for (let c = 0; c < arrayCheckExcel.length;) {
                    ws.cell(6 + c, 1, 6 + c + arrayCheckExcel[c] - 1, 1, true).number(data[c].stt).style(stylecellT)
                    ws.cell(6 + c, 2, 6 + c + arrayCheckExcel[c] - 1, 2, true).string(data[c].staffCode).style(stylecellT)
                    ws.cell(6 + c, 3, 6 + c + arrayCheckExcel[c] - 1, 3, true).string(data[c].nameStaff).style(stylecellT)
                    ws.cell(6 + c, 4, 6 + c + arrayCheckExcel[c] - 1, 4, true).string(data[c].nameDepartment).style(stylecellT)
                    c += arrayCheckExcel[c]
                }
                for (var i = 0; i < data.length; i++) {
                    let wages = data[i].bhxhSalary ? data[i].bhxhSalary : 0;
                    ws.cell(6 + i, 5).string(data[i].monthOfChange ? data[i].monthOfChange : '').style(stylecellT)
                    ws.cell(6 + i, 6).number(data[i].minimumWage ? data[i].minimumWage : 0).style(stylecellN)
                    ws.cell(6 + i, 7).number(data[i].coefficientsSalary ? data[i].coefficientsSalary : 0).style(stylecellNS)
                    ws.cell(6 + i, 8).number(wages).style(stylecellN)
                    ws.cell(6 + i, 9).number(wages * objInsurance.companyBHXH / 100).style(stylecellN)
                    ws.cell(6 + i, 10).number(wages * objInsurance.staffBHXH / 100).style(stylecellN)
                    ws.cell(6 + i, 11).number(wages * objInsurance.companyBHYT / 100).style(stylecellN)
                    ws.cell(6 + i, 12).number(wages * objInsurance.staffBHYT / 100).style(stylecellN)
                    ws.cell(6 + i, 13).number(wages * objInsurance.companyBHTN / 100).style(stylecellN)
                    ws.cell(6 + i, 14).number(wages * objInsurance.staffBHTN / 100).style(stylecellN)
                    ws.cell(6 + i, 15).number(wages * objInsurance.staffBHTNLD / 100).style(stylecellN)
                    ws.cell(6 + i, 16).number(wages * (objInsurance.staffBHXH + objInsurance.companyBHXH + objInsurance.staffBHYT + objInsurance.companyBHYT + objInsurance.staffBHTN + objInsurance.companyBHTN + objInsurance.staffBHTNLD) / 100).style(stylecellN)
                }
                // Tổng cộng
                ws.cell(6 + data.length, 1, 6 + data.length, 7, true)
                    .string('TỔNG CỘNG')
                    .style(styleHearderT);
                ws.cell(6 + data.length, 8).number(totalFooter.bhxhSalaryTotal).style(styleHearderN)
                ws.cell(6 + data.length, 9).number(totalFooter.bhxhCTTotal).style(styleHearderN)
                ws.cell(6 + data.length, 10).number(totalFooter.bhxhNVTotal).style(styleHearderN)
                ws.cell(6 + data.length, 11).number(totalFooter.bhytCTTotal).style(styleHearderN)
                ws.cell(6 + data.length, 12).number(totalFooter.bhytNVTotal).style(styleHearderN)
                ws.cell(6 + data.length, 13).number(totalFooter.bhtnCTTotal).style(styleHearderN)
                ws.cell(6 + data.length, 14).number(totalFooter.bhtnNVTotal).style(styleHearderN)
                ws.cell(6 + data.length, 15).number(totalFooter.bhtnldTotal).style(styleHearderN)
                ws.cell(6 + data.length, 16).number(totalFooter.tongTotal).style(styleHearderN)
            }

            await wb.write('C:/images_services/ageless_sendmail/' + strFile);
            setTimeout(() => {
                var result = {
                    link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/' + strFile,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                }
                res.json(result);
            }, 500);

        } catch (error) {
            console.log(error);
            res.json(Result.SYS_ERROR_RESULT)
        }
    },
    // export_excel_Detail_YCMS
    exportExcelInDetailYCMS: (req, res) => {
        var wb = new xl.Workbook();
        // Create a reusable style
        var styleHearder = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 14,
                bold: true,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
                vertical: 'center',
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var stylecell = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
                vertical: 'center',
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var stylecellNumber = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'right',
                // Dọc
                vertical: 'center',
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var stylecellText = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'left',
                // Dọc
                vertical: 'center',
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        let body = req.body;
        let arrayHeader = [
            'Ngày đề xuất',
            'Bộ phận đề xuất',
            'Nhân viên',
            'Người duyệt trước',
            'Người duyệt sau',
            'Mã TS/TB/LK',
            'Tên TS/TB/LK',
            'Số lượng',
            'Đơn giá',
            'Số tồn',
            'Tổng tiền',
            'Lý do mua',
            'Chứng từ đính kèm',
        ]
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    // Add Worksheets to the workbook
                    var ws = wb.addWorksheet('Sheet 1');
                    var row = 1
                    ws.column(row).setWidth(5);

                    for (var i = 0; i < arrayHeader.length; i++) {
                        ws.cell(1, row)
                            .string(arrayHeader[i])
                            .style(styleHearder);
                        ws.column(row).setWidth(20);
                        row += 1
                    }
                    var obj = await getDetailYCMS(db, body.id)
                    ws.cell(2, 1, obj.arrayTaiSan.length + 1, 1, true)
                        .string(obj.requireDate)
                        .style(stylecell);
                    ws.cell(2, 2, obj.arrayTaiSan.length + 1, 2, true)
                        .string(obj.namePhongBan)
                        .style(stylecell);
                    ws.cell(2, 3, obj.arrayTaiSan.length + 1, 3, true)
                        .string(obj.nameNhanVien)
                        .style(stylecell);
                    ws.cell(2, 4, obj.arrayTaiSan.length + 1, 4, true)
                        .string(obj.namePheDuyet1)
                        .style(stylecell);
                    ws.cell(2, 5, obj.arrayTaiSan.length + 1, 5, true)
                        .string(obj.namePheDuyet2)
                        .style(stylecell);
                    for (var i = 0; i < obj.arrayTaiSan.length; i++) {
                        ws.cell(2 + i, 6)
                            .string(obj.arrayTaiSan[i].name)
                            .style(stylecellText);
                        ws.cell(2 + i, 7)
                            .string(obj.arrayTaiSan[i].code)
                            .style(stylecellText);
                        ws.cell(2 + i, 8)
                            .number(obj.arrayTaiSan[i].amount)
                            .style(stylecellNumber);
                        ws.cell(2 + i, 9)
                            .number(obj.arrayTaiSan[i].unitPrice)
                            .style(stylecellNumber);
                        ws.cell(2 + i, 10)
                            .number(obj.arrayTaiSan[i].remainingAmount)
                            .style(stylecellNumber);
                    }
                    ws.cell(2, 11, obj.arrayTaiSan.length + 1, 11, true)
                        .number(obj.price)
                        .style(stylecellNumber);
                    ws.cell(2, 12, obj.arrayTaiSan.length + 1, 12, true)
                        .string(obj.reason)
                        .style(stylecellText);
                    for (var i = 0; i < obj.arrayFile.length; i++) {
                        ws.cell(2 + i, 13)
                            .link(obj.arrayFile[i].link, obj.arrayFile[i].name)
                            .style(stylecell);
                    }
                    await wb.write('C:/images_services/ageless_sendmail/export_excel_ycms.xlsx');
                    setTimeout(() => {
                        var result = {
                            link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/export_excel_ycms.xlsx',
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
    converBase64ToImg: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                var base64Data = body.data.base64.replace('data:image/jpeg;base64,', "");
                base64Data = base64Data.replace(/ /g, '+');
                var buf = new Buffer.from(base64Data, "base64");
                var numberRandom = Math.floor(Math.random() * 1000000);
                nameMiddle = numberRandom.toString();
                var dir = 'photo-' + nameMiddle + '.jpg';
                require("fs").writeFile('C:/images_services/struck_web/' + dir, buf, function (err) {
                    if (err) console.log(err + '');
                });
                var result = {
                    link: 'http://dbdev.namanphu.vn:1357/struck_web/' + dir,
                    name: body.data.name,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                }
                res.json(result);
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    exportToFileExcelVPP: async (req, res) => {
        var wb = new xl.Workbook();
        // Create a reusable style
        var styleHearder = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 14,
                bold: true,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
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
            }
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var stylecell = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'center',
                // Dọc
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
            }
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        var stylecellNumber = wb.createStyle({
            font: {
                // color: '#FF0800',
                size: 13,
                bold: false,
            },
            alignment: {
                wrapText: true,
                // ngang
                horizontal: 'right',
                // Dọc
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
            }
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        let body = req.body;
        let data = JSON.parse(body.data)
        let arrayHeader = [
            'MÃ VPP',
            'TÊN VPP',
            'ĐƠN VỊ TÍNH',
            'SỐ LƯỢNG',
            'TRẠNG THÁI',
            'NGƯỜI SỞ HỮU',
            'NGÀY TIẾP NHẬN',
            // 'NGƯỜI PHÊ DUYỆT TRƯỚC',
            // 'NGƯỜI PHÊ DUYỆT SAU',
        ]
        // Add Worksheets to the workbook
        // Add Worksheets to the workbook
        var ws = wb.addWorksheet('Sheet 1');
        var row = 1
        ws.column(row).setWidth(5);
        ws.cell(1, 1, 1, 7, true)
            .string('DANH SÁCH BÀN GIAO VĂN PHÒNG PHẨM')
            .style(styleHearder);
        arrayHeader.forEach(element => {
            ws.cell(4, row)
                .string(element)
                .style(styleHearder);
            row += 1
            ws.column(row).setWidth(20);
        });
        var row = 0;
        // dùng để check bản ghi chiếm nhiều nhất bao nhiêu dòng
        var checkMaxRow = 1;
        for (let i = 0; i < data.length; i++) {
            var max = 1;
            // Hàng lớn nhất của bản ghi trước
            if (i > 0)
                row = checkMaxRow + 4
            // bản ghi đầu tiên
            else
                row = i + 5
            if (data[i].line.length) {
                checkMaxRow += data[i].line.length;
                // max dùng để đánh dầu hàng tiếp theo
                max = data[i].line.length;
            } else {
                checkMaxRow += 1;
            }
            //  nơi những trường không cần merge
            for (var l = 0; l < max; l++) {
                ws.cell(l + row, 1).string(data[i].line[l] ? data[i].line[l].vppCode : '').style(stylecell)
                ws.cell(l + row, 2).string(data[i].line[l] ? data[i].line[l].vppName : '').style(stylecell)
                ws.cell(l + row, 3).string(data[i].line[l] ? data[i].line[l].unit : '').style(stylecell)
                ws.cell(l + row, 4).number(data[i].line[l] ? data[i].line[l].amount : 0).style(stylecellNumber)
            }
            //  nói những trường cần merger
            // if (data[i].line.length > 0) {
            ws.cell(row, 5, row + max - 1, 5, true).string(data[i].status).style(stylecell);
            ws.cell(row, 6, row + max - 1, 6, true).string(data[i].nameNhanVienSoHuu).style(stylecell);
            ws.cell(row, 7, row + max - 1, 7, true).string(data[i].date).style(stylecell);
            // }
        }
        await wb.write('C:/images_services/ageless_sendmail/Danh sách bàn giao văn phòng phẩm.xlsx');
        setTimeout(() => {
            var result = {
                link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/Danh sách bàn giao văn phòng phẩm.xlsx',
                status: Constant.STATUS.SUCCESS,
                message: Constant.MESSAGE.ACTION_SUCCESS,
            }
            res.json(result);
        }, 500);

    },


    //  tổng hợp chấm công
    // export_excel_synthetic_timekeeping
    exportToFileExcelSyntheticTimekeeping: async (req, res) => {
        var wb = new xl.Workbook();
        // Create a reusable style
        var styleHearderT = wb.createStyle(styleHearderText);
        var styleHearderN = wb.createStyle(styleHearderNumber);
        var stylecellT = wb.createStyle(styleCellText);
        var stylecellN = wb.createStyle(stylecellNumber);
        let body = req.body;
        var row = 0;
        var checkMaxRow = 1;
        let data = JSON.parse(body.data);
        let arrayHeader = [
            'STT',
            'BỘ PHẬN',
            'MÃ NHÂN VIÊN',
            'TÊN NHÂN VIÊN',
            'TỒN PHÉP THÁNG TRƯỚC',
            'NGÀY LÀM THÊM',
            'NGÀY VỀ SỚM, ĐI MUỘN',
            'NGHỈ ỐM',
            'NGÀY CHẾ ĐỘ',
            'NGÀY NGHỈ PHÉP',
            'NGHỈ KHÔNG LƯƠNG',
            'PHÉP CÒN LẠI',
        ]
        var month = Number(body.dateStart.slice(5, 7));
        var year = Number(body.dateStart.slice(0, 4));
        let monthEnd;
        let yearEnd;
        if (body.dateEnd) {
            monthEnd = Number(body.dateEnd.slice(5, 7));
            yearEnd = Number(body.dateEnd.slice(0, 4));
        }
        try {
            var ws = wb.addWorksheet('Sheet 1');
            var row = 1
            ws.column(row).setWidth(5);
            let strFile = '';
            let department;
            let strDepartment = ''
            let strMonth = ''
            if (body.departmentID) {
                await database.connectDatabase().then(async db => {
                    department = await mtblDMBoPhan(db).findOne({ where: { ID: body.departmentID } })
                    let branch = await mtblDMChiNhanh(db).findOne({ where: { ID: department.IDChiNhanh } })
                    strDepartment = 'Bộ phận: ' + department.DepartmentName + ' - ' + (branch ? branch.BranchName : '')
                })
            }
            if (!body.dateEnd) {
                strMonth = 'Tháng: ' + month + '/' + year

                if (!body.departmentID) {
                    strFile = 'Bảng tổng hợp chấm công ' + month + '.' + year + '.xlsx'
                    str = 'BẢNG TỔNG HỢP CHẤM CÔNG ' + month + '.' + year + strDepartment;
                } else {
                    await database.connectDatabase().then(async db => {
                        if (db) {
                            let department = await mtblDMBoPhan(db).findOne({ where: { ID: body.departmentID } })
                            strFile = 'Bảng tổng hợp chấm công ' + month + '.' + year + ' Bộ phận ' + department.DepartmentName + '.xlsx'
                            str = 'BẢNG TỔNG HỢP CHẤM CÔNG ' + month + '.' + year + strDepartment;
                        }
                    })
                }
            } else {
                strMonth = 'Tháng: ' + month + '/' + year + '-' + monthEnd + '/' + yearEnd
                if (!body.departmentID) {
                    strFile = 'Bảng tổng hợp chấm công ' + month + '.' + year + ' - ' + monthEnd + '.' + yearEnd + '.xlsx'
                } else {
                    await database.connectDatabase().then(async db => {
                        if (db) {
                            let department = await mtblDMBoPhan(db).findOne({ where: { ID: body.departmentID } })
                            strFile = 'Bảng tổng hợp chấm công ' + month + '.' + year + ' - ' + monthEnd + '.' + yearEnd + ' Bộ phận ' + department.DepartmentName + '.xlsx'
                        }
                    })
                }

            }
            ws.cell(1, 1, 1, 12, true)
                .string('BẢNG TỔNG HỢP CHẤM CÔNG')
                .style(styleHearderTitle);
            ws.cell(3, 3, 3, 6, true)
                .string(strMonth)
                .style(stylecellT);
            ws.cell(3, 7, 3, 9, true)
                .string(strDepartment)
                .style(stylecellT);
            arrayHeader.forEach(element => {
                ws.cell(4, row)
                    .string(element)
                    .style(styleHearderT);
                row += 1
                ws.column(row).setWidth(15);
            });
            let stt = 1;
            for (let i = 0; i < data.length; i++) {
                if (i > 0)
                    row = checkMaxRow + 4
                // bản ghi đầu tiên
                else
                    row = i + 5
                checkMaxRow += 1;
                ws.cell(row, 1).number(stt).style(stylecellT)
                ws.cell(row, 2).string(data[i].departmentName).style(stylecellT)
                ws.cell(row, 3).string(data[i].staffCode).style(stylecellT)
                ws.cell(row, 4).string(data[i].staffName).style(stylecellT)
                ws.cell(row, 5).number(data[i].remainingPreviousYear).style(stylecellT)
                ws.cell(row, 6).number(data[i].overtime).style(stylecellT)
                ws.cell(row, 7).number(data[i].lateDay).style(stylecellT)
                ws.cell(row, 8).number(data[i].sickLeave).style(stylecellT)
                ws.cell(row, 9).number(data[i].regimeLeave).style(stylecellT)
                ws.cell(row, 10).number(data[i].numberHoliday).style(stylecellT)
                ws.cell(row, 11).number(data[i].freeBreak).style(stylecellT)
                ws.cell(row, 12).number(data[i].remaining).style(stylecellT)
                stt += 1
            }
            await wb.write('C:/images_services/ageless_sendmail/' + strFile);
            setTimeout(() => {
                var result = {
                    link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/' + strFile,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                }
                res.json(result);
            }, 500);

        } catch (error) {
            console.log(error);
            res.json(Result.SYS_ERROR_RESULT)
        }
    },
}