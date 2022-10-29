const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblTaiSan = require('../tables/qlnb/tblTaiSan')
var mtblTaiSanADD = require('../tables/qlnb/tblTaiSanADD')
var mtblDMHangHoa = require('../tables/qlnb/tblDMHangHoa');
var mtblDMLoaiTaiSan = require('../tables/qlnb/tblDMLoaiTaiSan');
var mtblTaiSanBanGiao = require('../tables/qlnb/tblTaiSanBanGiao')
var mtblTaiSanHistory = require('../tables/qlnb/tblTaiSanHistory')
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblDMNhaCungCap = require('../tables/qlnb/tblDMNhaCungCap');
var mtblThayTheTaiSan = require('../tables/qlnb/tblThayTheTaiSan');
var tblYeuCauMuaSam = require('../tables/qlnb/tblYeuCauMuaSam');

var database = require('../database');
const tblTaiSanBanGiao = require('../tables/qlnb/tblTaiSanBanGiao');
const mtblThanhLyTaiSan = require('../tables/qlnb/tblThanhLyTaiSan');
const tblDMNhanvien = require('../tables/constants/tblDMNhanvien');
const tblDMBoPhan = require('../tables/constants/tblDMBoPhan');
var mtblFileAttach = require('../tables/constants/tblFileAttach');

