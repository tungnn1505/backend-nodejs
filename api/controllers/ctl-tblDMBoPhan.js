const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblDMChiNhanh = require('../tables/constants/tblDMChiNhanh')
var mtblTaiSanBanGiao = require('../tables/qlnb/tblTaiSanBanGiao')
var mtblPhanPhoiVPP = require('../tables/qlnb/tblPhanPhoiVPP')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblYeuCauMuaSam = require('../tables/qlnb/tblYeuCauMuaSam')

var database = require('../database');
async function deleteRelationshiptblDMBoPhan(db, listID) {
    await mtblYeuCauMuaSam(db).update({
        IDPhongBan: null,
    }, { where: { IDPhongBan: { [Op.in]: listID } } })
    await mtblDMNhanvien(db).update({
        IDBoPhan: null,
    }, { where: { IDBoPhan: { [Op.in]: listID } } })
    await mtblTaiSanBanGiao(db).update({
        IDBoPhanSoHuu: null,
    }, { where: { IDBoPhanSoHuu: { [Op.in]: listID } } })
    await mtblPhanPhoiVPP(db).update({
        IDBoPhanSoHuu: null,
    }, { where: { IDBoPhanSoHuu: { [Op.in]: listID } } })
    await mtblDMBoPhan(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblDMBoPhan,
    // add_tbl_dm_bophan
    addtblDMBoPhan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let check = await mtblDMBoPhan(db).findOne({
                        where: [{ DepartmentCode: body.departmentCode }]
                    })
                    if (!check)
                        mtblDMBoPhan(db).create({
                            DepartmentCode: body.departmentCode ? body.departmentCode : '',
                            DepartmentName: body.departmentName ? body.departmentName : '',
                            IDChiNhanh: body.idChiNhanh ? body.idChiNhanh : null,
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
                            message: "Mã này đã tồn tại. Vui lòng kiểm tra lại",
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
    // update_tbl_dm_bophan
    updatetblDMBoPhan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    let check = await mtblDMBoPhan(db).findOne({
                        where: [{ DepartmentCode: body.departmentCode }]
                    })
                    if (check) {
                        if (check.ID != body.id) {
                            var result = {
                                status: Constant.STATUS.FAIL,
                                message: "Mã này đã tồn tại. Vui lòng kiểm tra lại",
                            }
                            return res.json(result);
                        }

                    }
                    if (body.departmentCode || body.departmentCode === '')
                        update.push({ key: 'DepartmentCode', value: body.departmentCode });
                    if (body.departmentName || body.departmentName === '')
                        update.push({ key: 'DepartmentName', value: body.departmentName });
                    if (body.idChiNhanh || body.idChiNhanh === '') {
                        if (body.idChiNhanh === '')
                            update.push({ key: 'IDChiNhanh', value: null });
                        else
                            update.push({ key: 'IDChiNhanh', value: body.idChiNhanh });
                    }
                    database.updateTable(update, mtblDMBoPhan(db), body.id).then(response => {
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
    // delete_tbl_dm_bophan
    deletetblDMBoPhan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDMBoPhan(db, listID);
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
    // get_list_tbl_dm_bophan
    getListtblDMBoPhan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            var list = [];
                            await mtblDMChiNhanh(db).findAll({
                                where: {
                                    [Op.or]: [
                                        { BranchCode: { [Op.like]: '%' + data.search + '%' } },
                                        { BranchName: { [Op.like]: '%' + data.search + '%' } }
                                    ]
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    list.push(Number(item.ID));
                                })
                            })
                            where = [
                                { DepartmentCode: { [Op.like]: '%' + data.search + '%' } },
                                { DepartmentName: { [Op.like]: '%' + data.search + '%' } },
                                { IDChiNhanh: { [Op.in]: list } },
                            ];
                        } else {
                            where = [
                                { DepartmentCode: { [Op.ne]: '%%' } },
                            ];
                        }
                        whereOjb = {
                            [Op.and]: [{ [Op.or]: where }],
                            [Op.or]: [{ ID: { [Op.ne]: null } }],
                        };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'MÃ PHÒNG BAN/BỘ PHẬN') {
                                    userFind['DepartmentCode'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                                if (data.items[i].fields['name'] === 'TÊN PHÒNG BAN/BỘ PHẬN') {
                                    userFind['DepartmentName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                                if (data.items[i].fields['name'] === 'CHI NHÁNH') {
                                    userFind['IDChiNhanh'] = { [Op.eq]: data.items[i]['searchFields'] }
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
                    var stt = 1;
                    let tblDMBoPhan = mtblDMBoPhan(db);
                    tblDMBoPhan.belongsTo(mtblDMChiNhanh(db), { foreignKey: 'IDChiNhanh', sourceKey: 'IDChiNhanh', as: 'chinhanh' })
                    tblDMBoPhan.findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [
                            {
                                model: mtblDMChiNhanh(db),
                                required: false,
                                as: 'chinhanh'
                            },
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                departmentCode: element.DepartmentCode ? element.DepartmentCode : '',
                                departmentName: element.DepartmentName ? element.DepartmentName : '',
                                branchID: element.IDChiNhanh ? Number(element.IDChiNhanh) : null,
                                branchName: element.IDChiNhanh ? element.chinhanh.BranchName : null,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblDMBoPhan(db).count({ where: whereOjb, })
                        var result = {
                            array: array,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                            count: count
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
    // get_list_name_tbl_dm_bophan
    getListNametblDMBoPhan: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblDMBoPhan = mtblDMBoPhan(db);
                    tblDMBoPhan.belongsTo(mtblDMChiNhanh(db), { foreignKey: 'IDChiNhanh', sourceKey: 'IDChiNhanh', as: 'chinhanh' })
                    tblDMBoPhan.findAll({
                        include: [
                            {
                                model: mtblDMChiNhanh(db),
                                required: false,
                                as: 'chinhanh'
                            },
                        ],
                    }).then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                departmentName: element.DepartmentName ? element.DepartmentName : '',
                                branchID: element.IDChiNhanh ? element.IDChiNhanh : null,
                                branchName: element.IDChiNhanh ? element.chinhanh.BranchName : '',
                                displayName: (element.DepartmentName ? element.DepartmentName : '') + ' - ' + (element.IDChiNhanh ? element.chinhanh.BranchName : ''),
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

}