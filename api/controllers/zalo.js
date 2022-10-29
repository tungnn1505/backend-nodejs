const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var Zalo = require('zalo-sdk');
var ZaloSocial = require('zalo-sdk').ZaloSocial;

var zsConfig = {
    oaid: '3035823382762161450',
    // redirectUri: 'http://localhost/login/zalo-callback',
    secretkey: 'K4SN69O0Q6K8scUs51QX'
};

var ZSClient = new ZaloSocial(zsConfig);
module.exports = {
    zalo: (req, res) => {
        let body = req.body;
        try {
            ZSClient.api('me', 'GET', { fields: 'id, name, birthday, gender, picture' }, function (response) {
                console.log(response);
                res.json(response)

            });
        } catch (error) {
            console.log(error);
            res.json(Result.SYS_ERROR_RESULT)
        }
    },
}
