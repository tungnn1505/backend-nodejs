const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDecidedInsuranceSalary = require('../tables/hrmanage/tblDecidedInsuranceSalary')
var database = require('../database');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblMinWageConfig = require('../tables/hrmanage/tblMinWageConfig')

async function deleteRelationshiptblDecidedInsuranceSalary(db, listID) {
    await mtblDecidedInsuranceSalary(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}
module.exports = {
    deleteRelationshiptblDecidedInsuranceSalary,
    //  get_detail_tbl_decided_insurance_salary
    detailtblDecidedInsuranceSalary: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblDecidedInsuranceSalary = mtblDecidedInsuranceSalary(db);
                    tblDecidedInsuranceSalary.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDStaff', sourceKey: 'IDStaff', as: 'staff' })
                    tblDecidedInsuranceSalary.findAll({
                        where: { IDStaff: body.staffID },
                        include: [{
                            model: mtblDMNhanvien(db),
                            required: false,
                            as: 'staff'
                        },],
                    }).then(data => {
                        if (data) {
                            var array = [];
                            data.forEach(element => {
                                var obj = {
                                    // stt: stt,
                                    id: Number(element.ID),
                                    name: element.Name ? element.Name : '',
                                    idStaff: element.IDStaff ? element.IDStaff : null,
                                    staffName: element.IDStaff ? element.staff.StaffName : null,
                                    startDate: element.StartDate ? moment(element.StartDate).format('DD/MM/YYYY') : null,
                                    endDate: element.EndDate ? moment(element.EndDate).format('DD/MM/YYYY') : null,
                                    increase: element.Increase ? element.Increase : null,
                                    coefficient: element.Coefficient ? element.Coefficient : null,
                                }
                                array.push(obj);
                            });
                            var result = {
                                array: array,
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
    // add_tbl_decided_insurance_salary
    addtblDecidedInsuranceSalary: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let check;
                    if (body.name) {
                        check = await mtblDecidedInsuranceSalary(db).findOne({
                            where: { Name: body.name }
                        })
                    }
                    if (!check) {
                        if (body.idStaff && body.coefficient)
                            await mtblDMNhanvien(db).update({
                                CoefficientsSalary: body.coefficient
                            }, { where: { ID: body.idStaff } })
                        mtblDecidedInsuranceSalary(db).create({
                            IDStaff: body.idStaff ? body.idStaff : null,
                            Name: body.name ? body.name : '',
                            StartDate: body.startDate ? body.startDate : null,
                            EndDate: body.endDate ? body.endDate : null,
                            Increase: body.increase ? body.increase : null,
                            Coefficient: body.coefficient ? body.coefficient : null,
                        }).then(data => {
                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: Constant.MESSAGE.ACTION_SUCCESS,
                            }
                            res.json(result);
                        })
                    } else {
                        var result = {
                            status: Constant.STATUS.FAIL,
                            message: 'Tên quyết đinh ' + body.name + ' đã tồn tại.',
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
    // update_tbl_decided_insurance_salary
    updatetblDecidedInsuranceSalary: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.idStaff && body.coefficient)
                        await mtblDMNhanvien(db).update({
                            CoefficientsSalary: body.coefficient
                        }, { where: { ID: body.idStaff } })
                    if (body.name || body.name === '')
                        update.push({ key: 'Name', value: body.name });
                    if (body.idStaff || body.idStaff === '') {
                        if (body.idStaff === '')
                            update.push({ key: 'IDStaff', value: null });
                        else
                            update.push({ key: 'IDStaff', value: body.idStaff });
                    }
                    if (body.startDate || body.startDate === '') {
                        if (body.startDate === '')
                            update.push({ key: 'StartDate', value: null });
                        else
                            update.push({ key: 'StartDate', value: body.startDate });
                    }
                    if (body.endDate || body.endDate === '') {
                        if (body.endDate === '')
                            update.push({ key: 'EndDate', value: null });
                        else
                            update.push({ key: 'EndDate', value: body.endDate });
                    }
                    if (body.increase || body.increase === '') {
                        if (body.increase === '')
                            update.push({ key: 'Increase', value: null });
                        else
                            update.push({ key: 'Increase', value: body.increase });
                    }
                    if (body.coefficient || body.coefficient === '') {
                        if (body.coefficient === '')
                            update.push({ key: 'Coefficient', value: null });
                        else
                            update.push({ key: 'Coefficient', value: body.coefficient });
                    }
                    database.updateTable(update, mtblDecidedInsuranceSalary(db), body.id).then(response => {
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
    // delete_tbl_decided_insurance_salary
    deletetblDecidedInsuranceSalary: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDecidedInsuranceSalary(db, listID);
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
    // get_list_tbl_decided_insurance_salary
    getListtblDecidedInsuranceSalary: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    var minimumWage = 0;
                    await mtblMinWageConfig(db).findOne({
                        order: [
                            ['ID', 'DESC']
                        ]
                    }).then(data => {
                        minimumWage = data.MinimumWage
                    })
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)
                        var listStaff = [];
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
                                listStaff.push(item.ID);
                            })
                        })
                        if (data.search) {
                            where = [{
                                Name: {
                                    [Op.like]: '%' + data.search + '%'
                                }
                            },
                            {
                                IDStaff: {
                                    [Op.in]: listStaff
                                }
                            },
                            ];
                        } else {
                            where = [{
                                Name: {
                                    [Op.ne]: '%%'
                                }
                            },];
                        }
                        whereOjb = {
                            [Op.and]: [{
                                [Op.or]: where
                            }],
                            [Op.or]: [{
                                ID: {
                                    [Op.ne]: null
                                }
                            }],
                        };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'TÊN QUYẾT ĐỊNH') {
                                    userFind['Name'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'TỪ NGÀY') {
                                    let startDate = moment(data.items[i]['startDate']).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss')
                                    let endDate = moment(data.items[i]['endDate']).add(23 + 7, 'hours').format('YYYY-MM-DD HH:mm:ss')
                                    userFind['StartDate'] = {
                                        [Op.between]: [startDate, endDate]
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'ĐẾN NGÀY') {
                                    let startDate = moment(data.items[i]['startDate']).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss')
                                    let endDate = moment(data.items[i]['endDate']).add(23 + 7, 'hours').format('YYYY-MM-DD HH:mm:ss')
                                    userFind['EndDate'] = {
                                        [Op.between]: [startDate, endDate]
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'HỆ SỐ') {
                                    let array = []
                                    array.push(data.items[i].value1)
                                    array.push(data.items[i].value2)
                                    array.sort(function (a, b) { return a - b });
                                    userFind['Coefficient'] = { [Op.between]: array }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'MỨC LƯƠNG') {
                                    let max = (data.items[i].value1 > data.items[i].value2) ? data.items[i].value1 : data.items[i].value2
                                    let min = (data.items[i].value1 < data.items[i].value2) ? data.items[i].value1 : data.items[i].value2
                                    var listYCMS = [];
                                    let query = `SELECT * FROM [tblDecidedInsuranceSalary] AS [tblDecidedInsuranceSalary] WHERE [tblDecidedInsuranceSalary].[Coefficient] * ` + minimumWage + ` BETWEEN '` + min + `' AND '` + max + `';`
                                    console.log(query);
                                    let dataResult = await db.query(query)
                                    for (let item of dataResult[0]) {
                                        listYCMS.push(item.ID)
                                    }
                                    userFind['ID'] = {
                                        [Op.in]: listYCMS
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                                if (data.items[i].fields['name'] === 'NHÂN VIÊN') {
                                    userFind['IDStaff'] = data.items[i]['searchFields']
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or].push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                            }
                        }
                    }
                    let stt = 1;
                    let tblDecidedInsuranceSalary = mtblDecidedInsuranceSalary(db);
                    tblDecidedInsuranceSalary.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDStaff', sourceKey: 'IDStaff', as: 'staff' })
                    tblDecidedInsuranceSalary.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        order: [
                            ['ID', 'DESC']
                        ],
                        include: [{
                            model: mtblDMNhanvien(db),
                            required: false,
                            as: 'staff'
                        },],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            let salary = (element.Coefficient ? element.Coefficient : 0) * minimumWage
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                name: element.Name ? element.Name : '',
                                idStaff: element.IDStaff ? element.IDStaff : null,
                                staffName: element.IDStaff ? element.staff.StaffName : null,
                                startDate: element.StartDate ? moment(element.StartDate).format('DD/MM/YYYY') : null,
                                endDate: element.EndDate ? moment(element.EndDate).format('DD/MM/YYYY') : null,
                                increase: element.Increase ? element.Increase : null,
                                coefficient: element.Coefficient ? element.Coefficient : null,
                                salary: salary,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblDecidedInsuranceSalary(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_decided_insurance_salary
    getListNametblDecidedInsuranceSalary: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDecidedInsuranceSalary(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                name: element.Name ? element.Name : '',
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
    }
}