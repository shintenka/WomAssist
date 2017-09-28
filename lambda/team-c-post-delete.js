var AWS = require("aws-sdk");
var dynamo = new AWS.DynamoDB.DocumentClient();
var tableName = "post";

exports.handler = (event, context, callback) => {
    var response = {
        statusCode : 200,
        headers: {
            "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify({"message" : ""})
    };

    var body = JSON.parse(event.body);
    //var userId = body.userId;

    if(event.headers.Authorization !== "mti2017"){
      response.statusCode = 401;
      response.body = JSON.stringify({
        "message" : "認証エラーです．"
      });
      callback(null, response);
      return;
    }

    //TODO: 削除対象のテーブル名と削除したいデータのkeyをparamに設定
    var param = {
      "TableName" : tableName,
      "Key" : {
        "userId" : body.userId,
        "timestamp" : body.timestamp
      }
    };

    //dynamo.delete()を用いてデータを削除
    dynamo.delete(param, function(err, data){
        if(err){
            //TODO: 削除に失敗した場合の処理を記述
            response.statusCode = 500;
            response.body = JSON.stringify({
                "message" : "予期せぬエラーが発生しました"
            });
            callback(null, response);
            return;
        }else{
            //TODO: 削除に成功した場合の処理を記述
            response.body = JSON.stringify({
              "message" : "success"
            });
            callback(null, response);
            return;
        }
    });
};
