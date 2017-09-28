var AWS = require("aws-sdk");
var dynamo = new AWS.DynamoDB.DocumentClient();
var tableName = "post";

exports.handler = (event, context, callback) => {
    var response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify({"message" : ""})
    };

    var body = JSON.parse(event.body);



    var text = body.text;

    if(!text) {
      response.statusCode = 400;
      response.body = JSON.stringify({"message" : "入力されていない項目があります"});
      callback(null, response);
      return;
    }

    //TODO: DBに登録するための情報をparamオブジェクトとして宣言する（中身を記述）
    var param = {
        "TableName" : tableName,
        "Item" : {
            "userId" : body.userId,
            "timestamp" : Date.now(),
            "category" : body.category,
            "text" : body.text
        }
    };

    //dynamo.put()でDBにデータを登録
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
};
