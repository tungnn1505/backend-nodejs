const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblVanPhongPham = require('../tables/qlnb/tblVanPhongPham')
var mThemVPPChiTiet = require('../tables/qlnb/ThemVPPChiTiet');
var mtblPhanPhoiVPP = require('../tables/qlnb/tblPhanPhoiVPP')
var mtblThemVPP = require('../tables/qlnb/tblThemVPP')
var mtblPhanPhoiVPPChiTiet = require('../tables/qlnb/tblPhanPhoiVPPChiTiet')
var mtblTaiSan = require('../tables/qlnb/tblTaiSan')
var mtblTaiSanADD = require('../tables/qlnb/tblTaiSanADD')
var mtblDMHangHoa = require('../tables/qlnb/tblDMHangHoa');
var mtblDMLoaiTaiSan = require('../tables/qlnb/tblDMLoaiTaiSan');
var database = require('../database');

async function getOpeningBalance(db, idVPP, dateFrom) {
    var result = 0;
    var array = [];
    await mtblThemVPP(db).findAll({
        where: {
            Date: {
                [Op.lte]: dateFrom
            }
        }
    }).then(data => {
        data.forEach(element => {
            array.push(element.ID);
        });
    })
    await mThemVPPChiTiet(db).findAll({
        where: {
            [Op.and]: [
                { IDVanPhongPham: idVPP },
                {
                    IDThemVPP: {
                        [Op.in]: array
                    }
                }
            ]
        }
    }).then(detail => {
        detail.forEach(item => {
            result += item.Amount ? item.Amount : 0;
        })
    })
    await mtblPhanPhoiVPP(db).findAll({
        where: {
            Date: {
                [Op.lte]: dateFrom
            }
        }
    }).then(data => {
        data.forEach(element => {
            array.push(element.ID);
        });
    })
    await mtblPhanPhoiVPPChiTiet(db).findAll({
        where: {
            [Op.and]: [
                { IDVanPhongPham: idVPP },
                {
                    IDPhanPhoiVPP: {
                        [Op.in]: array
                    }
                }
            ]
        }
    }).then(detail => {
        detail.forEach(item => {
            result -= item.Amount ? item.Amount : 0;
        })
    })
    return result;
}

