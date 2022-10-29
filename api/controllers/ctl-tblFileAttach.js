const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblFileAttach = require('../tables/constants/tblFileAttach')
var database = require('../database');
const fs = require('fs');
async function deleteRelationshiptblFileAttach(db, id) {
    await mtblFileAttach(db).findOne({ where: { ID: id } }).then(data => {
        if (data) {
            var file = data.Link.replace("http://dbdev.namanphu.vn:1357/ageless_sendmail/", "")
            fs.unlink("C:/images_services/ageless_sendmail/" + file, (err) => {
                if (err) console.log(err);
            });
        }
    })
    await mtblFileAttach(db).destroy({
        where: {
            ID: id,
        }
    })
}
module.exports = {
    deleteRelationshiptblFileAttach,
    // //  get_detail_tblFileAttachapi
    // detailtblFileAttach: (req, res) => {
    //     let body = req.body;
    //     database.connectDatabase().then(async db => {
    //         if (db) {
    //             try {
    //                 mtblFileAttach(db).findOne({ where: { ID: body.id } }).then(data => {
    //                     if (data) {
    //                         var obj = {
    //                             id: data.ID,
    //                             name: data.Name,
    //                             code: data.Code,
    //                         }
    //                         var result = {
    //                             obj: obj,
    //                             status: Constant.STATUS.SUCCESS,
    //                             message: Constant.MESSAGE.ACTION_SUCCESS,
    //                         }
    //                         res.json(result);
    //                     } else {
    //                         res.json(Result.NO_DATA_RESULT)

    //                     }

    //                 })
    //             } catch (error) {
    //                 res.json(Result.SYS_ERROR_RESULT)
    //             }
    //         } else {
    //             res.json(Constant.MESSAGE.USER_FAIL)
    //         }
    //     })
    // },
    // // add_tblFileAttachapi
    // addtblFileAttach: (req, res) => {
    //     let body = req.body;
    //     database.connectDatabase().then(async db => {
    //         if (db) {
    //             try {
    //                 mtblFileAttach(db).create({
    //                     Code: body.code ? body.code : 'null',
    //                     Name: body.name ? body.name : '',
    //                 }).then(data => {
    //                     var result = {
    //                         status: Constant.STATUS.SUCCESS,
    //                         message: Constant.MESSAGE.ACTION_SUCCESS,
    //                     }
    //                     res.json(result);
    //                 })
    //             } catch (error) {
    //                 console.log(error);
    //                 res.json(Result.SYS_ERROR_RESULT)
    //             }
    //         } else {
    //             res.json(Constant.MESSAGE.USER_FAIL)
    //         }
    //     })
    // },
    // // update_tblFileAttachapi
    // updatetblFileAttach: (req, res) => {
    //     let body = req.body;
    //     database.connectDatabase().then(async db => {
    //         if (db) {
    //             try {
    //                 let update = [];
    //                 if (body.code || body.code === '')
    //                     update.push({ key: 'Code', value: body.code });
    //                 if (body.name || body.name === '')
    //                     update.push({ key: 'Name', value: body.name });
    //                 database.updateTable(update, mtblFileAttach(db), body.id).then(response => {
    //                     if (response == 1) {
    //                         res.json(Result.ACTION_SUCCESS);
    //                     } else {
    //                         res.json(Result.SYS_ERROR_RESULT);
    //                     }
    //                 })
    //             } catch (error) {
    //                 console.log(error);
    //                 res.json(Result.SYS_ERROR_RESULT)
    //             }
    //         } else {
    //             res.json(Constant.MESSAGE.USER_FAIL)
    //         }
    //     })
    // },
    // // delete_tblFileAttachapi
    deletetblFileFromLink: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var file = body.link.replace("http://dbdev.namanphu.vn:1357/", "")
                    fs.unlink("C:/images_services/" + file, (err) => {
                        if (err) console.log(err);
                    });
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    deletetblFileAttach: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await deleteRelationshiptblFileAttach(db, body.id);
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
    // // get_list_tblFileAttachapi
    // getListtblFileAttach: (req, res) => {
    //     let body = req.body;
    //     database.connectDatabase().then(async db => {
    //         if (db) {
    //             try {
    //                 var whereOjb = [];
    //                 if (body.dataSearch) {
    //                     var data = JSON.parse(body.dataSearch)

    //                     if (data.search) {
    //                         where = [
    //                             { FullName: { [Op.like]: '%' + data.search + '%' } },
    //                             { Address: { [Op.like]: '%' + data.search + '%' } },
    //                             { CMND: { [Op.like]: '%' + data.search + '%' } },
    //                             { EmployeeCode: { [Op.like]: '%' + data.search + '%' } },
    //                         ];
    //                     } else {
    //                         where = [
    //                             { FullName: { [Op.ne]: '%%' } },
    //                         ];
    //                     }
    //                     let whereOjb = { [Op.or]: where };
    //                     if (data.items) {
    //                         for (var i = 0; i < data.items.length; i++) {
    //                             let userFind = {};
    //                             if (data.items[i].fields['name'] === 'HỌ VÀ TÊN') {
    //                                 userFind['FullName'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
    //                                 if (data.items[i].conditionFields['name'] == 'And') {
    //                                     whereOjb[Op.and] = userFind
    //                                 }
    //                                 if (data.items[i].conditionFields['name'] == 'Or') {
    //                                     whereOjb[Op.or] = userFind
    //                                 }
    //                                 if (data.items[i].conditionFields['name'] == 'Not') {
    //                                     whereOjb[Op.not] = userFind
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //                 let stt = 1;
    //                 mtblFileAttach(db).findAll({
    //                     offset: Number(body.itemPerPage) * (Number(body.page) - 1),
    //                     limit: Number(body.itemPerPage),
    //                     where: whereOjb,
    //                 }).then(async data => {
    //                     var array = [];
    //                     data.forEach(element => {
    //                         var obj = {
    //                             stt: stt,
    //                             id: Number(element.ID),
    //                             name: element.Name ? element.Name : '',
    //                             code: element.Code ? element.Code : '',
    //                         }
    //                         array.push(obj);
    //                         stt += 1;
    //                     });
    //                     var count = await mtblFileAttach(db).count({ where: whereOjb, })
    //                     var result = {
    //                         array: array,
    //                         status: Constant.STATUS.SUCCESS,
    //                         message: Constant.MESSAGE.ACTION_SUCCESS,
    //                         all: count
    //                     }
    //                     res.json(result);
    //                 })

    //             } catch (error) {
    //                 console.log(error);
    //                 res.json(Result.SYS_ERROR_RESULT)
    //             }
    //         } else {
    //             res.json(Constant.MESSAGE.USER_FAIL)
    //         }
    //     })
    // },
    // // get_list_name_tblFileAttachapi
    // getListNametblFileAttach: (req, res) => {
    //     let body = req.body;
    //     database.connectDatabase().then(async db => {
    //         if (db) {
    //             try {
    //                 mtblFileAttach(db).findAll().then(data => {
    //                     var array = [];
    //                     data.forEach(element => {
    //                         var obj = {
    //                             id: Number(element.ID),
    //                             name: element.Name ? element.Name : '',
    //                         }
    //                         array.push(obj);
    //                     });
    //                     var result = {
    //                         array: array,
    //                         status: Constant.STATUS.SUCCESS,
    //                         message: Constant.MESSAGE.ACTION_SUCCESS,
    //                     }
    //                     res.json(result);
    //                 })

    //             } catch (error) {
    //                 console.log(error);
    //                 res.json(Result.SYS_ERROR_RESULT)
    //             }
    //         } else {
    //             res.json(Constant.MESSAGE.USER_FAIL)
    //         }
    //     })
    // }
}