const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblTaiSanBanGiao = require('../tables/qlnb/tblTaiSanBanGiao')
var mtblTaiSanHistory = require('../tables/qlnb/tblTaiSanHistory')
var mtblTaiSan = require('../tables/qlnb/tblTaiSan')

var database = require('../database');
async function deleteRelationshiptblTaiSanBanGiao(db, listID) {
    await mtblTaiSanHistory(db).destroy({
        where: { IDTaiSan: { [Op.in]: listID } }
    })
    await mtblTaiSanBanGiao(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblTaiSanBanGiao,
    // add_tbl_taisan_bangiao
    addtblTaiSanBanGiao: (req, res) => {
        let body = req.body;
        console.log(body);
        let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblTaiSanBanGiao(db).create({
                        // IDNhanVienBanGiao: body.idNhanVienBanGiao ? body.idNhanVienBanGiao : null,
                        IDNhanVienSoHuu: body.idNhanVienSoHuu ? body.idNhanVienSoHuu : null,
                        IDBoPhanSoHuu: body.idBoPhanSoHuu ? body.idBoPhanSoHuu : null,
                        Date: body.date ? body.date : '',
                    }).then(async data => {
                        body.listHistory = JSON.parse(body.listHistory);
                        if (body.listHistory.length > 0) {
                            for (var i = 0; i < body.listHistory.length; i++) {
                                await mtblTaiSan(db).update({
                                    Status: 'Sử dụng',
                                    StatusUsed: body.status ? body.status : 'Cá nhân',

                                }, {
                                    where: {
                                        ID: body.listHistory[i].idTaiSan.id
                                    }
                                })
                                await mtblTaiSanHistory(db).create({
                                    IDTaiSan: body.listHistory[i].idTaiSan.id,
                                    IDTaiSanBanGiao: data.ID,
                                    // DateThuHoi: now,
                                })
                            }
                        }

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
    // update_tbl_taisan_bangiao
    updatetblTaiSanBanGiao: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                // {
                //     idNhanVienBanGiao,
                //     idNhanVienSoHuu,
                //     idBoPhanSoHuu,
                //     date,
                //     id,
                //     listHistory: [
                //         {
                //            idTaiSan,
                //            dateThuHoi,
                //            idHistory
                //         }
                //     ]

                // }
                try {
                    let update = [];
                    if (body.idNhanVienBanGiao || body.idNhanVienBanGiao === '') {
                        if (body.idNhanVienBanGiao === '')
                            update.push({ key: 'IDNhanVienBanGiao', value: null });
                        else
                            update.push({ key: 'IDNhanVienBanGiao', value: body.idNhanVienBanGiao });
                    }
                    if (body.idNhanVienSoHuu || body.idNhanVienSoHuu === '') {
                        if (body.idNhanVienSoHuu === '')
                            update.push({ key: 'IDNhanVienSoHuu', value: null });
                        else
                            update.push({ key: 'IDNhanVienSoHuu', value: body.idNhanVienSoHuu });
                    }
                    if (body.idBoPhanSoHuu || body.idBoPhanSoHuu === '') {
                        if (body.idBoPhanSoHuu === '')
                            update.push({ key: 'IDBoPhanSoHuu', value: null });
                        else
                            update.push({ key: 'IDBoPhanSoHuu', value: body.idBoPhanSoHuu });
                    }
                    if (body.date || body.date === '') {
                        if (body.date === '')
                            update.push({ key: 'Date', value: null });
                        else
                            update.push({ key: 'Date', value: body.date });
                    }
                    if (body.status || body.status === '') {
                        update.push({ key: 'Status', value: body.status });
                    }
                    for (var i = 0; i < body.listHistory; i++) {
                        await mtblTaiSanHistory(db).update({
                            IDTaiSan: body.listHistory[i].idTaiSan,
                            IDTaiSanBanGiao: body.id,
                        }, { where: { ID: body.listHistory[i].idHistory } })
                    }
                    database.updateTable(update, mtblTaiSanBanGiao(db), body.id).then(response => {
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
    // delete_tbl_taisan_bangiao
    deletetblTaiSanBanGiao: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblTaiSanBanGiao(db, listID);
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
    // get_list_tbl_taisan_bangiao
    getListtblTaiSanBanGiao: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            where = [
                                { FullName: { [Op.like]: '%' + data.search + '%' } },
                                { Address: { [Op.like]: '%' + data.search + '%' } },
                                { CMND: { [Op.like]: '%' + data.search + '%' } },
                                { EmployeeCode: { [Op.like]: '%' + data.search + '%' } },
                            ];
                        } else {
                            where = [
                                { FullName: { [Op.ne]: '%%' } },
                            ];
                        }
                        let whereOjb = { [Op.or]: where };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                                    userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        whereOjb[Op.and] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        whereOjb[Op.or] = userFind
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        whereOjb[Op.not] = userFind
                                    }
                                }
                            }
                        }
                    }
                    let tblTaiSanBanGiao = mtblTaiSanBanGiao(db);
                    tblTaiSanBanGiao.hasMany(mtblTaiSanHistory(db), { foreignKey: 'IDTaiSanBanGiao', as: 'history' })

                    tblTaiSanBanGiao.findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [
                            {
                                model: mtblTaiSanHistory(db),
                                required: false,
                                as: 'history'
                            },
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                date: element.Date ? element.Date : '',
                                history: element.history
                            }
                            array.push(obj);
                        });
                        var count = await mtblTaiSanBanGiao(db).count({ where: whereOjb, })
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
}