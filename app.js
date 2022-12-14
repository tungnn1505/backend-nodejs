var session = require('express-session')

let app = require('express')();
let server = require('http').createServer(app);
let cors = require('cors');
const path = require('path');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser')
var mtblFileAttach = require("./api/tables/constants/tblFileAttach");
var mtblDMNhanvien = require("./api/tables/constants/tblDMNhanvien");
var mtblYeuCauMuaSam = require("./api/tables/qlnb/tblYeuCauMuaSam");
var mtblDeNghiThanhToan = require("./api/tables/qlnb/tblDeNghiThanhToan");
var mtblTemplate = require('./api/tables/qlnb/tblTemplate')
var mtblDMBoPhan = require('./api/tables/constants/tblDMBoPhan')
var mtblYeuCauMuaSamDetail = require('./api/tables/qlnb/tblYeuCauMuaSamDetail')

var database = require('./api/database');
var socket = require('./api/socket_io/socket');

app.use(session({
    name: 'user_sid',
    secret: '00a2152372fa8e0e62edbb45dd82831a',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000,
        maxAge: 3000000,
        sameSite: true,
        secure: true,
        httpOnly: true
    }
}))
app.use(cors())
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))
app.use(bodyParser.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: false }));
// ------------------------------------------------------------------------------------------------------
var nameMiddle;
async function getDateInt(req, res, next) {
    var datetime = new Date();
    nameMiddle = Date.parse(datetime) + Math.floor(Math.random() * 1000000);
    next();
}
var pathFile;
var nameFile;
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        pathFile = path.extname(file.originalname)
        nameFile = file.originalname.split('.')[0]
        cb(null, file.fieldname + '-' + nameMiddle + pathFile);
    }
});
let upload = multer({ storage: storage });
const DIR = 'C:/images_services/ageless_sendmail';

app.post('/qlnb/upload', getDateInt, upload.array('photo', 12), async function (req, res) {
    if (!req.files) {
        console.log("No file received");
        return res.send({
            success: false
        });
    } else {
        database.connectDatabase().then(async db => {
            var pathTo = 'C:/images_services/ageless_sendmail/'
            var pathFinal = '';
            pathFirst = pathTo + 'photo-' + nameMiddle + pathFile;
            if (pathFirst.slice(-1) == 'c') {
                var randomOutput = 'output-' + Math.floor(Math.random() * Math.floor(100000000000)) + '.docx';
                var CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
                var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;
                var Apikey = defaultClient.authentications['Apikey'];
                Apikey.apiKey = "867a8adc-9881-4c99-85f8-4c9d2cd7aaeb"

                var apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();
                var inputFile = Buffer.from(fs.readFileSync(pathFirst).buffer); // File | Input file to perform the operation on.
                var callback = function (error, data, response) {
                    if (error) {
                        console.error(error);
                    } else {
                        fs.writeFileSync(path.resolve(pathTo, randomOutput), data);
                    }
                };
                apiInstance.convertDocumentDocToDocx(inputFile, callback);
                pathFinal = pathTo + randomOutput;
                fs.unlink(pathFirst, (err) => {
                    if (err) console.log(err);
                });
            } else {
                pathFinal = pathFirst;
            }
            pathFinal = pathFinal.slice(36, 100)
            let idLink = await mtblFileAttach(db).create({
                Name: nameFile + pathFile,
                Link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/' + pathFinal,
            })
            return res.send({
                link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/' + pathFinal,
                name: nameFile + pathFile,
                id: idLink.ID,
                success: true
            })
        })
    }
});
var fs = require('fs');
const JSZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const Constant = require('./api/constants/constant');
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
var mtblDMHangHoa = require('./api/tables/qlnb/tblDMHangHoa');
var mtblDMLoaiTaiSan = require('./api/tables/qlnb/tblDMLoaiTaiSan');
var mtblDMChiNhanh = require('./api/tables/constants/tblDMChiNhanh')
var mtblMucDongBaoHiem = require('./api/tables/hrmanage/tblMucDongBaoHiem')

