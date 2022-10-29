const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var tblLoaiHopDong = require('../tables/hrmanage/tblLoaiHopDong')
var database = require('../database');
var mtblHopDongNhanSu = require('../tables/hrmanage/tblHopDongNhanSu')

async function deleteRelationshiptblLoaiHopDong(db, listID) {
    await mtblHopDongNhanSu(db).destroy({
        where: {
            IDLoaiHopDong: { [Op.in]: listID }
        }
    })
    await tblLoaiHopDong(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblLoaiHopDong,
    // add_tbl_loaihopdong
    addtblLoaiHopDong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let check = await tblLoaiHopDong(db).findOne({
                        where: { MaLoaiHD: body.maLoaiHD }
                    })
                    if (!check)
                        tblLoaiHopDong(db).create({
                            MaLoaiHD: body.maLoaiHD ? body.maLoaiHD : '',
                            TenLoaiHD: body.tenLoaiHD ? body.tenLoaiHD : '',
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
    // update_tbl_loaihopdong
    updatetblLoaiHopDong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.tenLoaiHD || body.tenLoaiHD === '')
                        update.push({ key: 'TenLoaiHD', value: body.tenLoaiHD });
                    if (body.maLoaiHD || body.maLoaiHD === '')
                        update.push({ key: 'MaLoaiHD', value: body.maLoaiHD });
                    database.updateTable(update, tblLoaiHopDong(db), body.id).then(response => {
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
    // delete_tbl_loaihopdong
    deletetblLoaiHopDong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblLoaiHopDong(db, listID);
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
    // get_list_tbl_loaihopdong
    getListtblLoaiHopDong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            where = [
                                { TenLoaiHD: { [Op.like]: '%' + data.search + '%' } },
                                { MaLoaiHD: { [Op.like]: '%' + data.search + '%' } },
                            ];
                        } else {
                            where = [
                                { MaLoaiHD: { [Op.ne]: '%%' } },
                            ];
                        }
                        whereOjb = {
                            [Op.and]: [{ [Op.or]: where }],
                            [Op.or]: [{ ID: { [Op.ne]: null } }],
                        };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'TÊN LOẠI HỢP ĐỒNG') {
                                    userFind['TenLoaiHD'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                                if (data.items[i].fields['name'] === 'MÃ LOẠI HỢP ĐỒNG') {
                                    userFind['MaLoaiHD'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                    tblLoaiHopDong(db).findAll({
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
                                tenLoaiHD: element.TenLoaiHD ? element.TenLoaiHD : '',
                                maLoaiHD: element.MaLoaiHD ? element.MaLoaiHD : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await tblLoaiHopDong(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_loaihopdong
    getListNametblLoaiHopDong: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    tblLoaiHopDong(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                tenLoaiHD: element.TenLoaiHD ? element.TenLoaiHD : '',
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