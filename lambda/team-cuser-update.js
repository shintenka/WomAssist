var AWS = require("aws-sdk");
var dynamo = new AWS.DynamoDB.DocumentClient();
var tableName = "user";

exports.handler = (event, context, callback) => {
    var response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify({"message" : ""})
    };

    var body = JSON.parse(event.body);

    if(event.headers.Authorization !== "mti2017"){
      response.statusCode = 401;
      response.body = JSON.stringify({
        "message" : "認証エラーです．"
      });
      callback(null, response);
      return;
    }

    //TODO: paramに更新対象のテーブル名と更新内容を記述
     var param = {
       "TableName" : tableName,
       "Item" : {
         "userId" : body.userId,
         "password" : body.password,
         "age" : body.age,
         "nickname" : body.nickname
     }
    };

    //dynamo.put()を用いてデータの更新
    dynamo.put(param, function(err, data){
        if(err){
            //TODO: 更新に失敗した場合の処理を記述
            response.statusCode = 500;
            response.body = JSON.stringify({
                "message" : "予期せぬエラーが発生しました"
            });
            callback(null, response);
            return;
        }else{
            //TODO: 更新に成功した場合の処理を記述
            response.body = JSON.stringify(param.Item);
            callback(null, response);
            return;
        }
    });
};
