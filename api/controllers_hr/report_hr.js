const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblDMChiNhanh = require('../tables/constants/tblDMChiNhanh')
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblTaiSanBanGiao = require('../tables/qlnb/tblTaiSanBanGiao')
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblHopDongNhanSu = require('../tables/hrmanage/tblHopDongNhanSu')
const Sequelize = require('sequelize');
var mtblLoaiHopDong = require('../tables/hrmanage/tblLoaiHopDong')
var mModules = require('../constants/modules');
var mtblTimeAttendanceSummary = require('../tables/hrmanage/tblTimeAttendanceSummary')

let ctlBangLuong = require('./ctl-tblBangLuong')

var database = require('../database');
var mtblRewardPunishment = require('../tables/hrmanage/tblRewardPunishment')
var mtblRewardPunishmentRStaff = require('../tables/hrmanage/tblRewardPunishmentRStaff')
async function totalRewardPunishment(db, month, departmentID) {
    let total = 0;
    let arrayStaff = []
    await mtblDMNhanvien(db).findAll({
        where: {
            IDBoPhan: departmentID
        }
    }).then(data => {
        data.forEach(item => {
            arrayStaff.push(item.ID)
        })
    })
    await mtblRewardPunishmentRStaff(db).findAll({
        where: { StaffID: { [Op.in]: arrayStaff }, Date: { [Op.substring]: month }, }
    }).then(data => {
        data.forEach(item => {
            total += item.SalaryIncrease
        })
    })
    return total
}
async function convertNumber(number) {
    if (number < 10) {
        return '0' + number
    } else
        return number
}
var mModules = require('../constants/modules');

async function numberStaffInYear(db, year, departmentID) {
    var dateStart = year + '-' + '12-30 07:00:00.000';
    let obj = {
        ContractDateStart: { [Op.lte]: dateStart },
    }
    if (departmentID) {
        let arrayStaff = []
        await mtblDMNhanvien(db).findAll({
            where: {
                IDBoPhan: departmentID
            }
        }).then(data => {
            data.forEach(item => {
                arrayStaff.push(item.ID)
            })
        })
        obj['IDNhanVien'] = { [Op.in]: arrayStaff }
    }
    let arrayStaff = []
    await mtblHopDongNhanSu(db).findAll({
        where: obj
    }).then(contract => {
        for (let c = 0; c < contract.length; c++) {
            if (!mModules.checkDuplicate(arrayStaff, contract[c].IDNhanVien)) {
                arrayStaff.push(contract[c].IDNhanVien)
            }
        }
    })
    return arrayStaff.length
}

async function getRewardPunishmentByMonth(db, staffID, monthYear, year, departmentID = null) {
    let total = 0;
    let tblRewardPunishmentRStaff = mtblRewardPunishmentRStaff(db);
    tblRewardPunishmentRStaff.belongsTo(mtblDMNhanvien(db), { foreignKey: 'StaffID', sourceKey: 'StaffID', as: 'staff' })
    let obj = {}
    if (monthYear) {
        obj['Date'] = { [Op.substring]: monthYear }
    } else if (year) {
        obj['Date'] = { [Op.substring]: year }
    }
    if (staffID) {
        obj['StaffID'] = staffID
    }
    if (departmentID) {
        let staffIDs = []
        await mtblDMNhanvien(db).findAll({
            where: { IDBoPhan: departmentID }
        }).then(data => {
            data.forEach(item => {
                staffIDs.push(item.ID)
            })
        })
        obj['StaffID'] = { [Op.in]: staffIDs }
    }
    await tblRewardPunishmentRStaff.findAll({
        where: obj,
        include: [
            {
                model: mtblDMNhanvien(db),
                required: false,
                as: 'staff'
            },
        ],
    }).then(data => {
        data.forEach(item => {
            total += (item.SalaryIncrease ? item.SalaryIncrease : 0)
        })
    })
    return total
}

async function getObjDetailStaffFollowTime(db, staffID, date, year) {
    let objResult = {}
    let staff = await mtblDMNhanvien(db).findOne({
        where: { ID: staffID }
    })
    let totalStaff = await getRewardPunishmentByMonth(db, staffID, date, year)
    let array = []
    array.push(totalStaff)
    let arrayPercent = [100]
    objResult = {
        data: array,
        dataPercent: arrayPercent,
        label: staff ? staff.StaffName : '',
        stack: 'a',
    }
    return objResult
}
async function convertNumber(number) {
    if (number < 10) {
        return '0' + number
    } else
        return number
}

