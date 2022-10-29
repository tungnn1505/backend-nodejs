const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblVanPhongPham = require('../tables/qlnb/tblVanPhongPham')
var mThemVPPChiTiet = require('../tables/qlnb/ThemVPPChiTiet');
var mtblFileAttach = require('../tables/constants/tblFileAttach');
var mtblPhanPhoiVPPChiTiet = require('../tables/qlnb/tblPhanPhoiVPPChiTiet')
var mtblYeuCauMuaSamDetail = require('../tables/qlnb/tblYeuCauMuaSamDetail');

var database = require('../database');
async function deleteRelationshiptblVanPhongPham(db, listID) {
    await mtblFileAttach(db).destroy({
        where: {
            IDVanPhongPham: { [Op.in]: listID }
        }
    })
    await mtblYeuCauMuaSamDetail(db).destroy({
        where: {
            IDVanPhongPham: { [Op.in]: listID }
        }
    })
    await mThemVPPChiTiet(db).update({
        IDVanPhongPham: null,
    }, { where: { IDVanPhongPham: { [Op.in]: listID } } })
    await mtblPhanPhoiVPPChiTiet(db).update({
        IDVanPhongPham: null,
    }, { where: { IDVanPhongPham: { [Op.in]: listID } } })
    await mtblVanPhongPham(db).destroy({
        where: {
            ID: { [Op.in]: listID }
        }
    })
}
module.exports = {
    deleteRelationshiptblVanPhongPham,
    // add_tbl_vanphongpham
    addtblVanPhongPham: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var check = await mtblVanPhongPham(db).findAll({ where: { VPPCode: body.vppCode } })
                    if (check.length > 0) {
                        var result = {
                            status: Constant.STATUS.SUCCESS,
                            message: 'Đã có mã này. Vui lòng kiểm tra lại !',
                        }
                        res.json(result);
                    }
                    else
                        mtblVanPhongPham(db).create({
                            VPPCode: body.vppCode ? body.vppCode : '',
                            VPPName: body.vppName ? body.vppName : '',
                            Unit: body.unit ? body.unit : 0,
                            Specifications: body.specifications ? body.specifications : '',
                            RemainingAmount: body.remainingAmount ? body.remainingAmount : null,
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
    // update_tbl_vanphongpham
    updatetblVanPhongPham: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.vppCode || body.vppCode === '')
                        update.push({ key: 'VPPCode', value: body.vppCode });
                    if (body.vppName || body.vppName === '')
                        update.push({ key: 'VPPName', value: body.vppName });
                    if (body.unit || body.unit === '') {
                        if (body.unit === '')
                            update.push({ key: 'Unit', value: null });
                        else
                            update.push({ key: 'Unit', value: body.unit });
                    }
                    if (body.specifications || body.specifications === '')
                        update.push({ key: 'Specifications', value: body.specifications });
                    if (body.remainingAmount || body.remainingAmount === '') {
                        if (body.remainingAmount === '')
                            update.push({ key: 'RemainingAmount', value: null });
                        else
                            update.push({ key: 'RemainingAmount', value: body.remainingAmount });
                    }
                    database.updateTable(update, mtblVanPhongPham(db), body.id).then(response => {
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
    // delete_tbl_vanphongpham
    deletetblVanPhongPham: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblVanPhongPham(db, listID);
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
    // get_list_tbl_vanphongpham
    getListtblVanPhongPham: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = [];
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            where = [
                                { VPPName: { [Op.like]: '%' + data.search + '%' } },
                                { VPPCode: { [Op.like]: '%' + data.search + '%' } },

                            ];
                        } else {
                            where = [
                                { VPPName: { [Op.ne]: '%%' } },
                            ];
                        }
                        whereOjb = {
                            [Op.and]: [{ [Op.or]: where }],
                            [Op.or]: [{ ID: { [Op.ne]: null } }],
                        };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'TÊN VPP') {
                                    userFind['VPPName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                                if (data.items[i].fields['name'] === 'MÃ VPP') {
                                    userFind['VPPCode'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                    mtblVanPhongPham(db).findAll({
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
                                id: Number(element.ID),
                                vppCode: element.VPPCode ? element.VPPCode : '',
                                vppName: element.VPPName ? element.VPPName : '',
                                unit: element.Unit ? element.Unit : null,
                                specifications: element.Specifications ? element.Specifications : '',
                                amount: element.RemainingAmount ? element.RemainingAmount : 0,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblVanPhongPham(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_vanphongpham
    getListNametblVanPhongPham: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblVanPhongPham(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                vppName: element.VPPName ? element.VPPName : '',
                                vppCode: element.VPPCode ? element.VPPCode : '',
                                unit: element.Unit ? element.Unit : '',
                                remainingAmount: element.RemainingAmount ? element.RemainingAmount : 0,
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