var moment = require('moment');
async function handleRequestShopping(db, idycms) {
    var objKey = {
        'B??? PH???N ????? XU???T': '',
        'NH??N VI??N': '',
        'NG??Y ????? XU???T': '',
        'M?? TS/TB/LK': '',
        'T??N TS/TB/LK': '',
        '????N GI??': '',
        'S??? L?????NG': '',
        'T???NG TI???N': '',
        'L?? DO MUA': '',
        'TR???NG TH??I': '',
    };
    let tblYeuCauMuaSam = mtblYeuCauMuaSam(db); // b???t bu???c
    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'NhanVien' })
    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDPheDuyet1', sourceKey: 'IDPheDuyet1', as: 'PheDuyet1' })
    tblYeuCauMuaSam.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDPheDuyet2', sourceKey: 'IDPheDuyet2', as: 'PheDuyet2' })
    tblYeuCauMuaSam.belongsTo(mtblDMBoPhan(db), { foreignKey: 'IDPhongBan', sourceKey: 'IDPhongBan', as: 'phongban' })
    let tblYeuCauMuaSamDetail = mtblYeuCauMuaSamDetail(db);
    tblYeuCauMuaSam.hasMany(tblYeuCauMuaSamDetail, { foreignKey: 'IDYeuCauMuaSam', as: 'line' })

    await tblYeuCauMuaSam.findOne({
        order: [
            ['ID', 'DESC']
        ],
        include: [{
            model: mtblDMBoPhan(db),
            required: false,
            as: 'phongban'
        },
        {
            model: mtblDMNhanvien(db),
            required: false,
            as: 'NhanVien'
        },
        {
            model: mtblDMNhanvien(db),
            required: false,
            as: 'PheDuyet1',
        },
        {
            model: mtblDMNhanvien(db),
            required: false,
            as: 'PheDuyet2',
        },
        {
            model: tblYeuCauMuaSamDetail,
            required: false,
            as: 'line'
        },
        ],
        where: { ID: idycms }
    }).then(async data => {
        var total = 0;
        var code = '';
        var name = '';
        var unitPrice = '';
        var amountHH = '';
        if (data) {
            for (var j = 0; j < data.line.length; j++) {
                var price = data.line[j].Price ? data.line[j].Price : 0
                var amount = data.line[j].Amount ? data.line[j].Amount : 0
                total += amount * price
                let tblDMHangHoa = mtblDMHangHoa(db);
                tblDMHangHoa.belongsTo(mtblDMLoaiTaiSan(db), { foreignKey: 'IDDMLoaiTaiSan', sourceKey: 'IDDMLoaiTaiSan', as: 'loaiTaiSan' })
                await tblDMHangHoa.findOne({
                    where: {
                        ID: data.line[j].IDDMHangHoa,
                    },
                    include: [{
                        model: mtblDMLoaiTaiSan(db),
                        required: false,
                        as: 'loaiTaiSan'
                    },],
                }).then(data => {
                    if (data) {
                        name += ',' + data ? data.Name : ''
                        code += ',' + data ? data.Code : ''
                        amount += ',' + amount
                        unitPrice += ',' + price
                    }
                })
                objKey = {
                    'B??? PH???N ????? XU???T': data.phongban ? data.phongban.DepartmentName : '',
                    'NH??N VI??N': data.NhanVien ? data.NhanVien.StaffName : '',
                    'NG??Y ????? XU???T': data.RequireDate ? moment(data.RequireDate).format('DD/MM/YYYY') : '',
                    'M?? TS/TB/LK': code,
                    'T??N TS/TB/LK': name,
                    '????N GI??': (Number(unitPrice)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                    'S??? L?????NG': amountHH,
                    'T???NG TI???N': (Number(total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                    'L?? DO MUA': data.Reason ? data.Reason : '',
                    'TR???NG TH??I': data.Status ? data.Status : '',
                }
            }
        }

    })
    return objKey
}
async function handlePaymentOrder(db, iddntt) {
    var objKey = {
        'CH???NG T???': '',
        'NG?????I ????? NGH???': '',
        'N???I DUNG THANH TO??N': '',
        'S??? TI???N THANH TO??N': '',
        'NG?????I PH?? DUY???T TR?????C': '',
        'NG?????I PH?? DUY???T SAU': '',
        'B??? PH???N': '',
        'S??? TI???N B???NG CH???': '',
    };
    let tblDeNghiThanhToan = mtblDeNghiThanhToan(db);
    let tblDMNhanvien = mtblDMNhanvien(db);
    let tblDMBoPhan = mtblDMBoPhan(db);
    tblDMNhanvien.belongsTo(tblDMBoPhan, { foreignKey: 'IDBoPhan', sourceKey: 'IDBoPhan', as: 'bophan' })
    tblDMBoPhan.belongsTo(mtblDMChiNhanh(db), { foreignKey: 'IDChiNhanh', sourceKey: 'IDChiNhanh', as: 'chinhanh' })

    tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'IDNhanVien', sourceKey: 'IDNhanVien', as: 'NhanVien' })
    tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'idNhanVienKTPD', sourceKey: 'idNhanVienKTPD', as: 'KTPD' })
    tblDeNghiThanhToan.belongsTo(mtblDMNhanvien(db), { foreignKey: 'idNhanVienLDPD', sourceKey: 'idNhanVienLDPD', as: 'LDPD' })
    await tblDeNghiThanhToan.findOne({
        where: { ID: iddntt },
        order: [
            ['ID', 'DESC']
        ],
        include: [{
            model: tblDMNhanvien,
            required: false,
            as: 'NhanVien',
            include: [{
                model: tblDMBoPhan,
                required: false,
                as: 'bophan',
                include: [{
                    model: mtblDMChiNhanh(db),
                    required: false,
                    as: 'chinhanh'
                },],
            },],
        },
        {
            model: mtblDMNhanvien(db),
            required: false,
            as: 'KTPD'
        },
        {
            model: mtblDMNhanvien(db),
            required: false,
            as: 'LDPD'
        },
        ],
    }).then(async data => {
        objKey = {
            'CH???NG T???': '',
            'NG?????I ????? NGH???': data.NhanVien ? data.NhanVien.StaffName : '',
            'N???I DUNG THANH TO??N': data.Contents ? data.Contents : '',
            'S??? TI???N THANH TO??N': data.Cost ? (Number(data.Cost)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : 0,
            'NG?????I PH?? DUY???T TR?????C': data.KTPD ? data.KTPD.StaffName : '',
            'NG?????I PH?? DUY???T SAU': data.LDPD ? data.LDPD.StaffName : '',
            'B??? PH???N': data.NhanVien ? data.NhanVien.bophan ? data.NhanVien.bophan.DepartmentName : '' : '',
            'S??? TI???N B???NG CH???': data.CostText ? data.CostText : '',
        };
    })
    return objKey
}
async function getPathFromtblTmplate(db, code, idycms) {
    let tblTemplate = mtblTemplate(db);
    var pathFirst = '';
    tblTemplate.hasMany(mtblFileAttach(db), { foreignKey: 'IDTemplate', as: 'tem' })
    await tblTemplate.findOne({
        where: { Code: code },
        include: [{
            model: mtblFileAttach(db),
            required: false,
            as: 'tem'
        },],
    }).then(data => {
        //  data.tem[0].Link.slice(44, 100)
        pathFirst = data.tem[0].Link.slice(47, 100);
        if (!data.tem[0].ID) {
            return res.json('Kh??ng t??m th???y code. Vui l??ng c???u h??nh l???i m???u !')
        }
    })
    return pathFirst
}
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.post('/qlnb/render_automatic_work', async function (req, res) {
    let body = req.body;
    var pathFirst = '';
    var objKey = {};
    await database.connectDatabase().then(async db => {
        pathFirst = await getPathFromtblTmplate(db, body.code, body.id)
        if (body.code == 'ycms') {
            objKey = await handleRequestShopping(db, body.id)
        } else if (body.code == 'dntt') {
            objKey = await handlePaymentOrder(db, body.id)
        } else {
            objKey = await handleRequestShopping(db, body.id)
        }
    })
    var pathTo = 'C:/images_services/ageless_sendmail/'
    console.log(pathTo + pathFirst);
    fs.readFile(pathTo + pathFirst, 'binary', function (err, data) {
        try {
            if (err) {
                console.log(err);
                var result = {
                    status: Constant.STATUS.FAIL,
                    message: 'File kh??ng t???n t???i. Vui l??ng c???u h??nh l???i!',
                }
                res.json(result);
            } else {
                var zip = new JSZip(data);
                var doc = new Docxtemplater().loadZip(zip)
                //set the templateVariables
                doc.setData(objKey);
                doc.render()
                var buf = doc.getZip().generate({ type: 'nodebuffer' });
                // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
                // var randomOutput = 'output-' + Math.floor(Math.random() * Math.floor(100000000000)) + '.docx';
                fs.writeFileSync(path.resolve(pathTo, 'export-file-word.docx'), buf);
                var result = {
                    link: 'http://dbdev.namanphu.vn:1357/ageless_sendmail/' + 'export-file-word.docx',
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                }
                res.json(result);
            }
        } catch (error) {
            console.log(error);
            res.json('L???i file export. Vui l??ng c???u h??nh l???i!')
        }
    });
})
// -------------------------------------------------------------------------------------------------------------------------
let routes = require('./api/router') //importing route
routes(app)