async function handleYearOrther(monthStart, yearStart, monthEnd, yearEnd, type = 'query') {
    let array = []
    let yearDifference = yearEnd - yearStart
    if (type == 'query') {
        if (yearDifference <= 0) {
            for (let month = monthStart; month <= monthEnd; month++) {
                array.push(yearStart + '-' + await convertNumber(month))
            }
        } else {
            if (yearDifference == 1) {
                for (let month = monthStart; month <= 12; month++) {
                    array.push(yearStart + '-' + await convertNumber(month))
                }
                for (let month = 1; month <= monthEnd; month++) {
                    array.push(yearEnd + '-' + await convertNumber(month))
                }
            } else {
                for (let month = monthStart; month <= 12; month++) {
                    array.push(yearStart + '-' + await convertNumber(month))
                }
                for (let year = 1; year <= yearDifference - 1; year++) {
                    for (let month = 1; month <= 12; month++) {
                        array.push((yearStart + year) + '-' + await convertNumber(month))
                    }
                }
                for (let month = 1; month <= monthEnd; month++) {
                    array.push(yearEnd + '-' + await convertNumber(month))
                }
            }
        }
    } else {
        if (yearDifference <= 0) {
            for (let month = monthStart; month <= monthEnd; month++) {
                array.push(await convertNumber(month) + '/' + yearStart)
            }
        } else {
            if (yearDifference == 1) {
                for (let month = monthStart; month <= 12; month++) {
                    array.push(await convertNumber(month) + '/' + yearStart)
                }
                for (let month = 1; month <= monthEnd; month++) {
                    array.push(await convertNumber(month) + '/' + yearEnd)
                }
            } else {
                for (let month = monthStart; month <= 12; month++) {
                    array.push(await convertNumber(month) + '/' + yearStart)
                }
                for (let year = 1; year <= yearDifference - 1; year++) {
                    for (let month = 1; month <= 12; month++) {
                        array.push(await convertNumber(month) + '/' + (yearStart + year))
                    }
                }
                for (let month = 1; month <= monthEnd; month++) {
                    array.push(await convertNumber(month) + '/' + yearEnd)
                }
            }
        }
    }

    return array
}




async function getByMonthSyntheticTimkeeping(db, staffID, monthYear, year, type, departmentID = null) {
    let total = 0;
    let tblTimeAttendanceSummary = mtblTimeAttendanceSummary(db);
    tblTimeAttendanceSummary.belongsTo(mtblDMNhanvien(db), { foreignKey: 'StaffID', sourceKey: 'StaffID', as: 'staff' })
    let obj = {}
    if (monthYear) {
        obj['Month'] = { [Op.substring]: monthYear }
    } else if (monthYear) {
        obj['Month'] = { [Op.substring]: year }
    }
    if (staffID) {
        obj['StaffID'] = staffID
    }
    if (departmentID) {
        let staffIDs = []
        await mtblDMNhanvien(db).findAll({
            where: { IDBoPhan: departmentID }
        }).then(data => {
            data.forEach(item => {
                staffIDs.push(item.ID)
            })
        })
        obj['StaffID'] = { [Op.in]: staffIDs }
    }
    await tblTimeAttendanceSummary.findAll({
        where: obj,
        order: [
            ['ID', 'DESC']
        ],
        include: [
            {
                model: mtblDMNhanvien(db),
                required: false,
                as: 'staff'
            },
        ],
    }).then(data => {
        data.forEach(item => {
            if (type == 'LateDay')
                total += (item.LateDay ? item.LateDay : 0)
            if (type == 'FreeBreak')
                total += (item.FreeBreak ? item.FreeBreak : 0)
            if (type == 'Overtime')
                total += (item.Overtime ? item.Overtime : 0)
        })
    })
    return total
}



