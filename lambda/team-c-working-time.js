var AWS = require("aws-sdk");
var dynamo = new AWS.DynamoDB.DocumentClient();
var tableName = "team-c-data";

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
            "working_sec" : body.working_sec,
            "working_hour" : body.working_hour,
            "working_min" : body.working_min
        }
    };

    if(event.headers.Authorization !== "mti2017"){
      response.statusCode = 401;
      response.body = JSON.stringify({
        "message" : "認証エラーです．"
      });
      callback(null, response);
      return;
    }

    //dynamo.put()でDBにデータを登録
    console.log(param);
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
