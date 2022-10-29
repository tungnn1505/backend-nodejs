const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblNghiPhep = require('../tables/hrmanage/tblNghiPhep')
var database = require('../database');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblLoaiChamCong = require('../tables/hrmanage/tblLoaiChamCong')
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan');
var mtblHopDongNhanSu = require('../tables/hrmanage/tblHopDongNhanSu')
var mtblDateOfLeave = require('../tables/hrmanage/tblDateOfLeave')
var mtblFileAttach = require('../tables/constants/tblFileAttach');
var mtblDMUser = require('../tables/constants/tblDMUser');
var mtblDMPermission = require('../tables/constants/tblDMPermission');
var mtblConfigWorkday = require('../tables/hrmanage/tblConfigWorkday')
async function convertNumber(number) {
    if (number < 10) {
        return '0' + number
    }
    else
        return number
}
async function deleteRelationshiptblNghiPhep(db, listID) {
    await mtblDateOfLeave(db).destroy({
        where: {
            LeaveID: {
                [Op.in]: listID
            }
        }
    })
    await mtblNghiPhep(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}
var mModules = require('../constants/modules');

var enumerateDaysBetweenDates = function (startDate, endDate) {
    var dates = [];
    var currDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');
    while (currDate.add(1, 'days').diff(lastDate) < 0) {
        dates.push(moment(currDate.clone().toDate()).format('YYYY-MM-DD'));
    }

    return dates;
};
async function monthDiff(d1, d2) {
    var months = 0;
    months = (Number(moment(d1).format('MM')) + (Number(moment(d1).format('YY')) * 12)) - (Number(moment(d2).format('MM')) + (12 * Number(moment(d2).format('YY'))))
    return months;
}
async function handleCalculateAdvancePayment(db, idStaff) {
    let staffData = await mtblHopDongNhanSu(db).findOne({
        where: { IDNhanVien: idStaff },
        order: [
            ['ID', 'ASC']
        ],
    })
    var diff;
    if (staffData) {
        let now = new Date()
        let dateSign = new Date(staffData.Date)
        diff = await monthDiff(now, dateSign)
    }
    return diff ? diff : 0
}
async function handleCalculateUsedLeave(db, idStaff) {
    var result = 0;
    await mtblNghiPhep(db).findAll({
        where: {
            IDNhanVien: idStaff,
            Status: 'Hoàn thành',
        },
        order: [
            ['ID', 'DESC']
        ],
    }).then(data => {
        if (data) {
            data.forEach(item => {
                result += item.Deducted
            })
        }
    })
    return result;
}
async function take7thDataToWork(year, month) {
    //  lấy danh sách thứ 7 đi làm ------------------------------------
    let array = []

    await database.connectDatabase().then(async db => {
        if (db) {
            await mtblConfigWorkday(db).findAll({
                where: {
                    Date: {
                        [Op.substring]: year + '-' + month
                    }
                },
                order: [
                    ['Date', 'DESC']
                ],
            }).then(async data => {
                if (data.length > 0)
                    for (var saturday = 0; saturday < data.length; saturday++) {
                        array.push(Number(data[saturday].Date.slice(8, 10)))
                    }
            })
            return array
            // ----------------------------------------------------------------------
        }
        else {
            array = []
        }
    })
    return array

}
async function handleCalculateDayOff(dateStart, dateEnd) {
    let result = 0;
    let subtractHalfDay = 0;
    let arrayMonth = []
    let monthStart = moment(dateStart).add(14, 'hours').format('MM')
    let monthEnd = moment(dateEnd).add(14, 'hours').format('MM')
    for (let m = monthStart; m <= monthEnd; m++) {
        arrayMonth.push(m)
    }
    let days = await enumerateDaysBetweenDates(dateStart, dateEnd)
    let array7th = [];
    for (var i = 0; i < days.length; i++) {
        var monthOfDay = moment(days[i]).add(14, 'hours').format('MM')
        var yearOfDay = moment(days[i]).add(14, 'hours').format('YYYY')
        var day = moment(days[i]).add(14, 'hours').format('DD')
        let arrayWork = await take7thDataToWork(yearOfDay, monthOfDay)
        if (!mModules.checkDuplicate(arrayWork, Number(day))) {
            array7th.push(days[i])
        }
    }
    let checkDateStart = Number(dateStart.slice(11, 13))
    let checkDateEnd = Number(dateEnd.slice(11, 13))
    var monthOfDayStart = moment(dateStart).add(14, 'hours').format('MM')
    var yearOfDayStart = moment(dateStart).add(14, 'hours').format('YYYY')
    var dayStart = moment(dateStart).add(14, 'hours').format('DD')
    var monthOfDayEnd = moment(dateEnd).add(14, 'hours').format('MM')
    var yearOfDayEnd = moment(dateEnd).add(14, 'hours').format('YYYY')
    var dayEnd = moment(dateEnd).add(14, 'hours').format('DD')
    let arrayWorkStart = await take7thDataToWork(yearOfDayStart, monthOfDayStart)
    let arrayWorkEnd = await take7thDataToWork(yearOfDayEnd, monthOfDayEnd)
    if (mModules.checkDuplicate(arrayWorkStart, Number(dayStart))) {
        if (checkDateStart >= 13) {
            subtractHalfDay += 0.5
        } else {
            subtractHalfDay += 1
        }
    }
    if (mModules.checkDuplicate(arrayWorkEnd, Number(dayEnd))) {
        if (checkDateEnd <= 13) {
            subtractHalfDay += 0.5
        } else {
            subtractHalfDay += 1
        }
    }
    if (days.length < 1) {
        if (Number(dateStart.slice(8, 10)) != Number(dateEnd.slice(8, 10)))
            if (checkDateEnd < 17)
                result = 1.5
            else
                result = 2
        else {
            if (checkDateEnd < 17)
                result = 0.5
            else
                result = 1
        }
    } else
        result = days.length - array7th.length + subtractHalfDay
    return result
}
async function handleCalculatePreviousYear(db, idStaff, currentYear) {
    var result = 0;
    await mtblNghiPhep(db).findOne({
        where: {
            IDNhanVien: idStaff,
            DateEnd: {
                [Op.substring]: currentYear
            }
        },
        order: [
            ['ID', 'DESC']
        ],
    }).then(data => {
        if (data) {
            result = data.AdvancePayment - data.UsedLeave - data.Deducted
        }
    })
    return result;
}
var mModules = require('../constants/modules');
let ctlTimeAttendanceSummary = require('./ctl-tblBangLuong')
var schedule = require('node-schedule');
module.exports = {
    deleteRelationshiptblNghiPhep,
    // add_tbl_nghiphep
    addtblNghiPhep: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var number = 1;
                    var code = 'DXN'
                    if (body.type == 'TakeLeave')
                        code = 'DXN'
                    else
                        code = 'LTG'
                    await mtblNghiPhep(db).findOne({
                        order: [
                            ['ID', 'DESC']
                        ],
                        where: {
                            Type: body.type
                        }
                    }).then(data => {
                        if (data)
                            if (data.NumberLeave) {
                                number = Number(data.NumberLeave.slice(3, 100)) + 1
                            }
                    })
                    code += number
                    let seniority = 0;
                    let advancePayment = 0;
                    let usedLeave = 0;
                    let numberHoliday = 0;
                    let remainingPreviousYear = 0;
                    let deducted = 0 // số lương phép bị trừ
                    let arrayRespone = JSON.parse(body.array)
                    if (body.type == 'TakeLeave') {
                        seniority = await handleCalculateAdvancePayment(db, body.idNhanVien) // thâm niên
                        // var quotient = Math.floor(y / x);  // lấy nguyên
                        // var remainder = y % x; // lấy dư
                        if (seniority > 12) {
                            advancePayment = 12 + Math.floor(seniority / 60)
                        } else {
                            let staffData = await mtblHopDongNhanSu(db).findOne({
                                where: { IDNhanVien: body.idNhanVien },
                                order: [
                                    ['ID', 'ASC']
                                ],
                            })
                            if (staffData) {
                                let dateSign = new Date(staffData.Date)
                                advancePayment = 12 - Number(moment(dateSign).format('MM'))
                                if (Number(moment(dateSign).format('DD')) == 1)
                                    advancePayment += 1
                            }
                        }
                        for (let i = 0; i < arrayRespone.length; i++) {
                            let numberHolidayArray = 0
                            if (!arrayRespone[i].timeStart)
                                arrayRespone[i].timeStart = "08:00"
                            if (!arrayRespone[i].timeEnd)
                                arrayRespone[i].timeEnd = "17:30"
                            numberHolidayArray = await handleCalculateDayOff(arrayRespone[i].dateStart + ' ' + arrayRespone[i].timeStart, arrayRespone[i].dateEnd + ' ' + arrayRespone[i].timeEnd)
                            numberHoliday += numberHolidayArray
                            let typeTime = await mtblLoaiChamCong(db).findOne({
                                where: { ID: arrayRespone[i].idLoaiChamCong }
                            })
                            if (typeTime.Compensation == false) {
                                deducted += numberHolidayArray
                            }
                        }
                        usedLeave = await handleCalculateUsedLeave(db, body.idNhanVien);
                        let currentYear = Number(moment().format('YYYY'))
                        let currentMonth = Number(moment().format('MM'))
                        if (currentMonth < 4)
                            remainingPreviousYear = await handleCalculatePreviousYear(db, body.idNhanVien, currentYear - 1)
                        else
                            remainingPreviousYear = 0
                    }
                    if (body.idLoaiChamCong) {
                        let typeLeave = await mtblLoaiChamCong(db).findOne({ where: { ID: body.idLoaiChamCong } })
                        if (typeLeave && typeLeave.Compensation) {
                            // usedLeave = 0
                            numberHoliday = 0
                        }
                    }
                    let checkErr = advancePayment - usedLeave
                    if (checkErr < deducted && body.type == 'TakeLeave') {
                        var result = {
                            status: Constant.STATUS.FAIL,
                            message: 'Số ngày nghỉ : ' + deducted + ' đã quá số phép còn lại. Vui lòng kiểm tra lại!',
                        }
                        res.json(result);
                    } else {
                        await mtblNghiPhep(db).create({
                            // DateStart: body.dateStart ? moment(body.dateStart).format('YYYY-MM-DD HH:mm:ss.SSS') : null,
                            // DateEnd: body.dateEnd ? moment(body.dateEnd).format('YYYY-MM-DD HH:mm:ss.SSS') : null,
                            IDNhanVien: body.idNhanVien ? body.idNhanVien : null,
                            IDLoaiChamCong: body.idLoaiChamCong ? body.idLoaiChamCong : null,
                            NumberLeave: code,
                            Type: body.type ? body.type : '',
                            ContentLeave: body.content ? body.content : '',
                            Date: body.date ? body.date : null,
                            IDHeadDepartment: body.idHeadDepartment ? body.idHeadDepartment : null,
                            IDAdministrationHR: body.idAdministrationHR ? body.idAdministrationHR : null,
                            IDHeads: body.idHeads ? body.idHeads : null,
                            Status: 'Chờ trưởng bộ phận phê duyệt',
                            AdvancePayment: advancePayment,
                            UsedLeave: usedLeave,
                            Deducted: deducted,
                            RemainingPreviousYear: remainingPreviousYear,
                            NumberHoliday: numberHoliday,
                            Time: body.time ? body.time : '',
                            Note: body.note ? body.note : '',
                            WorkContent: body.work ? body.work : ''
                        }).then(async data => {
                            if (data)
                                if (body.type == 'TakeLeave') {
                                    for (let i = 0; i < arrayRespone.length; i++) {
                                        await mtblDateOfLeave(db).create({
                                            DateStart: arrayRespone[i].dateStart + ' ' + arrayRespone[i].timeStart,
                                            DateEnd: arrayRespone[i].dateEnd + ' ' + arrayRespone[i].timeEnd,
                                            LeaveID: data.ID,
                                            IDLoaiChamCong: arrayRespone[i].idLoaiChamCong,
                                        })
                                    }
                                } else {
                                    for (let i = 0; i < arrayRespone.length; i++) {
                                        await mtblDateOfLeave(db).create({
                                            DateStart: arrayRespone[i].date + ' ' + arrayRespone[i].timeStart,
                                            DateEnd: arrayRespone[i].date + ' ' + arrayRespone[i].timeEnd,
                                            WorkContent: arrayRespone[i].workContent ? arrayRespone[i].workContent : '',
                                            WorkResult: arrayRespone[i].workResult ? arrayRespone[i].workResult : '',
                                            TimeStartReal: arrayRespone[i].date + ' ' + (arrayRespone[i].timeStartReal == '' ? arrayRespone[i].timeStartReal : arrayRespone[i].timeStart),
                                            TimeEndReal: arrayRespone[i].date + ' ' + (arrayRespone[i].TimeEndReal == '' ? arrayRespone[i].TimeEndReal : arrayRespone[i].timeEnd),
                                            LeaveID: data.ID,
                                        })
                                    }
                                }
                            if (body.type == 'TakeLeave') {
                                body.fileAttach = JSON.parse(body.fileAttach)
                                if (body.fileAttach.length > 0)
                                    for (var j = 0; j < body.fileAttach.length; j++)
                                        await mtblFileAttach(db).update({
                                            IDTakeLeave: data.ID,
                                        }, {
                                            where: {
                                                ID: body.fileAttach[j].id
                                            }
                                        })
                            }
                            var result = {
                                id: data ? data.ID : null,
                                status: Constant.STATUS.SUCCESS,
                                message: Constant.MESSAGE.ACTION_SUCCESS,
                            }
                            res.json(result);
                        })
                    }

                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // update_tbl_nghiphep
    updatetblNghiPhep: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.type == 'TakeLeave') {
                        body.fileAttach = JSON.parse(body.fileAttach)
                        await mModules.updateForFileAttach(db, 'IDTakeLeave', body.fileAttach, body.id)
                    }
                    let arrayRespone = JSON.parse(body.array)
                    let numberHoliday = 0
                    let deducted = 0 // số lương phép bị trừ
                    for (let i = 0; i < arrayRespone.length; i++) {
                        let numberHolidayArray = 0
                        if (!arrayRespone[i].timeStart)
                            arrayRespone[i].timeStart = "08:00"
                        if (!arrayRespone[i].timeEnd)
                            arrayRespone[i].timeEnd = "17:30"
                        if (body.type != 'TakeLeave') {
                            numberHolidayArray = await handleCalculateDayOff(arrayRespone[i].date + ' ' + arrayRespone[i].timeStart, arrayRespone[i].date + ' ' + arrayRespone[i].timeEnd)

                        } else {
                            numberHolidayArray = await handleCalculateDayOff(arrayRespone[i].dateStart + ' ' + arrayRespone[i].timeStart, arrayRespone[i].dateEnd + ' ' + arrayRespone[i].timeEnd)
                            let typeTime = await mtblLoaiChamCong(db).findOne({
                                where: { ID: arrayRespone[i].idLoaiChamCong }
                            })
                            if (typeTime.Compensation == false) {
                                deducted += numberHolidayArray
                            }
                        }
                        numberHoliday += numberHolidayArray
                    }
                    update.push({ key: 'NumberHoliday', value: numberHoliday });
                    update.push({ key: 'Deducted', value: deducted });
                    await mtblDateOfLeave(db).destroy({ where: { LeaveID: body.id } })
                    console.log(arrayRespone);
                    for (let i = 0; i < arrayRespone.length; i++) {
                        if (body.type != 'TakeLeave') {
                            await mtblDateOfLeave(db).create({
                                DateStart: arrayRespone[i].date + ' ' + arrayRespone[i].timeStart,
                                DateEnd: arrayRespone[i].date + ' ' + arrayRespone[i].timeEnd,
                                WorkContent: arrayRespone[i].workContent ? arrayRespone[i].workContent : '',
                                WorkResult: arrayRespone[i].workResult ? arrayRespone[i].workResult : '',
                                TimeStartReal: arrayRespone[i].date + ' ' + (arrayRespone[i].timeStartReal ? arrayRespone[i].timeStartReal : arrayRespone[i].timeStart),
                                TimeEndReal: arrayRespone[i].date + ' ' + (arrayRespone[i].timeEndReal ? arrayRespone[i].timeEndReal : arrayRespone[i].timeEnd),
                                LeaveID: body.id,
                            })
                        } else {
                            console.log(arrayRespone);
                            await mtblDateOfLeave(db).create({
                                DateStart: arrayRespone[i].dateStart + ' ' + arrayRespone[i].timeStart,
                                DateEnd: arrayRespone[i].dateEnd + ' ' + arrayRespone[i].timeEnd,
                                IDLoaiChamCong: arrayRespone[i].idLoaiChamCong,
                                LeaveID: body.id,
                            })
                        }
                    }
                    if (body.numberLeave || body.numberLeave === '')
                        update.push({ key: 'NumberLeave', value: body.numberLeave });
                    if (body.time || body.time === '')
                        update.push({ key: 'Time', value: body.time });
                    if (body.note || body.note === '')
                        update.push({ key: 'Note', value: body.note });
                    if (body.type || body.type === '')
                        update.push({ key: 'Type', value: body.type });
                    if (body.content || body.content === '')
                        update.push({ key: 'ContentLeave', value: body.content });
                    if (body.work || body.work === '')
                        update.push({ key: 'WorkContent', value: body.work });
                    if (body.date || body.date === '') {
                        if (body.date === '')
                            update.push({ key: 'Date', value: null });
                        else
                            update.push({ key: 'Date', value: body.date });
                    }
                    if (body.remaining || body.remaining === '') {
                        if (body.remaining === '')
                            update.push({ key: 'Remaining', value: 0 });
                        else
                            update.push({ key: 'Remaining', value: body.remaining });
                    }
                    if (body.idHeadDepartment || body.idHeadDepartment === '') {
                        if (body.idHeadDepartment === '')
                            update.push({ key: 'IDHeadDepartment', value: null });
                        else
                            update.push({ key: 'IDHeadDepartment', value: body.idHeadDepartment });
                    }
                    if (body.idAdministrationHR || body.idAdministrationHR === '') {
                        if (body.idAdministrationHR === '')
                            update.push({ key: 'IDAdministrationHR', value: null });
                        else
                            update.push({ key: 'IDAdministrationHR', value: body.idAdministrationHR });
                    }
                    if (body.idHeads || body.idHeads === '') {
                        if (body.idHeads === '')
                            update.push({ key: 'IDHeads', value: null });
                        else
                            update.push({ key: 'IDHeads', value: body.idHeads });
                    }
                    if (body.idNhanVien || body.idNhanVien === '') {
                        if (body.idNhanVien === '')
                            update.push({ key: 'IDNhanVien', value: null });
                        else
                            update.push({ key: 'IDNhanVien', value: body.idNhanVien });
                    }
                    database.updateTable(update, mtblNghiPhep(db), body.id).then(response => {
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
    // delete_tbl_nghiphep
    deletetblNghiPhep: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    // await deleteRelationshiptblNghiPhep(db, listID);
                    await mtblNghiPhep(db).findAll({
                        where: {
                            ID: {
                                [Op.in]: listID
                            }
                        }
                    }).then(async data => {
                        let check = true
                        let array = []
                        let mess = Constant.MESSAGE.ACTION_SUCCESS
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].Status == 'Hoàn thành') {
                                check = false
                            } else
                                array.push(data[i].ID)

                        }
                        await deleteRelationshiptblNghiPhep(db, array);
                        if (!check)
                            mess = 'Không thể xóa những bản ghi đã hoàn thành. Vui lòng kiểm tra lại !'
                        var result = {
                            status: Constant.STATUS.SUCCESS,
                            message: mess,
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
    // get_list_tbl_nghiphep
    getListtblNghiPhep: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereObj = {};
                    let arraySearchAnd = [];
                    let arraySearchOr = [];
                    let arraySearchNot = [];
                    if (body.type == 'TakeLeave') {
                        arraySearchAnd.push({ Type: 'TakeLeave' })
                    } else {
                        arraySearchAnd.push({ Type: 'SignUp' })
                    }
                    if (body.staffID) {
                        let tblDMUser = mtblDMUser(db);
                        tblDMUser.belongsTo(mtblDMPermission(db), { foreignKey: 'IDPermission', sourceKey: 'IDPermission', as: 'permission' })
                        await tblDMUser.findOne({
                            where: { IDNhanvien: body.staffID },
                            include: [{
                                model: mtblDMPermission(db),
                                required: false,
                                as: 'permission'
                            },],
                        }).then(user => {
                            if (user)
                                if (user.permission && user.permission.PermissionName != 'Admin') {
                                    arraySearchAnd.push({
                                        [Op.or]: [
                                            { IDNhanVien: body.staffID },
                                            { IDHeads: body.staffID },
                                            { IDAdministrationHR: body.staffID },
                                            { IDHeadDepartment: body.staffID },
                                        ]
                                    })
                                }
                        })
                    }
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            var list = [];
                            await mtblDMNhanvien(db).findAll({
                                order: [
                                    ['ID', 'DESC']
                                ],
                                where: {
                                    [Op.or]: [{
                                        StaffCode: {
                                            [Op.like]: '%' + data.search + '%'
                                        }
                                    },
                                    {
                                        StaffName: {
                                            [Op.like]: '%' + data.search + '%'
                                        }
                                    }
                                    ]
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    list.push(item.ID);
                                })
                            })
                            where = [{
                                IDNhanVien: {
                                    [Op.in]: list
                                }
                            },
                            {
                                NumberLeave: {
                                    [Op.like]: '%' + data.search + '%'
                                }
                            },
                            ];
                        } else {
                            where = [{
                                NumberLeave: {
                                    [Op.ne]: '%%'
                                }
                            },];
                        }
                        arraySearchAnd.push({
                            [Op.or]: where
                        })
                        // arraySearchOr.push({ ID: { [Op.ne]: null } })
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'SỐ ĐƠN') {
                                    var list = [];
                                    userFind['NumberLeave'] = {
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
                                if (data.items[i].fields['name'] === 'NGƯỜI LÀM ĐƠN') {
                                    var list = [];
                                    userFind['IDNhanVien'] = {
                                        [Op.eq]: data.items[i]['searchFields']
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
                                if (data.items[i].fields['name'] === 'BỘ PHẬN') {
                                    var list = [];
                                    await mtblDMNhanvien(db).findAll({
                                        where: { IDBoPhan: data.items[i]['searchFields'] }
                                    }).then(data => {
                                        data.forEach(item => {
                                            list.push(item.ID)
                                        })
                                    })
                                    userFind['IDNhanVien'] = {
                                        [Op.in]: list
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
                                if (data.items[i].fields['name'] === 'TRẠNG THÁI') {
                                    userFind['Status'] = {
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
                                if (data.items[i].fields['name'] === 'NGÀY LÀM ĐƠN') {
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
                                if (data.items[i].fields['name'] === 'LÝ DO TỪ CHỐI') {
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
                            }
                        }
                        if (arraySearchOr.length > 0)
                            whereObj[Op.or] = arraySearchOr
                        if (arraySearchAnd.length > 0)
                            whereObj[Op.and] = arraySearchAnd
                        if (arraySearchNot.length > 0)
                            whereObj[Op.not] = arraySearchNot
                    }
                    let stt = 1;
                    let tblNghiPhep = mtblNghiPhep(db);
                    let tblDMNhanvien = mtblDMNhanvien(db);
                    tblNghiPhep.belongsTo(mtblLoaiChamCong(db), { foreignKey: 'IDLoaiChamCong', sourceKey: 'IDLoaiChamCong', as: 'loaiChamCong' })
                    tblNghiPhep.belongsTo(tblDMNhanvien, { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
                    tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bp' })
                    tblNghiPhep.belongsTo(tblDMNhanvien, { foreignKey: 'IDHeadDepartment', sourceKey: 'IDHeadDepartment', as: 'headDepartment' })
                    tblNghiPhep.belongsTo(tblDMNhanvien, { foreignKey: 'IDAdministrationHR', sourceKey: 'IDAdministrationHR', as: 'adminHR' })
                    tblNghiPhep.belongsTo(tblDMNhanvien, { foreignKey: 'IDHeads', sourceKey: 'IDHeads', as: 'heads' })
                    tblNghiPhep.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereObj,
                        include: [{
                            model: mtblLoaiChamCong(db),
                            required: false,
                            as: 'loaiChamCong'
                        },
                        {
                            model: tblDMNhanvien,
                            required: false,
                            as: 'nv',
                            include: [{
                                model: mtblDMBoPhan(db),
                                required: false,
                                as: 'bp'
                            },]
                        },
                        {
                            model: tblDMNhanvien,
                            required: false,
                            as: 'headDepartment'
                        },
                        {
                            model: tblDMNhanvien,
                            required: false,
                            as: 'adminHR'
                        },
                        {
                            model: tblDMNhanvien,
                            required: false,
                            as: 'heads'
                        },
                        ],
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            let remaining = 0
                            if (data[i].Status == 'Hoàn thành') {
                                remaining = data[i].AdvancePayment - data[i].UsedLeave - data[i].Deducted
                            } else {
                                remaining = data[i].AdvancePayment - data[i].UsedLeave
                            }
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                dateEnd: data[i].DateEnd ? moment(data[i].DateEnd).subtract(7, 'hours').format('DD/MM/YYYY HH:mm:ss') : '',
                                dateStart: data[i].DateStart ? moment(data[i].DateStart).subtract(7, 'hours').format('DD/MM/YYYY HH:mm:ss') : '',
                                idLoaiChamCong: data[i].loaiChamCong ? data[i].loaiChamCong.ID : '',
                                nameLoaiChamCong: data[i].loaiChamCong ? data[i].loaiChamCong.Name : '',
                                codeLoaiChamCong: data[i].loaiChamCong ? data[i].loaiChamCong.Code : '',
                                idNhanVien: data[i].IDNhanVien ? data[i].IDNhanVien : '',
                                staffCode: data[i].nv ? data[i].nv.StaffCode : '',
                                staffName: data[i].nv ? data[i].nv.StaffName : '',
                                departmentName: data[i].nv ? data[i].nv.bp ? data[i].nv.bp.DepartmentName : '' : '',
                                departmentID: data[i].nv ? data[i].nv.bp ? data[i].nv.bp.ID : '' : '',
                                numberLeave: data[i].NumberLeave ? data[i].NumberLeave : '',
                                content: data[i].ContentLeave ? data[i].ContentLeave : '',
                                status: data[i].Status ? data[i].Status : '',
                                type: data[i].Type ? data[i].Type : '',
                                date: data[i].Date ? moment(data[i].Date).format('DD/MM/YYYY') : null,
                                remaining: remaining,
                                numberHoliday: data[i].NumberHoliday,
                                advancePayment: data[i].AdvancePayment,
                                usedLeave: data[i].UsedLeave,
                                idHeadDepartment: data[i].IDHeadDepartment ? data[i].IDHeadDepartment : '',
                                headDepartmentCode: data[i].headDepartment ? data[i].headDepartment.StaffCode : '',
                                headDepartmentName: data[i].headDepartment ? data[i].headDepartment.StaffName : '',
                                idAdministrationHR: data[i].IDAdministrationHR ? data[i].IDAdministrationHR : '',
                                administrationHRCode: data[i].adminHR ? data[i].adminHR.StaffCode : '',
                                administrationHRName: data[i].adminHR ? data[i].adminHR.StaffName : '',
                                idHeads: data[i].IDHeads ? data[i].IDHeads : '',
                                headsCode: data[i].heads ? data[i].heads.StaffCode : '',
                                headsName: data[i].heads ? data[i].heads.StaffName : '',
                                reason: data[i].Reason ? data[i].Reason : '',
                                time: data[i].Time ? data[i].Time : '',
                                note: data[i].Note ? data[i].Note : '',
                                work: data[i].WorkContent ? data[i].WorkContent : '',
                            }
                            let tblDateOfLeave = mtblDateOfLeave(db);
                            tblDateOfLeave.belongsTo(mtblLoaiChamCong(db), { foreignKey: 'IDLoaiChamCong', sourceKey: 'IDLoaiChamCong', as: 'lcc' })

                            await tblDateOfLeave.findAll({
                                where: { LeaveID: data[i].ID },
                                include: [{
                                    model: mtblLoaiChamCong(db),
                                    required: false,
                                    as: 'lcc'
                                },],
                            }).then(date => {
                                let arrayDate = []
                                if (obj.type == 'TakeLeave')
                                    date.forEach(item => {
                                        arrayDate.push({
                                            dateStart: moment(item.DateStart).subtract(7, 'hour').format('YYYY-MM-DD'),
                                            timeStart: moment(item.DateStart).subtract(7, 'hour').format('HH:mm'),
                                            dateEnd: moment(item.DateEnd).subtract(7, 'hour').format('YYYY-MM-DD'),
                                            timeEnd: moment(item.DateEnd).subtract(7, 'hour').format('HH:mm'),
                                            idLoaiChamCong: item.IDLoaiChamCong ? Number(item.IDLoaiChamCong) : null
                                        })
                                    })
                                else {
                                    date.forEach(item => {
                                        arrayDate.push({
                                            date: moment(item.DateStart).subtract(7, 'hour').format('YYYY-MM-DD'),
                                            timeStart: moment(item.DateStart).subtract(7, 'hour').format('HH:mm'),
                                            timeEnd: moment(item.DateEnd).subtract(7, 'hour').format('HH:mm'),
                                            workContent: item.WorkContent ? item.WorkContent : '',
                                            workResult: item.WorkResult ? item.WorkResult : '',
                                            timeStartReal: item.TimeStartReal ? moment(item.TimeStartReal).subtract(7, 'hour').format('HH:mm') : null,
                                            timeEndReal: item.TimeEndReal ? moment(item.TimeEndReal).subtract(7, 'hour').format('HH:mm') : null,
                                        })
                                    })
                                }
                                obj['array'] = arrayDate
                            })
                            array.push(obj);
                            stt += 1;
                        }
                        for (var i = 0; i < array.length; i++) {
                            var arrayFile = []
                            await mtblFileAttach(db).findAll({ where: { IDTakeLeave: array[i].id } }).then(file => {
                                if (file.length > 0) {
                                    for (var e = 0; e < file.length; e++) {
                                        arrayFile.push({
                                            id: file[e].ID ? file[e].ID : '',
                                            name: file[e].Name ? file[e].Name : '',
                                            link: file[e].Link ? file[e].Link : '',
                                        })
                                    }
                                }
                            })
                            array[i]['fileAttach'] = arrayFile;
                        }
                        var count = await mtblNghiPhep(db).count({ where: whereObj, })
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
    // confirm_head_department
    confirmHeadDepartment: (req, res) => {
        let body = req.body;
        console.log('confirm_head_department');
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let leave = await mtblNghiPhep(db).findOne({
                        where: { ID: body.id }
                    })
                    if (leave.Type == 'TakeLeave')
                        await mtblNghiPhep(db).update({
                            Status: 'Chờ thủ trưởng phê duyệt',
                        }, { where: { ID: body.id } })
                    else
                        await mtblNghiPhep(db).update({
                            Status: 'Chờ hành chính nhân sự phê duyệt',
                        }, { where: { ID: body.id } })

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
    // approval_head_department
    approvalHeadDepartment: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let leave = await mtblNghiPhep(db).findOne({
                        where: { ID: body.id }
                    })
                    let tblDateOfLeave = mtblDateOfLeave(db);
                    await tblDateOfLeave.findAll({
                        where: { LeaveID: leave.ID },
                    }).then(date => {
                        for (let d = 0; d < date.length; d++) {
                            var time = moment(date[d].DateEnd).add(17, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS');
                            let dbCon = db
                            let idN = body.id
                            var job = schedule.scheduleJob(time, async function () {
                                await mtblNghiPhep(dbCon).update({
                                    Status: 'Từ chối',
                                }, {
                                    where: {
                                        ID: idN,
                                        Status: { [Op.ne]: 'Hoàn thành' },
                                    }
                                })
                            });
                            console.log(job);
                        }
                    })
                    if (leave.Type == 'TakeLeave')
                        await mtblNghiPhep(db).update({
                            Status: 'Chờ hành chính nhân sự phê duyệt',
                        }, { where: { ID: body.id } })
                    else {
                        await mtblDateOfLeave(db).destroy({ where: { LeaveID: body.id } })
                        let arrayRespone = JSON.parse(body.array);
                        for (let i = 0; i < arrayRespone.length; i++) {
                            await mtblDateOfLeave(db).create({
                                DateStart: arrayRespone[i].date + ' ' + arrayRespone[i].timeStart,
                                DateEnd: arrayRespone[i].date + ' ' + arrayRespone[i].timeEnd,
                                WorkContent: arrayRespone[i].workContent ? arrayRespone[i].workContent : '',
                                WorkResult: arrayRespone[i].workResult ? arrayRespone[i].workResult : '',
                                TimeStartReal: arrayRespone[i].date + ' ' + (arrayRespone[i].timeStartReal ? arrayRespone[i].timeStartReal : arrayRespone[i].timeStart),
                                TimeEndReal: arrayRespone[i].date + ' ' + (arrayRespone[i].timeEndReal ? arrayRespone[i].timeEndReal : arrayRespone[i].timeEnd),
                                LeaveID: body.id,
                            })
                        }
                        await mtblNghiPhep(db).update({
                            Status: 'Chờ trưởng bộ phận xác nhận',
                            Note: body.note ? body.note : '',
                        }, { where: { ID: body.id } })
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
    // approval_administration_hr
    approvalAdministrationHR: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let leave = await mtblNghiPhep(db).findOne({
                        where: { ID: body.id }
                    })
                    if (leave.Type == 'TakeLeave') {
                        await mtblNghiPhep(db).update({
                            Status: 'Chờ thủ trưởng phê duyệt',
                        }, { where: { ID: body.id } })
                    } else {
                        await mtblDateOfLeave(db).destroy({ where: { LeaveID: body.id } })
                        let arrayRespone = JSON.parse(body.array);
                        for (let i = 0; i < arrayRespone.length; i++) {
                            await mtblDateOfLeave(db).create({
                                DateStart: arrayRespone[i].date + ' ' + arrayRespone[i].timeStart,
                                DateEnd: arrayRespone[i].date + ' ' + arrayRespone[i].timeEnd,
                                WorkContent: arrayRespone[i].workContent ? arrayRespone[i].workContent : '',
                                WorkResult: arrayRespone[i].workResult ? arrayRespone[i].workResult : '',
                                TimeStartReal: arrayRespone[i].date + ' ' + (arrayRespone[i].timeStartReal ? arrayRespone[i].timeStartReal : arrayRespone[i].timeStart),
                                TimeEndReal: arrayRespone[i].date + ' ' + (arrayRespone[i].timeEndReal ? arrayRespone[i].timeEndReal : arrayRespone[i].timeEnd),
                                LeaveID: body.id,
                            })
                        }
                        await mtblNghiPhep(db).update({
                            Status: 'Chờ thủ trưởng phê duyệt',
                            Note: body.note ? body.note : '',
                        }, { where: { ID: body.id } })
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
    // approval_heads
    approvalHeads: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let leave = await mtblNghiPhep(db).findOne({
                        where: { ID: body.id }
                    })
                    if (leave.Type == 'TakeLeave') {
                        await mtblNghiPhep(db).update({
                            Status: 'Hoàn thành',
                        }, { where: { ID: body.id } })
                        let min = Number(moment().format('MM'));
                        await mtblDateOfLeave(db).findAll({
                            where: { LeaveID: body.id }
                        }).then(date => {
                            date.forEach(element => {
                                if (Number(moment(element.DateStart).format('MM')) < min)
                                    min = Number(moment(element.DateStart).format('MM'))
                            })
                        })
                        await ctlTimeAttendanceSummary.createTimeAttendanceSummaryFollowMonth(min, Number(moment().format('YYYY')), leave.IDNhanVien)
                    }
                    else {
                        await mtblNghiPhep(db).update({
                            Status: 'Hoàn thành',
                        }, { where: { ID: body.id } })
                        let min = Number(moment().format('MM'));
                        await mtblDateOfLeave(db).findAll({
                            where: { LeaveID: body.id }
                        }).then(date => {
                            date.forEach(element => {
                                if (Number(moment(element.DateStart).format('MM')) < min)
                                    min = Number(moment(element.DateStart).format('MM'))
                            })
                        })
                        console.log(min, Number(moment().format('YYYY')), leave.IDNhanVien);
                        await ctlTimeAttendanceSummary.createTimeAttendanceSummaryFollowMonth(min, Number(moment().format('YYYY')), leave.IDNhanVien)
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
    // staff_confirm
    staffConfirm: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblNghiPhep(db).update({
                        Status: 'Chờ nhân viên xác nhận',
                    }, { where: { ID: body.id } })
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
    // refuse_head_department
    refuseHeadDepartment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblNghiPhep(db).update({
                        Status: 'Trưởng bộ phận đã từ chối',
                        Reason: body.reason,
                    }, { where: { ID: body.id } })
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
    // refuse_administration_hr
    refuseAdministrationHR: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblNghiPhep(db).update({
                        Status: 'Hành chính nhân sự đã từ chối',
                        Reason: body.reason,
                    }, { where: { ID: body.id } })
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
    // refuse_heads
    refuseHeads: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblNghiPhep(db).update({
                        Status: 'Thủ trưởng đã từ chối',
                        Reason: body.reason,
                    }, { where: { ID: body.id } })
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
    // refuse_staff
    refuseStaff: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblNghiPhep(db).update({
                        Status: 'Nhân viên đã từ chối',
                        Reason: body.reason,
                    }, { where: { ID: body.id } })
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
    // handle_take_leave_day
    handleTakeLeaveDay: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let result = await handleCalculateDayOff(body.dateStart, body.dateEnd)
                    var resultRes = {
                        result: result,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                    }
                    res.json(resultRes);
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // get_the_remaining_spells
    getTheRemainingSpells: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let result = 0
                    await mtblNghiPhep(db).findOne({
                        where: {
                            IDNhanVien: body.staffID,
                            Type: 'TakeLeave',
                        },
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        if (data)
                            if (data.Status == 'Hoàn thành') {
                                result = data.AdvancePayment - data.UsedLeave - data.Deducted
                            } else {
                                result = data.AdvancePayment - data.UsedLeave
                            }
                        else {
                            let seniority = await handleCalculateAdvancePayment(db, body.staffID) // thâm niên
                            // var quotient = Math.floor(y / x);  // lấy nguyên
                            // var remainder = y % x; // lấy dư
                            let advancePayment = 0
                            if (seniority > 12) {
                                advancePayment = 12 + Math.floor(seniority / 60)
                            } else {
                                let staffData = await mtblHopDongNhanSu(db).findOne({
                                    where: { IDNhanVien: body.staffID },
                                    order: [
                                        ['ID', 'ASC']
                                    ],
                                })
                                if (staffData) {
                                    let dateSign = new Date(staffData.Date)
                                    advancePayment = 12 - Number(moment(dateSign).format('MM'))
                                    if (Number(moment(dateSign).format('DD')) == 1)
                                        advancePayment += 1
                                }
                            }
                            result = advancePayment
                        }
                    })

                    var resultRes = {
                        result: result,
                        status: Constant.STATUS.SUCCESS,
                        message: Constant.MESSAGE.ACTION_SUCCESS,
                    }
                    res.json(resultRes);
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // change_notification_status
    changeNotificationStatus: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblNghiPhep(db).update({
                        IsNotification: true
                    }, { where: { ID: body.id } })
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