module.exports = {
    // report_personnel_structure
    reportPersonnelStructure: async (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let obj = {}
                    let array1 = []
                    let array2 = []
                    let count1 = 0
                    let count2 = 0
                    await mtblDMBoPhan(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async department => {
                        for (let d = 0; d < department.length; d++) {
                            await mtblDMNhanvien(db).findAll({
                                where: {
                                    IDBoPhan: department[d].ID
                                }
                            }).then(async staff => {
                                let count = 0
                                if (body.dateStart) {
                                    var date = body.dateStart + '-30 07:00:00.000';
                                    for (let s = 0; s < staff.length; s++) {
                                        await mtblHopDongNhanSu(db).findOne({
                                            where: {
                                                IDNhanVien: staff[s].ID,
                                                Date: { [Op.lte]: date }
                                            },
                                            order: [
                                                ['ID', 'ASC']
                                            ],
                                        }).then(data => {
                                            if (data) {
                                                count += 1
                                            }
                                        })
                                    }
                                    array1.push({
                                        departmentName: department[d].DepartmentName ? department[d].DepartmentName : '',
                                        departmentCode: department[d].DepartmentCode ? department[d].DepartmentCode : '',
                                        numberEmployees: count,
                                    })
                                    count1 += count
                                }
                                if (body.dateEnd) {
                                    var dateEnd = body.dateEnd + '-30 07:00:00.000';
                                    for (let s = 0; s < staff.length; s++) {
                                        await mtblHopDongNhanSu(db).findOne({
                                            where: {
                                                IDNhanVien: staff[s].ID,
                                                Date: { [Op.lte]: dateEnd }
                                            },
                                            order: [
                                                ['ID', 'ASC']
                                            ],
                                        }).then(data => {
                                            if (data) {
                                                count += 1
                                            }
                                        })
                                    }
                                    array2.push({
                                        departmentName: department[d].DepartmentName ? department[d].DepartmentName : '',
                                        departmentCode: department[d].DepartmentCode ? department[d].DepartmentCode : '',
                                        numberEmployees: count,
                                    })
                                    count2 += count

                                }

                            })
                        }
                    })
                    var monthStart;
                    var dateStart;
                    if (body.dateStart) {
                        monthStart = Number(body.dateStart.slice(5, 7)); // January
                        dateStart = Number(body.dateStart.slice(0, 4));
                    }
                    var monthEnd;
                    var dateEnd;
                    if (body.dateEnd) {
                        monthEnd = Number(body.dateEnd.slice(5, 7)); // January
                        dateEnd = Number(body.dateEnd.slice(0, 4));
                    }
                    obj['array1'] = array1
                    obj['count1'] = count1
                    obj['dateStart'] = body.dateStart ? (await convertNumber(monthStart) + '/' + dateStart) : ''
                    obj['array2'] = array2
                    obj['count2'] = count2
                    obj['dateEnd'] = body.dateEnd ? (await convertNumber(monthEnd) + '/' + dateEnd) : ''
                    var result = {
                        obj: obj,
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
    // report_types_of_contracts
    reportTypesOfContracts: async (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let obj = {}
                    let array1 = []
                    let array2 = []
                    let count1 = 0
                    let count2 = 0
                    await mtblLoaiHopDong(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async contractType => {
                        for (let c = 0; c < contractType.length; c++) {
                            if (body.dateStart) {
                                let countInForce;
                                let countExpiredContract;
                                var date = body.dateStart + '-30 07:00:00.000';
                                countInForce = await mtblHopDongNhanSu(db).count({
                                    where: {
                                        IDLoaiHopDong: contractType[c].ID,
                                        Status: 'Có hiệu lực',
                                        ContractDateStart: { [Op.lte]: date },
                                        ContractDateEnd: { [Op.gte]: date }
                                    }
                                })
                                countExpiredContract = await mtblHopDongNhanSu(db).count({
                                    where: {
                                        IDLoaiHopDong: contractType[c].ID,
                                        Status: 'Hết hiệu lực',
                                        ContractDateStart: { [Op.gte]: date },
                                        ContractDateEnd: { [Op.lte]: date }
                                    }
                                })
                                count1 += (countInForce ? countInForce : 0)
                                array1.push({
                                    contractTypeName: contractType[c].TenLoaiHD ? contractType[c].TenLoaiHD : '',
                                    contractTypeCode: contractType[c].MaLoaiHD ? contractType[c].MaLoaiHD : '',
                                    numberOfContractsInForce: countInForce ? countInForce : 0,
                                    numberOfExpiredContracts: countExpiredContract ? countExpiredContract : 0,
                                })
                            }
                            if (body.dateEnd) {
                                let countInForce;
                                let countExpiredContract;
                                var date = body.dateEnd + '-30 07:00:00.000';
                                countInForce = await mtblHopDongNhanSu(db).count({
                                    where: {
                                        IDLoaiHopDong: contractType[c].ID,
                                        Status: 'Có hiệu lực',
                                        ContractDateStart: { [Op.lte]: date },
                                        ContractDateEnd: { [Op.gte]: date }
                                    }
                                })
                                countExpiredContract = await mtblHopDongNhanSu(db).count({
                                    where: {
                                        IDLoaiHopDong: contractType[c].ID,
                                        Status: 'Hết hiệu lực',
                                        ContractDateStart: { [Op.gte]: date },
                                        ContractDateEnd: { [Op.lte]: date }
                                    }
                                })
                                count2 += (countInForce ? countInForce : 0)
                                array2.push({
                                    contractTypeName: contractType[c].TenLoaiHD ? contractType[c].TenLoaiHD : '',
                                    contractTypeCode: contractType[c].MaLoaiHD ? contractType[c].MaLoaiHD : '',
                                    numberOfContractsInForce: countInForce ? countInForce : 0,
                                    numberOfExpiredContracts: countExpiredContract ? countExpiredContract : 0,
                                })
                            }
                        }
                    })
                    var monthStart;
                    var dateStart;
                    if (body.dateStart) {
                        monthStart = Number(body.dateStart.slice(5, 7)); // January
                        dateStart = Number(body.dateStart.slice(0, 4));
                    }
                    var monthEnd;
                    var dateEnd;
                    if (body.dateEnd) {
                        monthEnd = Number(body.dateEnd.slice(5, 7)); // January
                        dateEnd = Number(body.dateEnd.slice(0, 4));
                    }
                    obj['array1'] = array1
                    obj['count1'] = count1
                    obj['dateStart'] = body.dateStart ? (await convertNumber(monthStart) + '/' + dateStart) : ''
                    obj['array2'] = array2
                    obj['count2'] = count2
                    obj['dateEnd'] = body.dateEnd ? (await convertNumber(monthEnd) + '/' + dateEnd) : ''
                    var result = {
                        obj: obj,
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
    // report_salary_bonus_chart
    reportSalaryAndBonusChart: async (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var monthStart;
                    var dateStart;
                    if (body.dateStart) {
                        monthStart = Number(body.dateStart.slice(5, 7)); // January
                        dateStart = Number(body.dateStart.slice(0, 4));
                    }
                    var monthEnd;
                    var dateEnd;
                    if (body.dateEnd) {
                        monthEnd = Number(body.dateEnd.slice(5, 7)); // January
                        dateEnd = Number(body.dateEnd.slice(0, 4));
                    }
                    let obj = {};
                    let count1 = 0
                    let count2 = 0
                    let countSalary1 = 0
                    let countSalary2 = 0
                    let array1 = []
                    let array2 = []
                    await mtblDMBoPhan(db).findAll().then(async department => {
                        for (let d = 0; d < department.length; d++) {
                            if (body.dateStart) {
                                let totalSalary = await ctlBangLuong.getDetailPayrollForMonthYear(db, body.dateStart, department[d].ID)
                                let rewardPunishment = await totalRewardPunishment(db, body.dateStart, department[d].ID)
                                array1.push({
                                    departmentName: department[d].DepartmentName ? department[d].DepartmentName : '',
                                    totalSalary: Number(totalSalary.totalFooter.totalRealField),
                                    totalRewardPunishment: rewardPunishment,
                                })
                                countSalary1 += Number(totalSalary.totalFooter.totalRealField)
                                count1 += Number(rewardPunishment)
                            }
                            if (body.dateEnd) {
                                let totalSalary = await ctlBangLuong.getDetailPayrollForMonthYear(db, body.dateEnd, department[d].ID)
                                let rewardPunishment = await totalRewardPunishment(db, body.dateEnd, department[d].ID)
                                array2.push({
                                    departmentName: department[d].DepartmentName ? department[d].DepartmentName : '',
                                    totalSalary: Number(totalSalary.totalFooter.totalRealField),
                                    totalRewardPunishment: rewardPunishment,
                                })
                                countSalary2 += Number(totalSalary.totalFooter.totalRealField)
                                count2 += Number(rewardPunishment)
                            }
                        }
                        obj['array1'] = array1
                        obj['totalRewardPunishment1'] = count1
                        obj['countSalary1'] = countSalary1
                        obj['array2'] = array2
                        obj['totalRewardPunishment2'] = count2
                        obj['countSalary2'] = countSalary2
                        obj['dateStart'] = body.dateStart ? (await convertNumber(monthStart) + '/' + dateStart) : ''
                        obj['dateEnd'] = body.dateEnd ? (await convertNumber(monthEnd) + '/' + dateEnd) : ''
                    })
                    var result = {
                        obj: obj,
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
    // report_personnel_development
    reportPersonnelDevelopment: async (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let arrayResult = []
                    let arrayYear = []
                    if (!body.dateEnd) {
                        arrayYear.push(body.dateStart ? body.dateStart : '2021')
                        await mtblDMBoPhan(db).findAll().then(async department => {
                            for (let d = 0; d < department.length; d++) {
                                let array = []
                                let arrayPercent = []
                                let total = await numberStaffInYear(db, body.dateStart ? body.dateStart : '2021', null)
                                let obj = await numberStaffInYear(db, body.dateStart ? body.dateStart : '2021', department[d].ID)
                                array.push(obj)
                                total = (total != 0 ? total : 1)
                                arrayPercent.push(Math.round((obj / total) * 10000) / 100);
                                let objResult = {
                                    data: array,
                                    dataPercent: arrayPercent,
                                    label: department[d].DepartmentName ? department[d].DepartmentName : '',
                                    stack: 'a',
                                }
                                arrayResult.push(objResult)
                            }

                        })
                    } else {
                        for (let y = Number(body.dateStart); y <= Number(body.dateEnd); y++) {
                            arrayYear.push(y)
                        }
                        await mtblDMBoPhan(db).findAll().then(async department => {
                            for (let d = 0; d < department.length; d++) {
                                let array = []
                                let arrayPercent = []
                                for (let y = Number(body.dateStart); y <= Number(body.dateEnd); y++) {
                                    let obj = await numberStaffInYear(db, y, department[d].ID)
                                    let total = await numberStaffInYear(db, y, null)
                                    total = (total != 0 ? total : 1)
                                    arrayPercent.push(Math.round((obj / total) * 10000) / 100);
                                    array.push(obj)
                                }
                                let objResult = {
                                    data: array,
                                    dataPercent: arrayPercent,
                                    label: department[d].DepartmentName ? department[d].DepartmentName : '',
                                    stack: 'a',
                                }
                                arrayResult.push(objResult)
                            }
                        })
                    }
                    var result = {
                        arrayYear: arrayYear,
                        arrayResult: arrayResult,
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
    // report_types_of_contracts_column_chart
    reportTypesOfContractsColumnChart: async (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let arrayResult = []
                    let arrayYear = []
                    await mtblLoaiHopDong(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async contractType => {
                        if (!body.dateEnd && body.dateStart) {
                            arrayYear.push(body.dateStart)
                            var date = body.dateStart + '-12-30 07:00:00.000';
                            let total = await mtblHopDongNhanSu(db).count({
                                where: {
                                    IDLoaiHopDong: { [Op.ne]: null },
                                    Status: 'Có hiệu lực',
                                    ContractDateStart: { [Op.lte]: date },

                                }
                            })
                            for (let c = 0; c < contractType.length; c++) {
                                let array = []
                                let arrayPercent = []
                                let countInForce;
                                countInForce = await mtblHopDongNhanSu(db).count({
                                    where: {
                                        IDLoaiHopDong: contractType[c].ID,
                                        Status: 'Có hiệu lực',
                                        ContractDateStart: { [Op.lte]: date },

                                    }
                                })
                                countExpiredContract = await mtblHopDongNhanSu(db).count({
                                    where: {
                                        IDLoaiHopDong: contractType[c].ID,
                                        Status: 'Hết hiệu lực',
                                        ContractDateStart: { [Op.gte]: date },

                                    }
                                })
                                array.push(countInForce ? countInForce : 0)
                                arrayPercent.push(Math.round(countInForce / (total != 0 ? total : 1) * 10000) / 100)
                                let objResult = {
                                    // total: total,
                                    data: array,
                                    dataPercent: arrayPercent,
                                    label: contractType[c].TenLoaiHD ? contractType[c].TenLoaiHD : '',
                                    stack: 'a',
                                }
                                arrayResult.push(objResult)
                            }
                        } else if (body.dateEnd && body.dateStart) {
                            for (let year = Number(body.dateStart); year <= Number(body.dateEnd); year++) {
                                arrayYear.push(year)
                            }
                            for (let c = 0; c < contractType.length; c++) {
                                let array = []
                                let arrayPercent = []
                                for (let y = Number(body.dateStart); y <= Number(body.dateEnd); y++) {
                                    var date = y + '-12-30 07:00:00.000';
                                    let total = await mtblHopDongNhanSu(db).count({
                                        where: {
                                            IDLoaiHopDong: { [Op.ne]: null },
                                            Status: 'Có hiệu lực',
                                            ContractDateStart: { [Op.lte]: date },

                                        }
                                    })
                                    let countInForce;
                                    countInForce = await mtblHopDongNhanSu(db).count({
                                        where: {
                                            IDLoaiHopDong: contractType[c].ID,
                                            Status: 'Có hiệu lực',
                                            ContractDateStart: { [Op.lte]: date },

                                        }
                                    })
                                    countExpiredContract = await mtblHopDongNhanSu(db).count({
                                        where: {
                                            IDLoaiHopDong: contractType[c].ID,
                                            Status: 'Hết hiệu lực',
                                            ContractDateStart: { [Op.gte]: date },

                                        }
                                    })
                                    array.push(countInForce ? countInForce : 0)
                                    arrayPercent.push(Math.round(countInForce / (total != 0 ? total : 1) * 10000) / 100)
                                }
                                let objResult = {
                                    data: array,
                                    dataPercent: arrayPercent,
                                    label: contractType[c].TenLoaiHD ? contractType[c].TenLoaiHD : '',
                                    stack: 'a',
                                }
                                arrayResult.push(objResult)
                            }
                        }

                    })
                    var result = {
                        arrayYear: arrayYear,
                        arrayResult: arrayResult,
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
    // report_time_attendance_summary
    reportTimeAttendanceSummary: async (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let arrayResult = []
                    let arrayMonthYear = []
                    if (!body.monthEnd && body.monthStart) {
                        if (body.staffID) {
                            let monthStart = Number(body.monthStart.slice(5, 7)); // January
                            let yearStart = Number(body.monthStart.slice(0, 4));
                            arrayMonthYear.push(await convertNumber(monthStart) + '/' + yearStart)
                            let array = []
                            let arrayPercent = []
                            let staff = await mtblDMNhanvien(db).findOne({
                                where: { ID: body.staffID }
                            })
                            let totalStaff = await getByMonthSyntheticTimkeeping(db, staff.ID, body.monthStart, null, body.type)
                            let total = await getByMonthSyntheticTimkeeping(db, staff.ID, body.monthStart, null, body.type, null)
                            array.push(totalStaff)
                            arrayPercent.push(Math.round(totalStaff / (total != 0 ? total : 1) * 100))
                            let objResult = {
                                data: array,
                                dataPercent: arrayPercent,
                                label: staff ? staff.StaffName : '',
                                stack: 'a',
                            }
                            arrayResult.push(objResult)
                        } else {
                            let monthStart = Number(body.monthStart.slice(5, 7)); // January
                            let yearStart = Number(body.monthStart.slice(0, 4));
                            arrayMonthYear.push(await convertNumber(monthStart) + '/' + yearStart)
                            await mtblDMNhanvien(db).findAll({
                                where: { IDBoPhan: body.departmentID }
                            }).then(async staff => {
                                for (let s = 0; s < staff.length; s++) {
                                    let array = []
                                    let arrayPercent = []
                                    let totalStaff = await getByMonthSyntheticTimkeeping(db, staff[s].ID, body.monthStart, null, body.type)
                                    let total = await getByMonthSyntheticTimkeeping(db, null, body.monthStart, null, body.type, body.departmentID)
                                    array.push(totalStaff)
                                    arrayPercent.push(Math.round(totalStaff / (total != 0 ? total : 1) * 100))
                                    let objResult = {
                                        data: array,
                                        dataPercent: arrayPercent,
                                        label: staff[s] ? staff[s].StaffName : '',
                                        stack: 'a',
                                    }
                                    arrayResult.push(objResult)
                                }
                            })

                        }
                    } else if (body.monthEnd && body.monthStart) {
                        let monthStart = Number(body.monthStart.slice(5, 7)); // January
                        let yearStart = Number(body.monthStart.slice(0, 4)); // January
                        let monthEnd = Number(body.monthEnd.slice(5, 7));
                        let yearEnd = Number(body.monthEnd.slice(0, 4));
                        let arrayDistanceMonthYear = await handleYearOrther(monthStart, yearStart, monthEnd, yearEnd)
                        arrayMonthYear = await handleYearOrther(monthStart, yearStart, monthEnd, yearEnd, 'format')
                        if (body.staffID) {
                            let array = []
                            let arrayPercent = []
                            for (let month = 0; month < arrayDistanceMonthYear.length; month++) {
                                let totalStaff = await getByMonthSyntheticTimkeeping(db, body.staffID, arrayDistanceMonthYear[month], null, body.type)
                                array.push(totalStaff)
                                arrayPercent.push(100)
                            }
                            let staff = await mtblDMNhanvien(db).findOne({
                                where: { ID: body.staffID }
                            })
                            let objResult = {
                                data: array,
                                dataPercent: arrayPercent,
                                label: staff ? staff.StaffName : '',
                                stack: 'a',
                            }
                            arrayResult.push(objResult)
                        } else {
                            let monthStart = Number(body.monthStart.slice(5, 7)); // January
                            let yearStart = Number(body.monthStart.slice(0, 4)); // January
                            let monthEnd = Number(body.monthEnd.slice(5, 7));
                            let yearEnd = Number(body.monthEnd.slice(0, 4));
                            let arrayDistanceMonthYear = await handleYearOrther(monthStart, yearStart, monthEnd, yearEnd)
                            arrayMonthYear = await handleYearOrther(monthStart, yearStart, monthEnd, yearEnd, 'format')
                            await mtblDMNhanvien(db).findAll({
                                where: { IDBoPhan: body.departmentID }
                            }).then(async staff => {
                                for (let s = 0; s < staff.length; s++) {
                                    let array = []
                                    let arrayPercent = []
                                    for (let month = 0; month < arrayDistanceMonthYear.length; month++) {
                                        let totalStaff = await getByMonthSyntheticTimkeeping(db, staff[s].ID, arrayDistanceMonthYear[month], null, body.type)
                                        let total = await getByMonthSyntheticTimkeeping(db, null, arrayDistanceMonthYear[month], null, body.type, body.departmentID)
                                        array.push(totalStaff)
                                        arrayPercent.push(Math.round(totalStaff / (total != 0 ? total : 1) * 100))
                                    }
                                    let objResult = {
                                        data: array,
                                        dataPercent: arrayPercent,
                                        label: staff[s].StaffName,
                                        stack: 'a',
                                    }
                                    arrayResult.push(objResult)
                                }
                            })
                        }
                    }
                    var result = {
                        arrayResult: arrayResult,
                        arrayMonthYear: arrayMonthYear,
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
    // report_reward_punishment
    reportRewardPunishment: async (req, res) => {
        let body = req.body;
        body = JSON.parse(body.obj)
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let arrayResult = []
                    let arrayMonthYear = []
                    if (!body.monthEnd && body.monthStart) {
                        if (body.staffID) {
                            let monthStart = Number(body.monthStart.slice(5, 7)); // January
                            let yearStart = Number(body.monthStart.slice(0, 4));
                            arrayMonthYear.push(await convertNumber(monthStart) + '/' + yearStart)
                            let objResult = await getObjDetailStaffFollowTime(db, body.staffID, body.monthStart, null)
                            arrayResult.push(objResult)
                        } else {
                            let monthStart = Number(body.monthStart.slice(5, 7)); // January
                            let yearStart = Number(body.monthStart.slice(0, 4));
                            arrayMonthYear.push(await convertNumber(monthStart) + '/' + yearStart)
                            await mtblDMNhanvien(db).findAll({
                                where: { IDBoPhan: body.departmentID }
                            }).then(async staff => {
                                for (let s = 0; s < staff.length; s++) {
                                    let array = []
                                    let arrayPercent = []
                                    let totalStaff = await getRewardPunishmentByMonth(db, staff[s].ID, body.monthStart, null)
                                    let total = await getRewardPunishmentByMonth(db, null, body.monthStart, null, body.departmentID)
                                    array.push(totalStaff)
                                    arrayPercent.push(Math.round(totalStaff / (total != 0 ? total : 1) * 100))
                                    let objResult = {
                                        data: array,
                                        dataPercent: arrayPercent,
                                        label: staff[s] ? staff[s].StaffName : '',
                                        stack: 'a',
                                    }
                                    arrayResult.push(objResult)
                                }
                            })

                        }
                    } else if (body.monthEnd && body.monthStart) {
                        let monthStart = Number(body.monthStart.slice(5, 7)); // January
                        let yearStart = Number(body.monthStart.slice(0, 4)); // January
                        let monthEnd = Number(body.monthEnd.slice(5, 7));
                        let yearEnd = Number(body.monthEnd.slice(0, 4));
                        let arrayDistanceMonthYear = await handleYearOrther(monthStart, yearStart, monthEnd, yearEnd)
                        arrayMonthYear = await handleYearOrther(monthStart, yearStart, monthEnd, yearEnd, 'format')
                        if (body.staffID) {
                            let array = []
                            let arrayPercent = []
                            for (let month = 0; month < arrayDistanceMonthYear.length; month++) {
                                let totalStaff = await getRewardPunishmentByMonth(db, body.staffID, arrayDistanceMonthYear[month], null)
                                array.push(totalStaff)
                                arrayPercent.push(100)
                            }
                            let staff = await mtblDMNhanvien(db).findOne({
                                where: { ID: body.staffID }
                            })
                            let objResult = {
                                data: array,
                                dataPercent: arrayPercent,
                                label: staff ? staff.StaffName : '',
                                stack: 'a',
                            }
                            arrayResult.push(objResult)
                        } else {
                            let monthStart = Number(body.monthStart.slice(5, 7)); // January
                            let yearStart = Number(body.monthStart.slice(0, 4)); // January
                            let monthEnd = Number(body.monthEnd.slice(5, 7));
                            let yearEnd = Number(body.monthEnd.slice(0, 4));
                            let arrayDistanceMonthYear = await handleYearOrther(monthStart, yearStart, monthEnd, yearEnd)
                            arrayMonthYear = await handleYearOrther(monthStart, yearStart, monthEnd, yearEnd, 'format')
                            await mtblDMNhanvien(db).findAll({
                                where: { IDBoPhan: body.departmentID }
                            }).then(async staff => {
                                for (let s = 0; s < staff.length; s++) {
                                    let array = []
                                    let arrayPercent = []
                                    for (let month = 0; month < arrayDistanceMonthYear.length; month++) {
                                        let totalStaff = await getRewardPunishmentByMonth(db, staff[s].ID, arrayDistanceMonthYear[month], null)
                                        let total = await getRewardPunishmentByMonth(db, null, arrayDistanceMonthYear[month], null, body.departmentID)
                                        array.push(totalStaff)
                                        arrayPercent.push(Math.round(totalStaff / (total != 0 ? total : 1) * 100))
                                    }
                                    let objResult = {
                                        data: array,
                                        dataPercent: arrayPercent,
                                        label: staff[s].StaffName,
                                        stack: 'a',
                                    }
                                    arrayResult.push(objResult)
                                }
                            })
                        }
                    } else if (!body.yearEnd && body.yearStart) {
                        if (body.staffID) {
                            arrayMonthYear.push(body.yearStart)
                            let objResult = await getObjDetailStaffFollowTime(db, body.staffID, null, body.yearStart)
                            arrayResult.push(objResult)
                        } else {
                            arrayMonthYear.push(body.yearStart)
                            await mtblDMNhanvien(db).findAll({
                                where: { IDBoPhan: body.departmentID }
                            }).then(async staff => {
                                for (let s = 0; s < staff.length; s++) {
                                    let array = []
                                    let arrayPercent = []
                                    let totalStaff = await getRewardPunishmentByMonth(db, staff[s].ID, null, body.yearStart)
                                    let total = await getRewardPunishmentByMonth(db, null, null, body.yearStart, body.departmentID)
                                    array.push(totalStaff)
                                    arrayPercent.push(Math.round(totalStaff / (total != 0 ? total : 1) * 100))
                                    let objResult = {
                                        data: array,
                                        dataPercent: arrayPercent,
                                        label: staff[s] ? staff[s].StaffName : '',
                                        stack: 'a',
                                    }
                                    arrayResult.push(objResult)
                                }
                            })

                        }
                    } else if (body.yearEnd && body.yearStart) {
                        if (body.staffID) {
                            let array = []
                            let arrayPercent = []
                            for (let year = Number(body.yearStart); year <= Number(body.yearEnd); year++) {
                                arrayMonthYear.push(year)
                                let totalStaff = await getRewardPunishmentByMonth(db, body.staffID, null, year)
                                array.push(totalStaff)
                                arrayPercent.push(100)
                            }
                            let staff = await mtblDMNhanvien(db).findOne({
                                where: { ID: body.staffID }
                            })
                            let objResult = {
                                data: array,
                                dataPercent: arrayPercent,
                                label: staff ? staff.StaffName : '',
                                stack: 'a',
                            }
                            arrayResult.push(objResult)
                        } else {
                            await mtblDMNhanvien(db).findAll({
                                where: { IDBoPhan: body.departmentID }
                            }).then(async staff => {
                                for (let year = Number(body.yearStart); year <= Number(body.yearEnd); year++) {
                                    arrayMonthYear.push(year)

                                }
                                for (let s = 0; s < staff.length; s++) {
                                    let array = []
                                    let arrayPercent = []
                                    for (let year = Number(body.yearStart); year <= Number(body.yearEnd); year++) {
                                        let totalStaff = await getRewardPunishmentByMonth(db, staff[s].ID, null, year)
                                        let total = await getRewardPunishmentByMonth(db, null, null, year, body.departmentID)
                                        array.push(totalStaff)
                                        arrayPercent.push(Math.round(totalStaff / (total != 0 ? total : 1) * 100))
                                    }
                                    let objResult = {
                                        data: array,
                                        dataPercent: arrayPercent,
                                        label: staff[s].StaffName,
                                        stack: 'a',
                                    }
                                    arrayResult.push(objResult)
                                }
                            })
                        }
                    }
                    var result = {
                        arrayResult: arrayResult,
                        arrayMonthYear: arrayMonthYear,
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
    // report_salary_fund
    reportSalaryFund: async (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let arrayResult = []
                    let arrayMonthYear = []
                    if (!body.dateEnd && body.dateStart) {
                        arrayMonthYear.push(body.dateStart)
                        await mtblDMBoPhan(db).findAll().then(async department => {
                            for (let d = 0; d < department.length; d++) {
                                let total = 0;
                                let array = []
                                for (let month = 1; month < 12; month++) {
                                    let result = await ctlBangLuong.getDetailPayrollForMonthYear(db, body.dateStart + '-' + await convertNumber(month), department[d].ID)
                                    total += Number(result.totalFooter.totalRealField)
                                }
                                array.push(total)
                                let objResult = {
                                    data: array,
                                    label: department[d].DepartmentName,
                                    stack: 'a',
                                }
                                arrayResult.push(objResult)
                            }
                        })
                    } else if (body.dateEnd && body.dateStart) {
                        arrayMonthYear.push(body.dateStart)
                        arrayMonthYear.push(body.dateEnd)
                        await mtblDMBoPhan(db).findAll().then(async department => {
                            for (let d = 0; d < department.length; d++) {
                                let array = []
                                for (let year = Number(body.dateStart); year <= Number(body.dateEnd); year++) {
                                    let total = 0;
                                    for (let month = 1; month < 12; month++) {
                                        let result = await ctlBangLuong.getDetailPayrollForMonthYear(db, year + '-' + await convertNumber(month), department[d].ID)
                                        total += Number(result.totalFooter.totalRealField)
                                    }
                                    array.push(total)
                                }
                                let objResult = {
                                    data: array,
                                    label: department[d].DepartmentName,
                                    stack: 'a',
                                }
                                arrayResult.push(objResult)
                            }
                        })
                    }
                    let total = []
                    let length = arrayResult[0].data.length ? arrayResult[0].data.length : 0
                    for (let d = 0; d < length; d++) {
                        let totalNumber = 0
                        for (let a = 0; a < arrayResult.length; a++) {
                            totalNumber += arrayResult[a].data[d]
                        }
                        total.push(totalNumber)
                    }
                    for (let d = 0; d < arrayResult.length; d++) {
                        let dataPercent = []
                        for (let i = 0; i < arrayResult[d].data.length; i++) {
                            dataPercent.push((arrayResult[d].data[i] / total[i] * 100) ? (Math.round((arrayResult[d].data[i] / total[i] * 100) * 100) / 100) : 0)
                        }
                        arrayResult[d]['dataPercent'] = dataPercent
                    }
                    var result = {
                        arrayResult: arrayResult,
                        arrayMonthYear: arrayMonthYear,
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