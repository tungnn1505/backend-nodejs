const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblNghiLe = require('../tables/hrmanage/tblNghiLe')
var mtblLoaiChamCong = require('../tables/hrmanage/tblLoaiChamCong')
var database = require('../database');
async function deleteRelationshiptblNghiLe(db, listID) {
    await mtblNghiLe(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblNghiLe,
    //  get_detail_tbl_nghile
    detailtblNghiLe: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblNghiLe = mtblNghiLe(db);
                    tblNghiLe.belongsTo(mtblLoaiChamCong(db), { foreignKey: 'IDLoaiChamCong', sourceKey: 'IDLoaiChamCong', as: 'loaiChamCong' })

                    tblNghiLe.findOne(
                        {
                            where: { ID: body.id },
                            include: [
                                {
                                    model: mtblLoaiChamCong(db),
                                    required: false,
                                    as: 'loaiChamCong'
                                },
                            ],
                            order: [
                                ['ID', 'DESC']
                            ],
                        }
                    ).then(data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                nameHoliday: data.NameHoliday,
                                nameLoaiChamCong: data.loaiChamCong ? data.loaiChamCong.Name : '',
                                codeLoaiChamCong: data.loaiChamCong ? data.loaiChamCong.Code : '',
                                describe: data.Describe ? data.Describe : '',
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
    // add_tbl_nghile
    addtblNghiLe: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblNghiLe(db).create({
                        IDLoaiChamCong: body.idLoaiChamCong ? body.idLoaiChamCong : null,
                        DateStartHoliday: body.dateStartHoliday ? body.dateStartHoliday : null,
                        DateEndHoliday: body.dateEndHoliday ? body.dateEndHoliday : null,
                        NameHoliday: body.nameHoliday ? body.nameHoliday : '',
                        // Describe: body.describe ? body.describe : '',
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
    // update_tbl_nghile
    updatetblNghiLe: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.idLoaiChamCong || body.idLoaiChamCong === '') {
                        if (body.idLoaiChamCong === '')
                            update.push({ key: 'IDLoaiChamCong', value: null });
                        else
                            update.push({ key: 'IDLoaiChamCong', value: body.idLoaiChamCong });
                    }
                    if (body.dateStartHoliday || body.dateStartHoliday === '') {
                        if (body.dateStartHoliday === '')
                            update.push({ key: 'DateStartHoliday', value: null });
                        else
                            update.push({ key: 'DateStartHoliday', value: body.dateStartHoliday });
                    }
                    if (body.dateEndHoliday || body.dateEndHoliday === '') {
                        if (body.dateEndHoliday === '')
                            update.push({ key: 'DateEndHoliday', value: null });
                        else
                            update.push({ key: 'DateEndHoliday', value: body.dateEndHoliday });
                    }
                    if (body.nameHoliday || body.nameHoliday === '')
                        update.push({ key: 'NameHoliday', value: body.nameHoliday });
                    if (body.describe || body.describe === '')
                        update.push({ key: 'Describe', value: body.describe });

                    database.updateTable(update, mtblNghiLe(db), body.id).then(response => {
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
    // delete_tbl_nghile
    deletetblNghiLe: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblNghiLe(db, listID);
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
    // get_list_tbl_nghile
    getListtblNghiLe: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            var list = [];
                            await mtblLoaiChamCong(db).findAll({
                                order: [
                                    ['ID', 'DESC']
                                ],
                                where: {
                                    [Op.or]: [
                                        { Code: { [Op.like]: '%' + data.search + '%' } },
                                        { Name: { [Op.like]: '%' + data.search + '%' } }
                                    ]
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    list.push(item.ID);
                                })
                            })
                            console.log(list);
                            where = [
                                { IDLoaiChamCong: { [Op.in]: list } },
                            ];
                        } else {
                            where = [
                                { ID: { [Op.ne]: null } },
                            ];
                        }
                        whereOjb = {
                            [Op.and]: [{ [Op.or]: where }],
                            [Op.or]: [{ ID: { [Op.ne]: null } }],
                        };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'LOẠI NGHỈ LỄ') {
                                    var list = [];
                                    userFind['IDLoaiChamCong'] = { [Op.eq]: data.items[i]['searchFields'] }
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
                    let tblNghiLe = mtblNghiLe(db);
                    tblNghiLe.belongsTo(mtblLoaiChamCong(db), { foreignKey: 'IDLoaiChamCong', sourceKey: 'IDLoaiChamCong', as: 'loaiChamCong' })
                    tblNghiLe.findAll({
                        include: [
                            {
                                model: mtblLoaiChamCong(db),
                                required: false,
                                as: 'loaiChamCong'
                            },
                        ],
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: element.ID,
                                // nameHoliday: element.NameHoliday ? element.NameHoliday : '',
                                dateStartHoliday: element.DateStartHoliday ? moment(element.DateStartHoliday).format('DD/MM/YYYY') : '',
                                dateEndHoliday: element.DateEndHoliday ? moment(element.DateEndHoliday).format('DD/MM/YYYY') : '',
                                idLoaiChamCong: element.loaiChamCong ? element.loaiChamCong.ID : '',
                                nameLoaiChamCong: element.loaiChamCong ? element.loaiChamCong.Name : '',
                                codeLoaiChamCong: element.loaiChamCong ? element.loaiChamCong.Code : '',
                                // describe: element.Describe ? element.Describe : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblNghiLe(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_nghile
    getListNametblNghiLe: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblNghiLe(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                nameHoliday: element.NameHoliday ? element.NameHoliday : '',
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