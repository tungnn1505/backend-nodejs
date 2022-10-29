const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDaoTaoTruoc = require('../tables/hrmanage/tblDaoTaoTruoc')
var database = require('../database');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblFileAttach = require('../tables/constants/tblFileAttach');
var mtblHopDongNhanSu = require('../tables/hrmanage/tblHopDongNhanSu')
var mtblDaoTaoSau = require('../tables/hrmanage/tblDaoTaoSau')

async function deleteRelationshiptblDaoTaoTruoc(db, listID) {
    await mtblDaoTaoTruoc(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}
var mModules = require('../constants/modules');
module.exports = {
    deleteRelationshiptblDaoTaoTruoc,
    //  get_detail_tbl_pre_training
    detailtblDaoTaoTruoc: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblDaoTaoTruoc = mtblDaoTaoTruoc(db);
                    tblDaoTaoTruoc.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'employee' })
                    tblDaoTaoTruoc.findOne({
                        where: { ID: body.id },
                        include: [{
                            model: mtblDMNhanvien(db),
                            required: false,
                            as: 'employee'
                        },],
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                idNhanVien: data.IDNhanVien ? data.IDNhanVien : '',
                                nameNhanVien: data.employee ? data.employee.StaffName : '',
                                dateStart: data.DateStart ? data.DateStart : '',
                                dateEnd: data.DateEnd ? data.DateEnd : '',
                                trainingPlace: data.TrainingPlace ? data.TrainingPlace : '',
                                major: data.Major ? data.Major : '',
                                degree: data.Degree ? data.Degree : '',
                                note: data.Note ? data.Note : '',
                                classification: data.Classification ? data.Classification : '',
                            }
                            var arrayFile = []
                            await mtblFileAttach(db).findAll({ where: { IDDaoTaoTruoc: obj.id } }).then(file => {
                                if (file.length > 0) {
                                    for (var e = 0; e < file.length; e++) {
                                        arrayFile.push({
                                            name: file[e].Name ? file[e].Name : '',
                                            link: file[e].Link ? file[e].Link : '',
                                            id: file[e].ID,
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
    // add_tbl_pre_training
    addtblDaoTaoTruoc: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDaoTaoTruoc(db).create({
                        IDNhanVien: body.idNhanVien ? body.idNhanVien : null,
                        DateStart: body.dateStart ? body.dateStart : null,
                        DateEnd: body.dateEnd ? body.dateEnd : null,
                        TrainingPlace: body.trainingPlace ? body.trainingPlace : '',
                        Major: body.major ? body.major : '',
                        Degree: body.degree ? body.degree : '',
                        Note: body.note ? body.note : '',
                        Classification: body.classification ? body.classification : '',
                    }).then(async data => {
                        body.fileAttach = JSON.parse(body.fileAttach)
                        if (body.fileAttach.length > 0)
                            for (var j = 0; j < body.fileAttach.length; j++)
                                await mtblFileAttach(db).update({
                                    IDDaoTaoTruoc: data.ID,
                                }, {
                                    where: {
                                        ID: body.fileAttach[j].id
                                    }
                                })
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
    // update_tbl_pre_training
    updatetblDaoTaoTruoc: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    body.fileAttach = JSON.parse(body.fileAttach)
                    await mModules.updateForFileAttach(db, 'IDDaoTaoTruoc', body.fileAttach, body.id)
                    if (body.idNhanVien || body.idNhanVien === '') {
                        if (body.idNhanVien === '')
                            update.push({ key: 'IDNhanVien', value: null });
                        else
                            update.push({ key: 'IDNhanVien', value: body.idNhanVien });
                    }
                    if (body.dateStart || body.dateStart === '') {
                        if (body.dateStart === '')
                            update.push({ key: 'DateStart', value: null });
                        else
                            update.push({ key: 'DateStart', value: body.dateStart });
                    }
                    if (body.dateEnd || body.dateEnd === '') {
                        if (body.dateEnd === '')
                            update.push({ key: 'DateEnd', value: null });
                        else
                            update.push({ key: 'DateEnd', value: body.dateEnd });
                    }
                    if (body.trainingPlace || body.trainingPlace === '')
                        update.push({ key: 'TrainingPlace', value: body.trainingPlace });
                    if (body.note || body.note === '')
                        update.push({ key: 'Note', value: body.note });
                    if (body.classification || body.classification === '')
                        update.push({ key: 'Classification', value: body.classification });
                    if (body.major || body.major === '')
                        update.push({ key: 'Major', value: body.major });
                    if (body.degree || body.degree === '')
                        update.push({ key: 'Degree', value: body.degree });
                    database.updateTable(update, mtblDaoTaoTruoc(db), body.id).then(response => {
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
    // delete_tbl_pre_training
    deletetblDaoTaoTruoc: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDaoTaoTruoc(db, listID);
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
    // get_list_tbl_pre_training
    getListtblDaoTaoTruoc: (req, res) => {
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
                    let tblDaoTaoTruoc = mtblDaoTaoTruoc(db);
                    tblDaoTaoTruoc.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'employee' })
                    tblDaoTaoTruoc.findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: { IDNhanVien: body.idNhanVien },
                        include: [{
                            model: mtblDMNhanvien(db),
                            required: false,
                            as: 'employee'
                        },],
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                idNhanVien: data[i].IDNhanVien ? data[i].IDNhanVien : '',
                                nameNhanVien: data[i].employee ? data[i].employee.StaffName : '',
                                dateStart: data[i].DateStart ? moment(data[i].DateStart).format('DD/MM/YYYY') : '',
                                dateEnd: data[i].DateEnd ? moment(data[i].DateEnd).format('DD/MM/YYYY') : '',
                                trainingPlace: data[i].TrainingPlace ? data[i].TrainingPlace : '',
                                major: data[i].Major ? data[i].Major : '',
                                degree: data[i].Degree ? data[i].Degree : '',
                                note: data[i].Note ? data[i].Note : '',
                                classification: data[i].Classification ? data[i].Classification : '',
                            }
                            var arrayFile = []
                            await mtblFileAttach(db).findAll({ where: { IDDaoTaoTruoc: obj.id } }).then(file => {
                                if (file.length > 0) {
                                    for (var e = 0; e < file.length; e++) {
                                        arrayFile.push({
                                            name: file[e].Name ? file[e].Name : '',
                                            link: file[e].Link ? file[e].Link : '',
                                            id: file[e].ID,
                                        })
                                    }
                                }
                            })
                            obj['arrayFile'] = arrayFile;
                            array.push(obj);
                            stt += 1;
                        }
                        var count = await mtblDaoTaoTruoc(db).count({ where: whereOjb, })
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
    // get_list_name_tbl_pre_training
    getListNametblDaoTaoTruoc: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDaoTaoTruoc(db).findAll().then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                id: Number(element.ID),
                                major: element.Major ? element.Major : '',
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
    // in_work_training
    inWorkTraining: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    console.log(body);
                    let obj = {}
                    let tblDaoTaoSau = mtblDaoTaoSau(db);
                    tblDaoTaoSau.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'staff' })
                    await tblDaoTaoSau.findOne({
                        where: { ID: body.id },
                        include: [{
                            model: mtblDMNhanvien(db),
                            required: false,
                            as: 'staff'
                        },],
                    }).then(async training => {
                        if (training) {
                            let contract = await mtblHopDongNhanSu(db).findOne({
                                where: { IDNhanVien: training.IDNhanVien },
                                order: [
                                    ['ID', 'DESC']
                                ],
                            })
                            let staffName = ''
                            if (training.staff) {
                                staffName = training.staff.StaffName ? training.staff.StaffName : ''
                                if (training.staff.Gender == 'Nam')
                                    staffName = 'Ông ' + staffName
                                else if (training.staff.Gender == 'Nam')
                                    staffName = 'Bà ' + staffName
                                else
                                    staffName = '(Ông/Bà) ' + staffName
                            }
                            obj = {
                                contractCode: contract ? contract.ContractCode : '',
                                dateStart: moment(training.DateStart).add(7, 'hours').format('DD'),
                                monthStart: moment(training.DateStart).add(7, 'hours').format('MM'),
                                yearStart: moment(training.DateStart).add(7, 'hours').format('YYYY'),
                                dateEnd: moment(training.DateEnd).add(7, 'hours').format('DD'),
                                monthEnd: moment(training.DateEnd).add(7, 'hours').format('MM'),
                                yearEnd: moment(training.DateEnd).add(7, 'hours').format('YYYY'),
                                staffName: staffName,
                            }
                            await mModules.convertDataAndRenderWordFile(obj, 'template_training.docx', 'quyetdinhcudidaotao.docx')
                            var result = {
                                link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/quyetdinhcudidaotao.docx',
                                status: Constant.STATUS.SUCCESS,
                                message: Constant.MESSAGE.ACTION_SUCCESS,
                            }
                            setTimeout(() => {
                                res.json(result);
                            }, 500);
                        } else {
                            var result = {
                                status: Constant.STATUS.FAIL,
                                message: Constant.MESSAGE.DATA_NOT_FOUND,
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
}