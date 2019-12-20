const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017/mogodbTest';

var login = async (ctx, next) => {
    const {phone, password} = ctx.request.body;
    var result = await find_have_phone(phone);
    if(result && result.length > 0) {
        var resultc = await find_correct_pass(phone, password);
        if(resultc && resultc.length > 0) {
            ctx.response.body = {
                code: 0,//0表示成功
                data:'',
                msg:'登陆成功'
            };
        } else {
            ctx.response.body = {
                code: 3,//3账户或者密码错误
                data:'',
                msg:'账户或者密码错误'
            };
        }
    } else {
        ctx.response.body =  {
            code: 2,//2表示不存在
            data:'',
            msg:'登陆账户不存在'
        }
    }
};

var find_have_phone = async function(phone) {//查找手机号是不是已经存在了
    return new Promise(function(resolve,reject) {
        MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
            if (err) throw err;
            var dataBase = db.db('mogodbTest');
            var whereStr = {"phone": phone};
            dataBase.collection('userInfo').find(whereStr).toArray(function(err, result) {
                if (err) throw err;
                db.close();
                resolve(result)
            })
        })
    })
}

var find_correct_pass = async function(phone, password) {//查找密码是不是正确
    return new Promise(function(resolve,reject) {
        MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
            if (err) throw err;
            var dataBase = db.db('mogodbTest');
            var whereStr = {"phone": phone, "password": password};
            dataBase.collection('userInfo').find(whereStr).toArray(function(err, result) {
                if (err) throw err;
                db.close();
                resolve(result)
            })
        })
    })
}

module.exports = {
    'POST /myapi/login': login
};
