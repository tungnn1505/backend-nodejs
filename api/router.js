module.exports = function (app) {
    var checkToken = require('./constants/token');
    var tblDMUser = require('./controllers/ctl-tblDMUser');
    var tblDMNhanvien = require('./controllers/ctl-tblDMNhanvien');
    var tblDMPermission = require('./controllers/ctl-tblDMPermission');
    var tblDMLoaiTaiSan = require('./controllers/ctl-tblDMLoaiTaiSan');
    var tblYeuCauMuaSam = require('./controllers/ctl-tblYeuCauMuaSam');
    var tblDMHanghoa = require('./controllers/ctl-tblDMHangHoa');
    var tblDMNhaCungCap = require('./controllers/ctl-tblDMNhaCungCap');
    var tblTaiSan = require('./controllers/ctl-tblTaiSanADD');
    var tblDMBoPhan = require('./controllers/ctl-tblDMBoPhan');
    var tblDMChiNhanh = require('./controllers/ctl-tblDMChiNhanh');
    var tblVanPhongPham = require('./controllers/ctl-tblVanPhongPham');
    var tblThemVPP = require('./controllers/ctl-tblThemVPP');
    var tblDeNghiThanhToan = require('./controllers/ctl-tblDeNghiThanhToan');
    var tblTaiSanBanGiao = require('./controllers/ctl-tblTaiSanBanGiao');
    var tblPhanPhoiVPP = require('./controllers/ctl-tblPhanPhoiVPP');
    var tblFileAttach = require('./controllers/ctl-tblFileAttach');
    var tblNghiPhep = require('./controllers_hr/ctl-tblNghiPhep');
    var tblTemplate = require('./controllers/ctl-tblTemplate');
    var exportPDF = require('./controllers/export');

    app.route('/qlnb/convert_docx_to_pdf').post(exportPDF.convertDocxToPDF);

    let locy = require('./controller_finance/ctl-locyApi')
    app.route('/qlnb/get_ticket_types').post(locy.apiGetTicketTypes);

    app.route('/qlnb/export_to_file_excel').post(exportPDF.exportToFileExcel);

    app.route('/qlnb/export_to_file_excel_payment').post(exportPDF.exportToFileExcelPayment);

    app.route('/qlnb/export_to_file_import_and_export').post(exportPDF.exportToFileImportAndExport);

    app.route('/qlnb/export_to_file_asset_management').post(exportPDF.exportToFileAssetManagement);

    app.route('/qlnb/export_to_file_stationery').post(exportPDF.exportToFilestationery);

    app.route('/qlnb/export_to_file_excel_payroll').post(exportPDF.exportToFileExcelPayroll);

    app.route('/qlnb/export_tofile_excel_insurance_premiums').post(exportPDF.exportToFileExcelInsutancePremiums);

    app.route('/qlnb/export_excel_synthetic_timekeeping').post(exportPDF.exportToFileExcelSyntheticTimekeeping);

    app.route('/qlnb/export_excel_Detail_YCMS').post(exportPDF.exportExcelInDetailYCMS);

    app.route('/qlnb/convert_base64_img').post(exportPDF.converBase64ToImg);

    app.route('/qlnb/export_to_file_excel_VPP').post(exportPDF.exportToFileExcelVPP);

    app.route('/qlnb/export_to_file_excel_timekeeping').post(exportPDF.exportToFileExcelTimekeeping);


    app.route('/qlnb/delete_file').post(tblFileAttach.deletetblFileAttach);
    app.route('/qlnb/delete_file_from_link').post(tblFileAttach.deletetblFileFromLink);

    //---------------------------------------------------------------- Menu Quản lý danh mục--------------------------------------------------------------------------------------
    // Quản lý mẫu in
    app.route('/qlnb/add_tbl_template').post(checkToken.checkToken, tblTemplate.addTBLTemplate);
    app.route('/qlnb/update_tbl_template').post(checkToken.checkToken, tblTemplate.updateTBLTemplate);
    app.route('/qlnb/get_list_tbl_template').post(tblTemplate.getListTBLTemplate);
    app.route('/qlnb/delete_tbl_template').post(checkToken.checkToken, tblTemplate.deleteTBLTemplate);
    // Quản lý account
    app.route('/qlnb/login').post(tblDMUser.login);
    app.route('/qlnb/add_tbl_dmuser').post(checkToken.checkToken, tblDMUser.addtblDMUser);
    app.route('/qlnb/get_detail_tbl_dmuser').post(tblDMUser.getDetailtblDMUser);
    app.route('/qlnb/update_tbl_dmuser').post(checkToken.checkToken, tblDMUser.updatetblDMUser);
    app.route('/qlnb/update_permission_for_tbl_dmuser').post(checkToken.checkToken, tblDMUser.updatePermissionFortblDMUser);
    app.route('/qlnb/update_data_option_for_tbl_dmuser').post(checkToken.checkToken, tblDMUser.updateDataOptionFortblDMUser);
    app.route('/qlnb/get_data_option').post(checkToken.checkToken, tblDMUser.getDataOption);
    app.route('/qlnb/delete_tbl_dmuser').post(checkToken.checkToken, tblDMUser.deletetblDMUser);
    app.route('/qlnb/get_list_tbl_dmuser').post(tblDMUser.getListtblDMUser);
    app.route('/qlnb/get_list_name_tbl_dmuser').post(tblDMUser.getListNametblDMUser);
    app.route('/qlnb/get_list_name_tbl_dmpermission').post(tblDMPermission.getListNametblDMPermission);
    // Quản lý bộ phận
    app.route('/qlnb/add_tbl_dm_bophan').post(checkToken.checkToken, tblDMBoPhan.addtblDMBoPhan);
    app.route('/qlnb/update_tbl_dm_bophan').post(checkToken.checkToken, tblDMBoPhan.updatetblDMBoPhan);
    app.route('/qlnb/get_list_tbl_dm_bophan').post(checkToken.checkToken, tblDMBoPhan.getListtblDMBoPhan);
    app.route('/qlnb/get_list_name_tbl_dm_bophan').post(tblDMBoPhan.getListNametblDMBoPhan);
    app.route('/qlnb/delete_tbl_dm_bophan').post(checkToken.checkToken, tblDMBoPhan.deletetblDMBoPhan);

    app.route('/qlnb/get_list_name_tbl_dm_chinhanh').post(tblDMChiNhanh.getListNametblDMChiNhanh);
    // Quản lý chi nhánh
    app.route('/qlnb/add_tbl_dm_chinhanh').post(checkToken.checkToken, tblDMChiNhanh.addtblDMChiNhanh);
    app.route('/qlnb/update_tbl_dm_chinhanh').post(checkToken.checkToken, tblDMChiNhanh.updatetblDMChiNhanh);
    app.route('/qlnb/get_list_tbl_dm_chinhanh').post(tblDMChiNhanh.getListtblDMChiNhanh);
    app.route('/qlnb/get_list_name_tbl_dm_chinhanh').post(tblDMChiNhanh.getListNametblDMChiNhanh);
    app.route('/qlnb/delete_tbl_dm_chinhanh').post(checkToken.checkToken, tblDMChiNhanh.deletetblDMChiNhanh);

    //  Quản lý nhân viên
    app.route('/qlnb/get_list_tbl_dmnhanvien').post(checkToken.checkToken, tblDMNhanvien.getListtblDMNhanvien);
    app.route('/qlnb/add_tbl_dmnhanvien').post(checkToken.checkToken, tblDMNhanvien.addtblDMNhanvien);

    app.route('/qlnb/delete_tbl_dmnhanvien').post(checkToken.checkToken, tblDMNhanvien.deletetblDMNhanvien);

    app.route('/qlnb/detail_tbl_dmnhanvien').post(tblDMNhanvien.detailtblDMNhanvien);

    app.route('/qlnb/notify_users').post(tblDMNhanvien.notifyUsers);

    app.route('/qlnb/update_tbl_dmnhanvien').post(checkToken.checkToken, tblDMNhanvien.updatetblDMNhanvien);
    app.route('/qlnb/get_list_name_tbl_dmnhanvien').post(tblDMNhanvien.getListNametblDMNhanvien);
    app.route('/qlnb/get_employee_from_department').post(checkToken.checkToken, tblDMNhanvien.getEmployeeFromDepartment);
    app.route('/qlnb/get_number_leave_day').post(checkToken.checkToken, tblDMNhanvien.getNumberLeaveDay);

    // Lịch sử sử dụng của nhân viên 
    app.route('/qlnb/get_list_history_nhanvien').post(checkToken.checkToken, tblDMNhanvien.getListHistoryNhanVien);
    app.route('/qlnb/get_list_history_vpp_staff').post(checkToken.checkToken, tblDMNhanvien.getListHistoryVPPStaff);


    //  Quản lý loại tài sản
    app.route('/qlnb/add_tbl_dmloaitaisan').post(checkToken.checkToken, tblDMLoaiTaiSan.addtblDMLoaiTaiSan);
    app.route('/qlnb/update_tbl_dmloaitaisan').post(checkToken.checkToken, tblDMLoaiTaiSan.updatetblDMLoaiTaiSan);
    app.route('/qlnb/get_list_tbl_dmloaitaisan').post(checkToken.checkToken, tblDMLoaiTaiSan.getListtblDMLoaiTaiSan);
    app.route('/qlnb/delete_tbl_dmloaitaisan').post(checkToken.checkToken, tblDMLoaiTaiSan.deletetblDMLoaiTaiSan);
    app.route('/qlnb/get_list_name_tbl_dmloaitaisan').post(tblDMLoaiTaiSan.getListNametblDMLoaiTaiSan);

    // Danh mục tài sản
    app.route('/qlnb/add_tbl_dmhanghoa').post(checkToken.checkToken, tblDMHanghoa.addtblDMHangHoa);
    app.route('/qlnb/update_tbl_dmhanghoa').post(checkToken.checkToken, tblDMHanghoa.updatetblDMHangHoa);
    app.route('/qlnb/delete_tbl_dmhanghoa').post(checkToken.checkToken, tblDMHanghoa.deletetblDMHangHoa);
    app.route('/qlnb/get_list_tbl_dmhanghoa').post(checkToken.checkToken, tblDMHanghoa.getListtblDMHangHoa);
    app.route('/qlnb/get_list_name_tbl_dmhanghoa').post(tblDMHanghoa.getListNametblDMHangHoa);
    app.route('/qlnb/get_list_all_tbl_dmhanghoa').post(checkToken.checkToken, tblDMHanghoa.getListAlltblDMHangHoa);

    //  Danh mục nhà cung cấp
    app.route('/qlnb/add_tbl_dmnhacungcap').post(checkToken.checkToken, tblDMNhaCungCap.addtblDMNhaCungCap);
    app.route('/qlnb/update_tbl_dmnhacungcap').post(checkToken.checkToken, tblDMNhaCungCap.updatetblDMNhaCungCap);
    app.route('/qlnb/delete_tbl_dmnhacungcap').post(checkToken.checkToken, tblDMNhaCungCap.deletetblDMNhaCungCap);
    app.route('/qlnb/get_list_tbl_dmnhacungcap').post(checkToken.checkToken, tblDMNhaCungCap.getListtblDMNhaCungCap);
    app.route('/qlnb/get_list_name_tbl_dmnhacungcap').post(tblDMNhaCungCap.getListNametblDMNhaCungCap);
    app.route('/qlnb/get_list_obj_of_payment_order').post(tblDMNhaCungCap.getListObjOfPayment);

    //  Danh mục văn phòng phẩm
    app.route('/qlnb/add_tbl_vanphongpham').post(checkToken.checkToken, tblVanPhongPham.addtblVanPhongPham);
    app.route('/qlnb/update_tbl_vanphongpham').post(checkToken.checkToken, tblVanPhongPham.updatetblVanPhongPham);
    app.route('/qlnb/delete_tbl_vanphongpham').post(checkToken.checkToken, tblVanPhongPham.deletetblVanPhongPham);
    app.route('/qlnb/get_list_tbl_vanphongpham').post(checkToken.checkToken, tblVanPhongPham.getListtblVanPhongPham);
    app.route('/qlnb/get_list_name_tbl_vanphongpham').post(tblVanPhongPham.getListNametblVanPhongPham);


    //---------------------------------------------------------------- Menu yêu cầu mua sắm --------------------------------------------------------------------------------------
    // Đề nghị mua sắm
    app.route('/qlnb/add_tbl_yeucaumuasam').post(checkToken.checkToken, tblYeuCauMuaSam.addtblYeuCauMuaSam);
    app.route('/qlnb/update_tbl_yeucaumuasam').post(checkToken.checkToken, tblYeuCauMuaSam.updatetblYeuCauMuaSam);
    app.route('/qlnb/get_list_tbl_yeucaumuasam').post(tblYeuCauMuaSam.getListtblYeuCauMuaSam);
    app.route('/qlnb/get_list_tbl_yeucaumuasam_app').post(tblYeuCauMuaSam.getListtblYeuCauMuaSamApp);

    app.route('/qlnb/get_detail_tbl_yeucaumuasam').post(checkToken.checkToken, tblYeuCauMuaSam.getDetailtblYeuCauMuaSam);

    app.route('/qlnb/get_tbl_request_from_payment').post(tblYeuCauMuaSam.gettblYeuCauMuaSamFromDeNghiThanhToan);
    app.route('/qlnb/change_notification_status_request').post(tblYeuCauMuaSam.changeNotificationStatusRequest);

    app.route('/qlnb/delete_tbl_yeucaumuasam').post(checkToken.checkToken, tblYeuCauMuaSam.deletetblYeuCauMuaSam);

    // button approval
    app.route('/qlnb/approval_first_approver').post(checkToken.checkToken, tblYeuCauMuaSam.approvalFirstApprover);
    app.route('/qlnb/approval_second_approver').post(checkToken.checkToken, tblYeuCauMuaSam.approvalSecondApprover);
    app.route('/qlnb/refuse_first_approver').post(checkToken.checkToken, tblYeuCauMuaSam.refuseFirstApprover);
    app.route('/qlnb/refuse_second_approver').post(checkToken.checkToken, tblYeuCauMuaSam.refuseSecondApprover);
    app.route('/qlnb/cancel_purchase').post(checkToken.checkToken, tblYeuCauMuaSam.cancelPurchase);
    app.route('/qlnb/done_purchase').post(checkToken.checkToken, tblYeuCauMuaSam.donePurchase);
    // app.route('/qlnb/get_list_name_tbl_yeucaumuasam').post(checkToken.checkToken ,tblYeuCauMuaSam.getListNametblYeuCauMuaSam);

    // lấy name hang hoa
    app.route('/qlnb/get_list_name_tbl_dmhanghoa').post(tblDMHanghoa.getListNametblDMHangHoa);
    app.route('/qlnb/get_list_asset_from_goods').post(checkToken.checkToken, tblDMHanghoa.getListAssetFromGoods);
    app.route('/qlnb/get_list_asset_from_goods_additional').post(checkToken.checkToken, tblDMHanghoa.getListAssetFromGoodsAdditional);

    // lấy name nhân viên ---- dòng 24
    //---------------------------------------------------------------- Menu quản lý tài sản --------------------------------------------------------------------------------------

    app.route('/qlnb/add_tbl_taisan_bangiao').post(checkToken.checkToken, tblTaiSanBanGiao.addtblTaiSanBanGiao);
    app.route('/qlnb/update_tbl_taisan_bangiao').post(checkToken.checkToken, tblTaiSanBanGiao.updatetblTaiSanBanGiao);
    // app.route('/qlnb/get_list_tbl_taisan_bangiao').post(tblTaiSanBanGiao.deleteRelationshiptblTaiSanBanGiao);
    // app.route('/qlnb/get_list_tbl_taisan_bangiao').post(tblTaiSanBanGiao.addtblTaiSanBanGiao);



    app.route('/qlnb/detail_tbl_taisanadd').post(checkToken.checkToken, tblTaiSan.detailtblTaiSanADD);
    app.route('/qlnb/update_detail_asset').post(checkToken.checkToken, tblTaiSan.updateDetailAsset);
    app.route('/qlnb/get_list_history_staff_use').post(checkToken.checkToken, tblTaiSan.getListHistoryStaffUse);


    app.route('/qlnb/add_tbl_taisanadd').post(checkToken.checkToken, tblTaiSan.addtblTaiSanADD);
    app.route('/qlnb/update_tbl_taisanadd').post(checkToken.checkToken, tblTaiSan.updatetblTaiSanADD);
    app.route('/qlnb/delete_tbl_taisanadd').post(checkToken.checkToken, tblTaiSan.deletetblTaiSanADD);
    app.route('/qlnb/get_list_tbl_taisanadd').post(checkToken.checkToken, tblTaiSan.getListtblTaiSanADD);
    app.route('/qlnb/get_list_tbl_taisan_chuasudung').post(tblTaiSan.getListtblTaiSanChuaSuDung);
    app.route('/qlnb/get_list_tbl_taisan_theodoi').post(checkToken.checkToken, tblTaiSan.getListtblTaiSanTheoDoi);



    app.route('/qlnb/get_list_attach_asset').post(checkToken.checkToken, tblTaiSan.getListAttachAsset);

    app.route('/qlnb/replace_asset_attach').post(checkToken.checkToken, tblTaiSan.replateAssetAttach);

    app.route('/qlnb/additional_asset_attach').post(checkToken.checkToken, tblTaiSan.additionalAssetAttach);

    app.route('/qlnb/delete_asset_attach').post(checkToken.checkToken, tblTaiSan.deleteAssetAttach);

    app.route('/qlnb/withdraw_asset').post(checkToken.checkToken, tblTaiSan.withdrawAsset);

    app.route('/qlnb/get_list_asset_not_use').post(checkToken.checkToken, tblTaiSan.getListAssetNotuse);

    app.route('/qlnb/asset_liquidation').post(checkToken.checkToken, tblTaiSan.assetLiquidation);

    app.route('/qlnb/liquidation_of_many_assets').post(checkToken.checkToken, tblTaiSan.liquidationOfManyAssets);



    //---------------------------------------------------------------- Menu quản lý văn phòng phẩm --------------------------------------------------------------------------------------
    app.route('/qlnb/add_tbl_them_vpp').post(checkToken.checkToken, tblThemVPP.addTBLThemVPP);
    app.route('/qlnb/update_tbl_them_vpp').post(checkToken.checkToken, tblThemVPP.updateTBLThemVPP);
    app.route('/qlnb/delete_tbl_them_vpp').post(checkToken.checkToken, tblThemVPP.deleteRelationshipTBLThemVPP);
    app.route('/qlnb/get_list_tbl_them_vpp').post(tblThemVPP.getListTBLThemVPP);
    app.route('/qlnb/get_list_name_tbl_them_vpp').post(tblThemVPP.getListNameTBLThemVPP);
    app.route('/qlnb/get_detail_tbl_them_vpp').post(tblThemVPP.getDetailTBLThemVPP);


    app.route('/qlnb/add_tbl_phanphoi_vpp').post(checkToken.checkToken, tblPhanPhoiVPP.addTBLPhanPhoiVPP);
    app.route('/qlnb/update_tbl_phanphoi_vpp').post(checkToken.checkToken, tblPhanPhoiVPP.updateTBLPhanPhoiVPP);
    app.route('/qlnb/delete_tbl_phanphoi_vpp').post(checkToken.checkToken, tblPhanPhoiVPP.deleteRelationshipTBLPhanPhoiVPP);
    app.route('/qlnb/get_list_tbl_phanphoi_vpp').post(tblPhanPhoiVPP.getListTBLPhanPhoiVPP);

    // get list name NCC dòng 63

    //---------------------------------------------------------------- Menu đề nghị thanh toán --------------------------------------------------------------------------------------
    app.route('/qlnb/add_tbl_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.addtblDeNghiThanhToan);
    app.route('/qlnb/update_tbl_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.updatetblDeNghiThanhToan);
    app.route('/qlnb/delete_tbl_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.deletetblDeNghiThanhToan);
    app.route('/qlnb/get_list_tbl_denghi_thanhtoan').post(tblDeNghiThanhToan.getListtblDeNghiThanhToan);
    app.route('/qlnb/get_list_tbl_denghi_thanhtoan_app').post(tblDeNghiThanhToan.getListtblDeNghiThanhToanApp);
    app.route('/qlnb/detail_tbl_denghi_thanhtoan').post(tblDeNghiThanhToan.detailtblDeNghiThanhToan);

    app.route('/qlnb/get_list_name_tbl_denghi_thanhtoan').post(tblDeNghiThanhToan.getListNametblDeNghiThanhToan);


    app.route('/qlnb/approval_employee_accountant').post(checkToken.checkToken, tblDeNghiThanhToan.approvalNhanVienKTPD);
    app.route('/qlnb/approval_employee_leader').post(checkToken.checkToken, tblDeNghiThanhToan.approvalNhanVienLDPD);
    app.route('/qlnb/refuse_employee_accountant').post(checkToken.checkToken, tblDeNghiThanhToan.refuseNhanVienKTPD);
    app.route('/qlnb/refuse_employee_leader').post(checkToken.checkToken, tblDeNghiThanhToan.refuseNhanVienLDPD);
    app.route('/qlnb/change_notification_status_payment').post(checkToken.checkToken, tblDeNghiThanhToan.changeNotificationStatusPayment);
    // app.route('/qlnb/approval_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.approvalDeNghiThanhToan);
    var zalo = require('./controllers/zalo');
    app.route('/zalo').post(zalo.zalo);


    var report = require('./controllers/report');
    app.route('/qlnb/report').post(report.report);
    app.route('/qlnb/depreciation_table').post(report.depreciationTable);


    // ************************************************************** QUẢN LÝ NHÂN SỰ **********************************************************************************************

    //---------------------------------------------------------------- Menu danh mục --------------------------------------------------------------------------------------
    var tblLoaiChamCong = require('./controllers_hr/ctl-tblLoaiChamCong');
    var tblNghiLe = require('./controllers_hr/ctl-tblNghiLe');
    var tblDMTinhTrangNV = require('./controllers_hr/ctl-tblDMTinhTrangNV');
    var tblDMLoaiHopDong = require('./controllers_hr/ctl-tblLoaiHopDong');
    var tblDMGiaDinh = require('./controllers_hr/ctl-tblDMGiaDinh');

    var tblDMChucVu = require('./controllers/ctl-tblDMChucVu');

    // Danh mục loại hợp đồng
    app.route('/qlnb/add_tbl_loaihopdong').post(checkToken.checkToken, tblDMLoaiHopDong.addtblLoaiHopDong);
    app.route('/qlnb/update_tbl_loaihopdong').post(checkToken.checkToken, tblDMLoaiHopDong.updatetblLoaiHopDong);
    app.route('/qlnb/delete_tbl_loaihopdong').post(checkToken.checkToken, tblDMLoaiHopDong.deletetblLoaiHopDong);
    app.route('/qlnb/get_list_tbl_loaihopdong').post(checkToken.checkToken, tblDMLoaiHopDong.getListtblLoaiHopDong);
    app.route('/qlnb/get_list_name_tbl_loaihopdong').post(tblDMLoaiHopDong.getListNametblLoaiHopDong);

    // Danh mục loại chấm công
    app.route('/qlnb/add_tbl_loaichamcong').post(checkToken.checkToken, tblLoaiChamCong.addtblLoaiChamCong);
    app.route('/qlnb/update_tbl_loaichamcong').post(checkToken.checkToken, tblLoaiChamCong.updatetblLoaiChamCong);
    app.route('/qlnb/delete_tbl_loaichamcong').post(checkToken.checkToken, tblLoaiChamCong.deletetblLoaiChamCong);
    app.route('/qlnb/get_list_tbl_loaichamcong').post(checkToken.checkToken, tblLoaiChamCong.getListtblLoaiChamCong);
    app.route('/qlnb/get_list_name_tbl_loaichamcong').post(tblLoaiChamCong.getListNametblLoaiChamCong);


    app.route('/qlnb/get_list_name_tbl_dmchucvu').post(tblDMChucVu.getListNametblDMChucVu);
    app.route('/qlnb/get_list_tbl_dmChucVu').post(tblDMChucVu.getListtblDMChucVu);
    app.route('/qlnb/add_tbl_dmChucVu').post(tblDMChucVu.addtblDMChucVu);
    app.route('/qlnb/update_tbl_dmChucVu').post(tblDMChucVu.updatetblDMChucVu);
    app.route('/qlnb/delete_tbl_dmChucVu').post(tblDMChucVu.deletetblDMChucVu);

    // Danh mục nghỉ lễ
    app.route('/qlnb/add_tbl_nghiLe').post(checkToken.checkToken, tblNghiLe.addtblNghiLe);
    app.route('/qlnb/update_tbl_nghiLe').post(checkToken.checkToken, tblNghiLe.updatetblNghiLe);
    app.route('/qlnb/delete_tbl_nghiLe').post(checkToken.checkToken, tblNghiLe.deletetblNghiLe);
    app.route('/qlnb/get_list_tbl_nghiLe').post(tblNghiLe.getListtblNghiLe);
    app.route('/qlnb/get_list_name_tbl_nghiLe').post(tblNghiLe.getListNametblNghiLe);

    // Danh mục nghỉ lễ
    app.route('/qlnb/add_tbl_nghiphep').post(checkToken.checkToken, tblNghiPhep.addtblNghiPhep);
    app.route('/qlnb/update_tbl_nghiphep').post(checkToken.checkToken, tblNghiPhep.updatetblNghiPhep);
    app.route('/qlnb/delete_tbl_nghiphep').post(checkToken.checkToken, tblNghiPhep.deletetblNghiPhep);
    app.route('/qlnb/delete_tbl_nghiphep').post(checkToken.checkToken, tblNghiPhep.deletetblNghiPhep);
    app.route('/qlnb/get_list_tbl_nghiphep').post(checkToken.checkToken, tblNghiPhep.getListtblNghiPhep);
    app.route('/qlnb/confirm_head_department').post(checkToken.checkToken, tblNghiPhep.confirmHeadDepartment);
    app.route('/qlnb/approval_head_department').post(checkToken.checkToken, tblNghiPhep.approvalHeadDepartment);
    app.route('/qlnb/approval_administration_hr').post(checkToken.checkToken, tblNghiPhep.approvalAdministrationHR);
    app.route('/qlnb/approval_heads').post(checkToken.checkToken, tblNghiPhep.approvalHeads);
    app.route('/qlnb/staff_confirm').post(checkToken.checkToken, tblNghiPhep.staffConfirm);
    app.route('/qlnb/refuse_head_department').post(checkToken.checkToken, tblNghiPhep.refuseHeadDepartment);
    app.route('/qlnb/refuse_administration_hr').post(checkToken.checkToken, tblNghiPhep.refuseAdministrationHR);
    app.route('/qlnb/refuse_heads').post(checkToken.checkToken, tblNghiPhep.refuseHeads);
    app.route('/qlnb/refuse_staff').post(checkToken.checkToken, tblNghiPhep.refuseStaff);
    app.route('/qlnb/handle_take_leave_day').post(tblNghiPhep.handleTakeLeaveDay);
    app.route('/qlnb/get_the_remaining_spells').post(tblNghiPhep.getTheRemainingSpells);
    app.route('/qlnb/change_notification_status').post(tblNghiPhep.changeNotificationStatus);

    //  Danh mục tình trạng nhân viên
    app.route('/qlnb/add_tbl_dm_tinhtrangnv').post(checkToken.checkToken, tblDMTinhTrangNV.addtblDMTinhTrangNV);
    app.route('/qlnb/update_tbl_dm_tinhtrangnv').post(checkToken.checkToken, tblDMTinhTrangNV.updatetblDMTinhTrangNV);
    app.route('/qlnb/delete_tbl_dm_tinhtrangnv').post(checkToken.checkToken, tblDMTinhTrangNV.deletetblDMTinhTrangNV);
    app.route('/qlnb/get_list_tbl_dm_tinhtrangnv').post(checkToken.checkToken, tblDMTinhTrangNV.getListtblDMTinhTrangNV);
    app.route('/qlnb/get_list_name_tbl_dm_tinhtrangnv').post(tblDMTinhTrangNV.getListNametblDMTinhTrangNV);

    //  Danh mục cấu hình mức lương tối thiểu
    var tblMinWageConfig = require('./controllers_hr/ctl-tblMinWageConfig');
    app.route('/qlnb/add_tbl_min_wage_config').post(checkToken.checkToken, tblMinWageConfig.addtblMinWageConfig);
    app.route('/qlnb/calculate_salary_increase').post(checkToken.checkToken, tblMinWageConfig.calculateSalaryIncrease);
    app.route('/qlnb/update_tbl_min_wage_config').post(checkToken.checkToken, tblMinWageConfig.updatetblMinWageConfig);
    app.route('/qlnb/delete_tbl_min_wage_config').post(checkToken.checkToken, tblMinWageConfig.deletetblMinWageConfig);
    app.route('/qlnb/get_list_tbl_min_wage_config').post(checkToken.checkToken, tblMinWageConfig.getListtblMinWageConfig);

    // Danh mục bộ phận
    // 35-40

    // Danh mục chi nhánh
    // 43-47

    //---------------------------------------------------------------- Menu trích ngang --------------------------------------------------------------------------------------

    // 49-54

    // Tabs quan hệ gia đình 
    app.route('/qlnb/add_tbl_dmgiadinh').post(checkToken.checkToken, tblDMGiaDinh.addtblDMGiaDinh);
    app.route('/qlnb/update_tbl_dmgiadinh').post(checkToken.checkToken, tblDMGiaDinh.updatetblDMGiaDinh);
    app.route('/qlnb/delete_tbl_dmgiadinh').post(checkToken.checkToken, tblDMGiaDinh.deletetblDMGiaDinh);
    app.route('/qlnb/get_list_tbl_dmgiadinh').post(checkToken.checkToken, tblDMGiaDinh.getListtblDMGiaDinh);
    app.route('/qlnb/get_list_name_tbl_dmgiadinh').post(tblDMGiaDinh.getListNametblDMGiaDinh);

    // Tabs quản lý đào tạo sau khi đến công ty
    var tblDaoTaoSau = require('./controllers_hr/ctl-tblDaoTaoSau');
    app.route('/qlnb/add_tbl_training_after').post(checkToken.checkToken, tblDaoTaoSau.addtblDaoTaoSaus);
    app.route('/qlnb/update_tbl_training_after').post(checkToken.checkToken, tblDaoTaoSau.updatetblDaoTaoSaus);
    app.route('/qlnb/delete_tbl_training_after').post(checkToken.checkToken, tblDaoTaoSau.deletetblDaoTaoSaus);
    app.route('/qlnb/get_list_tbl_training_after').post(checkToken.checkToken, tblDaoTaoSau.getListtblDaoTaoSaus);

    // Tabs quản lý đào tạo trước khi đến công ty
    var tblDaoTaoTruoc = require('./controllers_hr/ctl-tblDaoTaoTruoc');
    app.route('/qlnb/add_tbl_pre_training').post(checkToken.checkToken, tblDaoTaoTruoc.addtblDaoTaoTruoc);
    app.route('/qlnb/update_tbl_pre_training').post(checkToken.checkToken, tblDaoTaoTruoc.updatetblDaoTaoTruoc);
    app.route('/qlnb/delete_tbl_pre_training').post(checkToken.checkToken, tblDaoTaoTruoc.deletetblDaoTaoTruoc);
    app.route('/qlnb/get_list_tbl_pre_training').post(checkToken.checkToken, tblDaoTaoTruoc.getListtblDaoTaoTruoc);
    app.route('/qlnb/in_work_training').post(tblDaoTaoTruoc.inWorkTraining);

    // Lịch sử công tác
    var tblWorkHistory = require('./controllers_hr/ctl-tblWorkHistory');
    app.route('/qlnb/add_tbl_work_history').post(checkToken.checkToken, tblWorkHistory.addtblWorkHistory);
    app.route('/qlnb/update_tbl_work_history').post(checkToken.checkToken, tblWorkHistory.updatetblWorkHistory);
    app.route('/qlnb/delete_tbl_work_history').post(checkToken.checkToken, tblWorkHistory.deletetblWorkHistory);
    app.route('/qlnb/get_list_tbl_work_history').post(checkToken.checkToken, tblWorkHistory.getListtblWorkHistory);

    // Quản lý hợp đồng
    var tblHopDongNhanSu = require('./controllers_hr/ctl-tblHopDongNhanSu');
    app.route('/qlnb/add_tbl_hopdong_nhansu').post(checkToken.checkToken, tblHopDongNhanSu.addtblHopDongNhanSu);
    app.route('/qlnb/update_tbl_hopdong_nhansu').post(checkToken.checkToken, tblHopDongNhanSu.updatetblHopDongNhanSu);
    app.route('/qlnb/delete_tbl_hopdong_nhansu').post(checkToken.checkToken, tblHopDongNhanSu.deletetblHopDongNhanSu);
    app.route('/qlnb/get_list_tbl_hopdong_nhansu').post(tblHopDongNhanSu.getListtblHopDongNhanSu);

    app.route('/qlnb/get_list_tbl_hopdong_nhansu_detail').post(tblHopDongNhanSu.getListtblHopDongNhanSuDetail);

    app.route('/qlnb/in_word_contract').post(tblHopDongNhanSu.inWordContract);
    app.route('/qlnb/setup_time_repeat').post(tblHopDongNhanSu.setupTimeRepeat);

    // Quyết định tăng lương
    var tblQuyetDinhTangLuong = require('./controllers_hr/ctl-tblQuyetDinhTangLuong');
    app.route('/qlnb/add_tbl_quyetdinh_tangluong').post(checkToken.checkToken, tblQuyetDinhTangLuong.addtblQuyetDinhTangLuong);
    app.route('/qlnb/update_tbl_quyetdinh_tangluong').post(checkToken.checkToken, tblQuyetDinhTangLuong.updatetblQuyetDinhTangLuong);
    app.route('/qlnb/delete_tbl_quyetdinh_tangluong').post(checkToken.checkToken, tblQuyetDinhTangLuong.deletetblQuyetDinhTangLuong);
    app.route('/qlnb/get_list_tbl_quyetdinh_tangluong').post(checkToken.checkToken, tblQuyetDinhTangLuong.getListtblQuyetDinhTangLuong);
    app.route('/qlnb/get_detail_tbl_quyetdinh_tangluong').post(tblQuyetDinhTangLuong.detailtblQuyetDinhTangLuong);

    app.route('/qlnb/approval_decision').post(checkToken.checkToken, tblQuyetDinhTangLuong.approvalDecision);
    app.route('/qlnb/refuse_decision').post(checkToken.checkToken, tblQuyetDinhTangLuong.refuseDecisoon);

    app.route('/qlnb/get_list_decision_increase_from_staff').post(tblQuyetDinhTangLuong.getListDecisionIncreaseFromStaff);

    //---------------------------------------------------------------- Mẫu bảng lương --------------------------------------------------------------------------------------
    var tblBangLuong = require('./controllers_hr/ctl-tblBangLuong');
    app.route('/qlnb/get_list_tbl_bangluong').post(tblBangLuong.getListtblBangLuong);
    app.route('/qlnb/track_insurance_premiums').post(tblBangLuong.trackInsurancePremiums);

    app.route('/qlnb/data_timekeeping').post(tblBangLuong.dataTimekeeping);

    app.route('/qlnb/update_timekeeping').post(tblBangLuong.updateTimekeeping);

    app.route('/qlnb/data_export_excel').post(tblBangLuong.dataExportExcel);

    app.route('/qlnb/delete_all_timekeeping').post(tblBangLuong.deleteAllTimekeeping);

    app.route('/qlnb/synthetic_information_monthly').post(tblBangLuong.syntheticInformationMonthly);

    app.route('/qlnb/delete_and_create_data_timekeeping').get(tblBangLuong.deleteAndCreateDataTimeKeeping);

    //---------------------------------------------------------------- Mức đóng bảo hiểm --------------------------------------------------------------------------------------
    var tblMucDongBaoHiem = require('./controllers_hr/ctl-tblMucDongBaoHiem');
    app.route('/qlnb/add_tbl_mucdong_baohiem').post(checkToken.checkToken, tblMucDongBaoHiem.addtblMucDongBaoHiem);
    app.route('/qlnb/update_tbl_mucdong_baohiem').post(checkToken.checkToken, tblMucDongBaoHiem.updatetblMucDongBaoHiem);
    app.route('/qlnb/delete_tbl_mucdong_baohiem').post(checkToken.checkToken, tblMucDongBaoHiem.deletetblMucDongBaoHiem);
    app.route('/qlnb/get_list_tbl_mucdong_baohiem').post(checkToken.checkToken, tblMucDongBaoHiem.getListtblMucDongBaoHiem);
    app.route('/qlnb/update_minimum_wage').post(checkToken.checkToken, tblMucDongBaoHiem.updateMinimumWage);
    app.route('/qlnb/get_minimum_wage').post(checkToken.checkToken, tblMucDongBaoHiem.getMinimumWage);

    //---------------------------------------------------------------- Quyết định tăng lương --------------------------------------------------------------------------------------
    var tblQuyetDinhTangLuong = require('./controllers_hr/ctl-tblQuyetDinhTangLuong');
    app.route('/qlnb/add_tbl_quyetdinh_tangluong').post(checkToken.checkToken, tblQuyetDinhTangLuong.addtblQuyetDinhTangLuong);
    app.route('/qlnb/update_tbl_quyetdinh_tangluong').post(checkToken.checkToken, tblQuyetDinhTangLuong.updatetblQuyetDinhTangLuong);
    app.route('/qlnb/delete_tbl_quyetdinh_tangluong').post(checkToken.checkToken, tblQuyetDinhTangLuong.deletetblQuyetDinhTangLuong);
    // app.route('/qlnb/get_list_tbl_quyetdinh_tangluong').post(checkToken.checkToken, tblQuyetDinhTangLuong.getListtblQuyetDinhTangLuong);
    //---------------------------------------------------------------- Quyết định thưởng/phạt --------------------------------------------------------------------------------------
    var tblRewardPunishment = require('./controllers_hr/ctl-tblRewardPunishment');
    app.route('/qlnb/add_tbl_reward_punishment').post(checkToken.checkToken, tblRewardPunishment.addtblRewardPunishment);
    app.route('/qlnb/get_detail_tbl_reward_punishment').post(tblRewardPunishment.detailtblRewardPunishment);
    app.route('/qlnb/update_tbl_reward_punishment').post(checkToken.checkToken, tblRewardPunishment.updatetblRewardPunishment);
    app.route('/qlnb/delete_tbl_reward_punishment').post(checkToken.checkToken, tblRewardPunishment.deletetblRewardPunishment);
    app.route('/qlnb/get_list_tbl_reward_punishment').post(tblRewardPunishment.getListtblRewardPunishment);
    //---------------------------------------------------------------- Quyết định tăng lương bảo hiểm --------------------------------------------------------------------------------------
    var tblDecidedInsuranceSalary = require('./controllers_hr/ctl-tblDecidedInSuranceSalary');
    app.route('/qlnb/add_tbl_decided_insurance_salary').post(checkToken.checkToken, tblDecidedInsuranceSalary.addtblDecidedInsuranceSalary);
    app.route('/qlnb/update_tbl_decided_insurance_salary').post(checkToken.checkToken, tblDecidedInsuranceSalary.updatetblDecidedInsuranceSalary);
    app.route('/qlnb/delete_tbl_decided_insurance_salary').post(checkToken.checkToken, tblDecidedInsuranceSalary.deletetblDecidedInsuranceSalary);
    app.route('/qlnb/get_list_tbl_decided_insurance_salary').post(checkToken.checkToken, tblDecidedInsuranceSalary.getListtblDecidedInsuranceSalary);
    app.route('/qlnb/get_detail_tbl_decided_insurance_salary').post(checkToken.checkToken, tblDecidedInsuranceSalary.detailtblDecidedInsuranceSalary);
    // Quản lý loại hợp đồng 
    var tblTypeContract = require('./controllers_hr/ctl-tblLoaiHopDong');
    app.route('/qlnb/add_tbl_loaihopdong').post(checkToken.checkToken, tblTypeContract.addtblLoaiHopDong);
    app.route('/qlnb/update_tbl_loaihopdong').post(checkToken.checkToken, tblTypeContract.updatetblLoaiHopDong);
    app.route('/qlnb/delete_tbl_loaihopdong').post(checkToken.checkToken, tblTypeContract.deletetblLoaiHopDong);
    app.route('/qlnb/get_list_tbl_loaihopdong').post(checkToken.checkToken, tblTypeContract.getListtblLoaiHopDong);
    app.route('/qlnb/get_list_name_tbl_loaihopdong').post(tblTypeContract.getListNametblLoaiHopDong);

    // Quản lý ngày làm việc
    var tblConfigWorkday = require('./controllers_hr/ctl-tblConfigWorkday')
    app.route('/qlnb/add_tbl_config_workday').post(checkToken.checkToken, tblConfigWorkday.addtblConfigWorkday);
    app.route('/qlnb/update_tbl_config_workday').post(checkToken.checkToken, tblConfigWorkday.updatetblConfigWorkday);
    app.route('/qlnb/delete_tbl_config_workday').post(checkToken.checkToken, tblConfigWorkday.deletetblConfigWorkday);
    app.route('/qlnb/get_list_tbl_config_workday').post(checkToken.checkToken, tblConfigWorkday.getListtblConfigWorkday);

    var importFile = require('./controllers_hr/import-file')

    app.route('/qlnb/import_decided_increase_salary').post(importFile.importDecidedIncreaseSalary);

    // // Quản lý nghỉ lễ / tết
    // var tblQuanLyNghiLe = require('./controllers_hr/ctl-tblNghiLe');
    // app.route('/qlnb/add_tbl_nghile').post(checkToken.checkToken, tblQuanLyNghiLe.addtblNghiLe);
    // app.route('/qlnb/update_tbl_nghile').post(checkToken.checkToken, tblQuanLyNghiLe.updatetblNghiLe);
    // app.route('/qlnb/delete_tbl_nghile').post(checkToken.checkToken, tblQuanLyNghiLe.deletetblNghiLe);
    // app.route('/qlnb/get_list_tbl_nghile').post(checkToken.checkToken, tblQuanLyNghiLe.getListtblNghiLe);


    // ************************************************************** QUẢN LÝ TÀI CHÍNH **********************************************************************************************
    var tblVayTamUng = require('./controller_finance/ctl-tblVayTamUng')
    app.route('/qlnb/get_list_tbl_vaytamung').post(checkToken.checkToken, tblVayTamUng.getListtblVayTamUng);
    app.route('/qlnb/add_tbl_vaytamung').post(checkToken.checkToken, tblVayTamUng.addtblVayTamUng);
    app.route('/qlnb/update_tbl_vaytamung').post(checkToken.checkToken, tblVayTamUng.updatetblVayTamUng);
    app.route('/qlnb/delete_tbl_vaytamung').post(checkToken.checkToken, tblVayTamUng.deletetblVayTamUng);
    app.route('/qlnb/get_detail_tbl_vaytamung').post(checkToken.checkToken, tblVayTamUng.detailtblVayTamUng);

    app.route('/qlnb/approval_employee_leader_kvtu').post(checkToken.checkToken, tblVayTamUng.approvalNhanVienLDPD);
    app.route('/qlnb/refuse_employee_accountant_kvtu').post(checkToken.checkToken, tblVayTamUng.refuseNhanVienKTPD);
    app.route('/qlnb/refuse_employee_leader_kvtu').post(checkToken.checkToken, tblVayTamUng.refuseNhanVienLDPD);
    app.route('/qlnb/reimbursement').post(checkToken.checkToken, tblVayTamUng.reimbursement);
    app.route('/qlnb/get_list_loan_advance_from_staff').post(tblVayTamUng.getListLoanAdvanceFromStaff);
    app.route('/qlnb/get_list_reimbursement_from_staff').post(checkToken.checkToken, tblVayTamUng.getListReimbursementFromStaff);
    app.route('/qlnb/change_notification_status_Loan').post(checkToken.checkToken, tblVayTamUng.changeNotificationStatusLoan);
    app.route('/qlnb/get_list_reimbursement').post(tblVayTamUng.getListReimbursement);
    app.route('/qlnb/get_list_name_tbl_vaytamung').post(tblVayTamUng.getListNametblVayTamUng);
    app.route('/qlnb/approval_employee_accountant_kvtu').post(checkToken.checkToken, tblVayTamUng.approvalNhanVienKTPD);
    // Điều khoản thanh toán
    var tblDMDieuKhoanThanhToan = require('./controller_finance/ctl-tblDMDieuKhoanThanhToan')
    app.route('/qlnb/add_tbl_dm_dieukhoan_thanhtoan').post(checkToken.checkToken, tblDMDieuKhoanThanhToan.addtblDMDieuKhoanThanhToan);
    app.route('/qlnb/update_tbl_dm_dieukhoan_thanhtoan').post(checkToken.checkToken, tblDMDieuKhoanThanhToan.updatetblDMDieuKhoanThanhToan);
    app.route('/qlnb/delete_tbl_dm_dieukhoan_thanhtoan').post(checkToken.checkToken, tblDMDieuKhoanThanhToan.deletetblDMDieuKhoanThanhToan);
    app.route('/qlnb/get_list_tbl_dm_dieukhoan_thanhtoan').post(checkToken.checkToken, tblDMDieuKhoanThanhToan.getListtblDMDieuKhoanThanhToan);
    app.route('/qlnb/get_list_name_tbl_dm_dieukhoan_thanhtoan').post(tblDMDieuKhoanThanhToan.getListNametblDMDieuKhoanThanhToan);

    // Quản lý tài khoản ngân hàng
    var tblBankAccountManagement = require('./controller_finance/ctl-tblBankAccountManagement')
    app.route('/qlnb/add_tbl_bank_account_management').post(checkToken.checkToken, tblBankAccountManagement.addtblBankAccountManagement);
    app.route('/qlnb/update_tbl_bank_account_management').post(checkToken.checkToken, tblBankAccountManagement.updatetblBankAccountManagement);
    app.route('/qlnb/delete_tbl_bank_account_management').post(checkToken.checkToken, tblBankAccountManagement.deletetblBankAccountManagement);
    app.route('/qlnb/get_list_tbl_bank_account_management').post(checkToken.checkToken, tblBankAccountManagement.getListtblBankAccountManagement);
    app.route('/qlnb/get_list_name_tbl_bank_account_management').post(tblBankAccountManagement.getListNametblBankAccountManagement);

    // Quản lý hệ thống tài khoản kế toán / Loại tài khoản
    var tblDMLoaiTaiKhoanKeToan = require('./controller_finance/ctl-tblDMLoaiTaiKhoanKeToan')
    app.route('/qlnb/add_tbl_dm_loaitaikhoan_ketoan').post(checkToken.checkToken, tblDMLoaiTaiKhoanKeToan.addtblDMLoaiTaiKhoanKeToan);
    app.route('/qlnb/update_tbl_dm_loaitaikhoan_ketoan').post(checkToken.checkToken, tblDMLoaiTaiKhoanKeToan.updatetblDMLoaiTaiKhoanKeToan);
    app.route('/qlnb/delete_tbl_dm_loaitaikhoan_ketoan').post(checkToken.checkToken, tblDMLoaiTaiKhoanKeToan.deletetblDMLoaiTaiKhoanKeToan);
    app.route('/qlnb/get_list_tbl_dm_loaitaikhoan_ketoan').post(checkToken.checkToken, tblDMLoaiTaiKhoanKeToan.getListtblDMLoaiTaiKhoanKeToan);
    app.route('/qlnb/get_list_name_tbl_dm_loaitaikhoan_ketoan').post(tblDMLoaiTaiKhoanKeToan.getListNametblDMLoaiTaiKhoanKeToan);

    // Quản lý hệ thống tài khoản kế toán / Hệ thống tài khoản
    var tblDMTaiKhoanKeToan = require('./controller_finance/ctl-dmTaiKhoanKeToan')
    app.route('/qlnb/add_tbl_dm_taikhoanketoan').post(checkToken.checkToken, tblDMTaiKhoanKeToan.addtblDMTaiKhoanKeToan);
    app.route('/qlnb/get_detail_tbl_dm_taikhoanketoan').post(checkToken.checkToken, tblDMTaiKhoanKeToan.getDetailtblDMTaiKhoanKeToan);
    app.route('/qlnb/update_tbl_dm_taikhoanketoan').post(checkToken.checkToken, tblDMTaiKhoanKeToan.updatetblDMTaiKhoanKeToan);
    app.route('/qlnb/delete_tbl_dm_taikhoanketoan').post(checkToken.checkToken, tblDMTaiKhoanKeToan.deletetblDMTaiKhoanKeToan);
    app.route('/qlnb/get_list_tbl_dm_taikhoanketoan').post(tblDMTaiKhoanKeToan.getListtblDMTaiKhoanKeToan);
    app.route('/qlnb/get_list_name_tbl_dm_taikhoanketoan').post(tblDMTaiKhoanKeToan.getListNametblDMTaiKhoanKeToan);
    app.route('/qlnb/get_list_loan_advance_accounting').post(checkToken.checkToken, tblDMTaiKhoanKeToan.getListAdvanceLoanAccouting);
    app.route('/qlnb/get_list_reimbursement_accounting').post(checkToken.checkToken, tblDMTaiKhoanKeToan.getListReimbursementAccouting);

    var tblCurrency = require('./controller_finance/ctl-tblCurrency')
    app.route('/qlnb/get_detail_tbl_currency').post(tblCurrency.detailtblCurrency);
    app.route('/qlnb/add_tbl_currency').post(checkToken.checkToken, tblCurrency.addtblCurrency);
    app.route('/qlnb/update_tbl_currency').post(checkToken.checkToken, tblCurrency.updatetblCurrency);
    app.route('/qlnb/get_list_tbl_currency').post(tblCurrency.getListtblCurrency);
    app.route('/qlnb/delete_tbl_currency').post(checkToken.checkToken, tblCurrency.deletetblCurrency);
    app.route('/qlnb/get_list_name_tbl_currency').post(tblCurrency.getListNametblCurrency);
    app.route('/qlnb/get_list_tbl_currency_from_date').post(tblCurrency.getListtblCurrencyFromDate);

    var tblRate = require('./controller_finance/ctl-tblRate')
    app.route('/qlnb/add_tbl_rate').post(tblRate.addtblRate);
    app.route('/qlnb/update_tbl_rate').post(checkToken.checkToken, tblRate.updatetblRate);
    app.route('/qlnb/get_list_tbl_rate').post(checkToken.checkToken, tblRate.getListtblRate);
    app.route('/qlnb/delete_tbl_rate').post(checkToken.checkToken, tblRate.deletetblRate);
    app.route('/qlnb/get_list_tbl_rate_from_currency').post(checkToken.checkToken, tblRate.getListtblRateFromCurrency);

    var tblCustomer = require('./controller_finance/ctl-tblCustomer')
    app.route('/qlnb/add_tbl_customer').post(tblCustomer.addtblCustomer);
    app.route('/qlnb/update_tbl_customer').post(tblCustomer.updatetblCustomer);
    app.route('/qlnb/get_list_tbl_customer').post(tblCustomer.getListtblCustomer);
    app.route('/qlnb/get_list_tbl_customer_debt').post(tblCustomer.getListtblCustomerDebt);
    app.route('/qlnb/delete_tbl_customer').post(tblCustomer.deletetblCustomer);
    app.route('/qlnb/get_list_name_tbl_customer').post(tblCustomer.getListNametblCustomer);

    // api phần mềm chuyên môn
    var apiSpecializedSoftware = require('./controller_finance/ctl-apiSpecializedSoftware')
    app.route('/qlnb/get_list_department').post(apiSpecializedSoftware.getListDepartment);

    app.route('/qlnb/change_customer_data').post(apiSpecializedSoftware.changeCustomerData);

    app.route('/qlnb/change_invoice_or_credit_data').post(apiSpecializedSoftware.changeInvoiceOrCreditData);
    var tblInvoice = require('./controller_finance/ctl-tblInvoice')
    // app.route('/qlnb/get_list_invoice').post(apiSpecializedSoftware.getListInvoice);
    app.route('/qlnb/get_list_credit').post(apiSpecializedSoftware.getListCredit);
    app.route('/qlnb/get_list_partner').post(apiSpecializedSoftware.getListPartner);
    app.route('/qlnb/get_list_customer').post(apiSpecializedSoftware.getListCustomer);
    app.route('/qlnb/insert_data_invoice_and_credit').post(apiSpecializedSoftware.insertDataInvoiceAndCredit);
    app.route('/qlnb/get_all_object').post(apiSpecializedSoftware.getAllObject);
    app.route('/qlnb/get_list_user').post(apiSpecializedSoftware.getListUser);

    app.route('/qlnb/get_list_invoice_from_partner').post(apiSpecializedSoftware.getListInvoiceFromPartner);

    // invoice và credit theo khách hàng
    app.route('/qlnb/get_list_invoice_from_customer').post(apiSpecializedSoftware.getListInvoiceFromCustomer);
    app.route('/qlnb/get_list_invoice_wait_for_pay_from_customer').post(apiSpecializedSoftware.getListInvoiceWaitForPayFromCustomer);
    app.route('/qlnb/get_list_invoice_paid_from_customer').post(apiSpecializedSoftware.getListInvoicePaidFromCustomer);
    app.route('/qlnb/get_list_credit_from_customer').post(apiSpecializedSoftware.getListCreditFromCustomer);
    app.route('/qlnb/get_list_credit_wait_for_pay_from_customer').post(apiSpecializedSoftware.getListCreditWaitForPayFromCustomer);
    app.route('/qlnb/get_list_credit_paid_from_customer').post(apiSpecializedSoftware.getListCreditPaidFromCustomer);


    // --------------------------------INVOICE---------------------------------------------------------------------------------
    app.route('/qlnb/get_list_invoice').post(tblInvoice.getListtblInvoice);
    app.route('/qlnb/get_list_invoice_wait_for_pay').post(apiSpecializedSoftware.getListInvoiceWaitForPay);
    app.route('/qlnb/get_list_invoice_paid').post(apiSpecializedSoftware.getListInvoicePaid);
    app.route('/qlnb/get_list_invoice_edit_request').post(apiSpecializedSoftware.getListInvoiceEditRequest);
    app.route('/qlnb/get_list_invoice_delete_request').post(apiSpecializedSoftware.getListInvoiceDeleteRequest);
    app.route('/qlnb/get_list_invoice_payment_request').post(apiSpecializedSoftware.getListInvoicePaymentRequest);

    // --------------------------------CREDIT---------------------------------------------------------------------------------
    app.route('/qlnb/get_list_credit').post(apiSpecializedSoftware.getListCredit);
    app.route('/qlnb/get_list_credit_wait_for_pay').post(apiSpecializedSoftware.getListCreditWaitForPay);
    app.route('/qlnb/get_list_credit_paid').post(apiSpecializedSoftware.getListCreditPaid);
    app.route('/qlnb/get_list_credit_edit_request').post(apiSpecializedSoftware.getListCreditEditRequest);
    app.route('/qlnb/get_list_credit_delete_request').post(apiSpecializedSoftware.getListCreditDeleteRequest);
    app.route('/qlnb/get_list_credit_payment_request').post(apiSpecializedSoftware.getListCreditPaymentRequest);

    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------//
    app.route('/qlnb/approval_invoice_and_credit').post(apiSpecializedSoftware.approvalInvoiceAndCredit);
    app.route('/qlnb/refuse_invoice_and_credit').post(apiSpecializedSoftware.refuseInvoiceAndCredit);

    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------//

    // Danh sách phiếu thu / chi
    var tblReceiptsPayment = require('./controller_finance/ctl-tblReceiptsPayment')
    app.route('/qlnb/get_detail_tbl_receipts_payment').post(tblReceiptsPayment.detailtblReceiptsPayment);
    app.route('/qlnb/add_tbl_receipts_payment').post(tblReceiptsPayment.addtblReceiptsPayment);
    app.route('/qlnb/update_tbl_receipts_payment').post(tblReceiptsPayment.updatetblReceiptsPayment);
    app.route('/qlnb/get_list_tbl_receipts_payment').post(tblReceiptsPayment.getListtblReceiptsPayment);
    app.route('/qlnb/delete_tbl_receipts_payment').post(tblReceiptsPayment.deletetblReceiptsPayment);
    app.route('/qlnb/get_list_name_tbl_receipts_payment').post(tblReceiptsPayment.getListNametblReceiptsPayment);
    app.route('/qlnb/get_list_receipts_payment_unknown').post(tblReceiptsPayment.getListReceiptsPaymentUnknown);
    app.route('/qlnb/get_list_receipts_payment_unknown_customer_menu').post(tblReceiptsPayment.getListReceiptsPaymentUnknownFromCustomer);
    app.route('/qlnb/get_automatically_increasing_voucher_number').post(tblReceiptsPayment.getAutomaticallyIncreasingVoucherNumber);
    app.route('/qlnb/check_duplicate_voucher_number').post(tblReceiptsPayment.checkDuplicateVoucherNumber);

    // Danh sách giấy báo nợ/ có
    var tblCreditDebtnotices = require('./controller_finance/ctl-tblCreditDebtnotices')
    app.route('/qlnb/get_detail_tbl_credit_debt_notices').post(tblCreditDebtnotices.detailtblCreditDebtnotices);
    app.route('/qlnb/add_tbl_credit_debt_notices').post(tblCreditDebtnotices.addtblCreditDebtnotices);
    app.route('/qlnb/update_tbl_credit_debt_notices').post(tblCreditDebtnotices.updatetblCreditDebtnotices);
    app.route('/qlnb/get_list_tbl_credit_debt_notices').post(tblCreditDebtnotices.getListtblCreditDebtnotices);
    app.route('/qlnb/delete_tbl_credit_debt_notices').post(tblCreditDebtnotices.deletetblCreditDebtnotices);
    app.route('/qlnb/get_automatically_increasing_voucher_number_credit_debt_notices').post(tblCreditDebtnotices.getAutomaticallyIncreasingVoucherNumberCDN);
    app.route('/qlnb/check_duplicate_voucher_number_credit_debt_notices').post(tblCreditDebtnotices.checkDuplicateVoucherNumberCDN);

    var tblAccountingBooks = require('./controller_finance/ctl-tblAccountingBooks')
    app.route('/qlnb/get_list_tbl_accounting_books').post(tblAccountingBooks.getListtblAccountingBooks);
    app.route('/qlnb/insert_account_db').post(tblAccountingBooks.insertAccountDB);
    app.route('/qlnb/get_all_accounting_books').post(tblAccountingBooks.getAllAccountBooks);

    app.route('/qlnb/get_data_summary_book').post(tblAccountingBooks.getDataSummaryBook);

    app.route('/qlnb/get_child_accounts_of_account').post(tblAccountingBooks.getChildAccountsOfAccount);

    // thêm mới quyền
    var tblRole = require('./controllers/ctl-tblRole')
    app.route('/qlnb/add_tbl_role').post(checkToken.checkToken, tblRole.addtblRole);
    app.route('/qlnb/update_tbl_role').post(checkToken.checkToken, tblRole.updatetblRole);
    app.route('/qlnb/update_permission_of_role').post(checkToken.checkToken, tblRole.updatePermissionRole);
    app.route('/qlnb/get_detail_tbl_role').post(tblRole.detailtblRole);
    app.route('/qlnb/delete_tbl_role').post(checkToken.checkToken, tblRole.deletetblRole);
    app.route('/qlnb/get_list_tbl_role').post(tblRole.getListtblRole);
    app.route('/qlnb/get_list_name_tbl_role').post(tblRole.getListNametblRole);

    // report nhân sự
    var reportHR = require('./controllers_hr/report_hr')
    app.route('/qlnb/report_personnel_structure').post(reportHR.reportPersonnelStructure);
    app.route('/qlnb/report_types_of_contracts').post(reportHR.reportTypesOfContracts);
    app.route('/qlnb/report_salary_bonus_chart').post(reportHR.reportSalaryAndBonusChart);
    app.route('/qlnb/report_personnel_development').post(reportHR.reportPersonnelDevelopment);
    app.route('/qlnb/report_types_of_contracts_column_chart').post(reportHR.reportTypesOfContractsColumnChart);
    app.route('/qlnb/report_time_attendance_summary').post(reportHR.reportTimeAttendanceSummary);
    app.route('/qlnb/report_reward_punishment').post(reportHR.reportRewardPunishment);
    app.route('/qlnb/report_salary_fund').post(reportHR.reportSalaryFund);




    // report tài chính
    var exportFileFinance = require('./controller_finance/export-finance')
    app.route('/qlnb/export_excel_report_aggregate_revenue').post(exportFileFinance.exportExcelReportAggregateRevenue);
    app.route('/qlnb/export_excel_report_money_revenue').post(exportFileFinance.exportExcelReportMoneyRevenue);
    app.route('/qlnb/export_excel_report_average_monthly_revenue_by_year').post(exportFileFinance.exportExcelReportAverageMonthlyRevenueByYear);
    app.route('/qlnb/pour_data_into_work_file_and_convert_to_pdf').post(exportFileFinance.pourDataIntoWorkFileAndConvertToPDF);

    app.route('/qlnb/push_data_to_excel_template').post(exportFileFinance.pushDataToExcelTemplate);


    // report tài chính
    var reportFinance = require('./controller_finance/report-finance')
    app.route('/qlnb/get_data_report_aggregate_revenue_shtt').post(reportFinance.getDataReportAggregateRevenueSHTT);
    app.route('/qlnb/get_data_report_money_revenue').post(reportFinance.getDataReportMoneyRevenue);
    app.route('/qlnb/get_data_report_average_revenue').post(reportFinance.getDataReportAverageRevenue);
    app.route('/qlnb/get_data_report_aggregate_revenue_year').post(reportFinance.getDataReportAggregateRevenueYear);
    app.route('/qlnb/get_data_reqort_average_sales_comparison_table').post(reportFinance.getDataReportAverageSalesComparison);
    app.route('/qlnb/get_data_report_average_revenue_vnd').post(reportFinance.getDataReportAverageRevenueVND);


    // Cơ quan nhà nước
    var tblStateAgencies = require('./controller_finance/ctl-tblCoQuanNhaNuoc')
    app.route('/qlnb/get_list_tbl_state_agencies').post(tblStateAgencies.getListtblCoQuanNhaNuoc);
    app.route('/qlnb/track_receipts').post(tblStateAgencies.trackReceipts);
    app.route('/qlnb/add_tbl_state_agencies').post(tblStateAgencies.addtblCoQuanNhaNuoc);
    app.route('/qlnb/update_tbl_state_agencies').post(tblStateAgencies.updatetblCoQuanNhaNuoc);
    app.route('/qlnb/delete_tbl_state_agencies').post(tblStateAgencies.deletetblCoQuanNhaNuoc);
    app.route('/qlnb/get_automatically_increasing_voucher_number_cqnn').post(tblStateAgencies.getAutomaticallyIncreasingVoucherNumberCQNN);
    app.route('/qlnb/check_duplicate_voucher_number_cqnn').post(tblStateAgencies.checkDuplicateVoucherNumberCQNN);
    app.route('/qlnb/save_previous_period_balance').post(tblStateAgencies.savePreviousPeriodBalance);

}