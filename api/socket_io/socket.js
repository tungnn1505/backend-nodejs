var moment = require('moment');
const Sequelize = require('sequelize');
async function connectDatabase(dbname) {
    const db = new Sequelize(dbname, 'struck_user', '123456a$', {
        host: 'dbdev.namanphu.vn',
        dialect: 'mssql',
        operatorsAliases: '0',
        // Bắt buộc phải có
        dialectOptions: {
            options: { encrypt: false }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: false,
            freezeTableName: true
        }
    });
    return db
}

module.exports = {
    sockketIO: async (io) => {
        io.on("connection", async function (socket) {
            socket.on("sendrequest", async function (data) {
                let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                const db = new Sequelize(data.dbname, 'struck_user', '123456a$', {
                    host: 'dbdev.namanphu.vn',
                    dialect: 'mssql',
                    operatorsAliases: '0',
                    // Bắt buộc phải có
                    dialectOptions: {
                        options: { encrypt: false }
                    },
                    pool: {
                        max: 5,
                        min: 0,
                        acquire: 30000,
                        idle: 10000
                    },
                    define: {
                        timestamps: false,
                        freezeTableName: true
                    }
                });

                db.authenticate()
                    .then(() => console.log('Ket noi thanh cong'))
                    .catch(err => console.log(err.message));
                let str = '(';
                for (var key = 0; key < data.id.length; key++) {
                    if (key == (data.id.length - 1)) {
                        str += data.id[key];
                        str += ')'
                    } else {
                        str += data.id[key] + ', ';
                    }
                }
                if (data.id) {
                    let checkNhaXe = await db.query("SELECT IDNhaXe FROM tblYeuCau WHERE ID = " + data.id[0])
                    if (!checkNhaXe[0][0].IDNhaXe) {
                        let query = "UPDATE dbo.tblYeuCau SET TrangThai = N'ĐÃ GỬI', NgayGui = '" + now + "' where ID in " + str
                        console.log(query, 1234);
                        db.query(query)
                        io.sockets.emit("sendrequest", data.id);
                    }
                } else {
                    io.sockets.emit("sendrequest", []);
                }
            });
            socket.on("notification-zalo", async function (data) {
                io.sockets.emit("notification-zalo", { dbname: data.dbname });
            });
            socket.on("notification-thaydoidiadiem", async function (data) {
                io.sockets.emit("notification-thaydoidiadiem", { dbname: data.dbnamenhaxe, donhang_thongbao: data.donhang_thongbao });
            });
            socket.on("notification-thaydoichiphi", async function (data) {
                io.sockets.emit("notification-thaydoichiphi", { dbname: data.dbnamenhaxe, donhang_thongbao: data.donhang_thongbao });
            });
            socket.on("notification-yeucaupheduyet", async function (data) {
                io.sockets.emit("notification-yeucaupheduyet", { dbname: data.dbname, donhang_thongbao: data.donhang_thongbao });
            });
            socket.on("notification-nhaxehoanthanh", async function (data) {
                io.sockets.emit("notification-nhaxehoanthanh", { dbname: data.dbnamenhaxe, donhang_thongbao: data.donhang_thongbao });
            });
            socket.on("change-received-status", async function (data) {
                let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                let dbMaster = await connectDatabase('STRUCK_CUSTOMER_DB')
                let dbName1 = await connectDatabase(data.dbname1)
                let dbMasterQuery = "SELECT ID FROM CustomerDB WHERE NameDatabase = N'" + data.dbname2 + "'"
                let IDCustomerDB;
                IDCustomerDB = await dbMaster.query(dbMasterQuery)
                console.log(IDCustomerDB[0][0]);
                if (!IDCustomerDB[0][0]) {
                    dbMaster = await connectDatabase('Customer_VTNAP')
                    IDCustomerDB = await dbMaster.query(dbMasterQuery)
                }
                let query1 = "DELETE FROM dbo.tblDauGia WHERE IDYeuCau = '" + data.id + "' AND IDCustomer = '" + IDCustomerDB[0][0].ID + "'"
                dbName1.query(query1)
                let query = "INSERT INTO dbo.tblDauGia (IDYeuCau, IDCustomer, ChiPhi) VALUES ('" + data.id + "', '" + IDCustomerDB[0][0].ID + "', '" + data.chiphi + "')"
                console.log(query);
                dbName1.query(query)
                io.sockets.emit("sendrequest", []);

            });
            socket.on("send-plan-cost", async function (data) {
                let status = 'XÁC NHẬN KẾ HOẠCH'
                if (data.type == 'CHIPHI')
                    status = 'XÁC NHẬN CHI PHÍ'
                let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                const db = new Sequelize(data.dbname, 'struck_user', '123456a$', {
                    host: 'dbdev.namanphu.vn',
                    dialect: 'mssql',
                    operatorsAliases: '0',
                    // Bắt buộc phải có
                    dialectOptions: {
                        options: { encrypt: false }
                    },
                    pool: {
                        max: 5,
                        min: 0,
                        acquire: 30000,
                        idle: 10000
                    },
                    define: {
                        timestamps: false,
                        freezeTableName: true
                    }
                });

                db.authenticate()
                    .then(() => console.log('Ket noi thanh cong'))
                    .catch(err => console.log(err.message));

                let queryUpdateOrder = 'SELECT IDKhachHang, IDNhaXe FROM tblDonHang WHERE ID = ' + data.iddonhang
                let orderObj = await db.query(queryUpdateOrder)
                let ConfirmKH;
                let ConfirmNX;
                let keyConnectKH;
                let keyConnectNX;
                if (orderObj[0][0]) {
                    let queryCustomer = 'SELECT KeyConnect FROM tblKhachHang WHERE ID = ' + orderObj[0][0].IDKhachHang
                    let CustomerObj = await db.query(queryCustomer)
                    if (CustomerObj[0][0] && CustomerObj[0][0].KeyConnect) {
                        ConfirmKH = null
                        keyConnectKH = CustomerObj[0][0].KeyConnect
                    } else {
                        ConfirmKH = 1
                        keyConnectKH = null
                    }
                } else {
                    ConfirmKH = null
                    keyConnectKH = null
                }
                if (orderObj[0][0]) {
                    let queryCustomer = 'SELECT KeyConnect FROM tblKhachHang WHERE ID = ' + orderObj[0][0].IDNhaXe
                    let CustomerObj = await db.query(queryCustomer)
                    if (CustomerObj[0][0] && CustomerObj[0][0].KeyConnect) {
                        ConfirmNX = null
                        keyConnectNX = CustomerObj[0][0].KeyConnect
                    } else {
                        ConfirmNX = 1
                        keyConnectNX = null
                    }
                } else {
                    ConfirmNX = null
                    keyConnectNX = null
                }
                let dbMaster = await connectDatabase('STRUCK_CUSTOMER_DB')
                let dbnameKH;
                let dbnameNX;
                if (keyConnectKH) {
                    let dbMasterQuery = "SELECT NameDatabase FROM CustomerDB WHERE KeyConnect = '" + keyConnectKH + "'"
                    dbnameKH = await dbMaster.query(dbMasterQuery)
                    if (dbnameKH[0][0] && dbnameKH[0][0].NameDatabase) {
                        dbnameKH = dbnameKH[0][0].NameDatabase
                    } else {
                        dbMaster = await connectDatabase('Customer_VTNAP')
                        dbnameKH = await dbMaster.query(dbMasterQuery)
                        if (dbnameKH[0][0] && dbnameKH[0][0].NameDatabase) {
                            dbnameKH = dbnameKH[0][0].NameDatabase
                        } else {
                            dbnameKH = null
                        }
                    }
                } else {
                    dbnameKH = null
                }
                if (keyConnectNX) {
                    let dbMasterQuery = "SELECT NameDatabase FROM CustomerDB WHERE KeyConnect = '" + keyConnectNX + "'"
                    dbnameNX = await dbMaster.query(dbMasterQuery)
                    if (dbnameNX[0][0] && dbnameNX[0][0].NameDatabase) {
                        dbnameNX = dbnameNX[0][0].NameDatabase
                    } else {
                        dbMaster = await connectDatabase('Customer_VTNAP')
                        dbnameNX = await dbMaster.query(dbMasterQuery)
                        if (dbnameNX[0][0] && dbnameNX[0][0].NameDatabase) {
                            dbnameNX = dbnameNX[0][0].NameDatabase
                        } else {
                            dbnameNX = null
                        }
                    }
                } else {
                    dbnameNX = null
                }
                if (!keyConnectKH && !keyConnectNX) {
                    if (data.type == 'CHIPHI') {
                        status = "CHI PHÍ HOÀN THÀNH"
                    } else {
                        status = "KẾ HOẠCH HOÀN THÀNH"
                    }
                }
                await db.query("UPDATE tblDonHang SET NgayGui = '" + now + "' ,TrangThaiCho = N'" + status + "', ConfirmKH = " + ConfirmKH + ", ConfirmNX = " + ConfirmNX + " WHERE ID = " + data.iddonhang)
                let objResult = {
                    dbnameKH: dbnameKH,
                    dbnameNX: dbnameNX,
                    iddonhang: data.iddonhang,
                    type: data.type,
                }
                console.log(objResult);
                io.sockets.emit("send-plan-cost", objResult);

            });
            socket.on("confirm-plan-cost", async function (data) {
                let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                const db = new Sequelize(data.dbname, 'struck_user', '123456a$', {
                    host: 'dbdev.namanphu.vn',
                    dialect: 'mssql',
                    operatorsAliases: '0',
                    // Bắt buộc phải có
                    dialectOptions: {
                        options: { encrypt: false }
                    },
                    pool: {
                        max: 5,
                        min: 0,
                        acquire: 30000,
                        idle: 10000
                    },
                    define: {
                        timestamps: false,
                        freezeTableName: true
                    }
                });
                const db2 = new Sequelize(data.dbname2, 'struck_user', '123456a$', {
                    host: 'dbdev.namanphu.vn',
                    dialect: 'mssql',
                    operatorsAliases: '0',
                    // Bắt buộc phải có
                    dialectOptions: {
                        options: { encrypt: false }
                    },
                    pool: {
                        max: 5,
                        min: 0,
                        acquire: 30000,
                        idle: 10000
                    },
                    define: {
                        timestamps: false,
                        freezeTableName: true
                    }
                });
                db.authenticate()
                    .then(() => console.log('Ket noi thanh cong'))
                    .catch(err => console.log(err.message));
                let objOrder = await db.query("SELECT * FROM tblDonHang WHERE ID = " + data.id)
                objOrder = objOrder[0][0]
                if (data.object.toUpperCase() == 'KHÁCH HÀNG') {
                    if (data.confirm == 0) {
                        let queryUpdate
                        if (data.type.toUpperCase() == 'KEHOACH') {
                            queryUpdate = "UPDATE tblDonHang SET ConfirmKH = 0, TrangThaiCho = N'Khách Hàng Từ Chối Kế Hoạch' WHERE ID = " + data.id
                        } else {
                            queryUpdate = "UPDATE tblDonHang SET ConfirmKH = 0, TrangThaiCho = N'Khách Hàng Từ Chối Chi Phí' WHERE ID = " + data.id
                        }
                        await db.query(queryUpdate)
                    } else {
                        if (objOrder.ConfirmNX == 1) {
                            if (data.type.toUpperCase() == 'KEHOACH') {
                                await db.query("UPDATE tblDonHang SET ConfirmKH = 1, TrangThaiCho = N'KẾ HOẠCH HOÀN THÀNH' WHERE ID = " + data.id)
                            } else {
                                await db.query("UPDATE tblDonHang SET ConfirmKH = 1, TrangThaiCho = N'CHI PHÍ HOÀN THÀNH' WHERE ID = " + data.id)
                            }
                        } else {
                            await db.query("UPDATE tblDonHang SET ConfirmKH = 1 WHERE ID = " + data.id)
                        }
                    }
                } else {
                    if (data.confirm == 0) {
                        let queryUpdate
                        if (data.type.toUpperCase() == 'KEHOACH') {
                            queryUpdate = "UPDATE tblDonHang SET ConfirmNX = 0, TrangThaiCho = N'Nhà Xe Từ Chối Kế Hoạch' WHERE ID = " + data.id
                        } else {
                            queryUpdate = "UPDATE tblDonHang SET ConfirmNX = 0, TrangThaiCho = N'Nhà Xe Từ Chối Chi Phí' WHERE ID = " + data.id
                        }
                        await db.query(queryUpdate)
                    } else {
                        console.log("START");
                        //lấy dữ liệu đơn gốc
                        let loaihinhvanchuyen = await db.query("SELECT * FROM tblLoaiHinhVanChuyen WHERE ID = " + objOrder.IDLoaiHinhVanChuyen)
                        let loaivo = await db.query("SELECT * FROM tblLoaiVo WHERE ID = " + objOrder.IDLoaiVo)
                        let hangtau = await db.query("SELECT * FROM tblHangTau WHERE ID = " + objOrder.IDHangTau)

                        //dữ liệu mới
                        let IDLoaiHinhVanChuyen;
                        let TypeLoaiHinhVanChuyen;
                        let IDKhachHang;
                        let IDDonHangs
                        // let IDDMXeCongTy = data.xecongty == null ? null : data.xecongty.id;
                        let SoLuongVo = objOrder.SoLuongVo;
                        let IDLoaiVo;
                        let IDHangTau;
                        let TrongLuong = objOrder.TrongLuong;
                        let NgayDong = objOrder.NgayDong;
                        let GioDong = objOrder.GioDong;
                        let NgayTra = objOrder.NgayTra;
                        let GioTra = objOrder.GioTra;
                        let NoiDong = objOrder.NoiDong;
                        let NoiTra = objOrder.NoiTra;
                        let CuocVanChuyen = objOrder.GiaCuocChi;
                        let SoContainer = objOrder.SoContainer;
                        let SoChi = objOrder.SoChi;
                        let DiaDiemDong = objOrder.DiaDiemDong;
                        let NguoiLayHang = objOrder.NguoiLayHang;
                        let SDTNguoiLay = objOrder.SDTNguoiLay;
                        let GhiChuLay = objOrder.GhiChuLay;
                        let DiaDiemTra = objOrder.DiaDiemTra;
                        let NguoiTraHang = objOrder.NguoiTraHang;
                        let SDTNguoiTra = objOrder.SDTNguoiTra;
                        let GhiChuTra = objOrder.GhiChuTra;
                        let GhiChuChiPhi = objOrder.GhiChuChiPhi;
                        let TrangThai = "MỚI";
                        let PheDuyet = "ĐÃ DUYỆT";
                        let IDNhanVienKH = data.idnhanvienkh;
                        let MaDoiChieu = objOrder.SoDonHang;
                        // let ts = Date.now();
                        let now = moment().add(7, 'hours').format('YYYY-MM-DD HH:mm:ss');
                        // let date_ob = new Date(ts);
                        // let date = ("0" + date_ob.getDate()).slice(-2);
                        // let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                        // let year = date_ob.getFullYear();
                        // let hours = date_ob.getHours();
                        // let minutes = date_ob.getMinutes();
                        // let seconds = date_ob.getSeconds();

                        let CreateDate = now;
                        let EditDate = now;
                        let dateNow = moment().add(7, 'hours').format('DDMMYYYY');

                        let getdonghang = await db2.query("SELECT * FROM tblDonHang WHERE SoDonHang like '%" + dateNow + "%' AND SoDonHang not like '%-%'")

                        let loaihinhvanchuyen2 = await db2.query("SELECT * FROM tblLoaiHinhVanChuyen WHERE TenVietTat = '" + loaihinhvanchuyen[0][0].TenVietTat + "'")
                        if (!loaihinhvanchuyen2[0][0]) {
                            let create_lhvc = await db2.query("INSERT INTO tblLoaiHinhVanChuyen (TenVietTat, TenLoaiHinh) values ('" + loaihinhvanchuyen[0][0].TenVietTat + "', '" + loaihinhvanchuyen[0][0].TenLoaiHinh + "')")
                            IDLoaiHinhVanChuyen = create_lhvc[0][0].ID
                            TypeLoaiHinhVanChuyen = create_lhvc[0][0].TenVietTat
                        } else {
                            IDLoaiHinhVanChuyen = loaihinhvanchuyen2[0][0].ID
                            TypeLoaiHinhVanChuyen = loaihinhvanchuyen2[0][0].TenVietTat
                        }
                        let SoDonHang = TypeLoaiHinhVanChuyen + "." + dateNow + "." + (getdonghang[0].length + 1).toString()
                        if (!loaivo[0][0]) {
                            IDLoaiVo = null
                        } else {
                            let loaivo2 = await db2.query("SELECT * FROM tblLoaiVo WHERE TenLoaiVo = N'" + loaivo[0][0].TenLoaiVo + "'")
                            if (!loaivo2[0][0]) {
                                await db2.query("INSERT INTO tblLoaiVo (TenLoaiVo, GhiChu, TrangThai) values ('" + loaivo[0][0].TenLoaiVo + "', '" + loaivo[0][0].GhiChu + "', 0 )")
                                let create_lv = await db2.query("SELECT * FROM tblLoaiVo WHERE TenLoaiVo = N'" + loaivo[0][0].TenLoaiVo + "'")
                                IDLoaiVo = create_lv[0][0].ID
                            } else {
                                IDLoaiVo = loaivo2[0][0].ID
                            }
                        }
                        if (!hangtau[0][0]) {
                            IDHangTau = null
                        } else {
                            let hangtau2 = await db2.query("SELECT * FROM tblHangTau WHERE TenHangTau = N'" + hangtau[0][0].TenHangTau + "'")
                            if (!hangtau2[0][0]) {
                                await db2.query("INSERT INTO tblHangTau (BaiContainer, TenHangTau, GhiChu, TrangThai) values (N'" + hangtau[0][0].BaiContainer + "', N'" + hangtau[0][0].TenHangTau + "', N'" + hangtau[0][0].GhiChu + "', 0)")
                                let create_ht = await db2.query("SELECT * FROM tblHangTau WHERE TenHangTau = N'" + hangtau[0][0].TenHangTau + "'")
                                IDHangTau = create_ht[0][0].ID
                            } else {
                                IDHangTau = hangtau2[0][0].ID
                            }
                        }
                        let diadiemdong = await db.query("SELECT * FROM tblKho WHERE ID= " + objOrder.IDDiaDiemDong)
                        if (diadiemdong[0][0]) {
                            DiaDiemDong = diadiemdong[0][0].Address
                            NguoiLayHang = diadiemdong[0][0].TenThuKho
                            SDTNguoiLay = diadiemdong[0][0].PhoneNumber
                        }
                        let diadiemtra = await db.query("SELECT * FROM tblKho WHERE ID= " + objOrder.IDDiaDiemTra)
                        if (diadiemtra[0][0]) {
                            DiaDiemTra = diadiemtra[0][0].Address
                            NguoiTraHang = diadiemtra[0][0].TenThuKho
                            SDTNguoiTra = diadiemtra[0][0].PhoneNumber
                        }
                        let dbMaster = await connectDatabase('STRUCK_CUSTOMER_DB')
                        let dbMasterQuery = await dbMaster.query("SELECT KeyConnect FROM CustomerDB WHERE NameDatabase = '" + data.dbname + "'")
                        if (!dbMasterQuery[0][0]) {
                            dbMaster = await connectDatabase('Customer_VTNAP')
                            dbMasterQuery = await dbMaster.query("SELECT KeyConnect FROM CustomerDB WHERE NameDatabase = '" + data.dbname + "'")
                        }
                        let khachhang = await db2.query("SELECT * FROM tblKhachHang WHERE KeyConnect = '" + dbMasterQuery[0][0].KeyConnect + "'")
                        IDKhachHang = khachhang[0][0].ID
                        let chiphiphatsinhchi = await db.query("SELECT * FROM tblChiPhiChiDonHang WHERE IDDonHang = " + data.id + " AND (ISCOM = 0 or ISCOM is null)")
                        let ChiPhiPhatSinhThu = 0
                        chiphiphatsinhchi[0].forEach(value => {
                            ChiPhiPhatSinhThu = ChiPhiPhatSinhThu + value.ChiPhiPhatSinhChi
                        })
                        let TongTienThu = CuocVanChuyen + ChiPhiPhatSinhThu
                        let donhangs = await db2.query("SELECT * FROM tblDonHang WHERE MaDoiChieu = '" + MaDoiChieu + "' AND IDKhachHang = " + IDKhachHang)
                        if (donhangs[0][0]) {
                            IDDonHangs = donhangs[0][0].ID
                            await db2.query("DELETE FROM tblAttachFile WHERE IDDonHang = " + IDDonHangs)
                            await db2.query("DELETE FROM tblChiPhiThuDonHang WHERE IDDonHang = " + IDDonHangs)
                            await db2.query("DELETE FROM tblDoanhThuKhacChoXeCT WHERE IDDonHang = " + IDDonHangs)
                            await db2.query("DELETE FROM tblChiPhiChiDonHang WHERE IDDonHang = " + IDDonHangs)
                            await db2.query("DELETE FROM tblChiPhiKhacChoXeCT WHERE IDDonHang = " + IDDonHangs)
                            await db2.query("DELETE FROM tblDonHang WHERE IDDonHangChinhSua = " + IDDonHangs)
                            await db2.query("DELETE FROM tblDonHang WHERE MaDoiChieu = '" + MaDoiChieu + "' AND IDKhachHang = " + IDKhachHang)
                        }
                        console.log("INSERT");
                        let CreateOrderQuery = "Insert INTO tblDonHang (IDLoaiHinhVanChuyen, SoDonHang, MaDoiChieu, CuocVanChuyen, GiaCuocThu, NgayDong, NgayTra, GioDong, GioTra, ChiPhiPhatSinhThu, TongTienThu, TrangThai, IDKhachHang, SoLuongVo, IDLoaiVo, IDHangTau, TrongLuong, NoiDong, DiaDiemDong, NoiTra,DiaDiemTra, PheDuyet, SoContainer, SoChi, NguoiLayHang, SDTNguoiLay, GhiChuLay, NguoiTraHang, SDTNguoiTra, GhiChuTra, GhiChuChiPhi, IDNhanVienKH,CreateDate, EditDate) values (" + IDLoaiHinhVanChuyen + ",'" + SoDonHang + "','" + MaDoiChieu + "'," + CuocVanChuyen + "," + CuocVanChuyen + ",'" + NgayDong + "','" + NgayTra + "','" + GioDong + "','" + GioTra + "'," + ChiPhiPhatSinhThu + "," + TongTienThu + ", N'MỚI'," + IDKhachHang + "," + SoLuongVo + "," + IDLoaiVo + "," + IDHangTau + ",N'" + TrongLuong + "',N'" + NoiDong + "',N'" + DiaDiemDong + "',N'" + NoiTra + "',N'" + DiaDiemTra + "', N'ĐÃ DUYỆT','" + SoContainer + "','" + SoChi + "',N'" + NguoiLayHang + "','" + SDTNguoiLay + "',N'" + GhiChuLay + "',N'" + NguoiTraHang + "','" + SDTNguoiTra + "',N'" + GhiChuTra + "',N'" + GhiChuChiPhi + "'," + IDNhanVienKH + ",'" + CreateDate + "','" + EditDate + "')"
                        await db2.query(CreateOrderQuery)
                        let NewOrder = await db2.query("SELECT * FROM tblDonHang WHERE SoDonHang = '" + SoDonHang + "'")
                        let IDDonHang = NewOrder[0][0].ID
                        await chiphiphatsinhchi[0].forEach(value => {
                            db2.query("INSERT INTO tblDoanhThuKhacChoXeCT (IDDonHang, TenDoanhThuKhac, ChiPhi) values ('" + IDDonHang + "', N'" + value.TenChiPhiChi + "', " + value.ChiPhiPhatSinhChi + ")")
                        })
                        await chiphiphatsinhchi[0].forEach(value => {
                            db2.query("INSERT INTO tblChiPhiThuDonHang (IDDonHang, TenChiPhiThu, ChiPhiPhatSinhThu) values ('" + IDDonHang + "', N'" + value.TenChiPhiChi + "', " + value.ChiPhiPhatSinhChi + ")")
                        })
                        if (objOrder.ConfirmKH == 1) {
                            if (data.type.toUpperCase() == 'KEHOACH') {
                                await db.query("UPDATE tblDonHang SET ConfirmNX = 1, TrangThaiCho = N'KẾ HOẠCH HOÀN THÀNH', IDDMXeCongTy = NULL WHERE ID = " + data.id)
                            } else {
                                await db.query("UPDATE tblDonHang SET ConfirmNX = 1, TrangThaiCho = N'CHI PHÍ HOÀN THÀNH' WHERE ID = " + data.id)
                                await db2.query("UPDATE tblDonHang SET TrangThai = N'HOÀN THÀNH' WHERE MaDoiChieu = '" + objOrder.MaDoiChieu + "'")
                            }
                        } else {
                            if (data.type.toUpperCase() == 'CHIPHI') {
                                await db.query("UPDATE tblDonHang SET ConfirmNX = 1 WHERE ID = " + data.id)
                                await db2.query("UPDATE tblDonHang SET TrangThai = N'HOÀN THÀNH' WHERE MaDoiChieu = '" + objOrder.MaDoiChieu + "'")
                            } else {
                                await db.query("UPDATE tblDonHang SET ConfirmNX = 1, IDDMXeCongTy = NULL WHERE ID = " + data.id)
                            }
                        }
                    }
                }
                let dbnameKH;
                let dbnameNX;
                let KeyConnect;
                let IDNhaXe;
                let dbMaster = await connectDatabase('STRUCK_CUSTOMER_DB')
                // check dbname khách hàng
                if (!objOrder.IDKhachHang) {
                    dbnameKH = null
                } else {
                    KeyConnect = await db.query('select KeyConnect from tblKhachHang where ID = ' + objOrder.IDKhachHang)
                    KeyConnect = KeyConnect[0][0]
                    if (!KeyConnect)
                        dbnameKH = null
                    else {
                        let dbMasterQuery = "SELECT NameDatabase FROM CustomerDB WHERE KeyConnect = '" + KeyConnect.KeyConnect + "'"
                        dbnameKH = await dbMaster.query(dbMasterQuery)
                        dbnameKH = dbnameKH[0][0]
                        if (dbnameKH) {
                            dbnameKH = dbnameKH.NameDatabase
                        } else {
                            let dbMasterQuery = "SELECT NameDatabase FROM CustomerDB WHERE KeyConnect = '" + KeyConnect.KeyConnect + "'"
                            dbMaster = await connectDatabase('Customer_VTNAP')
                            dbnameKH = await dbMaster.query(dbMasterQuery)
                            dbnameKH = dbnameKH[0][0]
                            if (dbnameKH)
                                dbnameKH = dbnameKH.NameDatabase
                            else
                                dbnameKH = null
                        }
                    }
                }
                // check dbname nhà xe
                dbMaster = await connectDatabase('STRUCK_CUSTOMER_DB')

                if (!objOrder.IDNhaXe) {
                    dbnameNX = null
                } else {
                    IDNhaXe = await db.query('select KeyConnect from tblKhachHang where ID = ' + objOrder.IDNhaXe)
                    IDNhaXe = IDNhaXe[0][0]
                    if (!IDNhaXe)
                        dbnameNX = null
                    else {
                        let dbMasterQuery = "SELECT NameDatabase FROM CustomerDB WHERE KeyConnect = '" + IDNhaXe.KeyConnect + "'"
                        dbnameNX = await dbMaster.query(dbMasterQuery)
                        dbnameNX = dbnameNX[0][0]
                        if (dbnameNX) {
                            dbnameNX = dbnameNX.NameDatabase
                        } else {
                            let dbMasterQuery = "SELECT NameDatabase FROM CustomerDB WHERE KeyConnect = '" + IDNhaXe.KeyConnect + "'"
                            dbMaster = await connectDatabase('Customer_VTNAP')
                            dbnameNX = await dbMaster.query(dbMasterQuery)
                            dbnameNX = dbnameNX[0][0]
                            if (dbnameNX)
                                dbnameNX = dbnameNX.NameDatabase
                            else
                                dbnameNX = null
                        }
                    }
                }

                let obj = {
                    dbnameKH: dbnameKH,
                    dbnameNX: dbnameNX,
                }
                io.sockets.emit("confirm-plan-cost", obj);

            });
            console.log('The user is connecting : ' + socket.id);
        })
    },
    socketEmit: async (io, dbname) => {
        io.sockets.emit("notification-zalo", { dbname: dbname });
    },
    socketEmitNotifiPlan: async (io, dbname) => {
        io.sockets.emit("notification-kehoach", { dbname: dbname });
    },
    socketEmitNotifiCost: async (io, dbname) => {
        io.sockets.emit("notification-chiphi", { dbname: dbname });
    },
    socketEmitNotifiRequest: async (io, dbname) => {
        io.sockets.emit("sendrequest", { dbname: dbname });
    },
}