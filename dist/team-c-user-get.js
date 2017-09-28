var AWS = require("aws-sdk");
var dynamo = new AWS.DynamoDB.DocumentClient();
var tableName = "user";

exports.handler = (event, context, callback) => {
    //レスポンスの雛形
    var response = {
        statusCode : 200,
        headers: {
            "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify({"message" : ""})
    };

    var userId = event.queryStringParameters.userId;   //見たいユーザのuserId

    //TODO: 取得対象のテーブル名と検索に使うキーをparamに宣言
    var param = {
        "TableName" : tableName,
        "Key" : {
            "userId" : userId
        }
    };

    //dynamo.get()でDBからデータを取得
    dynamo.get(param, function(err, data){
        if(err){
            //TODO: 取得に失敗した時の処理を記述
            response.statusCode = 500;
            response.body = JSON.stringify({
                "message" : "予期せぬエラーが発生しました"
            });
            callback(null, response);
            return;
        }

        if(data.Item){
            delete data.Item.password;
        }

        //TODO: 条件に該当するデータがあればパスワードを隠蔽をする処理を記述

        //TODO: レスポンスボディの設定とコールバックを記述
        response.body = JSON.stringify(data);
        callback(null, response);
    });
};
