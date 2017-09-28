var AWS = require("aws-sdk");
var dynamo = new AWS.DynamoDB.DocumentClient();
var tableName = "team-c-user";
var tableName2 = "team-c-data"

exports.handler = (event, context, callback) => {
    var response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin" : "*"
        }
    };

    var body = JSON.parse(event.body);
    let rdata = {};

    if(!body){
      response.statusCode = 400;
      response.body = JSON.stringify({"message" : "入力されていません．"});
      callback(null, response);
      return;
    }

    var email = body.email;
    var password = body.password;

    if(!email || !password) {
      response.statusCode = 400;
      response.body = JSON.stringify({"message" : "メールアドレスまたはパスワードが入力されていません。"});
      callback(null, response);
      return;
    }

    //TODO: query()に渡すparamを宣言
    var param = {
        "TableName" : tableName,
        //キー、インデックスによる検索の定義
        "KeyConditionExpression" :
            "email = :mail",
        //プライマリーキー以外の属性でのフィルタ
        "FilterExpression":
            "#pass = :pass",
        //属性名のプレースホルダの定義
        "ExpressionAttributeNames" : {
          "#pass" : "password"
        },
        //検索値のプレースホルダの定義
        "ExpressionAttributeValues" : {
          ":mail": email,
          ":pass": password
        }
    };

    var param2 = {
        "TableName" : tableName2,
        //キー、インデックスによる検索の定義
        "KeyConditionExpression" :
            "email = :mail",
        //プライマリーキー以外の属性でのフィルタ

        //属性名のプレースホルダの定義

        //検索値のプレースホルダの定義
        "ExpressionAttributeValues" : {
          ":mail": email
        }
    };

    //dynamo.query()を用いてuserIdとpasswordが一致するデータの検索
    dynamo.query(param, function(err, data){
        //userの取得に失敗
        if(err){
            response.statusCode = 500;
            response.body = JSON.stringify({"message" : "予期せぬエラーが発生しました(1)。"});
            callback(null, response);
            return;
        }
        //TODO: 該当するデータが見つからない場合の処理を記述(ヒント：data.Itemsの中身が空)
        if (!data.Items.length) {
          response.statusCode = 401;
          response.body = JSON.stringify({
            "message" : "メールアドレスまたはパスワードが不正です。"
          });
          callback(null, response);
          return;
        }
        //TODO: 認証が成功した場合のレスポンスボディとコールバックを記述

        rdata.email = email;
        //callback(null, response);
    });

    dynamo.query(param2, function(err, data){
        //userの取得に失敗
        if(err){
            response.statusCode = 500;
            response.body = JSON.stringify({"message" : "予期せぬエラーが発生しました(2)。"});
            callback(null, response);
            return;
        }
        //TODO: 該当するデータが見つからない場合の処理を記述(ヒント：data.Itemsの中身が空)
        if (!data.Items.length) {
          response.statusCode = 401;
          rdata.message = "新規ユーザのためデータがありません。";
          response.body = JSON.stringify(rdata);
          callback(null, response);
          return;
        }
        //TODO: 認証が成功した場合のレスポンスボディとコールバックを記述
        rdata.token = "mti2017";
        rdata.working_min = data.Items[0]["working_min"];
        rdata.working_sec = data.Items[0]["working_sec"];
        response.body = JSON.stringify(rdata);
        console.log(rdata);
        callback(null, response);
    });

};