let connect = require('./api/database')

connect.connectDatabase();

const port = process.env.PORT || 3101
// wsEngine cho ph??p g???i v??o h??m
var io = require("socket.io")(server, {
    cors: {
        wsEngine: 'eiows',
        origin: ["http://dbdev.namanphu.vn:8692", "http://localhost:4210", "http://dbdev.namanphu.vn:8693", "http://dbdev.namanphu.vn:8694"],
        methods: ["GET", "POST"],
        credentials: true,
    }
})
server.listen(port, function () {
    console.log('http://localhost:' + port);
});
let scheduleJob = require('./api/scheduleJob')
scheduleJob.editStatus24HourEveryday()
// connect socket
var socket = require('./api/socket_io/socket');
var socket_ts = require('./api/socket_io/socket_ts');
var socket_ns = require('./api/socket_io/socket_ns');
socket.sockketIO(io)
socket_ts.sockketIO(io)
socket_ns.sockketIO(io)
app.post('/notification-zalo', async function (req, res) {
    let body = req.body;
    await socket.socketEmit(io, body.dbname)
    var result = {
        status: 1,
        message: '',
    }
    res.json(result);
})
app.post('/notification-kehoach', async function (req, res) {
    let body = req.body;
    await socket.socketEmitNotifiPlan(io, body.dbname)
    var result = {
        status: 1,
        message: '',
    }
    res.json(result);
})
app.post('/notification-chiphi', async function (req, res) {
    let body = req.body;
    await socket.socketEmitNotifiCost(io, body.dbname)
    var result = {
        status: 1,
        message: '',
    }
    res.json(result);
})
app.post('/notification-yeucau', async function (req, res) {
    let body = req.body;
    await socket.socketEmitNotifiRequest(io, body.dbname)
    var result = {
        status: 1,
        message: '',
    }
    res.json(result);
})
app.post('/backup_db', async function (req, res) {
    let body = req.body;
    let nameDatabase = body.name
    let query = `BACKUP DATABASE ${nameDatabase} TO DISK ='C:\\Program Files\\Microsoft SQL Server\\MSSQL15.MSSQLSERVER\\MSSQL\\DATA\\${nameDatabase}_copy.bark';
    RESTORE DATABASE ${nameDatabase}_Copy 
        FROM DISK='C:\\Program Files\\Microsoft SQL Server\\MSSQL15.MSSQLSERVER\\MSSQL\\DATA\\${nameDatabase}_copy.bark'
        WITH 
            MOVE '${nameDatabase}' TO 'C:\\Program Files\\Microsoft SQL Server\\MSSQL15.MSSQLSERVER\\MSSQL\\DATA\\${nameDatabase}_Copy.mdf',
            MOVE '${nameDatabase}_log' to  'C:\\Program Files\\Microsoft SQL Server\\MSSQL15.MSSQLSERVER\\MSSQL\\DATA\\${nameDatabase}_Copy_log.ldf';`
    database.connectDatabase().then(async db => {
        console.log(query);
        await db.query(query)
        var result = {
            status: 1,
            message: '',
        }
        res.json(result);
    })
})