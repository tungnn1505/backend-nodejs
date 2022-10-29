const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var mtblDMNhanvien = require('../tables/constants/tblDMNhanvien');
var mtblDMChiNhanh = require('../tables/constants/tblDMChiNhanh')
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblTaiSanBanGiao = require('../tables/qlnb/tblTaiSanBanGiao')
var mtblTaiSanHistory = require('../tables/qlnb/tblTaiSanHistory')
var mtblTaiSan = require('../tables/qlnb/tblTaiSan')
var mtblDMHangHoa = require('../tables/qlnb/tblDMHangHoa');
var mtblDMUser = require('../tables/constants/tblDMUser');
var mtblYeuCauMuaSam = require('../tables/qlnb/tblYeuCauMuaSam')
var mtblTaiSanBanGiao = require('../tables/qlnb/tblTaiSanBanGiao')
var mtblDMBoPhan = require('../tables/constants/tblDMBoPhan')
var mtblBangLuong = require('../tables/hrmanage/tblBangLuong')
var mtblHopDongNhanSu = require('../tables/hrmanage/tblHopDongNhanSu')
var mtblLoaiHopDong = require('../tables/hrmanage/tblLoaiHopDong')
var mtblDMChucVu = require('../tables/constants/tblDMChucVu');
var mtblDaoTaoTruoc = require('../tables/hrmanage/tblDaoTaoTruoc')
var mtblDaoTaoSau = require('../tables/hrmanage/tblDaoTaoSau')
var mtblQuyetDinhTangLuong = require('../tables/hrmanage/tblQuyetDinhTangLuong')
var mtblDMGiaDinh = require('../tables/hrmanage/tblDMGiaDinh')
var mtblDeNghiThanhToan = require('../tables/qlnb/tblDeNghiThanhToan')
const Sequelize = require('sequelize');
var mtblFileAttach = require('../tables/constants/tblFileAttach');

// nhân sự
var mtblChamCong = require('../tables/hrmanage/tblChamCong')
var mtblNghiPhep = require('../tables/hrmanage/tblNghiPhep')
var mtblNghiLe = require('../tables/hrmanage/tblNghiLe')
var mtblDateOfLeave = require('../tables/hrmanage/tblDateOfLeave')

var mtblPhanPhoiVPP = require('../tables/qlnb/tblPhanPhoiVPP')
var mtblPhanPhoiVPPChiTiet = require('../tables/qlnb/tblPhanPhoiVPPChiTiet')
var mtblVanPhongPham = require('../tables/qlnb/tblVanPhongPham')
var mtblIncreaseSalariesAndStaff = require('../tables/hrmanage/tblIncreaseSalariesAndStaff')
var mtblDecidedInsuranceSalary = require('../tables/hrmanage/tblDecidedInsuranceSalary')
var mtblRewardPunishmentRStaff = require('../tables/hrmanage/tblRewardPunishmentRStaff')

