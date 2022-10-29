const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDMGiaDinh = require('../tables/hrmanage/tblDMGiaDinh')
var database = require('../database');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');

async function deleteRelationshiptblDMGiaDinh(db, listID) {
    await mtblDMGiaDinh(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblDMGiaDinh,
    //  get_detail_tbl_dmgiadinh
    detailtblDMGiaDinh: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblDMGiaDinh = mtblDMGiaDinh(db);
                    tblDMGiaDinh.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'employee' })
                    tblDMGiaDinh.findOne({
                        where: { ID: body.id },
                        include: [
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'employee'
                            },
                        ],
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                idNhanVien: data.IDNhanVien ? data.IDNhanVien : null,
                                nameNhanVien: data.IDNhanVien ? data.employee.StaffName : null,
                                relationship: data.Relationship ? data.Relationship : '',
                                name: data.Name ? data.Name : '',
                                birthday: data.Birthday ? element.Birthday : null,
                                gender: data.Gender ? data.Gender : '',
                                cmndNumber: data.CMNDNumber ? data.CMNDNumber : '',
                                address: data.Address ? data.Address : '',
                                workplace: data.Workplace ? data.Workplace : '',
                                reduce: data.Reduce ? data.Reduce : '',
                                phone: data.Phone ? data.Phone : '',
                            }
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
    // add_tbl_dmgiadinh
    addtblDMGiaDinh: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMGiaDinh(db).create({
                        IDNhanVien: body.idNhanVien ? body.idNhanVien : null,
                        Relationship: body.relationship ? body.relationship : '',
                        Name: body.name ? body.name : '',
                        Birthday: body.birthday ? body.birthday : null,
                        Gender: body.gender ? body.gender : '',
                        CMNDNumber: body.cmndNumber ? body.cmndNumber : '',
                        Address: body.address ? body.address : '',
                        Workplace: body.workplace ? body.workplace : '',
                        Reduce: body.reduce ? body.reduce : '',
                        Phone: body.phone ? body.phone : '',
                    }).then(data => {
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
    // update_tbl_dmgiadinh
    updatetblDMGiaDinh: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.idNhanVien || body.idNhanVien === '') {
                        if (body.idNhanVien === '')
                            update.push({ key: 'IDNhanVien', value: null });
                        else
                            update.push({ key: 'IDNhanVien', value: body.idNhanVien });
                    }
                    if (body.relationship || body.relationship === '')
                        update.push({ key: 'Relationship', value: body.relationship });
                    if (body.name || body.name === '')
                        update.push({ key: 'Name', value: body.name });
                    if (body.birthday || body.birthday === '') {
                        if (body.birthday === '')
                            update.push({ key: 'Birthday', value: null });
                        else
                            update.push({ key: 'Birthday', value: body.birthday });
                    }
                    if (body.gender || body.gender === '')
                        update.push({ key: 'Gender', value: body.gender });
                    if (body.phone || body.phone === '')
                        update.push({ key: 'Phone', value: body.phone });
                    if (body.cmndNumber || body.cmndNumber === '')
                        update.push({ key: 'CMNDNumber', value: body.cmndNumber });
                    if (body.address || body.address === '')
                        update.push({ key: 'Address', value: body.address });
                    if (body.workplace || body.workplace === '')
                        update.push({ key: 'Workplace', value: body.workplace });
                    if (body.reduce || body.reduce === '')
                        update.push({ key: 'Reduce', value: body.reduce });
                    database.updateTable(update, mtblDMGiaDinh(db), body.id).then(response => {
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
    // delete_tbl_dmgiadinh
    deletetblDMGiaDinh: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDMGiaDinh(db, listID);
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
    // get_list_tbl_dmgiadinh
    getListtblDMGiaDinh: (req, res) => {
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
                    let tblDMGiaDinh = mtblDMGiaDinh(db);
                    tblDMGiaDinh.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'employee' })
                    tblDMGiaDinh.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: { IDNhanVien: body.idNhanVien },
                        include: [
                            {
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'employee'
                            },
                        ],
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                idNhanVien: element.IDNhanVien ? element.IDNhanVien : null,
                                nameNhanVien: element.IDNhanVien ? element.employee.StaffName : null,
                                relationship: element.Relationship ? element.Relationship : '',
                                name: element.Name ? element.Name : '',
                                birthday: element.Birthday ? moment(element.Birthday).format('DD/MM/YYYY') : null,
                                gender: element.Gender ? element.Gender : '',
                                cmndNumber: element.CMNDNumber ? element.CMNDNumber : '',
                                address: element.Address ? element.Address : '',
                                workplace: element.Workplace ? element.Workplace : '',
                                reduce: element.Reduce ? element.Reduce : '',
                                phone: element.Phone ? element.Phone : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblDMGiaDinh(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_dmgiadinh
    getListNametblDMGiaDinh: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMGiaDinh(db).findAll().then(data => {
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
    },
}