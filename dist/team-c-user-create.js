var AWS = require("aws-sdk");
var dynamo = new AWS.DynamoDB.DocumentClient();
var tableName = "team-c-user";
var tableName2 = "team-c-data";

exports.handler = (event, context, callback) => {
    var response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify({"message" : ""})
    };

    var body = JSON.parse(event.body);

    //TODO: DBに登録するための情報をparamオブジェクトとして宣言する（中身を記述）
    var param = {
        "TableName" : tableName,
        "Item" : {
            "email" : body.email,
            "age" : body.age,
            "name" : body.name,
            "password" : body.password,
            "sex" : body.sex
        }
    };
    var param2 = {
        "TableName" : tableName2,
        "Item" : {
            "email" : body.email,
            "working_day" : 0,
            "working_hour" : 0,
            "working_min" : 0,
            "working_sec" : 0
        }
    };

    //dynamo.put()でユーザ情報(性別、年齢など)を登録
    console.log(param);
    dynamo.put(param, function(err, data) {
        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                "message" : "予期せぬエラーが発生しました"
            });
            callback(null, response);
            return;
        } else {
            //TODO: 登録に成功した場合の処理を記述
            response.body = JSON.stringify(param.Item);
            callback(null, response);
            return;
        }
    });
    //dynamo.put()でユーザの作業時間データの初期値を登録
    dynamo.put(param2, function(err, data) {
        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                "message" : "予期せぬエラーが発生しました"
            });
            callback(null, response);
            return;
        } else {
            //TODO: 登録に成功した場合の処理を記述
            response.body = JSON.stringify(param2.Item);
            callback(null, response);
            return;
        }
    });
};
