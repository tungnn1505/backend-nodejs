const Sequelize = require('sequelize');
const Op = require('sequelize').Op;
const Constant = require('../constants/constant');

async function connectDatabase() {
    const db = new Sequelize('NMQ_DB', 'nmq_user', '123456a$', {
        host: 'db.namanphu.vn',
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
    apiGetTicketTypes: async(req, res) => {
        let body = req.body;
        let db = await connectDatabase()
        let query = `SELECT * FROM tblJOBPhieuThuChi`

        if (body.type == 'receipts') {
            query = 'SELECT * FROM tblJOBPhieuThuChi WHERE EnumLoaiPhieu = 0 and enumLoaiPhieuTamUng is NULL'
        } else if (body.type == 'payment') {
            query = 'SELECT * FROM tblJOBPhieuThuChi WHERE EnumLoaiPhieu = 1  and enumLoaiPhieuTamUng is NULL'
        } else if (body.type == 'loan') {
            query = 'SELECT * FROM tblJOBPhieuThuChi WHERE enumLoaiPhieuTamUng = 2'
        } else {
            query = 'SELECT * FROM tblJOBPhieuThuChi WHERE enumLoaiPhieuTamUng = 3'

        }
        let locyData = await db.query(query)
            // console.log(locyData[0][0]);
        let data = locyData[0]
        for (var i = 0; i < data.length; i++) {
            let dataCurrency = {};
            let dataVanPhong = {};
            let dataNVTamUng = {};
            if (data[i].IDCurrency) {
                let query = 'SELECT Code, NameVI, NameEN FROM tblDMCurrency WHERE ID = ' + data[i].IDCurrency
                dataCurrency = await db.query(query)
                dataCurrency = dataCurrency[0][0]
            }
            if (data[i].IDVanPhong) {
                let query = 'SELECT Code, NameEN, NameVI FROM tblDMVanPhong WHERE ID = ' + data[i].IDVanPhong
                dataVanPhong = await db.query(query)
                dataVanPhong = dataVanPhong[0][0]
            }
            if (data[i].IDNVTamUng) {
                let query = 'SELECT HoTenVI, MST, HoTenEN FROM tblNhanSu WHERE ID = ' + data[i].IDNVTamUng
                dataNVTamUng = await db.query(query)
                dataNVTamUng = dataNVTamUng[0][0]
            }
            data[i]['currencyObj'] = dataCurrency
            data[i]['vanPhongObj'] = dataVanPhong
            data[i]['nvTamUngObj'] = dataNVTamUng
            data[i]['staffAdvance'] = dataNVTamUng.HoTenVI ? dataNVTamUng.HoTenVI : ''
            data[i]['officeName'] = dataVanPhong.NameVI ? dataVanPhong.NameVI : ''
            data[i]['currencyName'] = dataCurrency.NameVI ? dataCurrency.NameVI : ''
            let typeAdvance = '';
            let typeReceipts = '';
            let cashOrBankTransfer = '';
            if (data[i].EnumLoaiPhieu == 0)
                typeReceipts = 'Phiếu thu'
            else
                typeReceipts = 'Phiếu Chi'
            if (data[i].enumLoaiPhieuTamUng == 2)
                typeAdvance = 'Tạm ứng'
            else if (data[i].enumLoaiPhieuTamUng == 3)
                typeAdvance = 'Hoàn ứng'
            if (data[i].EnumCashOrBankTransfer == 0)
                cashOrBankTransfer = 'Tiền mặt'
            if (data[i].EnumCashOrBankTransfer == 1)
                cashOrBankTransfer = 'Chuyển khoản'
            data[i]['typeAdvance'] = typeAdvance
            data[i]['typeReceipts'] = typeReceipts
            data[i]['cashOrBankTransfer'] = cashOrBankTransfer
        }
        var result = {
            array: data,
            status: Constant.STATUS.SUCCESS,
            message: Constant.MESSAGE.ACTION_SUCCESS,
        }
        res.json(result);
    }
}