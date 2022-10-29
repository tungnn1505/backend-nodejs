const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblPhanPhoiVPP = require('../tables/qlnb/tblPhanPhoiVPP')
var mtblPhanPhoiVPPChiTiet = require('../tables/qlnb/tblPhanPhoiVPPChiTiet')
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var database = require('../database');
var mtblVanPhongPham = require('../tables/qlnb/tblVanPhongPham')
var mModules = require('../constants/modules');

async function deleteRelationshipTBLPhanPhoiVPP(db, listID) {
    // await mtblFileAttach(db).destroy({
    //     where: {
    //         IDDeNghiThanhToan: { [Op.in]: listID }
    //     }
    // })
    await mtblPhanPhoiVPP(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}
module.exports = {
    deleteRelationshipTBLPhanPhoiVPP,
    // add_tbl_phanphoi_vpp
    addTBLPhanPhoiVPP: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblPhanPhoiVPP(db).create({
                        IDNhanVienSoHuu: body.idNhanVienSoHuu ? body.idNhanVienSoHuu : null,
                        IDNhanVienBanGiao: body.idNhanVienBanGiao ? body.idNhanVienBanGiao : null,
                        IDBoPhanSoHuu: body.idBoPhanSoHuu ? body.idBoPhanSoHuu : null,
                        Date: body.date ? body.date : null,
                        Status: body.status ? body.status : '',
                    }).then(async data => {
                        body.line = JSON.parse(body.line);
                        if (data) {
                            for (var i = 0; i < body.line.length; i++) {
                                let vpp = await mtblVanPhongPham(db).findOne({ where: { ID: body.line[i].idVanPhongPham.id } })
                                let amount = vpp.RemainingAmount ? vpp.RemainingAmount : 0;
                                if (Number(body.line[i].amount) <= amount) {
                                    await mtblPhanPhoiVPPChiTiet(db).create({
                                        IDPhanPhoiVPP: data.ID,
                                        IDVanPhongPham: body.line[i].idVanPhongPham.id ? body.line[i].idVanPhongPham.id : null,
                                        Amount: body.line[i].amount ? body.line[i].amount : null,
                                        Describe: body.line[i].describe ? body.line[i].describe : '',
                                    }).then(data => {
                                        console.log(data.ID);
                                    })
                                    await mtblVanPhongPham(db).update({
                                        RemainingAmount: Number(amount) - Number(body.line[i].amount),
                                    }, { where: { ID: body.line[i].idVanPhongPham.id } })
                                } else {
                                    var result = {
                                        status: Constant.STATUS.FAIL,
                                        message: "Số lượng bàn giao lớn hơn số lượng tồn. Vui lòng kiểm tra lại!",
                                    }

                                    res.json(result);
                                }
                            }
                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: Constant.MESSAGE.ACTION_SUCCESS,
                            }
                            res.json(result);
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
    // update_tbl_phanphoi_vpp
    updateTBLPhanPhoiVPP: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.idNhanVienSoHuu || body.idNhanVienSoHuu === '') {
                        if (body.idNhanVienSoHuu === '')
                            update.push({ key: 'IDNhanVienSoHuu', value: null });
                        else
                            update.push({ key: 'IDNhanVienSoHuu', value: body.idNhanVienSoHuu });
                    }
                    if (body.idNhanVienBanGiao || body.idNhanVienBanGiao === '') {
                        if (body.idNhanVienBanGiao === '')
                            update.push({ key: 'IDNhanVienBanGiao', value: null });
                        else
                            update.push({ key: 'IDNhanVienBanGiao', value: body.idNhanVienBanGiao });
                    }
                    if (body.idBoPhanSoHuu || body.idBoPhanSoHuu === '') {
                        if (body.idBoPhanSoHuu === '')
                            update.push({ key: 'IDBoPhanSoHuu', value: null });
                        else
                            update.push({ key: 'IDBoPhanSoHuu', value: body.idBoPhanSoHuu });
                    }
                    if (body.amount || body.amount === '') {
                        if (body.amount === '')
                            update.push({ key: 'Amount', value: null });
                        else
                            update.push({ key: 'Amount', value: body.amount });
                    }
                    if (body.date || body.date === '') {
                        if (body.date === '')
                            update.push({ key: 'Date', value: null });
                        else
                            update.push({ key: 'Date', value: body.date });
                    }
                    if (body.status) {
                        update.push({ key: 'Status', value: body.status });
                    }
                    for (var i = 0; i < body.line; i++) {
                        await mtblPhanPhoiVPPChiTiet(db).create({
                            IDPhanPhoiVPP: body.id,
                            IDVanPhongPham: body.line[i].idVanPhongPham ? body.line[i].idVanPhongPham : null,
                            Amount: body.line[i].amount ? body.line[i].amount : null,
                            Describe: body.line[i].describe ? body.line[i].describe : '',
                        }, { where: { ID: body.line[i].idLine } })
                    }
                    database.updateTable(update, mtblPhanPhoiVPP(db), body.id).then(response => {
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
    // delete_tbl_phanphoi_vpp
    deleteTBLPhanPhoiVPP: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshipTBLPhanPhoiVPP(db, listID);
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
    // get_list_tbl_phanphoi_vpp
    getListTBLPhanPhoiVPP: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            var listVPP = [];
                            await mtblVanPhongPham(db).findAll({
                                where: {
                                    [Op.or]: [{
                                        VPPCode: {
                                            [Op.like]: '%' + data.search + '%'
                                        }
                                    },
                                    {
                                        VPPName: {
                                            [Op.like]: '%' + data.search + '%'
                                        }
                                    }
                                    ]
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    listVPP.push(item.ID);
                                })
                            })
                            var list = [];
                            await mtblPhanPhoiVPPChiTiet(db).findAll({
                                where: {
                                    IDVanPhongPham: {
                                        [Op.in]: listVPP
                                    }
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    list.push(item.IDPhanPhoiVPP);
                                })
                            })
                            where = [{
                                ID: {
                                    [Op.in]: list
                                }
                            },];
                        } else {
                            where = [{
                                ID: {
                                    [Op.ne]: null
                                }
                            },];
                        }
                        whereOjb = {
                            [Op.or]: where
                        };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'NGÀY TIẾP NHẬN') {
                                    let startDate = moment(data.items[i]['startDate']).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss')
                                    let endDate = moment(data.items[i]['endDate']).add(23 + 7, 'hours').format('YYYY-MM-DD HH:mm:ss')
                                    userFind['Date'] = {
                                        [Op.between]: [startDate, endDate]
                                    }
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
                                if (data.items[i].fields['name'] === 'NGƯỜI SỞ HỮU') {
                                    var list = [];
                                    userFind['IDNhanVienSoHuu'] = {
                                        [Op.eq]: data.items[i]['searchFields']
                                    }
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
                                if (data.items[i].fields['name'] === 'SỐ LƯỢNG') {
                                    let array = []
                                    let list = []
                                    array.push(data.items[i].value1)
                                    array.push(data.items[i].value2)
                                    array.sort(function (a, b) { return a - b });
                                    await mtblPhanPhoiVPPChiTiet(db).findAll({
                                        where: {
                                            Amount: { [Op.between]: array }
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            list.push(item.IDPhanPhoiVPP);
                                        })
                                    })
                                    userFind['ID'] = {
                                        [Op.in]: list
                                    }
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
                                if (data.items[i].fields['name'] === 'ĐƠN VỊ TÍNH') {
                                    var listVPP = [];
                                    await mtblVanPhongPham(db).findAll({
                                        where: {
                                            [Op.or]: [{
                                                Unit: {
                                                    [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                                }
                                            },]
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            listVPP.push(item.ID);
                                        })
                                    })
                                    var list = [];
                                    await mtblPhanPhoiVPPChiTiet(db).findAll({
                                        where: {
                                            IDVanPhongPham: {
                                                [Op.in]: listVPP
                                            }
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            list.push(item.IDPhanPhoiVPP);
                                        })
                                    })
                                    userFind['ID'] = {
                                        [Op.in]: list
                                    }
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
                                if (data.items[i].fields['name'] === 'MÃ VPP') {
                                    var listVPP = [];
                                    await mtblVanPhongPham(db).findAll({
                                        where: {
                                            [Op.or]: [{
                                                VPPCode: {
                                                    [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                                }
                                            },]
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            listVPP.push(item.ID);
                                        })
                                    })
                                    var list = [];
                                    await mtblPhanPhoiVPPChiTiet(db).findAll({
                                        where: {
                                            IDVanPhongPham: {
                                                [Op.in]: listVPP
                                            }
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            list.push(item.IDPhanPhoiVPP);
                                        })
                                    })
                                    userFind['ID'] = {
                                        [Op.in]: list
                                    }
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
                                if (data.items[i].fields['name'] === 'TÊN VPP') {
                                    var listVPP = [];
                                    await mtblVanPhongPham(db).findAll({
                                        where: {
                                            [Op.or]: [{
                                                VPPName: {
                                                    [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                                }
                                            },]
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            listVPP.push(item.ID);
                                        })
                                    })
                                    var list = [];
                                    await mtblPhanPhoiVPPChiTiet(db).findAll({
                                        where: {
                                            IDVanPhongPham: {
                                                [Op.in]: listVPP
                                            }
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            list.push(item.IDPhanPhoiVPP);
                                        })
                                    })
                                    userFind['ID'] = {
                                        [Op.in]: list
                                    }
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
                                if (data.items[i].fields['name'] === 'TRẠNG THÁI') {
                                    userFind['Status'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                    let tblPhanPhoiVPP = mtblPhanPhoiVPP(db);
                    let tblPhanPhoiVPPChiTiet = mtblPhanPhoiVPPChiTiet(db);
                    tblPhanPhoiVPP.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVienBanGiao', sourceKey: 'IDNhanVienBanGiao', as: 'nvbg' })
                    tblPhanPhoiVPP.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVienSoHuu', sourceKey: 'IDNhanVienSoHuu', as: 'nvsh' })
                    tblPhanPhoiVPP.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhanSoHuu', sourceKey: 'IDBoPhanSoHuu', as: 'bp' })
                    tblPhanPhoiVPP.hasMany(tblPhanPhoiVPPChiTiet, { foreignKey: 'IDPhanPhoiVPP', as: 'line' })
                    tblPhanPhoiVPPChiTiet.belongsTo(mtblVanPhongPham(db), { foreignKey: 'IDVanPhongPham', sourceKey: 'IDVanPhongPham', as: 'vpp' })
                    var stt = 1;
                    tblPhanPhoiVPP.findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [{
                            model: tblPhanPhoiVPPChiTiet,
                            required: false,
                            as: 'line',
                            include: [{
                                model: mtblVanPhongPham(db),
                                required: false,
                                as: 'vpp'
                            },]
                        },
                        {
                            model: mtblDMNhanvien(db),
                            required: false,
                            as: 'nvbg'
                        },
                        {
                            model: mtblDMNhanvien(db),
                            required: false,
                            as: 'nvsh'
                        },
                        {
                            model: mtblDMBoPhan(db),
                            required: false,
                            as: 'bp'
                        },
                        ],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var arrayLine = [];
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                idNhanVienBanGiao: element.IDNhanVienBanGiao ? element.IDNhanVienBanGiao : null,
                                nameNhanVienBanGiao: element.nvbg ? element.nvbg.StaffName : '',
                                idNhanVienSoHuu: element.IDNhanVienSoHuu ? element.IDNhanVienSoHuu : null,
                                nameNhanVienSoHuu: element.nvsh ? element.nvsh.StaffName : '',
                                idBoPhanSoHuu: element.IDBoPhanSoHuu ? element.IDBoPhanSoHuu : null,
                                nameBoPhanSoHuu: element.bp ? element.bp.DepartmentName : null,
                                date: element.Date ? moment(element.Date).format('DD/MM/YYYY') : null,
                                // vppName: element.line[0] ? element.line[0].vpp ? element.line[0].vpp.VPPName : '' : '',
                                // vppCode: element.line[0] ? element.line[0].vpp ? element.line[0].vpp.VPPCode : '' : '',
                                // unit: element.line[0] ? element.line[0].vpp ? element.line[0].vpp.Unit : '' : '',
                                // amount: element.line[0] ? element.line[0].Amount : '',
                                status: element.Status ? element.Status : '',
                            }
                            element.line.forEach(item => {
                                arrayLine.push({
                                    vppName: item ? item.vpp ? item.vpp.VPPName : '' : '',
                                    vppCode: item ? item.vpp ? item.vpp.VPPCode : '' : '',
                                    unit: item ? item.vpp ? item.vpp.Unit : '' : '',
                                    amount: item ? item.Amount : '',
                                })
                            })
                            stt += 1;
                            obj['line'] = arrayLine
                            array.push(obj);
                        });
                        var count = await mtblPhanPhoiVPP(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_phanphoi_vpp
    getListNameTBLPhanPhoiVPP: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblPhanPhoiVPP(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                amount: element.amount ? element.amount : null,
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