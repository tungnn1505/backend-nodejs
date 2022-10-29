const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblMucDongBaoHiem = require('../tables/hrmanage/tblMucDongBaoHiem')
var database = require('../database');
var mtblMinWageConfig = require('../tables/hrmanage/tblMinWageConfig')

async function deleteRelationshiptblMucDongBaoHiem(db, listID) {
    await mtblMucDongBaoHiem(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}
async function convertNumber(number) {
    if (number < 10) {
        return '0' + number
    } else
        return number
}
module.exports = {
    deleteRelationshiptblMucDongBaoHiem,
    // add_tbl_mucdong_baohiem
    addtblMucDongBaoHiem: async (req, res) => {
        let body = req.body;
        console.log(body);
        var year = Number(body.applicableDate.slice(3, 7)); // January
        var month = Number(body.applicableDate.slice(0, 2));
        let applicableDate = null
        if (body.applicableDate)
            applicableDate = year + '-' + await convertNumber(month) + '-' + '01';
        let date = year + '-' + await convertNumber(month) + '-' + '01';
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let check = await mtblMucDongBaoHiem(db).findOne({
                        where: {
                            ApplicableDate: { [Op.gte]: date }
                        }
                    })
                    if (!check)
                        mtblMucDongBaoHiem(db).create({
                            CompanyBHXH: body.companyBHXH ? body.companyBHXH : null,
                            CompanyBHYT: body.companyBHYT ? body.companyBHYT : null,
                            CompanyBHTN: body.companyBHTN ? body.companyBHTN : null,
                            StaffUnion: body.union ? body.union : null,
                            StaffBHXH: body.staffBHXH ? body.staffBHXH : null,
                            StaffBHTNLD: body.staffBHTNLD ? body.staffBHTNLD : null,
                            StaffBHYT: body.staffBHYT ? body.staffBHYT : null,
                            StaffBHTN: body.staffBHTN ? body.staffBHTN : null,
                            DateStart: body.dateStart ? body.dateStart : null,
                            DateEnd: body.dateEnd ? body.dateEnd : null,
                            ApplicableDate: applicableDate,
                        }).then(data => {
                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: Constant.MESSAGE.ACTION_SUCCESS,
                            }
                            res.json(result);
                        })
                    else {
                        var result = {
                            status: Constant.STATUS.FAIL,
                            message: 'Đã cấu hình mức đóng bảo hiểm của tháng ' + body.applicableDate + '. Vui lòng kiểm tra lại!',
                        }
                        res.json(result);
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
    // update_tbl_mucdong_baohiem
    updatetblMucDongBaoHiem: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.applicableDate || body.applicableDate === '') {
                        if (body.applicableDate === '')
                            update.push({ key: 'ApplicableDate', value: null });
                        else {
                            var year = Number(body.applicableDate.slice(3, 7)); // January
                            var month = Number(body.applicableDate.slice(0, 2));
                            let applicableDate = year + '-' + await convertNumber(month) + '-' + '01';
                            update.push({ key: 'ApplicableDate', value: applicableDate });

                        }
                    }
                    if (body.companyBHXH || body.companyBHXH === '') {
                        if (body.companyBHXH === '')
                            update.push({ key: 'CompanyBHXH', value: null });
                        else
                            update.push({ key: 'CompanyBHXH', value: body.companyBHXH });
                    }
                    if (body.staffBHTNLD || body.staffBHTNLD === '') {
                        if (body.staffBHTNLD === '')
                            update.push({ key: 'StaffBHTNLD', value: null });
                        else
                            update.push({ key: 'StaffBHTNLD', value: body.staffBHTNLD });
                    }
                    if (body.companyBHYT || body.companyBHYT === '') {
                        if (body.companyBHYT === '')
                            update.push({ key: 'CompanyBHYT', value: null });
                        else
                            update.push({ key: 'CompanyBHYT', value: body.companyBHYT });
                    }
                    if (body.companyBHTN || body.companyBHTN === '') {
                        if (body.companyBHTN === '')
                            update.push({ key: 'CompanyBHTN', value: null });
                        else
                            update.push({ key: 'CompanyBHTN', value: body.companyBHTN });
                    }
                    if (body.staffBHXH || body.staffBHXH === '') {
                        if (body.staffBHXH === '')
                            update.push({ key: 'StaffBHXH', value: null });
                        else
                            update.push({ key: 'StaffBHXH', value: body.staffBHXH });
                    }
                    if (body.staffBHYT || body.staffBHYT === '') {
                        if (body.staffBHYT === '')
                            update.push({ key: 'StaffBHYT', value: null });
                        else
                            update.push({ key: 'StaffBHYT', value: body.staffBHYT });
                    }
                    if (body.staffBHTN || body.staffBHTN === '') {
                        if (body.staffBHTN === '')
                            update.push({ key: 'StaffBHTN', value: null });
                        else
                            update.push({ key: 'StaffBHTN', value: body.staffBHTN });
                    }
                    if (body.dateStart || body.dateStart === '') {
                        if (body.dateStart === '')
                            update.push({ key: 'DateStart', value: null });
                        else
                            update.push({ key: 'DateStart', value: body.dateStart });
                    }
                    if (body.dateEnd || body.dateEnd === '') {
                        if (body.dateEnd === '')
                            update.push({ key: 'DateEnd', value: null });
                        else
                            update.push({ key: 'DateEnd', value: body.dateEnd });
                    }
                    if (body.union || body.union === '') {
                        if (body.union === '')
                            update.push({ key: 'StaffUnion', value: 0 });
                        else
                            update.push({ key: 'StaffUnion', value: body.union });
                    }
                    database.updateTable(update, mtblMucDongBaoHiem(db), body.id).then(response => {
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
    // delete_tbl_mucdong_baohiem
    deletetblMucDongBaoHiem: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblMucDongBaoHiem(db, listID);
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
    // get_list_tbl_mucdong_baohiem
    getListtblMucDongBaoHiem: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    if (body.dataSearch) {
                        // var data = JSON.parse(body.dataSearch)

                        // if (data.search) {
                        //     where = [
                        //         { FullName: { [Op.like]: '%' + data.search + '%' } },
                        //         { Address: { [Op.like]: '%' + data.search + '%' } },
                        //         { CMND: { [Op.like]: '%' + data.search + '%' } },
                        //         { EmployeeCode: { [Op.like]: '%' + data.search + '%' } },
                        //     ];
                        // } else {
                        //     where = [
                        //         { FullName: { [Op.ne]: '%%' } },
                        //     ];
                        // }
                        // whereOjb = { [Op.or]: where };
                        // if (data.items) {
                        //     for (var i = 0; i < data.items.length; i++) {
                        //         let userFind = {};
                        //         if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                        //             userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                        //             if (data.items[i].conditionFields['name'] == 'And') {
                        //                 whereOjb[Op.and] = userFind
                        //             }
                        //             if (data.items[i].conditionFields['name'] == 'Or') {
                        //                 whereOjb[Op.or] = userFind
                        //             }
                        //             if (data.items[i].conditionFields['name'] == 'Not') {
                        //                 whereOjb[Op.not] = userFind
                        //             }
                        //         }
                        //     }
                        // }
                    }
                    let stt = 1;
                    mtblMucDongBaoHiem(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                companyBHXH: element.CompanyBHXH ? element.CompanyBHXH : 0,
                                companyBHYT: element.CompanyBHYT ? element.CompanyBHYT : 0,
                                companyBHTN: element.CompanyBHTN ? element.CompanyBHTN : 0,
                                union: element.StaffUnion ? element.StaffUnion : 0,
                                staffBHTNLD: element.StaffBHTNLD ? element.StaffBHTNLD : 0,
                                staffBHXH: element.StaffBHXH ? element.StaffBHXH : 0,
                                staffBHYT: element.StaffBHYT ? element.StaffBHYT : 0,
                                staffBHTN: element.StaffBHTN ? element.StaffBHTN : 0,
                                dateStart: element.DateStart ? moment(element.DateStart).format('MM/YYYY') : null,
                                dateEnd: element.DateEnd ? moment(element.DateEnd).format('MM/YYYY') : null,
                                applicableDate: element.ApplicableDate ? moment(element.ApplicableDate).format('MM/YYYY') : null,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblMucDongBaoHiem(db).count({ where: whereOjb, })
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
    // update_minimum_wage
    updateMinimumWage: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                await mtblMucDongBaoHiem(db).update({
                    MinimumWage: body.minimumWage ? body.minimumWage : null,
                }, {
                    where: {
                        ID: {
                            [Op.ne]: null
                        }
                    }
                })
                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                }
                res.json(result);
            }
        })
    },
    // get_minimum_wage
    getMinimumWage: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                let where = {}
                if (body.date) {
                    let month = Number(body.date.slice(5, 7)); // January
                    let year = Number(body.date.slice(0, 4));
                    let minimumWageDate = moment(year + '-' + await convertNumber(month + 1) + '-01').add(7, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS')
                    where = {
                        StartDate: {
                            [Op.lte]: minimumWageDate
                        }
                    }
                }
                var minimumWage = await mtblMinWageConfig(db).findOne({
                    order: [
                        ['ID', 'DESC']
                    ],
                    where: where,
                })
                var result = {
                    minimumWage: minimumWage ? minimumWage.MinimumWage ? minimumWage.MinimumWage : 0 : 0,
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                }
                res.json(result);
            }
        })
    }
}