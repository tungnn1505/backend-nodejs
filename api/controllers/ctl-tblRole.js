const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblRole = require('../tables/constants/tblRole')
var mtblRRoleUser = require('../tables/constants/tblRRoleUser')
var database = require('../database');
var mtbltblRPermissionRole = require('../tables/constants/tblRPermissionRole');
var mtblDMPermission = require('../tables/constants/tblDMPermission');

async function deleteRelationshiptblRole(db, listID) {
    await mtblRRoleUser(db).destroy({
        where: {
            RoleID: {
                [Op.in]: listID
            }
        }
    })
    await mtblRole(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}
let permissions = `{"permissionTS":[{"key":"isAllQLTS","completed":false,"name":"- Sử dụng đầy đủ chức năng"},{"key":"isCreateEditPersonalYCMS","name":"- Thêm/sửa yêu cầu mua sắm (VPP Tài sản) của cá nhân mình","completed":false,"color":"primary","title":"Yêu cầu mua sắm"},{"key":"isApprovalYCMS","name":"- Phê duyệt Yêu cầu mua sắm (VPP Tài sản) mà mình được chỉ định phê duyệt","completed":false,"color":"accent"},{"key":"isAllAssetsYCMS","name":"- Xem tất cả yêu cầu mua sắm Tài sản","completed":false,"color":"warn"},{"key":"isAllVPPYCMS","name":"- Xem tất cả yêu cầu mua sắm VPP","completed":false},{"key":"isCreateEditPersonalDNTT","name":"- Tạo Đề nghị thanh toán","completed":false,"color":"primary","title":"Đề nghị thanh toán"},{"key":"isCreateEditAsset","name":"- Thêm/sửa Tài sản/loại Tài sản","completed":false,"color":"warn","title":"Quản lý tài sản"},{"key":"isWorkAsset","name":"- Thực hiện các công việc, chức năng liên quan đến Tài sản (thay đổi, sửa đổi người sử dụng, thanh lý, thêm thông tin Tài sản…)","completed":false,"color":"accent"},{"key":"isCreateEditVPP","name":"- Thêm/sửa văn phòng phẩm/ loại văn phòng phẩm","completed":false,"title":"Quản lý văn phòng phẩm"},{"key":"isWorkVPP","name":"- Thực hiện các công việc, chức năng liên quan đến văn phòng phẩm (cấp phát, quản lý kho…)","completed":false,"color":"primary"}],"permissionNS":[{"key":"isAllQLNS","completed":false,"name":"- Sử dụng đầy đủ chức năng"},{"key":"isWatchTimeAttendance","name":"- Xem Bảng chấm công/Tổng hợp ngày công","completed":false,"color":"primary","title":"Quản lý chấm công"},{"key":"isEditTimeAttendance","name":"- Sửa chữa bảng chấm công","completed":false,"color":"primary"},{"key":"isCreatePersonalTakeLeaveSignUp","name":"- Thêm Đơn xin nghỉ/ Đăng ký làm thêm giờ","completed":false,"color":"accent","title":"Quản lý nghỉ phép, bù"},{"key":"isEditDeletePersonalTakeLeaveSignUp","name":"- Sửa/xóa Đơn xin nghỉ/ Đăng ký làm thêm giờ chưa được duyệt/ từ chối","completed":false,"color":"warn"},{"key":"isApprovalTakeLeaveSignUp","name":"- Phê duyệt Đơn xin nghỉ / Đăng ký làm thêm giờ mà mình được chỉ định phê duyệt","completed":false},{"key":"isWatchAllTakeLeaveSignUp","name":"- Xem tất cả Đơn xin nghỉ/Đề nghị làm thêm","completed":false,"color":"warn"}],"permissionTC":[{"key":"isAllQLTC","completed":false,"name":"- Sử dụng đầy đủ chức năng","color":"primary"},{"key":"isCreateDNTT","name":"- Tạo Đề nghị thanh toán","completed":false,"color":"primary","title":"Đề nghị thanh toán"},{"key":"isCreateLoan","name":"- Tạo Đề nghị tạm ứng","completed":false,"color":"warn","title":"Khoản vay tạm ứng"},{"key":"isEditDeleteLoanDNTT","name":"- Sửa/xóa Đề nghị tạm ứng/ Đề nghị thanh toán chưa được duyệt/từ chối","completed":false,"color":"accent"},{"key":"isApprovalLoanDNTT","name":"- Phê duyệt Đề nghị tạm ứng/ Đề nghị thanh toán mà mình được chỉ định phê duyệt","completed":false,"color":"primary"},{"key":"isWatchReport","name":"- Sử dụng đầy đủ chức năng trừ chức năng Báo cáo","completed":false,"color":"warn","title":"Báo cáo"}],"notiTS":[{"title":"Yêu cầu mua sắm","name":"- Thông báo Yêu cầu mua sắm của chính họ đã được duyệt","key":"isNotiPersonalYCMS","color":"primary","completed":false},{"name":"- Thông báo duyệt yêu cầu mua sắm","key":"isNotiApprovalYCMS","color":"warn","completed":false},{"title":"Đề nghị thanh toán","name":"- Thông báo Đề nghị thanh toán của chính họ đã được duyệt","key":"isNotiPersonalDNTT","color":"accent","completed":false},{"name":"- Thông báo duyệt đề nghị thanh toán","key":"isNotiApprovalDNTT","completed":false},{"title":"Quản lý tài sản","name":"- Thông báo hết khấu hao tài sản","key":"isNotiLiquidationAsset","color":"primary","completed":false}],"notiNS":[{"title":"Quản lý nghỉ phép, bù","name":"- Thông báo Đơn xin nghỉ của chính họ đã được duyệt","key":"isNotiPersonalTakeLeave","color":"primary","completed":false},{"name":"- Thông báo Đăng ký làm thêm của chính họ đã được duyệt","key":"isNotiPersonalSignUp","color":"warn","completed":false},{"name":"- Thông báo duyệt Đơn xin nghỉ","key":"isNotiApprovalTakeLeave","color":"accent","completed":false},{"name":"- Thông báo duyệt Đăng ký làm thêm","key":"isNotiApprovalSignUp","completed":false},{"title":"Quản lý hợp đồng","name":"- Thông báo hết hạn hợp đồng","key":"isNotiContract","color":"primary","completed":false},{"title":"Tăng lương bảo hiểm","name":"- Thông báo đến hạn tăng lương bảo hiểm","key":"isNotiInscreaseInsurance","color":"primary","completed":false}],"notiTC":[{"title":"Đề nghị thanh toán","name":"- Thông báo Đề nghị Thanh toán của chính họ đã được duyệt","key":"isNotiPersonalDNTT","color":"primary","completed":false},{"name":"- Thông báo duyệt Đề nghị Thanh toán","key":"isNotiApprovalDNTT","color":"accent","completed":false},{"title":"Hoàn ứng, tạm ứng","name":"- Thông báo Đề nghị Tạm ứng của chính họ đã được duyệt","key":"isNotiPersonalLoan","color":"warn","completed":false},{"name":"- Thông báo duyệt Đề nghị Tạm ứng","key":"isNotiApprovalLoan","completed":false}]}`
module.exports = {
    deleteRelationshiptblRole,
    //  get_detail_tbl_role
    detailtblRole: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblRole(db).findOne({ where: { ID: body.id } }).then(data => {
                        if (data) {
                            var obj = {
                                id: data.ID,
                                name: data.Name,
                                permissions: data.Permissions ? JSON.parse(data.Permissions) : '',
                                code: data.Code,
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
    // add_tbl_role
    addtblRole: (req, res) => {
        let body = req.body;
        // let permissionIDs = JSON.parse(body.permissionIDs)
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let check = await mtblRole(db).findOne({
                        where: { Code: body.code }
                    })
                    if (!check)
                        mtblRole(db).create({
                            Code: body.code ? body.code : '',
                            Name: body.name ? body.name : '',
                            Permissions: permissions,
                        }).then(async data => {
                            // for (let i = 0; i < permissionIDs.length; i++) {
                            //     await mtbltblRPermissionRole({
                            //         RoleID: data.ID,
                            //         PermissionID: permissionIDs[i],
                            //     })
                            // }
                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: Constant.MESSAGE.ACTION_SUCCESS,
                            }
                            res.json(result);
                        })
                    else {
                        var result = {
                            status: Constant.STATUS.FAIL,
                            message: 'Mã quyền đã tồn tại. Vui lòng kiểm tra lại!',
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
    // update_tbl_role
    updatetblRole: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    let check = await mtblRole(db).findOne({
                        where: { Code: body.code }
                    })
                    if (!check) {
                        if (body.code || body.code === '')
                            update.push({ key: 'Code', value: body.code });
                        if (body.name || body.name === '')
                            update.push({ key: 'Name', value: body.name });
                        database.updateTable(update, mtblRole(db), body.id).then(response => {
                            if (response == 1) {
                                res.json(Result.ACTION_SUCCESS);
                            } else {
                                res.json(Result.SYS_ERROR_RESULT);
                            }
                        })
                    } else {
                        var result = {
                            status: Constant.STATUS.FAIL,
                            message: 'Mã quyền đã tồn tại. Vui lòng kiểm tra lại!',
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
    // update_permission_of_role
    updatePermissionRole: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    await mtblRole(db).update({
                        Permissions: body.permissions
                    }, { where: { ID: body.id } })
                    res.json(Result.ACTION_SUCCESS);
                } catch (error) {
                    console.log(error);
                    res.json(Result.SYS_ERROR_RESULT)
                }
            } else {
                res.json(Constant.MESSAGE.USER_FAIL)
            }
        })
    },
    // delete_tbl_role
    deletetblRole: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblRole(db, listID);
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
    // get_list_tbl_role
    getListtblRole: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var whereObj = {};
                    let arraySearchAnd = [];
                    let arraySearchOr = [];
                    let arraySearchNot = [];
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)

                        if (data.search) {
                            where = {
                                [Op.or]: [
                                    {
                                        Code: {
                                            [Op.like]: '%' + data.search + '%'
                                        }
                                    },
                                    {
                                        Name: {
                                            [Op.like]: '%' + data.search + '%'
                                        }
                                    },
                                ]
                            };
                        } else {
                            where = {
                                ID: {
                                    [Op.ne]: null
                                }
                            };
                        }
                        whereObj[Op.and] = where
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'TÊN VAI TRÒ') {
                                    userFind['Name'] = { [Op.like]: '%' + data.items[i]['searchFields'] + '%' }
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
                        if (arraySearchOr.length > 0)
                            whereObj[Op.or] = arraySearchOr
                        if (arraySearchAnd.length > 0)
                            whereObj[Op.and] = arraySearchAnd
                        if (arraySearchNot.length > 0)
                            whereObj[Op.not] = arraySearchNot
                    }
                    console.log(whereObj);
                    let stt = 1;
                    mtblRole(db).findAll({
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereObj,
                        order: [
                            ['ID', 'DESC']
                        ],
                    }).then(async data => {
                        var array = [];
                        for (let i = 0; i < data.length; i++) {
                            var obj = {
                                stt: stt,
                                id: Number(data[i].ID),
                                name: data[i].Name ? data[i].Name : '',
                                code: data[i].Code ? data[i].Code : '',
                            }
                            let tbltblRPermissionRole = mtbltblRPermissionRole(db);
                            tbltblRPermissionRole.belongsTo(mtblDMPermission(db), { foreignKey: 'PermissionID', sourceKey: 'PermissionID', as: 'permission' })
                            await tbltblRPermissionRole.findAll({
                                where: { RoleID: data[i].ID },
                                include: [{
                                    model: mtblDMPermission(db),
                                    required: false,
                                    as: 'permission'
                                },],
                            }).then(per => {
                                let pers = []
                                for (let p = 0; p < per.length; p++) {
                                    pers.push({
                                        id: per[p].PermissionID,
                                        permissionName: per[p].PermissionID ? per[p].permission.PermissionName : '',
                                    })
                                }
                                obj['permissionIDs'] = pers
                            })
                            array.push(obj);
                            stt += 1;
                        }
                        var count = await mtblRole(db).count({ where: whereObj, })
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
    // get_list_name_tbl_role
    getListNametblRole: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblRole(db).findAll().then(data => {
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
    }
}