async function deleteRelationshiptblTaiSanADD(db, listID) {
    // await mtblReceiptsPayment(db).destroy({
    //     where: {
    //         [Op.or]: {
    //             IDAsset: { [Op.in]: listID },
    //         }
    //     }
    // })
    await mtblThanhLyTaiSan(db).destroy({
        where: {
            [Op.or]: {
                IDTaiSan: {
                    [Op.in]: listID
                },
            }
        }
    })
    await mtblThayTheTaiSan(db).destroy({
        where: {
            [Op.or]: {
                IDTaiSan: {
                    [Op.in]: listID
                },
                IDTaiSanThayThe: {
                    [Op.in]: listID
                },
            }
        }
    })
    await mtblFileAttach(db).destroy({
        where: {
            IDTaiSanADD: {
                [Op.in]: listID
            }
        }
    })
    await mtblTaiSanHistory(db).destroy({
        where: {
            IDTaiSan: {
                [Op.in]: listID
            }
        }
    })
    await mtblTaiSan(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}

function checkDuplicate(array, elm) {
    var check = false;
    array.forEach(item => {
        if (item === elm) check = true;
    })
    return check;
}
async function getDepartFromTaiSan(db, idTaiSan) {
    let departmentName = '';
    let tblTaiSanBanGiao = mtblTaiSanBanGiao(db);
    let tblTaiSanHistory = mtblTaiSanHistory(db);
    tblTaiSanHistory.belongsTo(tblTaiSanBanGiao, { foreignKey: 'IDTaiSanBanGiao', sourceKey: 'IDTaiSanBanGiao', as: 'tsbangiao' })
    tblTaiSanBanGiao.belongsTo(tblDMNhanvien(db), { foreignKey: 'IDNhanVienSoHuu', sourceKey: 'IDNhanVienSoHuu', as: 'nv' })
    tblTaiSanBanGiao.belongsTo(tblDMBoPhan(db), { foreignKey: 'IDBoPhanSoHuu', sourceKey: 'IDBoPhanSoHuu', as: 'bp' })
    await tblTaiSanHistory.findOne({
        where: {
            DateThuHoi: null,
            IDTaiSan: idTaiSan,
        },
        include: [{
            model: tblTaiSanBanGiao,
            required: false,
            as: 'tsbangiao',
            include: [{
                model: tblDMNhanvien(db),
                required: false,
                as: 'nv'
            },
            {
                model: tblDMBoPhan(db),
                required: false,
                as: 'bp'
            },
            ],
        },],

    }).then(data => {
        if (data) {
            departmentName = data.tsbangiao ? data.tsbangiao.bp ? data.tsbangiao.bp.DepartmentName : '' : '';
        }

    })
    return departmentName;
}
async function getStaffFromTaiSan(db, idTaiSan) {
    let staffName = '';
    let tblTaiSanBanGiao = mtblTaiSanBanGiao(db);
    let tblTaiSanHistory = mtblTaiSanHistory(db);
    tblTaiSanHistory.belongsTo(tblTaiSanBanGiao, { foreignKey: 'IDTaiSanBanGiao', sourceKey: 'IDTaiSanBanGiao', as: 'tsbangiao' })
    tblTaiSanBanGiao.belongsTo(tblDMNhanvien(db), { foreignKey: 'IDNhanVienSoHuu', sourceKey: 'IDNhanVienSoHuu', as: 'nv' })
    tblTaiSanBanGiao.belongsTo(tblDMBoPhan(db), { foreignKey: 'IDBoPhanSoHuu', sourceKey: 'IDBoPhanSoHuu', as: 'bp' })
    await tblTaiSanHistory.findOne({
        where: {
            DateThuHoi: null,
            IDTaiSan: idTaiSan,
        },
        include: [{
            model: tblTaiSanBanGiao,
            required: false,
            as: 'tsbangiao',
            include: [{
                model: tblDMNhanvien(db),
                required: false,
                as: 'nv'
            },
            {
                model: tblDMBoPhan(db),
                required: false,
                as: 'bp'
            },
            ],
        },],

    }).then(data => {
        if (data) {
            staffName = data.tsbangiao ? data.tsbangiao.nv ? data.tsbangiao.nv.StaffName : '' : '';
        }

    })
    return staffName;
}
async function getArrayIDTaiSanFromStaff(staffID, db) {
    let arrayResult = []
    await mtblTaiSanBanGiao(db).findAll({
        where: {
            IDNhanVienSoHuu: staffID
        }
    }).then(async data => {
        for (let item of data) {
            await mtblTaiSanHistory(db).findAll({
                where: {
                    IDTaiSanBanGiao: item.ID,
                    DateThuHoi: null
                }
            }).then(history => {
                for (let his of history) {
                    arrayResult.push(his.IDTaiSan)
                }
            })
        }
    })
    return arrayResult
}
async function getArrayIDTaiSanFromDepartment(departmentID, db) {
    let arrayResult = []
    await mtblTaiSanBanGiao(db).findAll({
        where: {
            IDBoPhanSoHuu: departmentID
        }
    }).then(async data => {
        for (let item of data) {
            await mtblTaiSanHistory(db).findAll({
                where: {
                    IDTaiSanBanGiao: item.ID,
                    DateThuHoi: null
                }
            }).then(history => {
                for (let his of history) {
                    arrayResult.push(his.IDTaiSan)
                }
            })
        }
    })
    return arrayResult
}
async function getDetailTaiSan(db, idTaiSan) {
    let tblTaiSan = mtblTaiSan(db);
    var obj = {};
    let tblDMHangHoa = mtblDMHangHoa(db);
    let tblTaiSanADD = mtblTaiSanADD(db);
    tblDMHangHoa.belongsTo(mtblDMLoaiTaiSan(db), { foreignKey: 'IDDMLoaiTaiSan', sourceKey: 'IDDMLoaiTaiSan', as: 'loaitaisan' })
    tblTaiSan.belongsTo(tblDMHangHoa, { foreignKey: 'IDDMHangHoa', sourceKey: 'IDDMHangHoa', as: 'hanghoa' })
    tblTaiSanADD.belongsTo(mtblDMNhaCungCap(db), { foreignKey: 'IDNhaCungCap', sourceKey: 'IDNhaCungCap', as: 'ncc' })
    tblTaiSanADD.hasMany(mtblFileAttach(db), { foreignKey: 'IDTaiSanADD', as: 'file' })
    tblTaiSan.belongsTo(tblTaiSanADD, { foreignKey: 'IDTaiSanADD', sourceKey: 'IDTaiSanADD', as: 'taisanADD' })
    await tblTaiSan.findOne({
        where: { ID: idTaiSan },
        include: [{
            model: tblDMHangHoa,
            required: false,
            as: 'hanghoa',
            include: [{
                model: mtblDMLoaiTaiSan(db),
                required: false,
                as: 'loaitaisan'
            },],
        },
        {
            model: tblTaiSanADD,
            required: false,
            as: 'taisanADD',
            include: [{
                model: mtblDMNhaCungCap(db),
                required: false,
                as: 'ncc'
            },
            {
                model: mtblFileAttach(db),
                required: false,
                as: 'file'
            },
            ],
        },
        ],
    }).then(async data => {
        let staffName = await getStaffFromTaiSan(db, idTaiSan);
        let departmentName = await getDepartFromTaiSan(db, idTaiSan);
        obj = {
            id: data.ID,
            code: data.TSNBCode ? data.TSNBCode : '',
            idDMHangHoa: data.hanghoa ? data.hanghoa.ID : null,
            name: data.hanghoa ? data.hanghoa.Name : '',
            unit: data.hanghoa ? data.hanghoa.Unit : '',
            nameLoaiTaiSan: data.hanghoa ? data.hanghoa.loaitaisan ? data.hanghoa.loaitaisan.Name : '' : '',
            codeLoaiTaiSan: data.hanghoa ? data.hanghoa.loaitaisan ? data.hanghoa.loaitaisan.Code : '' : '',
            serialNumber: data.SerialNumber ? data.SerialNumber : '',
            originalPrice: data.OriginalPrice ? data.OriginalPrice : 0,
            depreciationDate: data.DepreciationDate ? data.DepreciationDate : null,
            depreciationPrice: data.DepreciationPrice ? data.DepreciationPrice : 0,
            supplierName: data.taisanADD ? data.taisanADD.ncc ? data.taisanADD.ncc.SupplierName : '' : '',
            fileAttach: data.taisanADD ? data.taisanADD.file : [],
            dateIncreases: data.DateIncreases ? data.DateIncreases : (data.taisanADD ? data.taisanADD.Date : ''),
            date: data.taisanADD ? data.taisanADD.Date : '',
            idTaiSanADD: data.taisanADD ? data.taisanADD.ID : null,
            staffName: staffName,
            assetName: data.AssetName ? data.AssetName : '',
            departmentName: departmentName,
            guaranteeMonth: data.GuaranteeMonth ? data.GuaranteeMonth : '',
            liquidationReason: data.LiquidationReason ? data.LiquidationReason : '',
            liquidationDate: data.LiquidationDate ? data.LiquidationDate : '',
            liquidationMoney: data.LiquidationMoney ? data.LiquidationMoney : 0,
            condition: data.Condition ? data.Condition : '',
            describe: data.Describe ? data.Describe : '',
            status: data.Status ? data.Status : '',
            statusUsed: data.StatusUsed ? data.StatusUsed : '',
            isCreateReceipt: data.IDReceiptsPayment ? true : false
        }
    })
    return obj;

}
var mModules = require('../constants/modules');

module.exports = {
    deleteRelationshiptblTaiSanADD,
    // get_list_history_staff_use
    getListHistoryStaffUse: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblTaiSan = mtblTaiSan(db);
                    let tblTaiSanHistory = mtblTaiSanHistory(db);
                    let tblTaiSanBanGiao = mtblTaiSanBanGiao(db);
                    var stt = 1;
                    var array = [];
                    tblTaiSan.hasMany(tblTaiSanHistory, { foreignKey: 'IDTaiSan', as: 'history' })
                    tblTaiSanHistory.belongsTo(tblTaiSanBanGiao, { foreignKey: 'IDTaiSanBanGiao', sourceKey: 'IDTaiSanBanGiao', as: 'taisanbangiao' })
                    tblTaiSanBanGiao.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVienSoHuu', sourceKey: 'IDNhanVienSoHuu', as: 'nv' })
                    tblTaiSan.findOne({
                        where: { ID: body.id },
                        include: [{
                            model: tblTaiSanHistory,
                            required: false,
                            as: 'history',
                            include: [{
                                model: tblTaiSanBanGiao,
                                required: false,
                                as: 'taisanbangiao',
                                include: [{
                                    model: mtblDMNhanvien(db),
                                    required: false,
                                    as: 'nv',
                                },],
                            },],
                        },],
                    }).then(async data => {
                        if (data.history)
                            for (var i = 0; i < data.history.length; i++) {
                                var obj = {
                                    stt: stt,
                                    staffCode: data.history[i] ? data.history[i].taisanbangiao ? data.history[i].taisanbangiao.nv ? data.history[i].taisanbangiao.nv.StaffCode : '' : '' : '',
                                    staffName: data.history[i] ? data.history[i].taisanbangiao ? data.history[i].taisanbangiao.nv ? data.history[i].taisanbangiao.nv.StaffName : '' : '' : '',
                                    fromDate: data.history[i] ? data.history[i].taisanbangiao ? moment(data.history[i].taisanbangiao.Date).format('DD/MM/YYYY') : null : null,
                                    toDate: data.history[i] ? data.history[i].DateThuHoi ? moment(data.history[i].DateThuHoi).add(0, 'hours').format('DD/MM/YYYY') : null : null,
                                    status: data.StatusUsed,
                                }
                                stt += 1;
                                array.push(obj);
                            }

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
    // detail_tbl_taisanadd
    detailtblTaiSanADD: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var obj = await getDetailTaiSan(db, body.id);
                    var array = [];
                    var listIDTaiSan = [];
                    await mtblTaiSan(db).findAll({
                        where: { IDTaiSanDiKem: body.id }
                    }).then(data => {
                        if (data.length > 0) {
                            data.forEach(element => {
                                listIDTaiSan.push(element.ID);
                            })
                        }
                    })
                    if (listIDTaiSan.length > 0) {
                        var stt = 1;
                        for (var i = 0; i < listIDTaiSan.length; i++) {
                            var objTaiSanDK = await getDetailTaiSan(db, listIDTaiSan[i]);
                            objTaiSanDK['stt'] = stt;
                            stt += 1;
                            array.push(objTaiSanDK);
                        }
                    }
                    var result = {
                        obj: obj,
                        arrayTaiSanDinhKem: array,
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
    // update_detail_asset
    updateDetailAsset: (req, res) => {
        let body = req.body;
        console.log(body);
        body.obj = JSON.parse(body.obj)
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var status = '';
                    if (body.liquidationDate) {
                        status = 'Thanh lý'
                    }
                    var obj = {}
                    if (status == '') {
                        obj = {
                            OriginalPrice: body.obj.originalPrice ? body.obj.originalPrice : null,
                            Unit: body.obj.unit ? body.obj.unit : '',
                            Specifications: body.obj.specifications ? body.obj.specifications : '',
                            DepreciationPrice: body.obj.depreciationPrice ? body.obj.depreciationPrice : 0,
                            DepreciationDate: body.obj.depreciationDate ? body.obj.depreciationDate : null,
                            GuaranteeMonth: body.obj.guaranteeMonth ? body.obj.guaranteeMonth : null,
                            SerialNumber: body.obj.serialNumber ? body.obj.serialNumber : '',
                            Describe: body.obj.describe ? body.obj.describe : '',
                            TSNBCode: body.obj.code ? body.obj.code : '',
                            AssetName: body.obj.assetName,
                            DateIncreases: body.obj.dateIncreases ? body.obj.dateIncreases : null,
                        }
                    } else {
                        obj = {
                            OriginalPrice: body.obj.originalPrice ? body.obj.originalPrice : null,
                            Unit: body.obj.unit ? body.obj.unit : '',
                            Specifications: body.obj.specifications ? body.obj.specifications : '',
                            DepreciationPrice: body.obj.depreciationPrice ? body.obj.depreciationPrice : 0,
                            DepreciationDate: body.obj.depreciationDate ? body.obj.depreciationDate : null,
                            GuaranteeMonth: body.obj.guaranteeMonth ? body.obj.guaranteeMonth : null,
                            SerialNumber: body.obj.serialNumber ? body.obj.serialNumber : '',
                            Describe: body.obj.describe ? body.obj.describe : '',
                            TSNBCode: body.obj.code ? body.obj.code : '',
                            Status: status,
                            AssetName: body.obj.assetName,
                            DateIncreases: body.obj.dateIncreases ? body.obj.dateIncreases : null,
                        }
                    }
                    await mtblTaiSan(db).update(obj, {
                        where: { ID: body.id }
                    })
                    let idAdd = await mtblTaiSan(db).findOne({ where: { ID: body.id } })
                    body.obj.fileAttach = JSON.parse(body.obj.fileAttach)
                    await mModules.updateForFileAttach(db, 'IDTaiSanADD', body.obj.fileAttach, idAdd.IDTaiSanADD)
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
    // add_tbl_TaiSanADD
    addtblTaiSanADD: (req, res) => {
        let body = req.body;
        body.taisan = JSON.parse(body.taisan)
        body.fileAttach = JSON.parse(body.fileAttach)
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    if (body.idPurchaseRequest)
                        await tblYeuCauMuaSam(db).update({
                            Status: "Đã thêm mới tài sản",
                        }, {
                            where: {
                                ID: body.idPurchaseRequest
                            }
                        })
                    mtblTaiSanADD(db).create({
                        IDNhaCungCap: body.idNhaCungCap ? body.idNhaCungCap : null,
                        Date: moment(body.date).format('YYYY-MM-DD HH:mm:ss.SSS') ? body.date : null,
                    }).then(async data => {
                        if (body.fileAttach.length > 0) {
                            for (var i = 0; i < body.fileAttach.length; i++) {
                                await mtblFileAttach(db).update({
                                    IDTaiSanADD: data.ID,
                                }, { where: { ID: body.fileAttach[i].id } })
                            }
                        }
                        for (var i = 0; i < body.taisan.length; i++) {
                            var tsnbCode = '';
                            var tsnbNumber = 1;
                            await mtblTaiSan(db).findOne({
                                order: [
                                    ['TSNBNumber', 'DESC']
                                ],
                                where: {
                                    IDDMHangHoa: body.taisan[i].idDMHangHoa.id
                                }
                            }).then(data => {
                                if (data) {
                                    if (data) {
                                        if (data.TSNBNumber) {
                                            tsnbNumber = Number(data.TSNBNumber) + 1;
                                            tsnbCode = body.taisan[i].idDMHangHoa.code + Number(tsnbNumber)
                                        } else {
                                            tsnbCode = body.taisan[i].idDMHangHoa.code + 1
                                            tsnbNumber = 1
                                        }
                                    } else {
                                        tsnbCode = body.taisan[i].idDMHangHoa.code + 1
                                        tsnbNumber = 1
                                    }
                                }

                            })
                            await mtblTaiSan(db).create({
                                IDDMHangHoa: body.taisan[i].idDMHangHoa ? body.taisan[i].idDMHangHoa.id : null,
                                OriginalPrice: body.taisan[i].originalPrice ? body.taisan[i].originalPrice : 0,
                                DepreciationPrice: body.taisan[i].originalPrice ? body.taisan[i].originalPrice : null,
                                Unit: body.taisan[i].unit ? body.taisan[i].unit : '',
                                Specifications: body.taisan[i].specifications ? body.taisan[i].specifications : '',
                                GuaranteeMonth: body.taisan[i].guaranteeMonth ? body.taisan[i].guaranteeMonth : null,
                                IDTaiSanDiKem: body.taisan[i].idTaiSanDiKem ? body.taisan[i].idTaiSanDiKem : null,
                                // DepreciationDate: moment(body.date).format('YYYY-MM-DD HH:mm:ss.SSS') ? body.date : null,
                                SerialNumber: body.taisan[i].serialNumber ? body.taisan[i].serialNumber : '',
                                Describe: body.taisan[i].describe ? body.taisan[i].describe : '',
                                AssetName: body.taisan[i].assetName ? body.taisan[i].assetName : '',
                                TSNBCode: tsnbCode ? tsnbCode : (body.taisan[i].idDMHangHoa.code + tsnbNumber),
                                TSNBNumber: tsnbNumber,
                                IDTaiSanADD: data.ID,
                                Status: 'Lưu kho',
                            })
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
    // update_tbl_TaiSanADD
    updatetblTaiSanADD: (req, res) => {
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
                    body.taisan = JSON.parse(body.taisan)
                    if (body.taisan.length > 0)
                        for (var i = 0; i < body.taisan.length; i++) {
                            mtblTaiSan(db).update({
                                IDDMHangHoa: body.taisan[i].idDMHangHoa ? body.taisan[i].idDMHangHoa : null,
                                OriginalPrice: body.taisan[i].originalPrice ? body.taisan[i].originalPrice : 0,
                                Unit: body.taisan[i].unit ? body.taisan[i].unit : '',
                                IDTaiSanADD: body.id ? body.id : '',
                                Specifications: body.taisan[i].specifications ? body.taisan[i].specifications : '',
                                GuaranteeMonth: body.taisan[i].guaranteeMonth ? body.taisan[i].guaranteeMonth : null,
                                IDTaiSanDiKem: body.taisan[i].idTaiSanDiKem ? body.taisan[i].idTaiSanDiKem : null,
                                SerialNumber: body.taisan[i].serialNumber ? body.taisan[i].serialNumber : '',
                                AssetName: body.taisan[i].assetName ? body.taisan[i].assetName : '',
                                Describe: body.taisan[i].describe ? body.taisan[i].describe : '',
                            }, { where: { ID: body.taisan[i].idTaiSanADD } })
                        }
                    if (body.fileAttach.length > 0)
                        for (var j = 0; j < body.fileAttach.length; j++)
                            await mtblFileAttach(db).update({
                                IDTaiSanADD: body.id
                            }, { where: { where: { ID: body.fileAttach[j].id } } })
                    database.updateTable(update, mtblTaiSanADD(db), body.id).then(response => {
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
    // delete_tbl_TaiSanADD
    deletetblTaiSanADD: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblTaiSanADD(db, listID);
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
    // get_list_tbl_TaiSanADD
    getListtblTaiSanADD: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let whereOjb = []
                    if (body.type != 'TSCSD') {
                        let listIDTaiSan = [];
                        await mtblTaiSanHistory(db).findAll({
                            where: [{
                                DateThuHoi: {
                                    [Op.ne]: null
                                }
                            }]
                        }).then(data => {
                            data.forEach(item => {
                                if (item.IDTaiSan) {
                                    if (!checkDuplicate(listIDTaiSan, item.IDTaiSan))
                                        listIDTaiSan.push(item.IDTaiSan)
                                }
                            })
                        })
                        let listIDTaiSanADD = [];
                        await mtblTaiSan(db).findAll({
                            where: [{
                                ID: {
                                    [Op.in]: listIDTaiSan
                                }
                            }]
                        }).then(data => {
                            data.forEach(item => {
                                if (item.IDTaiSanADD) {
                                    if (!checkDuplicate(listIDTaiSanADD, item.IDTaiSanADD))
                                        listIDTaiSanADD.push(item.IDTaiSanADD)
                                }
                            })
                        })
                        whereOjb.push({
                            ID: {
                                [Op.in]: listIDTaiSanADD
                            }
                        })
                    }
                    // if (body.dataSearch) {
                    //     var data = JSON.parse(body.dataSearch)

                    //     if (data.search) {
                    //         where = [
                    //             { FullName: { [Op.like]: '%' + data.search + '%' } },
                    //             { Address: { [Op.like]: '%' + data.search + '%' } },
                    //             { CMND: { [Op.like]: '%' + data.search + '%' } },
                    //             { EmployeeCode: { [Op.like]: '%' + data.search + '%' } },
                    //         ];
                    //     } else {
                    //         where = [
                    //             { FullName: { [Op.ne]: '%%' } },
                    //         ];
                    //     }
                    //     whereOjb = { [Op.or]: where };
                    //     if (data.items) {
                    //         for (var i = 0; i < data.items.length; i++) {
                    //             let userFind = {};
                    //             if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                    //                 userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                    //                 if (data.items[i].conditionFields['name'] == 'And') {
                    //                     whereOjb[Op.and] = userFind
                    //                 }
                    //                 if (data.items[i].conditionFields['name'] == 'Or') {
                    //                     whereOjb[Op.or] = userFind
                    //                 }
                    //                 if (data.items[i].conditionFields['name'] == 'Not') {
                    //                     whereOjb[Op.not] = userFind
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                    let stt = 1;
                    let tblTaiSanADD = mtblTaiSanADD(db);
                    tblTaiSanADD.hasMany(mtblTaiSan(db), { foreignKey: 'IDTaiSanADD', as: 'add' })
                    tblTaiSanADD.findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [{
                            model: mtblTaiSan(db),
                            required: false,
                            as: 'add'
                        },],
                    }).then(async data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                idNhaCungCap: element.IDNhaCungCap ? element.IDNhaCungCap : null,
                                date: element.Date ? element.Date : null,
                                line: element.add
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var count = await mtblTaiSan(db).count({ where: whereOjb })
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







    // get_list_tbl_TaiSan_ChuaSuDung
    getListtblTaiSanChuaSuDung: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let warrantyRemainingMax = 0;
                    let warrantyRemainingMin = 0;
                    let dateMax = 0;
                    let dateMin = 0;
                    let dem = 0
                    let check = false
                    let checkDate = false
                    let listIDTaiSan = [];
                    let arraySearchAnd = [];
                    let arraySearchOr = [];
                    let arraySearchNot = [];
                    let whereObj = {}
                    if (body.type == 'liquidation') {
                        arraySearchAnd.push({
                            Status: 'Đã thanh lý'
                        })
                    } else if (body.type == 'depreciation') {
                        arraySearchAnd.push({
                            DepreciationDate: {
                                [Op.ne]: null
                            }
                        })
                    } else {
                        arraySearchAnd.push({
                            Status: {
                                [Op.ne]: 'Đã thanh lý'
                            }
                        })
                    }
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            var list = [];
                            await mtblDMHangHoa(db).findAll({
                                where: {
                                    [Op.or]: [{
                                        Name: {
                                            [Op.like]: '%' + data.search + '%'
                                        }
                                    },
                                    {
                                        Code: {
                                            [Op.like]: '%' + data.search + '%'
                                        }
                                    }
                                    ]
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    list.push(Number(item.ID));
                                })
                            })
                            where = [{
                                TSNBCode: {
                                    [Op.like]: '%' + data.search + '%'
                                }
                            },
                            {
                                SerialNumber: {
                                    [Op.like]: '%' + data.search + '%'
                                }
                            },
                            {
                                IDDMHangHoa: {
                                    [Op.in]: list
                                }
                            },
                            ];
                        } else {
                            where = [{
                                TSNBCode: {
                                    [Op.ne]: '%%'
                                }
                            },];

                        }
                        whereObj = {
                            [Op.or]: where
                        };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'TÌNH TRẠNG') {
                                    userFind['Status'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                                if (data.items[i].fields['name'] === 'ĐƠN VỊ') {
                                    userFind['Unit'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                                if (data.items[i].fields['name'] === 'SERIAL TÀI SẢN') {
                                    userFind['SerialNumber'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                                if (data.items[i].fields['name'] === 'NGUYÊN GIÁ') {
                                    let array = []
                                    array.push(data.items[i].value1)
                                    array.push(data.items[i].value2)
                                    array.sort(function (a, b) { return a - b });
                                    userFind['OriginalPrice'] = { [Op.between]: array }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                                if (data.items[i].fields['name'] === 'GIÁ TRỊ CÒN LẠI') {
                                    let array = []
                                    array.push(data.items[i].value1)
                                    array.push(data.items[i].value2)
                                    array.sort(function (a, b) { return a - b });
                                    userFind['DepreciationPrice'] = { [Op.between]: array }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                                if (data.items[i].fields['name'] === 'BẢO HÀNH CÒN LẠI') {
                                    let max = (data.items[i].value1 > data.items[i].value2) ? data.items[i].value1 : data.items[i].value2
                                    let min = (data.items[i].value1 < data.items[i].value2) ? data.items[i].value1 : data.items[i].value2
                                    warrantyRemainingMax = max
                                    warrantyRemainingMin = min
                                    check = true
                                }
                                if (data.items[i].fields['name'] === 'MÃ NỘI BỘ') {
                                    userFind['TSNBCode'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                                if (data.items[i].fields['name'] === 'MÃ TÀI SẢN') {
                                    userFind['TSNBCode'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%',
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                                if (data.items[i].fields['name'] === 'TÊN TÀI SẢN') {
                                    var list = [];
                                    await mtblDMHangHoa(db).findAll({
                                        where: {
                                            [Op.or]: [{
                                                Name: {
                                                    [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                                }
                                            },
                                            {
                                                Code: {
                                                    [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                                }
                                            }
                                            ]
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            list.push(item.ID);
                                        })
                                    })
                                    userFind['IDDMHangHoa'] = {
                                        [Op.in]: list,
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                                if (data.items[i].fields['name'] === 'LOẠI TÀI SẢN') {
                                    var list = [];
                                    await mtblDMHangHoa(db).findAll({
                                        where: {
                                            IDDMLoaiTaiSan: {
                                                [Op.eq]: data.items[i]['searchFields']
                                            }
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            list.push(item.ID);
                                        })
                                    })
                                    userFind['IDDMHangHoa'] = {
                                        [Op.in]: list,
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                                if (data.items[i].fields['name'] === 'NGƯỜI SỞ HỮU') {
                                    var list = await getArrayIDTaiSanFromStaff(data.items[i]['searchFields'], db);
                                    userFind['ID'] = {
                                        [Op.in]: list,
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                                if (data.items[i].fields['name'] === 'BP SỞ HỮU') {
                                    var list = await getArrayIDTaiSanFromDepartment(data.items[i]['searchFields'], db);
                                    userFind['ID'] = {
                                        [Op.in]: list,
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                                if (data.items[i].fields['name'] === 'NGÀY MUA') {
                                    var list = []
                                    let startDate = moment(data.items[i]['startDate']).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss')
                                    let endDate = moment(data.items[i]['endDate']).add(23 + 7, 'hours').format('YYYY-MM-DD HH:mm:ss')
                                    await mtblTaiSanADD(db).findAll({
                                        where: {
                                            Date: { [Op.between]: [startDate, endDate] }
                                        }
                                    }).then(data => {
                                        for (let item of data) {
                                            list.push(item.ID)
                                        }
                                    })
                                    userFind['IDTaiSanADD'] = {
                                        [Op.in]: list
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                                if (data.items[i].fields['name'] === 'NGÀY THANH LÝ') {
                                    let startDate = moment(data.items[i]['startDate']).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss')
                                    let endDate = moment(data.items[i]['endDate']).add(23 + 7, 'hours').format('YYYY-MM-DD HH:mm:ss')
                                    userFind['LiquidationDate'] = {
                                        [Op.between]: [startDate, endDate]
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                                if (data.items[i].fields['name'] === 'LÝ DO') {
                                    userFind['LiquidationReason'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                                if (data.items[i].fields['name'] === 'NGÀY HẾT BẢO HÀNH') {
                                    checkDate = true
                                    dateMin = moment(data.items[i]['startDate']).add(7, 'hours').format('YYYY-MM-DD')
                                    dateMax = moment(data.items[i]['endDate']).add(23 + 7, 'hours').format('YYYY-MM-DD')
                                    body.itemPerPage = 10000000000
                                }
                                if (data.items[i].fields['name'] === 'TRẠNG THÁI') {
                                    userFind['StatusUsed'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
                                    if (data.items[i].conditionFields['name'] == 'And') {
                                        arraySearchAnd.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Or') {
                                        arraySearchOr.push(userFind)
                                    }
                                    if (data.items[i].conditionFields['name'] == 'Not') {
                                        arraySearchNot.push(userFind)
                                    }
                                }
                            }
                        }
                    } else {
                        let userFind = {};
                        userFind['ID'] = {
                            [Op.notIn]: listIDTaiSan,
                        }
                        userFind['IDTaiSanDiKem'] = {
                            [Op.is]: null
                        }
                        arraySearchAnd.push(userFind)
                    }
                    if (arraySearchOr.length > 0)
                        whereObj[Op.or] = arraySearchOr
                    if (arraySearchAnd.length > 0)
                        whereObj[Op.and] = arraySearchAnd
                    if (arraySearchNot.length > 0)
                        whereObj[Op.not] = arraySearchNot
                    let tblTaiSan = mtblTaiSan(db);
                    tblTaiSan.belongsTo(mtblTaiSanADD(db), { foreignKey: 'IDTaiSanADD', sourceKey: 'IDTaiSanADD', as: 'taisan' })
                    tblTaiSan.belongsTo(mtblDMHangHoa(db), { foreignKey: 'IDDMHangHoa', sourceKey: 'IDDMHangHoa', as: 'hanghoa' })
                    let tblDMHangHoa = mtblDMHangHoa(db);
                    tblDMHangHoa.belongsTo(mtblDMLoaiTaiSan(db), { foreignKey: 'IDDMLoaiTaiSan', sourceKey: 'IDDMLoaiTaiSan', as: 'loaitaisan' })
                    tblTaiSan.findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereObj,
                        include: [{
                            model: mtblTaiSanADD(db),
                            required: false,
                            as: 'taisan'
                        },
                        {
                            model: tblDMHangHoa,
                            required: false,
                            as: 'hanghoa',
                            include: [{
                                model: mtblDMLoaiTaiSan(db),
                                required: false,
                                as: 'loaitaisan'
                            },],
                        },
                        ],
                    }).then(async data => {
                        var array = [];
                        var stt = 1;
                        let dateCheck;
                        for (let element of data) {
                            let staffName = await getStaffFromTaiSan(db, element.ID);
                            let departmentName = await getDepartFromTaiSan(db, element.ID);
                            var guaranteDate;
                            var warrantyRemaining = 0;
                            let month = Number(moment().format('MM')) + Number(moment().format('YY') * 12);
                            if (element.taisan) {
                                guaranteDate = element.taisan.Date ? moment(element.taisan.Date).add(Number(element.GuaranteeMonth), 'M').format('DD/MM/YYYY') : ''
                                dateCheck = element.taisan.Date ? moment(element.taisan.Date).add(Number(element.GuaranteeMonth), 'M').format('YYYY-MM-DD') : ''
                                warrantyRemaining = Number(element.GuaranteeMonth) - (Number(month) - (Number(moment(element.taisan.Date).format('MM')) + Number(moment(element.taisan.Date).format('YY')) * 12))
                            }
                            var obj = {
                                stt: stt,
                                staffName: staffName,
                                departmentName: departmentName,
                                id: Number(element.ID),
                                idDMHangHoa: element.IDDMHangHoa ? element.IDDMHangHoa : null,
                                nameDMHangHoa: element.hanghoa ? element.hanghoa.Name : '',
                                codeDMHangHoa: element.TSNBCode ? element.TSNBCode : '',
                                liquidationReason: element.LiquidationReason ? element.LiquidationReason : '',
                                assetName: element.AssetName ? element.AssetName : '',
                                liquidationDate: element.LiquidationDate ? moment(element.LiquidationDate).format('DD/MM/YYYY') : null,
                                status: element.Status ? element.Status : '',
                                statusUsed: element.StatusUsed ? element.StatusUsed : '',
                                idLoaiTaiSan: element.hanghoa ? element.hanghoa.loaitaisan ? element.hanghoa.loaitaisan.ID : '' : null,
                                nameLoaiTaiSan: element.hanghoa ? element.hanghoa.loaitaisan ? element.hanghoa.loaitaisan.Name : '' : null,
                                codeLoaiTaiSan: element.loaitaisan ? element.loaitaisan.Code : '',
                                unit: element.hanghoa ? element.hanghoa.Unit : null,
                                serialNumber: element.SerialNumber ? element.SerialNumber : null,
                                originalPrice: element.OriginalPrice ? element.OriginalPrice : 0,
                                depreciationPrice: element.DepreciationPrice ? element.DepreciationPrice : 0,
                                guaranteeMonth: element.GuaranteeMonth ? element.GuaranteeMonth : 0,
                                liquidationMoney: element.LiquidationMoney ? element.LiquidationMoney : 0,
                                status: element.Status ? element.Status : 0,
                                date: element.taisan ? element.taisan.Date ? moment(element.taisan.Date).format('DD/MM/YYYY') : '' : '',
                                guaranteDate: guaranteDate,
                                warrantyRemaining: warrantyRemaining > 0 ? warrantyRemaining : 0,
                                isCreateReceipt: element.IDReceiptsPayment ? true : false
                            }
                            if (check && warrantyRemaining >= warrantyRemainingMin && warrantyRemaining <= warrantyRemainingMax || !check) {
                                if (checkDate && moment(dateCheck).isAfter(dateMin) && moment(dateCheck).isBefore(dateMax) || !checkDate) {
                                    array.push(obj);
                                    stt += 1;
                                    dem += 1;
                                }
                            }
                        }
                        var count = await mtblTaiSan(db).count({ where: whereObj })
                        var result = {
                            array: array,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                            all: (checkDate || check) ? dem : count
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
    // get_list_tbl_TaiSan_TheoDoi
    getListtblTaiSanTheoDoi: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereOjb = {};
                    let listIDTaiSan = [];
                    await mtblTaiSanHistory(db).findAll({
                        where: [{
                            DateThuHoi: null
                        }]
                    }).then(data => {
                        data.forEach(item => {
                            if (item.IDTaiSan) {
                                if (!checkDuplicate(listIDTaiSan, item.IDTaiSan))
                                    listIDTaiSan.push(item.IDTaiSan)
                            }
                        })
                    })
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            var list = [];
                            await mtblDMHangHoa(db).findAll({
                                where: {
                                    [Op.or]: [{
                                        Name: {
                                            [Op.like]: '%' + data.search + '%'
                                        }
                                    },
                                    {
                                        Code: {
                                            [Op.like]: '%' + data.search + '%'
                                        }
                                    }
                                    ]
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    list.push(Number(item.ID));
                                })
                            })
                            where = [{
                                TSNBCode: {
                                    [Op.like]: '%' + data.search + '%'
                                }
                            },
                            {
                                SerialNumber: {
                                    [Op.like]: '%' + data.search + '%'
                                }
                            },
                            {
                                IDDMHangHoa: {
                                    [Op.in]: list
                                }
                            },
                            ];
                        } else {
                            where = [{
                                TSNBCode: {
                                    [Op.ne]: '%%'
                                }
                            },];
                        }
                        whereOjb = {
                            [Op.or]: where
                        };
                        // let listIDTaiSan = [];
                        // await mtblTaiSanHistory(db).findAll({
                        //     where: [
                        //         {
                        //             DateThuHoi: null
                        //         }
                        //     ]
                        // }).then(data => {
                        //     data.forEach(item => {
                        //         if (item.IDTaiSan) {
                        //             if (!checkDuplicate(listIDTaiSan, item.IDTaiSan))
                        //                 listIDTaiSan.push(Number(item.IDTaiSan))
                        //         }
                        //     })
                        // })
                        let userFind = {};
                        userFind['ID'] = {
                            [Op.in]: listIDTaiSan,
                        }
                        userFind['IDTaiSanDiKem'] = {
                            [Op.is]: null
                        }
                        whereOjb[Op.and] = userFind
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'MÃ TÀI SẢN') {
                                    userFind['TSNBCode'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%',
                                    }
                                    userFind['IDTaiSanDiKem'] = {
                                        [Op.is]: null
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
                                if (data.items[i].fields['name'] === 'TÊN TÀI SẢN') {
                                    var list = [];
                                    await mtblDMHangHoa(db).findAll({
                                        where: {
                                            [Op.or]: [{
                                                Name: {
                                                    [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                                }
                                            },
                                            {
                                                Code: {
                                                    [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                                }
                                            }
                                            ]
                                        }
                                    }).then(data => {
                                        data.forEach(item => {
                                            list.push(item.ID);
                                        })
                                    })
                                    userFind['IDDMHangHoa'] = {
                                        [Op.in]: list,
                                    }
                                    userFind['IDTaiSanDiKem'] = {
                                        [Op.is]: null
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
                    } else {
                        let userFind = {};
                        userFind['ID'] = {
                            [Op.in]: listIDTaiSan,
                        }
                        userFind['IDTaiSanDiKem'] = {
                            [Op.is]: null
                        }
                        whereOjb[Op.and] = userFind
                    }
                    // if (body.dataSearch) {
                    //     var data = JSON.parse(body.dataSearch)

                    //     if (data.search) {
                    //         where = [
                    //             { FullName: { [Op.like]: '%' + data.search + '%' } },
                    //             { Address: { [Op.like]: '%' + data.search + '%' } },
                    //             { CMND: { [Op.like]: '%' + data.search + '%' } },
                    //             { EmployeeCode: { [Op.like]: '%' + data.search + '%' } },
                    //         ];
                    //     } else {
                    //         where = [
                    //             { FullName: { [Op.ne]: '%%' } },
                    //         ];
                    //     }
                    //     whereOjb = { [Op.or]: where };
                    //     if (data.items) {
                    //         for (var i = 0; i < data.items.length; i++) {
                    //             let userFind = {};
                    //             if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
                    //                 userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
                    //                 if (data.items[i].conditionFields['name'] == 'And') {
                    //                     whereOjb[Op.and] = userFind
                    //                 }
                    //                 if (data.items[i].conditionFields['name'] == 'Or') {
                    //                     whereOjb[Op.or] = userFind
                    //                 }
                    //                 if (data.items[i].conditionFields['name'] == 'Not') {
                    //                     whereOjb[Op.not] = userFind
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                    var listTaiSan = [];
                    var listObj = [];
                    let tblTaiSan = mtblTaiSan(db);
                    tblTaiSan.belongsTo(mtblTaiSanADD(db), { foreignKey: 'IDTaiSanADD', sourceKey: 'IDTaiSanADD', as: 'taisan' })
                    tblTaiSan.belongsTo(mtblDMHangHoa(db), { foreignKey: 'IDDMHangHoa', sourceKey: 'IDDMHangHoa', as: 'hanghoa' })
                    let tblDMHangHoa = mtblDMHangHoa(db);
                    tblDMHangHoa.belongsTo(mtblDMLoaiTaiSan(db), { foreignKey: 'IDDMLoaiTaiSan', sourceKey: 'IDDMLoaiTaiSan', as: 'loaitaisan' })
                    await tblTaiSan.findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                        where: whereOjb,
                        include: [{
                            model: mtblTaiSanADD(db),
                            required: false,
                            as: 'taisan'
                        },
                        {
                            model: tblDMHangHoa,
                            required: false,
                            as: 'hanghoa',
                            include: [{
                                model: mtblDMLoaiTaiSan(db),
                                required: false,
                                as: 'loaitaisan'
                            },],
                        },
                            // {
                            //     model: mtblDMLoaiTaiSan(db),
                            //     required: false,
                            //     as: 'loaitaisan'
                            // },
                        ],
                    }).then(async data => {
                        for (var i = 0; i < data.length; i++) {
                            listTaiSan.push(data[i].ID);
                            listObj.push({
                                id: Number(data[i].ID),
                                idDMHangHoa: data[i].IDDMHangHoa ? data[i].IDDMHangHoa : null,
                                nameDMHangHoa: data[i].hanghoa ? data[i].hanghoa.Name : '',
                                codeDMHangHoa: data[i].TSNBCode ? data[i].TSNBCode : '',
                                idLoaiTaiSan: data[i].hanghoa ? data[i].hanghoa.loaitaisan ? data[i].hanghoa.loaitaisan.ID : '' : null,
                                nameLoaiTaiSan: data[i].hanghoa ? data[i].hanghoa.loaitaisan ? data[i].hanghoa.loaitaisan.Name : '' : null,
                                codeLoaiTaiSan: data[i].hanghoa ? data[i].hanghoa.loaitaisan ? data[i].hanghoa.loaitaisan.Code : '' : null,
                                unit: data[i].hanghoa ? data[i].hanghoa.Unit : null,
                            })
                        }

                    })
                    await mtblTaiSanHistory(db).findAll({
                        where: {
                            IDTaiSan: {
                                [Op.in]: listTaiSan
                            }
                        },
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async history => {
                        var array = [];
                        var stt = 1;
                        for (var e = 0; e < history.length; e++) {
                            let tblTaiSanBanGiao = mtblTaiSanBanGiao(db);
                            tblTaiSanBanGiao.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVienSoHuu', sourceKey: 'IDNhanVienSoHuu', as: 'nhanvien' })
                            tblTaiSanBanGiao.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhanSoHuu', sourceKey: 'IDBoPhanSoHuu', as: 'bophan' })
                            var bangiao = await tblTaiSanBanGiao.findOne({
                                where: { ID: history[e].IDTaiSanBanGiao },
                                include: [{
                                    model: mtblDMNhanvien(db),
                                    required: false,
                                    as: 'nhanvien'
                                },
                                {
                                    model: mtblDMBoPhan(db),
                                    required: false,
                                    as: 'bophan'
                                },
                                ],
                            })
                            listObj.forEach(element => {
                                if (element.id == history[e].IDTaiSan) {
                                    var obj = {
                                        stt: stt,
                                        id: element.id,
                                        idDMHangHoa: element.idDMHangHoa ? element.idDMHangHoa : null,
                                        nameDMHangHoa: element.nameDMHangHoa ? element.nameDMHangHoa : '',
                                        codeDMHangHoa: element.codeDMHangHoa ? element.codeDMHangHoa : '',
                                        idLoaiTaiSan: element.idLoaiTaiSan ? element.idLoaiTaiSan : null,
                                        nameLoaiTaiSan: element.nameLoaiTaiSan ? element.nameLoaiTaiSan : null,
                                        codeLoaiTaiSan: element.codeLoaiTaiSan ? element.codeLoaiTaiSan : null,
                                        unit: element.unit ? element.unit : null,
                                        employeeName: bangiao ? bangiao.nhanvien ? bangiao.nhanvien.StaffName : '' : '',
                                        departmentName: bangiao ? bangiao.bophan ? bangiao.bophan.DepartmentName : '' : '',
                                        date: bangiao ? moment(bangiao.Date).format('DD/MM/YYYY') : null
                                    }
                                    array.push(obj);
                                    stt += 1;
                                }
                            })
                        }
                        var count = await mtblTaiSanHistory(db).count({
                            where: {
                                IDTaiSan: {
                                    [Op.in]: listTaiSan
                                }
                            }
                        })
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








    // get_list_attach_asset
    getListAttachAsset: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblTaiSan = mtblTaiSan(db);
                    tblTaiSan.belongsTo(mtblDMHangHoa(db), { foreignKey: 'IDDMHangHoa', sourceKey: 'IDDMHangHoa', as: 'hanghoa' })

                    tblTaiSan.findAll({
                        where: { IDTaiSanDiKem: body.id },
                        include: [{
                            model: mtblDMHangHoa(db),
                            required: false,
                            as: 'hanghoa'
                        },],
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                id: data[i].ID,
                                name: data[i].hanghoa.Name,
                                code: data[i].TSNBCode,
                            }
                            array.push(obj);
                        }
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
    // replace_asset_attach
    replateAssetAttach: (req, res) => {
        let body = req.body;
        let array = JSON.parse(body.array);
        // body: {
        //     id,
        //     date,
        //     array: [
        //         {
        //             idReplaceAsset, //id tài sản thay thế
        //             idReplaceNeedAsset //id tài sản bị thay thế
        //         },
        //     ]
        // }
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].idReplaceAsset.id && array[i].idReplaceNeedAsset !== "") {
                            await mtblTaiSan(db).update({
                                IDTaiSanDiKem: body.id,
                                DateDiKem: body.date ? body.date : null,
                            }, { where: { ID: array[i].idReplaceAsset.id } }).then(data => { })
                            await mtblTaiSan(db).update({
                                IDTaiSanDiKem: null,
                                DateDiKem: null
                            }, { where: { ID: array[i].idReplaceNeedAsset } })
                            await mtblThayTheTaiSan(db).create({
                                IDTaiSan: array[i].idReplaceNeedAsset,
                                IDTaiSanThayThe: array[i].idReplaceAsset.id,
                                DateThayThe: body.date ? body.date : null,
                            })
                        }
                    }
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
    // additional_asset_attach
    additionalAssetAttach: (req, res) => {
        let body = req.body;
        let array = JSON.parse(body.array);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].idAdditionalAsset.id) {
                            await mtblTaiSan(db).update({
                                IDTaiSanDiKem: body.id,
                                DateDiKem: body.date ? body.date : null,
                            }, { where: { ID: array[i].idAdditionalAsset.id } })
                        }
                    }
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
    // delete_asset_attach
    deleteAssetAttach: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblTaiSan(db).update({
                        IDTaiSanDiKem: null,
                        DateDiKem: null,
                    }, { where: { ID: body.id } })
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
    // withdraw_asset
    withdrawAsset: (req, res) => {
        let body = req.body;
        let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblTaiSan(db).update({
                        Status: 'Lưu kho'
                    }, { where: { ID: body.id } })
                    await mtblTaiSanHistory(db).update({
                        DateThuHoi: now,
                    }, { where: { IDTaiSan: body.id } })
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
    // get_list_asset_not_use
    getListAssetNotuse: (req, res) => {
        let body = req.body;
        let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let whereOjb = [];
                    let listIDTaiSan = [];
                    await mtblTaiSanHistory(db).findAll({
                        where: [{
                            DateThuHoi: null
                        }]
                    }).then(data => {
                        data.forEach(item => {
                            if (item.IDTaiSan) {
                                if (!checkDuplicate(listIDTaiSan, item.IDTaiSan))
                                    listIDTaiSan.push(Number(item.IDTaiSan))
                            }
                        })
                    })
                    whereOjb.push({
                        ID: {
                            [Op.notIn]: listIDTaiSan
                        },
                        IDTaiSanDiKem: null
                    })
                    let tblTaiSan = mtblTaiSan(db);
                    tblTaiSan.belongsTo(mtblDMHangHoa(db), { foreignKey: 'IDDMHangHoa', sourceKey: 'IDDMHangHoa', as: 'hanghoa' })
                    tblTaiSan.findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [{
                            model: mtblDMHangHoa(db),
                            required: false,
                            as: 'hanghoa',
                        },],
                    }).then(async data => {
                        var array = [];
                        var stt = 1;
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                nameDMHangHoa: element.hanghoa ? element.hanghoa.Name : '',
                                codeDMHangHoa: element.hanghoa ? element.hanghoa.Code : '',
                                tsnbCode: element.TSNBCode ? element.TSNBCode : '',
                            }
                            array.push(obj);
                            stt += 1;
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
    // asset_liquidation
    assetLiquidation: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblTaiSan(db).update({
                        LiquidationDate: body.liquidationDate ? body.liquidationDate : null,
                        LiquidationReason: body.liquidationReason ? body.liquidationReason : '',
                        LiquidationMoney: body.liquidationMoney ? body.liquidationMoney : null,
                        Status: 'Đã thanh lý'
                    }, {
                        where: {
                            ID: body.id
                        }
                    })
                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: 'Đã thanh lý !'
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
    // liquidation_of_many_assets
    liquidationOfManyAssets: (req, res) => {
        let body = req.body;
        body.taisan = JSON.parse(body.taisan)
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    for (var i = 0; i < body.taisan.length; i++) {
                        await mtblTaiSan(db).update({
                            LiquidationDate: body.liquidationDate ? body.liquidationDate : null,
                            LiquidationReason: body.liquidationReason ? body.liquidationReason : '',
                            LiquidationMoney: body.taisan[i].liquidationMoney ? body.taisan[i].liquidationMoney : '',
                            Status: 'Đã thanh lý'
                        }, {
                            where: {
                                ID: body.taisan[i].assetID
                            }
                        })
                    }

                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: 'Đã thanh lý !'
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
}