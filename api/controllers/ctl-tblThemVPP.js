const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblThemVPP = require('../tables/qlnb/tblThemVPP')
var mtblDMNhaCungCap = require('../tables/qlnb/tblDMNhaCungCap');
var mtblFileAttach = require('../tables/constants/tblFileAttach');
var mThemVPPChiTiet = require('../tables/qlnb/ThemVPPChiTiet');
var mtblVanPhongPham = require('../tables/qlnb/tblVanPhongPham')

var database = require('../database');
async function deleteRelationshipTBLThemVPP(db, listID) {
    await mThemVPPChiTiet(db).destroy({
        where: {
            IDThemVPP: {
                [Op.in]: listID
            }
        }
    })
    await mtblThemVPP(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}
var mModules = require('../constants/modules');

module.exports = {
    deleteRelationshipTBLThemVPP,
    // add_tbl_them_vpp
    addTBLThemVPP: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblThemVPP(db).create({
                        IDNhaCungCap: body.idNhaCungCap ? body.idNhaCungCap : null,
                        Date: body.date ? body.date : null,
                    }).then(async data => {
                        body.fileAttach = JSON.parse(body.fileAttach)
                        if (body.fileAttach.length > 0)
                            for (var j = 0; j < body.fileAttach.length; j++)
                                await mtblFileAttach(db).update({
                                    IDVanPhongPham: data.ID,
                                }, {
                                    where: {
                                        ID: body.fileAttach[j].id
                                    }
                                })
                        body.line = JSON.parse(body.line)
                        if (body.line.length > 0)
                            for (var i = 0; i < body.line.length; i++) {
                                await mThemVPPChiTiet(db).create({
                                    IDVanPhongPham: body.line[i].idVanPhongPham.id,
                                    IDThemVPP: data.ID,
                                    Amount: body.line[i].amount ? body.line[i].amount : 0,
                                    Describe: body.line[i].describe ? body.line[i].describe : '',
                                })
                                let vpp = await mtblVanPhongPham(db).findOne({ where: { ID: body.line[i].idVanPhongPham.id } })
                                let amount = vpp.RemainingAmount ? vpp.RemainingAmount : 0;
                                await mtblVanPhongPham(db).update({
                                    RemainingAmount: Number(body.line[i].amount) + Number(amount),
                                }, { where: { ID: body.line[i].idVanPhongPham.id } })
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
    // update_tbl_them_vpp
    updateTBLThemVPP: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    if (body.idNhaCungCap || body.idNhaCungCap === '') {
                        if (body.idNhaCungCap === '')
                            update.push({ key: 'IDNhaCungCap', value: null });
                        else
                            update.push({ key: 'IDNhaCungCap', value: body.idNhaCungCap });
                    }
                    if (body.date || body.date === '') {
                        if (body.date === '')
                            update.push({ key: 'Date', value: null });
                        else
                            update.push({ key: 'Date', value: body.date });
                    }
                    body.fileAttach = JSON.parse(body.fileAttach)
                    await mModules.updateForFileAttach(db, 'IDVanPhongPham', body.fileAttach, body.id)
                    body.line = JSON.parse(body.line)
                    if (body.line.length > 0)
                        for (var i = 0; i < body.line.length; i++)
                            await mThemVPPChiTiet(db).update({
                                IDVanPhongPham: body.line[i].idVanPhongPham,
                                Amount: body.line[i].amount,
                                Describe: body.line[i].describe ? body.line[i].describe : '',
                            }, { where: { ID: body.line[i].idLine } })
                    database.updateTable(update, mtblThemVPP(db), body.id).then(response => {
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
    // delete_tbl_them_vpp
    deleteTBLThemVPP: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshipTBLThemVPP(db, listID);
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
    // get_list_tbl_them_vpp
    getListTBLThemVPP: (req, res) => {
        let body = req.body;
        console.log(body);
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
                            await mThemVPPChiTiet(db).findAll({
                                where: {
                                    IDVanPhongPham: {
                                        [Op.in]: listVPP
                                    }
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    list.push(item.IDThemVPP);
                                })
                            })
                            var listNCC = [];
                            await mtblDMNhaCungCap(db).findAll({
                                where: {
                                    [Op.or]: [{
                                        SupplierCode: {
                                            [Op.like]: '%' + data.search + '%'
                                        }
                                    },
                                    {
                                        SupplierName: {
                                            [Op.like]: '%' + data.search + '%'
                                        }
                                    }
                                    ]
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    listNCC.push(item.ID);
                                })
                            })
                            where = [{
                                ID: {
                                    [Op.in]: list
                                }
                            },
                            {
                                IDNhaCungCap: {
                                    [Op.in]: listNCC
                                }
                            },
                            ];
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
                                if (data.items[i].fields['name'] === 'ĐƠN VỊ') {
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
                                    await mThemVPPChiTiet(db).findAll({
                                        where: {
                                            IDVanPhongPham: {
                                                [Op.in]: listVPP
                                            }
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            list.push(item.IDThemVPP);
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
                                if (data.items[i].fields['name'] === 'TỔNG SỐ TỒN') {
                                    var listVPP = [];
                                    await mtblVanPhongPham(db).findAll({
                                        where: {
                                            [Op.or]: [
                                                { RemainingAmount: Number(data.items[i]['searchFields']) },
                                            ]
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            listVPP.push(item.ID);
                                        })
                                    })
                                    var list = [];
                                    await mThemVPPChiTiet(db).findAll({
                                        where: {
                                            IDVanPhongPham: {
                                                [Op.in]: listVPP
                                            }
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            list.push(item.IDThemVPP);
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
                                    await mThemVPPChiTiet(db).findAll({
                                        where: {
                                            IDVanPhongPham: {
                                                [Op.in]: listVPP
                                            }
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            list.push(item.IDThemVPP);
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
                                    await mThemVPPChiTiet(db).findAll({
                                        where: {
                                            IDVanPhongPham: {
                                                [Op.in]: listVPP
                                            }
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            list.push(item.IDThemVPP);
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
                                if (data.items[i].fields['name'] === 'NHÀ CUNG CẤP') {
                                    var list = [];
                                    userFind['IDNhaCungCap'] = {
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
                                if (data.items[i].fields['name'] === 'NGÀY CUNG CẤP') {
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
                                if (data.items[i].fields['name'] === 'SỐ LƯỢNG') {
                                    let array = []
                                    array.push(data.items[i].value1)
                                    array.push(data.items[i].value2)
                                    array.sort(function (a, b) { return a - b });
                                    var listYCMS = [];
                                    await mThemVPPChiTiet(db).findAll({
                                        where: {
                                            Amount: { [Op.between]: array }
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            listYCMS.push(item.IDThemVPP);
                                        })
                                    })
                                    userFind['ID'] = {
                                        [Op.in]: listYCMS
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
                            }
                        }
                    }
                    let tblThemVPP = mtblThemVPP(db);
                    let stt = 1;
                    tblThemVPP.belongsTo(mtblDMNhaCungCap(db), { foreignKey: 'IDNhaCungCap', sourceKey: 'IDNhaCungCap', as: 'ncc' })
                    tblThemVPP.hasMany(mThemVPPChiTiet(db), { foreignKey: 'IDThemVPP', as: 'line' })
                    var themVPPChiTiet = mThemVPPChiTiet(db);
                    themVPPChiTiet.belongsTo(mtblVanPhongPham(db), { foreignKey: 'IDVanPhongPham', sourceKey: 'IDVanPhongPham', as: 'vpp' })
                    tblThemVPP.findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [{
                            model: mtblDMNhaCungCap(db),
                            required: false,
                            as: 'ncc'
                        },
                        {
                            model: themVPPChiTiet,
                            required: false,
                            as: 'line',
                            include: [{
                                model: mtblVanPhongPham(db),
                                required: false,
                                as: 'vpp',
                            },],
                        },
                        ],
                    }).then(async data => {
                        var array = [];
                        for (var j = 0; j < data.length; j++) {
                            var obj = {
                                stt: stt,
                                id: Number(data[j].ID),
                                idNhaCungCap: data[j].IDNhaCungCap ? data[j].IDNhaCungCap : null,
                                supplierName: data[j].ncc ? data[j].ncc.SupplierName : null,
                                dateReceive: data[j].Date ? moment(data[j].Date).format('DD/MM/YYYY') : null,
                                tsName: data[j].line
                            }
                            for (var i = 0; i < data[j].line.length; i++) {
                                obj["tsName"][i]['dataValues']['amount'] = data[j].line[i].Amount;
                                obj["tsName"][i]['dataValues']['name'] = data[j].line[i] ? data[j].line[i].vpp ? data[j].line[i].vpp.VPPName : '' : '';
                                if (data[j].line[i].IDVanPhongPham) {
                                    var unit = await mtblVanPhongPham(db).findOne({ where: { ID: data[j].line[i].IDVanPhongPham } })
                                    if (unit) {
                                        obj["tsName"][i]['dataValues']['unit'] = unit.Unit
                                    } else {
                                        obj["tsName"][i]['dataValues']['unit'] = ''
                                    }

                                } else {
                                    obj["tsName"][i]['dataValues']['unit'] = ''
                                }

                            }
                            array.push(obj);
                            stt += 1;
                        }
                        for (var i = 0; i < array.length; i++) {
                            var arrayFile = []
                            await mtblFileAttach(db).findAll({ where: { IDVanPhongPham: array[i].id } }).then(file => {
                                if (file.length > 0) {
                                    for (var e = 0; e < file.length; e++) {
                                        arrayFile.push({
                                            id: file[e].ID ? file[e].ID : '',
                                            name: file[e].Name ? file[e].Name : '',
                                            link: file[e].Link ? file[e].Link : '',
                                        })
                                    }
                                }
                            })
                            array[i]['arrayFile'] = arrayFile;

                        }
                        var count = await mtblThemVPP(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_them_vpp
    getListNameTBLThemVPP: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblThemVPP(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                amount: element.Amount ? element.Amount : '',
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
    // get_detail_tbl_them_vpp
    getDetailTBLThemVPP: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblThemVPP = mtblThemVPP(db);
                    let stt = 1;
                    tblThemVPP.belongsTo(mtblDMNhaCungCap(db), { foreignKey: 'IDNhaCungCap', sourceKey: 'IDNhaCungCap', as: 'ncc' })
                    tblThemVPP.hasMany(mThemVPPChiTiet(db), { foreignKey: 'IDThemVPP', as: 'line' })
                    var themVPPChiTiet = mThemVPPChiTiet(db);
                    themVPPChiTiet.belongsTo(mtblVanPhongPham(db), { foreignKey: 'IDVanPhongPham', sourceKey: 'IDVanPhongPham', as: 'vpp' })
                    var obj = {}
                    tblThemVPP.findOne({
                        where: { ID: body.id },
                        include: [{
                            model: mtblDMNhaCungCap(db),
                            required: false,
                            as: 'ncc'
                        },
                        {
                            model: themVPPChiTiet,
                            required: false,
                            as: 'line',
                            include: [{
                                model: mtblVanPhongPham(db),
                                required: false,
                                as: 'vpp',
                            },],
                        },
                        ],
                    }).then(async data => {
                        obj = {
                            id: Number(data.ID),
                            idNhaCungCap: data.IDNhaCungCap ? data.IDNhaCungCap : null,
                            supplierName: data.ncc ? data.ncc.SupplierName : null,
                            dateReceive: data.Date ? moment(data.Date).format('DD/MM/YYYY') : null,
                            arrayVPP: data.line
                        }
                        for (var i = 0; i < data.line.length; i++) {
                            obj["arrayVPP"][i]['dataValues']['amount'] = data.line[i].Amount;
                            obj["arrayVPP"][i]['dataValues']['name'] = data.line[i] ? data.line[i].vpp ? data.line[i].vpp.VPPName : '' : '';
                            if (data.line[i].IDVanPhongPham) {
                                var unit = await mtblVanPhongPham(db).findOne({ where: { ID: data.line[i].IDVanPhongPham } })
                                if (unit) {
                                    obj["arrayVPP"][i]['dataValues']['unit'] = unit.Unit
                                } else {
                                    obj["arrayVPP"][i]['dataValues']['unit'] = ''
                                }

                            } else {
                                obj["arrayVPP"][i]['dataValues']['unit'] = ''
                            }

                        }
                        var arrayFile = []
                        await mtblFileAttach(db).findAll({ where: { IDVanPhongPham: obj.id } }).then(file => {
                            if (file.length > 0) {
                                for (var e = 0; e < file.length; e++) {
                                    arrayFile.push({
                                        id: file[e].ID ? file[e].ID : '',
                                        name: file[e].Name ? file[e].Name : '',
                                        link: file[e].Link ? file[e].Link : '',
                                    })
                                }
                            }
                        })
                        obj['arrayFile'] = arrayFile;
                        var result = {
                            obj: obj,
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