const Constant = require('../constants/constant');
const Result = require('../constants/result');
var database = require('../database');
var mtblQuyetDinhTangLuong = require('../tables/hrmanage/tblQuyetDinhTangLuong')
var mModules = require('../constants/modules');
var mtblIncreaseSalariesAndStaff = require('../tables/hrmanage/tblIncreaseSalariesAndStaff')
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');

module.exports = {
    // import_decided_increase_salary
    importDecidedIncreaseSalary: (req, res) => {
        let body = req.body;
        let data = JSON.parse(body.data)
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    for (let i = 0; i < data.length; i++) {
                        let staff = await mtblDMNhanvien(db).findOne({
                            where: { StaffCode: data[i]['Mã NV'] }
                        })
                        if (staff)
                            await mtblQuyetDinhTangLuong(db).create({
                                DecisionCode: await mModules.automaticCode(mtblQuyetDinhTangLuong(db), 'DecisionCode', 'QDTL'),
                                DecisionDate: data[i]['Ngày kí'] ? data[i]['Ngày kí'] : null,
                                IncreaseDate: data[i]['Ngày kí'] ? data[i]['Ngày kí'] : null,
                                StopDate: data[i]['Ngày dừng quyết định'] ? data[i]['Ngày dừng quyết định'] : null,
                                StopReason: '',
                                IDNhanVien: staff ? staff.ID : null,
                                // SalaryIncrease: data[i]['Mức lương'] ? data[i]['Mức lương'] : null,
                                StatusDecision: 'Có hiệu lực',
                                Increase: data[i]['Mức tăng'] ? data[i]['Mức tăng'] : null,
                                Status: 'Chờ phê duyệt',
                            }).then(async data => {
                                if (data)
                                    await mtblIncreaseSalariesAndStaff(db).create({
                                        StaffID: staff.ID,
                                        IncreaseSalariesID: data.ID,
                                    })
                            })
                        else {
                            return res.json(Result.SYS_ERROR_RESULT)
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
}