var database = require('../database');
async function deleteRelationshiptblDMNhanvien(db, listID) {
    await mtblIncreaseSalariesAndStaff(db).destroy({
        where: {
            StaffID: {
                [Op.in]: listID
            }
        }
    })
    await mtblRewardPunishmentRStaff(db).destroy({
        where: {
            StaffID: {
                [Op.in]: listID
            }
        }
    })
    await mtblDecidedInsuranceSalary(db).destroy({
        where: {
            IDStaff: {
                [Op.in]: listID
            }
        }
    })
    await mtblPhanPhoiVPP(db).update({
        IDNhanVienBanGiao: null,
    }, {
        where: {
            IDNhanVienBanGiao: {
                [Op.in]: listID
            }
        }
    })
    await mtblPhanPhoiVPP(db).update({
        IDNhanVienSoHuu: null,
    }, {
        where: {
            IDNhanVienSoHuu: {
                [Op.in]: listID
            }
        }
    })
    await mtblChamCong(db).destroy({
        where: {
            IDNhanVien: {
                [Op.in]: listID
            }
        }
    })
    await mtblChamCong(db).destroy({
        where: {
            IDNhanVien: {
                [Op.in]: listID
            }
        }
    })
    // ---------------------------------------------------------------------------------------------------------------
    let listLeave = []
    await mtblNghiPhep(db).findAll({
        where: {
            [Op.or]: [
                {
                    IDNhanVien: {
                        [Op.in]: listID
                    }
                },
                {
                    IDHeadDepartment: {
                        [Op.in]: listID
                    }
                },
                {
                    IDHeads: {
                        [Op.in]: listID
                    }
                },
                {
                    IDAdministrationHR: {
                        [Op.in]: listID
                    }
                },
            ]
        }
    }).then(async data => {
        for (let i = 0; i < data.length; i++) {
            listLeave.push(Number(data[i].ID))
        }
    })
    await mtblDateOfLeave(db).destroy({
        where: {
            LeaveID: {
                [Op.in]: listLeave
            }
        }
    })
    await mtblNghiPhep(db).destroy({
        where: {
            IDNhanVien: {
                [Op.in]: listID
            }
        }
    })
    await mtblNghiPhep(db).destroy({
        where: {
            IDHeadDepartment: {
                [Op.in]: listID
            }
        }
    })
    await mtblNghiPhep(db).destroy({
        where: {
            IDHeads: {
                [Op.in]: listID
            }
        }
    })
    await mtblNghiPhep(db).destroy({
        where: {
            IDAdministrationHR: {
                [Op.in]: listID
            }
        }
    })
    // -----------------------------------------------------------------------------------------------------------------------------------------------------
    await mtblQuyetDinhTangLuong(db).destroy({
        where: {
            IDNhanVien: {
                [Op.in]: listID
            }
        }
    })
    await mtblDMGiaDinh(db).destroy({
        where: {
            IDNhanVien: {
                [Op.in]: listID
            }
        }
    })
    await mtblBangLuong(db).destroy({
        where: {
            IDNhanVien: {
                [Op.in]: listID
            }
        }
    })
    await mtblDaoTaoTruoc(db).destroy({
        where: {
            IDNhanVien: {
                [Op.in]: listID
            }
        }
    })
    await mtblDaoTaoSau(db).destroy({
        where: {
            IDNhanVien: {
                [Op.in]: listID
            }
        }
    })
    await mtblHopDongNhanSu(db).destroy({
        where: {
            IDNhanVien: {
                [Op.in]: listID
            }
        }
    })
    await mtblHopDongNhanSu(db).destroy({
        where: {
            IDNhanVienSDLD: {
                [Op.in]: listID
            }
        }
    })
    await mtblDMBoPhan(db).update({
        IDNhanVienBanGiao: null,
    }, {
        where: {
            IDNhanVienBanGiao: {
                [Op.in]: listID
            }
        }
    })
    await mtblTaiSanBanGiao(db).update({
        IDNhanVienBanGiao: null,
    }, {
        where: {
            IDNhanVienBanGiao: {
                [Op.in]: listID
            }
        }
    })
    await mtblTaiSanBanGiao(db).update({
        IDNhanVienSoHuu: null,
    }, {
        where: {
            IDNhanVienSoHuu: {
                [Op.in]: listID
            }
        }
    })
    await mtblYeuCauMuaSam(db).update({
        IDNhanVien: null,
    }, {
        where: {
            IDNhanVien: {
                [Op.in]: listID
            }
        }
    })
    await mtblYeuCauMuaSam(db).update({
        IDPheDuyet1: null,
    }, {
        where: {
            IDPheDuyet1: {
                [Op.in]: listID
            }
        }
    })
    await mtblYeuCauMuaSam(db).update({
        IDPheDuyet2: null,
    }, {
        where: {
            IDPheDuyet2: {
                [Op.in]: listID
            }
        }
    })
    await mtblDMUser(db).update({
        IDNhanvien: null,
    }, {
        where: {
            IDNhanvien: {
                [Op.in]: listID
            }
        }
    })
    await mtblDMNhanvien(db).destroy({
        where: {
            ID: {
                [Op.in]: listID
            }
        }
    })
}
module.exports = {
    deleteRelationshiptblDMNhanvien,
    // notify_users
    notifyUsers: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    var user = await mtblDMUser(db).findOne({ where: { ID: body.id } });
                    var array = [];
                    let count = 0;
                    if (user) {
                        let tblYeuCauMuaSam = mtblYeuCauMuaSam(db);
                        tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
                        await tblYeuCauMuaSam.findAll({
                            where: [
                                { IDPheDuyet1: user.IDNhanvien },
                                { Status: 'Chờ phê duyệt' }
                            ],
                            include: [{
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'nv'
                            },],
                        }).then(data => {
                            data.forEach(item => {
                                array.push({
                                    name: item.nv ? item.nv.StaffName : 'admin',
                                    type: 'shopping_cart'
                                })
                                count += 1;
                            })
                        })
                        await tblYeuCauMuaSam.findAll({
                            where: [
                                { IDPheDuyet2: user.IDNhanvien },
                                { Status: 'Đang phê duyệt' }
                            ],
                            include: [{
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'nv'
                            },],
                        }).then(data => {
                            data.forEach(item => {
                                array.push({
                                    name: item.nv ? item.nv.StaffName : 'admin',
                                    type: 'shopping_cart'
                                })
                                count += 1;
                            })
                        })
                        let tblDeNghiThanhToan = mtblDeNghiThanhToan(db);
                        tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'nv' })
                        await tblDeNghiThanhToan.findAll({
                            where: [
                                { IDNhanVienKTPD: user.IDNhanvien },
                                { TrangThaiPheDuyetKT: 'Chờ phê duyệt' }
                            ],
                            include: [{
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'nv'
                            },],
                        }).then(data => {
                            data.forEach(item => {
                                array.push({
                                    name: item.nv ? item.nv.StaffName : 'admin',
                                    type: 'payment'
                                })
                                count += 1;
                            })
                        })
                        await tblDeNghiThanhToan.findAll({
                            where: [
                                { IDNhanVienLDPD: user.IDNhanvien },
                                {
                                    [Op.or]: [
                                        { TrangThaiPheDuyetKT: 'Đã phê duyệt' },
                                        { TrangThaiPheDuyetKT: 'Đã hủy' },
                                    ]
                                }
                            ],
                            include: [{
                                model: mtblDMNhanvien(db),
                                required: false,
                                as: 'nv'
                            },],
                        }).then(data => {
                            data.forEach(item => {
                                array.push({
                                    name: item.nv ? item.nv.StaffName : 'admin',
                                    type: 'payment'
                                })
                                count += 1;
                            })
                        })
                        var all = count;
                        var result = {
                            array: array,
                            all: all,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
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
    // detail_tbl_dmnhanvien
    detailtblDMNhanvien: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let stt = 1;
                    let tblDMNhanvien = mtblDMNhanvien(db);
                    tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bophan' })
                    tblDMNhanvien.belongsTo(mtblFileAttach(db), { foreignKey: 'FileAttachID', sourceKey: 'FileAttachID', as: 'file' })
                    let tblDMBoPhan = mtblDMBoPhan(db);
                    tblDMBoPhan.belongsTo(mtblDMChiNhanh(db), { foreignKey: 'IDChiNhanh', sourceKey: 'IDChiNhanh' })
                    tblDMNhanvien.belongsTo(mtblDMChucVu(db), { foreignKey: 'IDChucVu', sourceKey: 'IDChucVu', as: 'chucvu' })
                    tblDMNhanvien.findOne({
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: { ID: body.id },
                        include: [{
                            model: tblDMBoPhan,
                            required: false,
                            as: 'bophan',
                            include: [{
                                model: mtblDMChiNhanh(db)
                            }]
                        },
                        {
                            model: mtblDMChucVu(db),
                            required: false,
                            as: 'chucvu',
                        },
                        {
                            model: mtblFileAttach(db),
                            required: false,
                            as: 'file',
                        },
                        ],
                    }).then(async data => {
                        var obj = {
                            stt: stt,
                            id: Number(data.ID),
                            staffCode: data.StaffCode ? data.StaffCode : '',
                            staffName: data.StaffName ? data.StaffName : '',
                            cmndNumber: data.CMNDNumber ? data.CMNDNumber : '',
                            cmndPlace: data.CMNDPlace ? data.CMNDPlace : '',
                            cmndDate: data.CMNDDate ? data.CMNDDate : '',
                            address: data.Address ? data.Address : '',
                            idNation: data.IDNation ? data.IDNation : null,
                            phoneNumber: data.PhoneNumber ? data.PhoneNumber : '',
                            gender: data.Gender ? data.Gender : '',
                            idBoPhan: data.IDBoPhan ? data.IDBoPhan : null,
                            departmentName: data.bophan ? data.bophan.DepartmentName : null,
                            departmentCode: data.bophan ? data.bophan.DepartmentCode : null,
                            branchCode: data.bophan ? data.bophan.tblDMChiNhanh ? data.bophan.tblDMChiNhanh.BranchCode : null : null,
                            branchName: data.bophan ? data.bophan.tblDMChiNhanh ? data.bophan.tblDMChiNhanh.BranchName : null : null,
                            idChucVu: data.IDChucVu ? data.IDChucVu : null,
                            positionName: data.IDChucVu ? data.chucvu.PositionName : null,
                            taxCode: data.TaxCode ? data.TaxCode : '',
                            bankNumber: data.BankNumber ? data.BankNumber : '',
                            bankName: data.BankName ? data.BankName : '',
                            birthday: data.Birthday ? data.Birthday : '',
                            degree: data.Degree ? data.Degree : '',
                            permanentResidence: data.PermanentResidence ? data.PermanentResidence : '',
                            probationaryDate: data.ProbationaryDate ? data.ProbationaryDate : '',
                            probationarySalary: data.ProbationarySalary ? data.ProbationarySalary : null,
                            workingDate: data.WorkingDate ? data.WorkingDate : null,
                            workingSalary: data.WorkingSalary ? data.WorkingSalary : null,
                            bhxhSalary: data.BHXHSalary ? data.BHXHSalary : null,
                            contactUrgent: data.ContactUrgent ? data.ContactUrgent : '',
                            idMayChamCong: data.IDMayChamCong ? data.IDMayChamCong : null,
                            email: data.Email ? data.Email : '',
                            statusEmployee: data.Status ? data.Status : '',
                            productivityWages: data.ProductivityWages ? data.ProductivityWages : '',
                            coefficientsSalary: data.CoefficientsSalary ? data.CoefficientsSalary : 0,
                        }
                        obj['fileAttach'] = {
                            id: data.file ? data.file.ID : null,
                            name: data.file ? data.file.Name : null,
                            link: data.file ? data.file.Link : null,
                        }
                        let tblHopDongNhanSu = mtblHopDongNhanSu(db);
                        tblHopDongNhanSu.belongsTo(mtblLoaiHopDong(db), { foreignKey: 'IDLoaiHopDong', sourceKey: 'IDLoaiHopDong', as: 'loaiHD' })

                        await tblHopDongNhanSu.findOne({
                            where: {
                                IDNhanVien: body.id
                            },
                            order: [
                                ['ID', 'DESC']
                            ],
                            include: [{
                                model: mtblLoaiHopDong(db),
                                required: false,
                                as: 'loaiHD'
                            },],
                        }).then(hd => {
                            // workingSalary ghi đè lên bảng employee
                            obj['contractCode'] = hd ? hd.ContractCode : '';
                            obj['idContract'] = hd ? hd.ID : '';
                            obj['idLoaiHopDong'] = hd ? hd.IDLoaiHopDong : '';
                            obj['signDate'] = hd ? hd.Date : '';
                            obj['workingSalary'] = hd ? hd.SalaryNumber : '';
                            obj['salaryText'] = hd ? hd.SalaryText : '';
                            obj['contractDateEnd'] = hd ? hd.ContractDateEnd : '';
                            obj['status'] = hd ? hd.Status : '';
                            obj['nameTypeContract'] = hd ? hd.loaiHD ? hd.loaiHD.TenLoaiHD : '' : '';
                            obj['codeTypeContract'] = hd ? hd.loaiHD ? hd.loaiHD.MaLoaiHD : '' : '';
                        })
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
    // add_tbl_dmnhanvien
    addtblDMNhanvien: (req, res) => {
        let body = req.body;
        let now = moment().format('DD-MM-YYYY HH:mm:ss.SSS');
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let check = await mtblDMNhanvien(db).findOne({
                        where: {
                            StaffCode: body.staffCode,
                            IDMayChamCong: body.idMayChamCong,
                        },
                    })
                    if (body.fileAttach)
                        body.fileAttach = JSON.parse(body.fileAttach)
                    if (!check)
                        mtblDMNhanvien(db).create({
                            StaffCode: body.staffCode ? body.staffCode : '',
                            StaffName: body.staffName ? body.staffName : '',
                            CMNDNumber: body.cmndNumber ? body.cmndNumber : '',
                            CMNDPlace: body.cmndPlace ? body.cmndPlace : '',
                            CMNDDate: body.cmndDate ? body.cmndDate : null,
                            Address: body.address ? body.address : '',
                            IDNation: body.idNation ? body.idNation : null,
                            PhoneNumber: body.phoneNumber ? body.phoneNumber : '',
                            Gender: body.gender ? body.gender : '',
                            IDBoPhan: body.idBoPhan ? body.idBoPhan : null,
                            IDChucVu: body.idChucVu ? body.idChucVu : null,
                            TaxCode: body.taxCode ? body.taxCode : '',
                            BankNumber: body.bankNumber ? body.bankNumber : '',
                            BankName: body.bankName ? body.bankName : '',
                            Birthday: body.birthday ? body.birthday : null,
                            Degree: body.degree ? body.degree : '',
                            PermanentResidence: body.permanentResidence ? body.permanentResidence : '',
                            ProbationaryDate: body.probationaryDate ? body.probationaryDate : null,
                            probationarySalary: body.probationarySalary ? body.probationarySalary : null,
                            // WorkingDate: body.workingDate ? body.workingDate : null,
                            WorkingSalary: body.workingSalary ? body.workingSalary : null,
                            BHXHSalary: body.bhxhSalary ? body.bhxhSalary : null,
                            ContactUrgent: body.contactUrgent ? body.contactUrgent : '',
                            // IDMayChamCong: body.idMayChamCong ? body.idMayChamCong : null,
                            Email: body.email ? body.email : '',
                            ProductivityWages: body.productivityWages ? body.productivityWages : '',
                            CoefficientsSalary: body.coefficientsSalary ? body.coefficientsSalary : 0,
                            Status: body.statusEmployee ? body.statusEmployee : 'Hưởng lương và được công ty đóng bảo hiểm',
                            IDSpecializedSoftware: body.idSpecializedSoftware ? body.idSpecializedSoftware : null,
                            IDMayChamCong: body.idMayChamCong ? body.idMayChamCong : null,
                            FileAttachID: body.fileAttach ? body.fileAttach.id : null,
                        }).then(async data => {
                            await mtblBangLuong(db).create({
                                Date: body.signDate ? body.signDate : null,
                                WorkingSalary: body.workingSalary ? body.workingSalary : 0,
                                BHXHSalary: body.bhxhSalary ? body.bhxhSalary : 0,
                                DateEnd: body.contractDateEnd ? body.contractDateEnd : null,
                                IDNhanVien: data.ID,
                            })
                            if (data)
                                await mtblHopDongNhanSu(db).update({
                                    Status: 'Hết hiệu lực'
                                }, {
                                    where: { IDNhanVien: data.ID }
                                })
                            let contractID = await mtblHopDongNhanSu(db).create({
                                IDNhanVien: data.ID,
                                ContractCode: body.contractCode ? body.contractCode : '',
                                Date: body.signDate ? body.signDate : null,
                                IDLoaiHopDong: body.idLoaiHopDong ? body.idLoaiHopDong : null,
                                SalaryNumber: body.workingSalary ? body.workingSalary : 0,
                                SalaryText: body.workingSalary ? body.workingSalary : '',
                                ContractDateEnd: body.contractDateEnd ? body.contractDateEnd : null,
                                ContractDateStart: body.signDate ? body.signDate : null,
                                UnitSalary: 'VND',
                                WorkingPlace: '',
                                Status: body.status ? body.status : '',
                                ProductivityWages: body.productivityWages ? body.productivityWages : null,
                                CoefficientsSalary: body.coefficientsSalary ? body.coefficientsSalary : null,
                            })
                            var result = {
                                contractID: contractID.ID,
                                status: Constant.STATUS.SUCCESS,
                                message: Constant.MESSAGE.ACTION_SUCCESS,
                            }
                            res.json(result);
                        })
                    else {
                        var result = {
                            status: Constant.STATUS.FAIL,
                            message: "Mã nhân viên hoặc id chấm công đã tồn tại. Vui lòng kiểm tra lại!",
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
    // update_tbl_dmnhanvien
    updatetblDMNhanvien: (req, res) => {
        let body = req.body;
        let now = moment().format('DD-MM-YYYY HH:mm:ss.SSS');
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let update = [];
                    let idCHamCong = await mtblDMNhanvien(db).findOne({
                        where: {
                            ID: body.id,
                        },
                    })
                    let check = true;
                    if (idCHamCong.IDMayChamCong != body.idMayChamCong) {
                        await mtblDMNhanvien(db).findOne({
                            where: {
                                IDMayChamCong: body.idMayChamCong,
                            },
                        }).then(data => {
                            if (data)
                                check = false
                        })
                    }
                    if (check) {
                        if (body.coefficientsSalary)
                            update.push({ key: 'CoefficientsSalary', value: body.coefficientsSalary });
                        if (body.cmndNumber || body.cmndNumber === '')
                            update.push({ key: 'CMNDNumber', value: body.cmndNumber });
                        if (body.staffCode || body.staffCode === '')
                            update.push({ key: 'StaffCode', value: body.staffCode });
                        if (body.staffName || body.staffName === '')
                            update.push({ key: 'StaffName', value: body.staffName });
                        if (body.cmndumber || body.cmndumber === '')
                            update.push({ key: 'CMNDumber', value: body.cmndumber });
                        if (body.cmndPlace || body.cmndPlace === '')
                            update.push({ key: 'CMNDPlace', value: body.cmndPlace });
                        if (body.address || body.address === '')
                            update.push({ key: 'Address', value: body.address });
                        if (body.statusEmployee || body.statusEmployee === '')
                            update.push({ key: 'Status', value: body.statusEmployee });
                        if (body.idSpecializedSoftware || body.idSpecializedSoftware === '')
                            update.push({ key: 'IDSpecializedSoftware', value: body.idSpecializedSoftware });
                        if (body.idNation || body.idNation === '') {
                            if (body.idNation === '')
                                update.push({ key: 'IDNation', value: null });
                            else
                                update.push({ key: 'IDNation', value: body.idNation });
                        }
                        if (body.fileAttach || body.fileAttach === '') {
                            body.fileAttach = JSON.parse(body.fileAttach)
                            if (body.fileAttach === '')
                                update.push({ key: 'FileAttachID', value: null });
                            else
                                update.push({ key: 'FileAttachID', value: body.fileAttach.id });
                        }
                        if (body.fileAttachID || body.fileAttachID === '') {
                            if (body.fileAttachID === '')
                                update.push({ key: 'FileAttachID', value: null });
                            else
                                update.push({ key: 'FileAttachID', value: body.fileAttachID });
                        }
                        if (body.productivityWages || body.productivityWages === '') {
                            if (body.productivityWages === '')
                                update.push({ key: 'ProductivityWages', value: null });
                            else
                                update.push({ key: 'ProductivityWages', value: body.productivityWages });
                        }
                        if (body.cmndDate || body.cmndDate === '') {
                            if (body.cmndDate === '')
                                update.push({ key: 'CMNDDate', value: null });
                            else
                                update.push({ key: 'CMNDDate', value: body.cmndDate });
                        }
                        if (body.phoneNumber || body.phoneNumber === '')
                            update.push({ key: 'PhoneNumber', value: body.phoneNumber });
                        if (body.gender || body.gender === '')
                            update.push({ key: 'Gender', value: body.gender });
                        if (body.idBoPhan || body.idBoPhan === '') {
                            if (body.idBoPhan === '')
                                update.push({ key: 'IDBoPhan', value: null });
                            else
                                update.push({ key: 'IDBoPhan', value: body.idBoPhan });
                        }

                        if (body.idChucVu || body.idChucVu === '') {
                            if (body.idChucVu === '')
                                update.push({ key: 'IDChucVu', value: null });
                            else
                                update.push({ key: 'IDChucVu', value: body.idChucVu });
                        }
                        if (body.taxCode || body.taxCode === '')
                            update.push({ key: 'TaxCode', value: body.taxCode });
                        if (body.bankNumber || body.bankNumber === '')
                            update.push({ key: 'BankNumber', value: body.bankNumber });
                        if (body.bankName || body.bankName === '')
                            update.push({ key: 'BankName', value: body.bankName });
                        if (body.birthday || body.birthday === '') {
                            if (body.birthday === '')
                                update.push({ key: 'Birthday', value: null });
                            else
                                update.push({ key: 'Birthday', value: body.birthday });
                        }
                        if (body.degree || body.degree === '')
                            update.push({ key: 'Degree', value: body.degree });
                        if (body.permanentResidence || body.permanentResidence === '')
                            update.push({ key: 'PermanentResidence', value: body.permanentResidence });
                        if (body.probationaryDate || body.probationaryDate === '') {
                            if (body.probationaryDate === '')
                                update.push({ key: 'ProbationaryDate', value: null });
                            else
                                update.push({ key: 'ProbationaryDate', value: body.probationaryDate });
                        }
                        if (body.probationarySalary || body.probationarySalary === '') {
                            if (body.probationarySalary === '')
                                update.push({ key: 'probationarySalary', value: null });
                            else
                                update.push({ key: 'probationarySalary', value: body.probationarySalary });
                        }
                        if (body.workingDate || body.workingDate === '') {
                            if (body.workingDate === '')
                                update.push({ key: 'WorkingDate', value: null });
                            else
                                update.push({ key: 'WorkingDate', value: body.workingDate });
                        }
                        if (body.workingSalary || body.workingSalary === '') {
                            if (body.workingSalary === '')
                                update.push({ key: 'WorkingSalary', value: null });
                            else
                                update.push({ key: 'WorkingSalary', value: body.workingSalary });
                        }
                        if (body.bhxhSalary || body.bhxhSalary === '') {
                            if (body.bhxhSalary === '')
                                update.push({ key: 'BHXHSalary', value: null });
                            else
                                update.push({ key: 'BHXHSalary', value: body.bhxhSalary });
                        }
                        if (body.contactUrgent || body.contactUrgent === '')
                            update.push({ key: 'ContactUrgent', value: body.contactUrgent });
                        if (body.email || body.email === '')
                            update.push({ key: 'Email', value: body.email });
                        if (body.idMayChamCong || body.idMayChamCong === '') {
                            if (body.idMayChamCong === '')
                                update.push({ key: 'IDMayChamCong', value: null });
                            else
                                update.push({ key: 'IDMayChamCong', value: body.idMayChamCong });
                        }
                        database.updateTable(update, mtblDMNhanvien(db), body.id).then(response => {
                            if (response == 1) {
                                res.json(Result.ACTION_SUCCESS);
                            } else {
                                res.json(Result.SYS_ERROR_RESULT);
                            }
                        })
                    } else {
                        var result = {
                            status: Constant.STATUS.FAIL,
                            message: "Mã nhân viên hoặc id chấm công đã tồn tại. Vui lòng kiểm tra lại!",
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
    // delete_tbl_dmnhanvien
    deletetblDMNhanvien: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            let body = req.body;
            if (db) {
                try {
                    let listID = JSON.parse(body.listID);
                    await deleteRelationshiptblDMNhanvien(db, listID);
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
    // get_list_tbl_dmnhanvien
    getListtblDMNhanvien: (req, res) => {
        let body = req.body;
        console.log(body);
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let whereOjb = []
                    if (body.dataSearch) {
                        var data = JSON.parse(body.dataSearch)
                        if (data.search) {
                            var list = [];
                            await mtblDMBoPhan(db).findAll({
                                order: [
                                    ['ID', 'DESC']
                                ],
                                where: {
                                    [Op.or]: [{
                                        DepartmentCode: {
                                            [Op.like]: '%' + data.search + '%'
                                        }
                                    },
                                    {
                                        DepartmentName: {
                                            [Op.like]: '%' + data.search + '%'
                                        }
                                    }
                                    ]
                                }
                            }).then(data => {
                                data.forEach(item => {
                                    list.push(item.ID);
                                })
                            })
                            where = [{
                                StaffCode: {
                                    [Op.like]: '%' + data.search + '%'
                                }
                            },
                            {
                                StaffName: {
                                    [Op.like]: '%' + data.search + '%'
                                }
                            },
                            {
                                Address: {
                                    [Op.like]: '%' + data.search + '%'
                                }
                            },
                            {
                                Email: {
                                    [Op.like]: '%' + data.search + '%'
                                }
                            },
                            {
                                Gender: {
                                    [Op.like]: '%' + data.search + '%'
                                }
                            },
                            {
                                IDBoPhan: {
                                    [Op.in]: list
                                }
                            },
                            ];
                        } else {
                            where = [{
                                StaffName: {
                                    [Op.ne]: '%%'
                                }
                            },];
                        }
                        whereOjb = {
                            [Op.and]: [{
                                [Op.or]: where
                            }],
                            [Op.or]: [{
                                ID: {
                                    [Op.ne]: null
                                }
                            }],
                        };
                        if (data.items) {
                            for (var i = 0; i < data.items.length; i++) {
                                let userFind = {};
                                if (data.items[i].fields['name'] === 'MÃ NHÂN VIÊN') {
                                    userFind['StaffCode'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
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
                                if (data.items[i].fields['name'] === 'GIỚI TÍNH') {
                                    userFind['Gender'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
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
                                if (data.items[i].fields['name'] === 'NGÀY SINH') {
                                    let startDate = moment(data.items[i]['startDate']).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss')
                                    let endDate = moment(data.items[i]['endDate']).add(23 + 7, 'hours').format('YYYY-MM-DD HH:mm:ss')
                                    userFind['Birthday'] = {
                                        [Op.between]: [startDate, endDate]
                                    }
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
                                if (data.items[i].fields['name'] === 'TÊN NHÂN VIÊN') {
                                    userFind['StaffName'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
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
                                if (data.items[i].fields['name'] === 'ĐỊA CHỈ') {
                                    userFind['Address'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
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
                                if (data.items[i].fields['name'] === 'EMAIL') {
                                    userFind['Email'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
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
                                if (data.items[i].fields['name'] === 'LOẠI ĐỐI TƯỢNG') {
                                    userFind['Status'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
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
                                if (data.items[i].fields['name'] === 'SỐ ĐIỆN THOẠI') {
                                    userFind['PhoneNumber'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
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
                                if (data.items[i].fields['name'] === 'SỐ CMND') {
                                    userFind['CMNDNumber'] = {
                                        [Op.like]: '%' + data.items[i]['searchFields'] + '%'
                                    }
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
                                if (data.items[i].fields['name'] === 'PHÒNG BAN/BỘ PHẬN') {
                                    userFind['IDBoPhan'] = {
                                        [Op.eq]: data.items[i]['searchFields']
                                    }
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
                                if (data.items[i].fields['name'] === 'CHI NHÁNH') {
                                    let list = []
                                    await mtblDMBoPhan(db).findAll({
                                        where: { IDChiNhanh: data.items[i]['searchFields'] }
                                    }).then(data => {
                                        data.forEach(item => {
                                            list.push(item.ID)
                                        })
                                    })
                                    userFind['IDBoPhan'] = {
                                        [Op.in]: list
                                    }
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
                    let tblDMNhanvien = mtblDMNhanvien(db);
                    tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bophan' })
                    tblDMNhanvien.belongsTo(mtblFileAttach(db), { foreignKey: 'FileAttachID', sourceKey: 'FileAttachID', as: 'file' })
                    let tblDMBoPhan = mtblDMBoPhan(db);
                    tblDMBoPhan.belongsTo(mtblDMChiNhanh(db), { foreignKey: 'IDChiNhanh', sourceKey: 'IDChiNhanh' })
                    let all = await tblDMNhanvien.count({ where: whereOjb, })
                    tblDMNhanvien.findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [{
                            model: tblDMBoPhan,
                            required: false,
                            as: 'bophan',
                            include: [{
                                model: mtblDMChiNhanh(db)
                            },
                            ]
                        },
                        {
                            model: mtblFileAttach(db),
                            required: false,
                            as: 'file',
                        },],
                    }).then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                staffCode: element.StaffCode ? element.StaffCode : '',
                                staffName: element.StaffName ? element.StaffName : '',
                                cmndNumber: element.CMNDNumber ? element.CMNDNumber : '',
                                address: element.Address ? element.Address : '',
                                idNation: element.IDNation ? Number(element.IDNation) : null,
                                phoneNumber: element.PhoneNumber ? element.PhoneNumber : '',
                                gender: element.Gender ? element.Gender : '',
                                idBoPhan: element.IDBoPhan ? Number(element.IDBoPhan) : null,
                                departmentName: element.bophan ? element.bophan.DepartmentName : null,
                                departmentCode: element.bophan ? element.bophan.DepartmentCode : null,
                                branchCode: element.bophan ? element.bophan.tblDMChiNhanh ? element.bophan.tblDMChiNhanh.BranchCode : null : null,
                                branchName: element.bophan ? element.bophan.tblDMChiNhanh ? element.bophan.tblDMChiNhanh.BranchName : null : null,
                                idChucVu: element.IDChucVu ? Number(element.IDChucVu) : null,
                                taxCode: element.TaxCode ? element.TaxCode : '',
                                bankNumber: element.BankNumber ? element.BankNumber : '',
                                bankName: element.BankName ? element.BankName : '',
                                birthday: element.Birthday ? moment(element.Birthday).format('DD/MM/YYYY') : '',
                                degree: element.Degree ? element.Degree : '',
                                permanentResidence: element.PermanentResidence ? element.PermanentResidence : '',
                                probationaryDate: element.ProbationaryDate ? moment(element.ProbationaryDate).format('DD/MM/YYYY') : '',
                                probationarySalary: element.ProbationarySalary ? element.ProbationarySalary : null,
                                workingDate: element.WorkingDate ? moment(element.WorkingDate).format('DD/MM/YYYY') : null,
                                workingSalary: element.WorkingSalary ? element.WorkingSalary : null,
                                bhxhSalary: element.BHXHSalary ? element.BHXHSalary : null,
                                contactUrgent: element.ContactUrgent ? element.ContactUrgent : '',
                                idMayChamCong: element.IDMayChamCong ? element.IDMayChamCong : null,
                                email: element.Email ? element.Email : '',
                                statusEmployee: element.Status ? element.Status : '',
                                productivityWages: element.ProductivityWages ? element.ProductivityWages : '',
                                idSpecializedSoftware: element.idSpecializedSoftware ? element.idSpecializedSoftware : null,
                            }
                            obj['fileAttach'] = {
                                id: element.file ? element.file.ID : null,
                                name: element.file ? element.file.Name : null,
                                link: element.file ? element.file.Link : null,
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var result = {
                            array: array,
                            all: all,
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
    // get_list_name_tbl_dmnhanvien
    getListNametblDMNhanvien: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblDMNhanvien = mtblDMNhanvien(db);
                    tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bp' })

                    tblDMNhanvien.findAll({
                        include: [{
                            model: mtblDMBoPhan(db),
                            required: false,
                            as: 'bp'
                        },],
                    }).then(async staff => {
                        var array = [];
                        for (let i = 0; i < staff.length; i++) {
                            let salary = 0;
                            if (body.date) {
                                let dateSearch = moment(data.date).add(30, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS');
                                await mtblIncreaseSalariesAndStaff(db).findAll({
                                    where: {
                                        Date: {
                                            [Op.lte]: dateSearch
                                        },
                                        StaffID: staff[i].ID,
                                    },
                                }).then(async data => {
                                    data.forEach(element => {
                                        salary += element.Increase
                                    })
                                })
                            }
                            var obj = {
                                id: Number(staff[i].ID),
                                staffCode: staff[i].StaffCode ? staff[i].StaffCode : '',
                                staffName: staff[i].StaffName ? staff[i].StaffName : '',
                                departmentName: staff[i].bp ? staff[i].bp.DepartmentName : '',
                                productivityWagesPresent: Number(staff[i].ProductivityWages ? staff[i].ProductivityWages : 0) + Number(salary),
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
    // get_list_history_nhanvien
    getListHistoryNhanVien: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblTaiSanBanGiao = mtblTaiSanBanGiao(db);
                    let stt = 1;
                    await tblTaiSanBanGiao.findAll({ where: { IDNhanVienSoHuu: body.idNhanVien }, }).then(async data => {
                        var array = [];
                        var result = {
                            array: array,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                        }
                        if (data) {
                            for (var i = 0; i < data.length; i++) {
                                let tblTaiSan = mtblTaiSan(db);
                                tblTaiSan.belongsTo(mtblDMHangHoa(db), { foreignKey: 'IDDMHangHoa', sourceKey: 'IDDMHangHoa', as: 'hanghoa' })
                                let tblTaiSanHistory = mtblTaiSanHistory(db);
                                tblTaiSanHistory.belongsTo(tblTaiSan, { foreignKey: 'IDTaiSan', sourceKey: 'IDTaiSan', as: 'taisan' })
                                tblTaiSanHistory.belongsTo(mtblTaiSanBanGiao(db), { foreignKey: 'IDTaiSanBanGiao', sourceKey: 'IDTaiSanBanGiao', as: 'bg' })
                                var date = data[i].Date
                                var id = data[i].ID
                                await tblTaiSanHistory.findAll({
                                    where: {
                                        IDTaiSanBanGiao: data[i].ID,
                                    },
                                    include: [{
                                        model: tblTaiSan,
                                        required: false,
                                        as: 'taisan',
                                        include: [{
                                            model: mtblDMHangHoa(db),
                                            required: false,
                                            as: 'hanghoa'
                                        },],
                                    },
                                    {
                                        model: mtblTaiSanBanGiao(db),
                                        required: false,
                                        as: 'bg',
                                    },
                                    ],
                                }).then(tsht => {
                                    if (tsht)
                                        for (var j = 0; j < tsht.length; j++) {
                                            array.push({
                                                stt: stt,
                                                id: id,
                                                codeDevice: tsht[j].taisan ? tsht[j].taisan.TSNBCode : '',
                                                nameDevice: tsht[j].taisan ? tsht[j].taisan.hanghoa ? tsht[j].taisan.hanghoa.Name : '' : '',
                                                dateFrom: moment(date).format('DD/MM/YYYY'),
                                                dateTo: tsht[j].bg ? (tsht[j].bg.Date ? moment(tsht[j].bg.Date).format('DD/MM/YYYY') : '') : '',
                                            })
                                            stt += 1;
                                        }
                                })
                            }
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
    // get_list_history_vpp_staff
    getListHistoryVPPStaff: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let tblPhanPhoiVPP = mtblPhanPhoiVPP(db);
                    let stt = 1;
                    await tblPhanPhoiVPP.findAll({ where: { IDNhanVienSoHuu: body.idNhanVien }, }).then(async data => {
                        var array = [];
                        var result = {
                            array: array,
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS,
                        }
                        if (data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                let tblPhanPhoiVPPChiTiet = mtblPhanPhoiVPPChiTiet(db);
                                tblPhanPhoiVPPChiTiet.belongsTo(mtblVanPhongPham(db), { foreignKey: 'IDVanPhongPham', sourceKey: 'IDVanPhongPham', as: 'vpp' })

                                await tblPhanPhoiVPPChiTiet.findAll({
                                    where: { IDPhanPhoiVPP: data[i].ID },
                                    include: [{
                                        model: mtblVanPhongPham(db),
                                        required: false,
                                        as: 'vpp'
                                    },],
                                }).then(detail => {
                                    detail.forEach(element => {
                                        array.push({
                                            stt: stt,
                                            id: element.vpp ? element.vpp.ID : null,
                                            codeDevice: element.vpp ? element.vpp.VPPCode : '',
                                            nameDevice: element.vpp ? element.vpp.VPPName : '',
                                            dateFrom: moment(data[i].Date).format('DD/MM/YYYY'),
                                            dateTo: moment().format('DD/MM/YYYY'),
                                        })
                                        stt += 1;
                                    })
                                })
                            }
                        }
                        stt += 1;
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
    //get_employee_from_department
    getEmployeeFromDepartment: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    let whereOjb = [{
                        IDBoPhan: body.idBoPhan,
                    }]
                    let stt = 1;
                    let tblDMNhanvien = mtblDMNhanvien(db);
                    tblDMNhanvien.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bophan' })
                    let tblDMBoPhan = mtblDMBoPhan(db);
                    tblDMBoPhan.belongsTo(mtblDMChiNhanh(db), { foreignKey: 'IDChiNhanh', sourceKey: 'IDChiNhanh' })
                    let all = await tblDMNhanvien.count({ where: whereOjb, })
                    tblDMNhanvien.findAll({
                        order: [
                            ['ID', 'DESC']
                        ],
                        offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                        limit: Number(body.itemPerPage),
                        where: whereOjb,
                        include: [{
                            model: tblDMBoPhan,
                            required: false,
                            as: 'bophan',
                            include: [{
                                model: mtblDMChiNhanh(db)
                            }]
                        },],
                    }).then(data => {
                        var array = [];
                        data.forEach(element => {
                            var obj = {
                                stt: stt,
                                id: Number(element.ID),
                                staffCode: element.StaffCode ? element.StaffCode : '',
                                staffName: element.StaffName ? element.StaffName : '',
                                cmndNumber: element.CMNDNumber ? element.CMNDNumber : '',
                                address: element.Address ? element.Address : '',
                                idNation: element.IDNation ? element.IDNation : null,
                                phoneNumber: element.PhoneNumber ? element.PhoneNumber : '',
                                gender: element.Gender ? element.Gender : '',
                                idBoPhan: element.IDBoPhan ? element.IDBoPhan : null,
                                departmentName: element.bophan ? element.bophan.DepartmentName : null,
                                departmentCode: element.bophan ? element.bophan.DepartmentCode : null,
                                branchCode: element.bophan ? element.bophan.tblDMChiNhanh ? element.bophan.tblDMChiNhanh.BranchCode : null : null,
                                branchName: element.bophan ? element.bophan.tblDMChiNhanh ? element.bophan.tblDMChiNhanh.BranchName : null : null,
                                idChucVu: element.IDChucVu ? element.IDChucVu : null,
                                taxCode: element.TaxCode ? element.TaxCode : '',
                                bankNumber: element.BankNumber ? element.BankNumber : '',
                                bankName: element.BankName ? element.BankName : '',
                                birthday: element.Birthday ? element.Birthday : '',
                                degree: element.Degree ? element.Degree : '',
                                dermanentResidence: element.DermanentResidence ? element.DermanentResidence : '',
                                probationaryDate: element.ProbationaryDate ? element.ProbationaryDate : '',
                                probationarySalary: element.ProbationarySalary ? element.ProbationarySalary : null,
                                workingDate: element.WorkingDate ? element.WorkingDate : null,
                                workingSalary: element.WorkingSalary ? element.WorkingSalary : null,
                                bhxhSalary: element.BHXHSalary ? element.BHXHSalary : null,
                                contactUrgent: element.ContactUrgent ? element.ContactUrgent : '',
                                idMayChamCong: element.IDMayChamCong ? element.IDMayChamCong : null,
                                email: element.Email ? element.Email : '',
                            }
                            array.push(obj);
                            stt += 1;
                        });
                        var result = {
                            array: array,
                            all: all,
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
    // get_number_leave_day
    getNumberLeaveDay: (req, res) => {
        let body = req.body;
        database.connectDatabase().then(async db => {
            if (db) {
                try {
                    mtblDMNhanvien(db).findOne({ where: { ID: body.id } }).then(async data => {
                        let month = Number(moment().format('MM'));
                        let leave = 0;
                        await mtblNghiPhep(db).findAll({
                            where: { IDNhanVien: data.ID }
                        }).then(np => {
                            if (np)
                                np.forEach(item => {
                                    leave += item.Remaining
                                })
                        })
                        var obj = {
                            id: Number(data.ID),
                            numberLeave: month - leave
                        }

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