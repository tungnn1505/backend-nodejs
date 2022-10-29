const cryptoJS = require('crypto-js');
var moment = require('moment');
var fs = require('fs');
const JSZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const path = require('path');

var arrCallStatus = [
    { id: 1, name: 'Không trả lời' },
    { id: 2, name: 'Bận' },
    { id: 3, name: 'Nhầm số' },
    { id: 4, name: 'Tin nhắn' },
    { id: 5, name: 'Cúp máy' },
    { id: 6, name: 'Đã kết nối' },
]

var arrTastType = [
    { id: 1, name: 'Cuộc gọi' },
    { id: 2, name: 'Email' },
    { id: 3, name: 'Gặp mặt' }
]

var arrMailStatus = [
    { id: 1, name: 'Đã gửi' },
    { id: 2, name: 'Đã nhận' },
    { id: 3, name: 'Đã trả lời' },
    { id: 4, name: 'Nhầm email' }
]

function checkDuplicate(array, elm) {
    var check = false;
    array.forEach(item => {
        if (item === elm) check = true;
    })
    return check;
}
let ctlFileAttach = require('../controllers/ctl-tblFileAttach');
var mtblFileAttach = require('../tables/constants/tblFileAttach');
const libre = require('libreoffice-convert-win');
async function readGroup(group) {
    let readDigit = [
        ' Không',
        ' Một',
        ' Hai',
        ' Ba',
        ' Bốn',
        ' Năm',
        ' Sáu',
        ' Bảy',
        ' Tám',
        ' Chín',
    ];
    let temp = '';
    if (group == '000') return '';
    //read number hundreds
    temp = readDigit[parseInt(group.substring(0, 1))] + ' Trăm';
    //read number tens
    if (group.substring(1, 2) == '0')
        if (group.substring(2, 3) == '0') return temp;
        else {
            temp += ' Lẻ' + readDigit[parseInt(group.substring(2, 3))];
            return temp;
        }
    else temp += readDigit[parseInt(group.substring(1, 2))] + ' Mươi';
    //read number
    if (group.substring(2, 3) == '5') temp += ' Lăm';
    else if (group.substring(2, 3) != '0')
        temp += readDigit[parseInt(group.substring(2, 3))];
    return temp;
}
var dayInWeek = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
module.exports = {
    checkDuplicate,
    updateForFileAttach: async function (db, key, array, idFile) {
        let arrayFileAttach = []
        let obj = {}
        obj[key] = idFile
        let where = []
        where.push(obj)
        for (var i = 0; i < array.length; i++) {
            arrayFileAttach.push(array[i].id ? array[i].id : array[i].ID)
        }
        await mtblFileAttach(db).findAll({
            where: where
        }).then(async data => {
            for (let file = 0; file < data.length; file++) {
                if (!checkDuplicate(arrayFileAttach, data[file].ID)) {
                    console.log(123);
                    await ctlFileAttach.deleteRelationshiptblFileAttach(db, data[file].ID ? data[file].ID : data[file].id)

                }
            }
        })
        for (var j = 0; j < array.length; j++)
            await mtblFileAttach(db).update(obj, {
                where: {
                    ID: array[j].id ? array[j].id : array[j].ID
                }
            })
    },
    automaticCode: async (database, fieldCode, codeBefore, type = '') => {
        let year = moment().format('YYYY');
        let month = moment().format('MM');
        let where = []
        if (type != '') {
            where.push({ Type: type })
        }
        var check = await database.findOne({
            order: [
                ['ID', 'DESC']
            ],
            where: where,
        })
        var automaticCode = codeBefore + '_1_' + month + year;
        if (!check) {
            codeNumber = codeBefore + '_1_' + month + year
        } else {
            let codeBetween = 1;
            if (Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 6)))
                codeBetween = Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 6)) + 1
            else if (Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 5)))
                codeBetween = Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 5)) + 1
            else if (Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 4)))
                codeBetween = Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 4)) + 1
            else if (Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 3)))
                codeBetween = Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 3)) + 1
            else if (Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 2)))
                codeBetween = Number(check[fieldCode].slice((codeBefore).length + 1, (codeBefore).length + 2)) + 1
            if (check[fieldCode]) {
                let checkMonth = Number(check[fieldCode].slice(Number(check[fieldCode].length - 6), Number(check[fieldCode].length - 4)))
                console.log(checkMonth);
                if (Number(check[fieldCode].slice(check[fieldCode].length - 4, check[fieldCode].length + 6)) == year) {
                    if (month != checkMonth)
                        automaticCode = codeBefore + '_' + 1 + '_' + month + year
                    else
                        automaticCode = codeBefore + '_' + codeBetween + '_' + month + year
                } else
                    automaticCode = codeBefore + '_' + 1 + '_' + month + year
            } else {
                automaticCode = codeBefore + '_' + 1 + '_' + month + year

            }
        }
        return automaticCode
    },
    toDatetimeHour: function (time) {
        if (time) {
            var hour = moment(time).hours();
            return hour + ":00, " + moment(time).format('DD/MM/YYYY');
        } else return null
    },

    toHour: function (time) {
        if (time) {
            return moment(time).hours() + ":00";
        } else return null
    },

    toDatetimeDay: function (time) {
        console.log(time);
        if (time) {
            var day = dayInWeek[moment(time).days()];
            return day + ", " + moment(time).format('DD/MM/YYYY');
        } else return null
    },

    toDay: function (time) {
        if (time) {
            return dayInWeek[moment(time).days()];
        } else return null
    },

    toDatetimeMonth: function (time) {
        if (time) {
            return "Tháng " + moment(time).format('MM/YYYY');
        } else return null
    },

    toMonth: function (time) {
        if (time) {
            return "T" + moment(time).format('MM/YYYY');
        } else return null
    },

    toDatetime: function (time) {
        if (time)
            return moment(time).format('DD/MM/YYYY HH:mm');
        else return null
    },

    callStatus: function (type) {
        var obj = arrCallStatus.find(item => {
            return item.id == type
        });
        if (obj) {
            return obj.name
        } else return ''
    },

    mailStatus: function (type) {
        var obj = arrMailStatus.find(item => {
            return item.id == type
        });
        if (obj) {
            return obj.name
        } else return ''
    },

    taskType: function (type) {
        var obj = arrTastType.find(item => {
            return item.id == type
        });
        if (obj) {
            return obj.name
        } else return ''
    },

    encryptKey(value) {

        var key = "CRM@NAP#JSC$123";
        key = cryptoJS.MD5(key).toString();
        var keyHex = cryptoJS.enc.Hex.parse(key);

        var options = {
            mode: cryptoJS.mode.ECB,
            padding: cryptoJS.pad.Pkcs7
        };

        var textWordArray = cryptoJS.enc.Utf8.parse(value);
        var encrypted = cryptoJS.TripleDES.encrypt(textWordArray, keyHex, options);
        var base64String = encrypted.toString();

        return base64String;
    },

    decryptKey(value) {

        var key = "CRM@NAP#JSC$123";
        key = cryptoJS.MD5(key).toString();
        var keyHex = cryptoJS.enc.Hex.parse(key);

        var options = {
            mode: cryptoJS.mode.ECB,
            padding: cryptoJS.pad.Pkcs7
        };

        var resultArray = cryptoJS.TripleDES.decrypt({
            ciphertext: cryptoJS.enc.Base64.parse(value)
        }, keyHex, options);

        return resultArray.toString(cryptoJS.enc.Utf8);
    },

    handleWhereClause: async function (listObj) {
        let obj = {};
        for (let field of listObj) {
            obj[field.key] = field.value
        }
        return obj
    },

    arrayToObj(array) {
        let obj = {};
        for (let field of array) {
            obj[field.key] = field.value
        }
        return obj;
    },
    convertDataAndRenderWordFile: async function (objKey, readName, writeName) {
        var pathTo = 'C:/images_services/ageless_sendmail/'
        try {
            console.log(pathTo + readName);
            fs.readFile(pathTo + readName, 'binary', function (err, data) {
                if (err) {
                    console.log(err, 1);
                    return false
                }
                var zip = new JSZip(data);
                var doc = new Docxtemplater().loadZip(zip)
                doc.setData(objKey);
                doc.render()
                var buf = doc.getZip().generate({ type: 'nodebuffer' });
                fs.writeFileSync(path.resolve(pathTo, writeName), buf);
                return 'C:/images_services/ageless_sendmail/' + writeName
            });
        } catch (error) {
            console.log(error);
            return ''
        }

    },
    convertDataAndRenderExcelFile: async function (objKey, readLink, writeLink) {
        try {
            var XlsxTemplate = require('xlsx-template');
            // Load an XLSX file into memory
            fs.readFile((readLink), function (err, data) {

                // Create a template
                var template = new XlsxTemplate(data);

                // Replacements take place on first sheet
                var sheetNumber = 1;
                // Set up some placeholder values matching the placeholders in the template
                // Perform substitution
                template.substitute(sheetNumber, objKey);

                // Get binary data
                var data = template.generate();
                fs.writeFileSync(writeLink, data, 'binary')
            })
            return 1
        } catch (error) {
            console.log(error);
            return 0
        }

    },
    convertDocxToPDF: async function (readName, writeName) {
        try {
            const extend = '.pdf'
            const file = fs.readFileSync(readName);
            libre.convert(file, extend, undefined, (err, done) => {
                if (err) {
                    console.log(`Error converting file: ${err}`);
                }
                // Here in done you have pdf file which you can save or transfer in another stream
                fs.writeFileSync(writeName, done);
            });
        } catch (error) {
            console.log(error);
            return ''
        }

    },
    transform: function (amount, decimalCount = 2, decimal = '.', thousands = ',') {
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
    },
    readMoney: async function (num, endingText = ' đồng chẵn.') {
        if (num == null || num == '') return '';
        let temp = '';
        //length <= 18

        while (num.length < 18) {
            num = '0' + num;
        }
        let g1 = num.substring(0, 3);
        let g2 = num.substring(3, 6);
        let g3 = num.substring(6, 9);
        let g4 = num.substring(9, 12);
        let g5 = num.substring(12, 15);
        let g6 = num.substring(15, 18);
        //read group1 ---------------------
        if (g1 != '000') {
            temp = await readGroup(g1);
            temp += ' Triệu';
        }
        //read group2-----------------------
        if (g2 != '000') {
            temp += await readGroup(g2);
            temp += ' Nghìn';
        }
        //read group3 ---------------------
        if (g3 != '000') {
            temp += await readGroup(g3);
            temp += ' Tỷ';
        }

        //read group2-----------------------
        if (g4 != '000') {
            temp += await readGroup(g4);
            temp += ' Triệu';
        }
        //---------------------------------
        if (g5 != '000') {
            temp += await readGroup(g5);
            temp += ' Nghìn';
        }
        //-----------------------------------
        temp = temp + await readGroup(g6);
        //---------------------------------
        // Refine
        temp = temp.replace('Một Mươi', 'Mười');
        temp = temp.trim();
        temp = temp.replace('Không Trăm', '');
        //        if (temp.indexOf("Không Trăm") == 0) temp = temp.substring(10);
        temp = temp.trim();
        temp = temp.replace('Mười Không', 'Mười');
        temp = temp.trim();
        temp = temp.replace('Mươi Không', 'Mươi');
        temp = temp.trim();
        if (temp.indexOf('Lẻ') == 0) temp = temp.substring(2);
        temp = temp.trim();
        temp = temp.replace('Mươi Một', 'Mươi Mốt');
        temp = temp.trim();

        //Change Case
        return (
            '' +
            temp.substring(0, 1).toUpperCase() +
            temp.substring(1).toLowerCase() +
            endingText.toLowerCase()
        );
    }
}