async function getDuringBalance(db, idVPP, dateFrom, dateTo) {
    dateTo = moment(dateTo).add(30, 'hour').format('YYYY-MM-DD HH:mm:ss.SSS');
    dateFrom = moment(dateFrom).add(7, 'hour').format('YYYY-MM-DD HH:mm:ss.SSS');
    console.log(dateTo, dateFrom);
    var result = 0;
    var array = [];
    await mtblThemVPP(db).findAll({
        where: {
            Date: {
                [Op.between]: [dateFrom, dateTo]
            }
        }
    }).then(data => {
        data.forEach(element => {
            array.push(element.ID);
        });
    })
    await mThemVPPChiTiet(db).findAll({
        where: {
            [Op.and]: [
                { IDVanPhongPham: idVPP },
                {
                    IDThemVPP: {
                        [Op.in]: array
                    }
                }
            ]
        }
    }).then(detail => {
        detail.forEach(item => {
            result += item.Amount ? item.Amount : 0;
        })
    })
    return result;
}
async function getOutputPeriod(db, idVPP, dateFrom, dateTo) {
    // dateFrom = moment(dateFrom).add(31, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS');
    dateTo = moment(dateTo).add(30, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS');
    dateFrom = moment(dateFrom).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS');
    console.log(dateFrom, dateTo);
    var result = 0;
    var array = [];
    await mtblPhanPhoiVPP(db).findAll({
        where: {
            Date: {
                [Op.between]: [dateFrom, dateTo]
            }
        }
    }).then(data => {
        data.forEach(element => {
            array.push(element.ID);
        });
    })
    await mtblPhanPhoiVPPChiTiet(db).findAll({
        where: {
            [Op.and]: [
                { IDVanPhongPham: idVPP },
                {
                    IDPhanPhoiVPP: {
                        [Op.in]: array
                    }
                }
            ]
        }
    }).then(detail => {
        detail.forEach(item => {
            result += item.Amount ? item.Amount : 0;
        })
    })
    return result;
}
async function getTheLastDayOfTheMonth(year, month) {
    var date = new Date(year, month, 0);
    var dateFinal = Number(date.toISOString().slice(8, 10))
    dateFinal += 1
    return dateFinal
}
async function calculateTheAverageDepreciationForEachMonthOfTheFirstYear(time, dateAssetDepreciation, originalPrice) {
    objGoods = {}
    let yearAsset = Number(moment(dateAssetDepreciation).format('YYYY'))
    let monthAsset = Number(moment(dateAssetDepreciation).format('MM'))
    let dateAsset = Number(moment(dateAssetDepreciation).format('DD'))
    let lastDayOfTheMonth = await getTheLastDayOfTheMonth(yearAsset, monthAsset)
    let monthlyDepreciationRate = Math.round(originalPrice / time) // mức khấu hao tháng = nguyên giá / thời gian khấu hao
    if (dateAsset == 1) {
        for (var onDay = 1; onDay < monthAsset; onDay++) {
            objGoods['discountedValue' + onDay] = 0
        }
        for (var onDay = monthAsset; onDay <= 12; onDay++) {
            objGoods['discountedValue' + onDay] = monthlyDepreciationRate
        }
        objGoods['totalAnnualDepreciation'] = Math.round(originalPrice / time)
        objGoods['note'] = 0
        objGoods['accumulatedDepreciation'] = 0
        objGoods['residualValue'] = originalPrice
        objGoods['accumulatedDepreciationEndYear'] = Math.round(originalPrice / time)
        objGoods['yearEndResidualValue'] = Math.round(originalPrice - (originalPrice / time))
    } else {
        let discountedValueDepreciationStartMonth = 0; // giá trị tháng bắt đầu khấu hao
        discountedValueDepreciationStartMonth = Math.round((monthlyDepreciationRate / lastDayOfTheMonth) * (lastDayOfTheMonth - dateAsset + 1)) // số ngày = số ngày của tháng - ngày khấu hao của tài sản + 1
        objGoods['discountedValue' + monthAsset] = discountedValueDepreciationStartMonth
        objGoods['note'] = discountedValueDepreciationStartMonth
        for (var underDay = 1; underDay < monthAsset; underDay++) {
            objGoods['discountedValue' + underDay] = 0
        }
        for (var onDay = (monthAsset + 1); onDay <= 12; onDay++) {
            objGoods['discountedValue' + onDay] = monthlyDepreciationRate
        }

        let depreciationOfTheRemainingMonths = 0 // Mức khấu hao trung bình của các tháng còn lại
        depreciationOfTheRemainingMonths = Math.round((12 - monthAsset) * (originalPrice / time))
        let totalDepreciationOfTheFirstYear = 0 // tổng khấu hao của năm đầu tiên
        totalDepreciationOfTheFirstYear = Math.round(depreciationOfTheRemainingMonths + discountedValueDepreciationStartMonth)
        objGoods['totalAnnualDepreciation'] = Math.round(totalDepreciationOfTheFirstYear)
        objGoods['note'] = discountedValueDepreciationStartMonth
        let accumulatedDepreciation = 0 // lũy kế đầu năm
        residualValue = originalPrice - accumulatedDepreciation
        accumulatedDepreciationEndYear = accumulatedDepreciation + objGoods['totalAnnualDepreciation']
        yearEndResidualValue = originalPrice - accumulatedDepreciationEndYear
        objGoods['accumulatedDepreciation'] = accumulatedDepreciation
        objGoods['residualValue'] = residualValue
        objGoods['accumulatedDepreciationEndYear'] = accumulatedDepreciationEndYear
        objGoods['yearEndResidualValue'] = yearEndResidualValue
    }
    return objGoods
}
async function calculateDepreciationForTheFollowingYears(year, time, dateAssetDepreciation, originalPrice) {
    let objGoods = {}
    let yearAsset = Number(moment(dateAssetDepreciation).format('YYYY'))
    let monthAsset = Number(moment(dateAssetDepreciation).format('MM'))
    let dateAsset = Number(moment(dateAssetDepreciation).format('DD'))
    let monthlyDepreciationRate = Math.round(originalPrice / time) // mức khấu hao tháng = nguyên giá / thời gian khấu hao
    let firstYearObj = {}
    firstYearObj = await calculateTheAverageDepreciationForEachMonthOfTheFirstYear(time, dateAssetDepreciation, originalPrice)
    let totalAnnualDepreciation = Math.round(originalPrice / time * 12) // tổng khấu hao hàng tháng
    objGoods['discountedValue1'] = monthlyDepreciationRate
    objGoods['discountedValue2'] = monthlyDepreciationRate
    objGoods['discountedValue3'] = monthlyDepreciationRate
    objGoods['discountedValue4'] = monthlyDepreciationRate
    objGoods['discountedValue5'] = monthlyDepreciationRate
    objGoods['discountedValue6'] = monthlyDepreciationRate
    objGoods['discountedValue7'] = monthlyDepreciationRate
    objGoods['discountedValue8'] = monthlyDepreciationRate
    objGoods['discountedValue9'] = monthlyDepreciationRate
    objGoods['discountedValue10'] = monthlyDepreciationRate
    objGoods['discountedValue11'] = monthlyDepreciationRate
    objGoods['discountedValue12'] = monthlyDepreciationRate
    objGoods['totalAnnualDepreciation'] = totalAnnualDepreciation
    let accumulatedDepreciation = firstYearObj['accumulatedDepreciationEndYear']
    let accumulatedDepreciationEndYear = 0
    let yearEndResidualValue = 0
    let residualValue = 0
    for (y = (yearAsset + 1); y <= year; y++) {
        if (y > (yearAsset + 1))
            accumulatedDepreciation = accumulatedDepreciationEndYear
        accumulatedDepreciationEndYear = accumulatedDepreciation + totalAnnualDepreciation
        yearEndResidualValue = originalPrice - accumulatedDepreciationEndYear
        if (((y - yearAsset) * 12 - monthAsset + 12) >= time) {
            let balance = 0 // số tháng dư
            //  lấy số tháng dư trừ 1 để lấy số tháng còn lại của năm sau
            balance = (12 - (((y - yearAsset) * 12 - monthAsset + 12) - time))
            for (month = 1; month < balance; month++) {
                objGoods['discountedValue' + month] = monthlyDepreciationRate
            }
            // let lastMonth = await getTheLastDayOfTheMonth(yearAsset, monthAsset - 1)
            objGoods['discountedValue' + balance] = originalPrice / time - firstYearObj['note']
            for (month = balance + 1; month <= 12; month++) {
                objGoods['discountedValue' + month] = 0
            }
            let totalAnnualDepreciation = 0
            totalAnnualDepreciation = (monthlyDepreciationRate * (balance - 1) + originalPrice - accumulatedDepreciation - monthlyDepreciationRate * (balance - 1))
            accumulatedDepreciationEndYear = originalPrice
            yearEndResidualValue = originalPrice - accumulatedDepreciationEndYear
            objGoods['totalAnnualDepreciation'] = Math.round(totalAnnualDepreciation)

        }
    }
    residualValue = originalPrice - accumulatedDepreciation
    objGoods['accumulatedDepreciation'] = accumulatedDepreciation
    objGoods['accumulatedDepreciationEndYear'] = accumulatedDepreciationEndYear
    objGoods['yearEndResidualValue'] = yearEndResidualValue
    objGoods['residualValue'] = residualValue
    return objGoods
}
async function getDetailAsset(db, idGoods, goodsName, year) {
    let arrayResult = []
    let tblTaiSan = mtblTaiSan(db);
    tblTaiSan.belongsTo(mtblTaiSanADD(db), { foreignKey: 'IDTaiSanADD', sourceKey: 'IDTaiSanADD', as: 'asset' })
    await tblTaiSan.findAll({
        where: {
            IDDMHangHoa: idGoods,
            depreciationDate: {
                [Op.ne]: null
            }
        },
        include: [{
            model: mtblTaiSanADD(db),
            required: false,
            as: 'asset'
        },],
    }).then(async asset => {
        let stt = 1;
        for (let s = 0; s < asset.length; s++) {
            let objGoods = {}
            let originalPrice = asset[s].DepreciationPrice ? asset[s].DepreciationPrice : 0
            let time = asset[s].GuaranteeMonth ? asset[s].GuaranteeMonth : 0
            let yearAsset = Number(moment(asset[s].DepreciationDate).format('YYYY'))
            let monthAsset = Number(moment(asset[s].DepreciationDate).format('MM'))
            objGoods['discountedValue1'] = 0
            objGoods['discountedValue2'] = 0
            objGoods['discountedValue3'] = 0
            objGoods['discountedValue4'] = 0
            objGoods['discountedValue5'] = 0
            objGoods['discountedValue6'] = 0
            objGoods['discountedValue7'] = 0
            objGoods['discountedValue8'] = 0
            objGoods['discountedValue9'] = 0
            objGoods['discountedValue10'] = 0
            objGoods['discountedValue11'] = 0
            objGoods['discountedValue12'] = 0
            objGoods['totalAnnualDepreciation'] = 0
            objGoods['accumulatedDepreciation'] = 0
            objGoods['residualValue'] = 0
            objGoods['accumulatedDepreciationEndYear'] = 0
            objGoods['yearEndResidualValue'] = 0
            if (year == yearAsset) {
                objGoods = await calculateTheAverageDepreciationForEachMonthOfTheFirstYear(time, asset[s].DepreciationDate, originalPrice)
            }
            if (year > yearAsset) {
                if (((year - 1 - yearAsset) * 12 + (12 - monthAsset) - time) < 0)
                    objGoods = await calculateDepreciationForTheFollowingYears(year, time, asset[s].DepreciationDate, originalPrice)
            }
            objGoods['stt'] = stt
            objGoods['assetName'] = goodsName
            objGoods['assetCode'] = asset[s].TSNBCode ? asset[s].TSNBCode : ''
            objGoods['date'] = asset[s].asset ? moment(asset[s].DepreciationDate).format('DD/MM/YYYY') : ''
            objGoods['originalPrice'] = originalPrice
            objGoods['time'] = time
            objGoods['isTypeAsset'] = false
            arrayResult.push(objGoods)
            stt += 1
        }
    })
    return arrayResult
}

async function getInfoAssetFromIDTypeAsset(db, typeAssetID, year) {
    let arrayResult = []
    await mtblDMHangHoa(db).findAll({
        where: { IDDMLoaiTaiSan: typeAssetID }
    }).then(async goods => {
        for (var g = 0; g < goods.length; g++) {
            let arrayAsset = await getDetailAsset(db, goods[g].ID, goods[g].Name, year)
            // console.log(arrayAsset);
            Array.prototype.push.apply(arrayResult, arrayAsset);
        }

    })
    return arrayResult
}

module.exports = {
    // report
    report: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let stt = 1;
                    mtblVanPhongPham(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            var openingBalance = 0;
                            var closingBalance = 0;
                            var duringBalance = 0;
                            var outputPeriod = 0;
                            if (body.dateFrom && body.dateTo) {
                                openingBalance = await getOpeningBalance(db, data[i].ID, body.dateFrom);
                                duringBalance = await getDuringBalance(db, data[i].ID, body.dateFrom, body.dateTo);
                                outputPeriod = await getOutputPeriod(db, data[i].ID, body.dateFrom, body.dateTo);
                                closingBalance = Number(openingBalance) + Number(duringBalance) - Number(outputPeriod);
                            }
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                vppCode: data[i].VPPCode ? data[i].VPPCode : '',
                                vppName: data[i].VPPName ? data[i].VPPName : '',
                                unit: data[i].Unit ? data[i].Unit : null,
                                openingBalance: openingBalance,
                                closingBalance: closingBalance,
                                duringBalance: duringBalance,
                                outputPeriod: outputPeriod,
                            }
                            array.push(obj);
                            stt += 1;
                        }
                        var count = await mtblVanPhongPham(db).count()
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
    // depreciation_table
    depreciationTable: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblDMLoaiTaiSan(db).findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async typeAsset => {
                        let array = [];
                        let objTotal = {}
                        let originalPriceTotal = 0
                        let accumulatedDepreciationTotal = 0
                        let timeTotal = 0
                        let residualValueTotal = 0
                        let discountedValue1Total = 0
                        let discountedValue2Total = 0
                        let discountedValue3Total = 0
                        let discountedValue4Total = 0
                        let discountedValue5Total = 0
                        let discountedValue6Total = 0
                        let discountedValue7Total = 0
                        let discountedValue8Total = 0
                        let discountedValue9Total = 0
                        let discountedValue10Total = 0
                        let discountedValue11Total = 0
                        let discountedValue12Total = 0
                        let totalAnnualDepreciationTotal = 0
                        let accumulatedDepreciationEndYearTotal = 0
                        let yearEndResidualValueTotal = 0
                        for (var detailAcsset = 0; detailAcsset < typeAsset.length; detailAcsset++) {
                            let arrayAsset = await getInfoAssetFromIDTypeAsset(db, typeAsset[detailAcsset].ID, body.year)
                            if (arrayAsset.length > 0) {
                                let obj = {}
                                let totalOriginalPrice = 0
                                let totalTime = 0
                                let totalAccumulatedDepreciation = 0
                                let totalResidualValue = 0
                                let totalDiscountedValue1 = 0
                                let totalDiscountedValue2 = 0
                                let totalDiscountedValue3 = 0
                                let totalDiscountedValue4 = 0
                                let totalDiscountedValue5 = 0
                                let totalDiscountedValue6 = 0
                                let totalDiscountedValue7 = 0
                                let totalDiscountedValue8 = 0
                                let totalDiscountedValue9 = 0
                                let totalDiscountedValue10 = 0
                                let totalDiscountedValue11 = 0
                                let totalDiscountedValue12 = 0
                                let totalAnnualDepreciation = 0
                                let totalAccumulatedDepreciationEndYear = 0
                                let totalyearEndResidualValue = 0
                                let stt = 1
                                for (let asset = 0; asset < arrayAsset.length; asset++) {
                                    arrayAsset[asset]['stt'] = stt
                                    stt += 1
                                    totalOriginalPrice += arrayAsset[asset].originalPrice
                                    totalTime += arrayAsset[asset].time
                                    totalAccumulatedDepreciation += arrayAsset[asset].accumulatedDepreciation
                                    totalResidualValue += arrayAsset[asset].residualValue
                                    totalDiscountedValue1 += arrayAsset[asset].discountedValue1
                                    totalDiscountedValue2 += arrayAsset[asset].discountedValue2
                                    totalDiscountedValue3 += arrayAsset[asset].discountedValue3
                                    totalDiscountedValue4 += arrayAsset[asset].discountedValue4
                                    totalDiscountedValue5 += arrayAsset[asset].discountedValue5
                                    totalDiscountedValue6 += arrayAsset[asset].discountedValue6
                                    totalDiscountedValue7 += arrayAsset[asset].discountedValue7
                                    totalDiscountedValue8 += arrayAsset[asset].discountedValue8
                                    totalDiscountedValue9 += arrayAsset[asset].discountedValue9
                                    totalDiscountedValue10 += arrayAsset[asset].discountedValue10
                                    totalDiscountedValue11 += arrayAsset[asset].discountedValue11
                                    totalDiscountedValue12 += arrayAsset[asset].discountedValue12
                                    totalAnnualDepreciation += arrayAsset[asset].totalAnnualDepreciation
                                    totalAccumulatedDepreciationEndYear += arrayAsset[asset].accumulatedDepreciationEndYear
                                    totalyearEndResidualValue += arrayAsset[asset].yearEndResidualValue
                                }
                                obj['assetName'] = typeAsset[detailAcsset].Name
                                obj['assetCode'] = typeAsset[detailAcsset].Code
                                obj['originalPrice'] = totalOriginalPrice
                                obj['time'] = totalTime
                                obj['accumulatedDepreciation'] = totalAccumulatedDepreciation
                                obj['residualValue'] = totalResidualValue
                                obj['discountedValue1'] = totalDiscountedValue1
                                obj['discountedValue2'] = totalDiscountedValue2
                                obj['discountedValue3'] = totalDiscountedValue3
                                obj['discountedValue4'] = totalDiscountedValue4
                                obj['discountedValue5'] = totalDiscountedValue5
                                obj['discountedValue6'] = totalDiscountedValue6
                                obj['discountedValue7'] = totalDiscountedValue7
                                obj['discountedValue8'] = totalDiscountedValue8
                                obj['discountedValue9'] = totalDiscountedValue9
                                obj['discountedValue10'] = totalDiscountedValue10
                                obj['discountedValue11'] = totalDiscountedValue11
                                obj['discountedValue12'] = totalDiscountedValue12
                                obj['totalAnnualDepreciation'] = totalAnnualDepreciation
                                obj['accumulatedDepreciationEndYear'] = totalAccumulatedDepreciationEndYear
                                obj['yearEndResidualValue'] = totalyearEndResidualValue
                                obj['isTypeAsset'] = true
                                arrayAsset.unshift(obj)

                                // Tình tổng cộng
                                originalPriceTotal += totalOriginalPrice
                                timeTotal += totalTime
                                residualValueTotal += totalResidualValue
                                accumulatedDepreciationTotal += totalAccumulatedDepreciation
                                discountedValue1Total += totalDiscountedValue1
                                discountedValue2Total += totalDiscountedValue2
                                discountedValue3Total += totalDiscountedValue3
                                discountedValue4Total += totalDiscountedValue4
                                discountedValue5Total += totalDiscountedValue5
                                discountedValue6Total += totalDiscountedValue6
                                discountedValue7Total += totalDiscountedValue7
                                discountedValue8Total += totalDiscountedValue8
                                discountedValue9Total += totalDiscountedValue9
                                discountedValue10Total += totalDiscountedValue10
                                discountedValue11Total += totalDiscountedValue11
                                discountedValue12Total += totalDiscountedValue12
                                totalAnnualDepreciationTotal += totalAnnualDepreciation
                                accumulatedDepreciationEndYearTotal += totalAccumulatedDepreciationEndYear
                                yearEndResidualValueTotal += totalyearEndResidualValue
                                Array.prototype.push.apply(array, arrayAsset);
                            }

                        }
                        objTotal['originalPriceTotal'] = originalPriceTotal
                        objTotal['timeTotal'] = timeTotal
                        objTotal['residualValueTotal'] = residualValueTotal
                        objTotal['accumulatedDepreciationTotal'] = accumulatedDepreciationTotal
                        objTotal['discountedValue1Total'] = discountedValue1Total
                        objTotal['discountedValue2Total'] = discountedValue2Total
                        objTotal['discountedValue3Total'] = discountedValue3Total
                        objTotal['discountedValue4Total'] = discountedValue4Total
                        objTotal['discountedValue5Total'] = discountedValue5Total
                        objTotal['discountedValue6Total'] = discountedValue6Total
                        objTotal['discountedValue7Total'] = discountedValue7Total
                        objTotal['discountedValue8Total'] = discountedValue8Total
                        objTotal['discountedValue9Total'] = discountedValue9Total
                        objTotal['discountedValue10Total'] = discountedValue10Total
                        objTotal['discountedValue11Total'] = discountedValue11Total
                        objTotal['discountedValue12Total'] = discountedValue12Total
                        objTotal['totalAnnualDepreciationTotal'] = totalAnnualDepreciationTotal
                        objTotal['accumulatedDepreciationEndYearTotal'] = accumulatedDepreciationEndYearTotal
                        objTotal['yearEndResidualValueTotal'] = yearEndResidualValueTotal
                        var result = {
                            total: objTotal,
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
}