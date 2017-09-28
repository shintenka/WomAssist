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

    if(event.headers.Authorization !== "mti2017"){
      response.statusCode = 401;
      response.body = JSON.stringify({
        "message" : "認証エラーです．"
      });
      callback(null, response);
      return;
    }

    if(!body){
      response.statusCode = 400;
      response.body = JSON.stringify({"message" : "入力されていません．"});
      callback(null, response);
      return;
    }

    var userId = body.userId;
    var start = body.start;
    var end = body.end;
    var category = body.category;

    //TODO: query()に渡すparamを宣言
    if (!userId) {
      response.body = JSON.stringify({
        "message" : "ユーザIDを入力して下さい．"
      });
      callback(null, response);
      return;
    } else if (!category && !end && !start) {
      var param = {
          "TableName" : tableName,
          //キー、インデックスによる検索の定義
          "KeyConditionExpression" :
              "userId = :uid",
          //プライマリーキー以外の属性でのフィルタ
          //属性名のプレースホルダの定義
          //検索値のプレースホルダの定義
          "ExpressionAttributeValues" : {
            ":uid": userId
          }
      };
    }
    else if (!category && !end && start) {
      var param = {
          "TableName" : tableName,
          //キー、インデックスによる検索の定義
          "KeyConditionExpression" :
              "userId = :uid AND #timestamp > :start",
          //プライマリーキー以外の属性でのフィルタ
          //属性名のプレースホルダの定義
          "ExpressionAttributeNames" : {
            "#timestamp":"timestamp"
          },
          //検索値のプレースホルダの定義
          "ExpressionAttributeValues" : {
            ":uid": userId,
            ":start": start,
          }
      };
    } else if (!start && !end && category){
      var param = {
          "TableName" : tableName,
          //キー、インデックスによる検索の定義
          "KeyConditionExpression" :
              "userId = :uid",
          //プライマリーキー以外の属性でのフィルタ
          "FilterExpression" :
              "#category = :category",
          //属性名のプレースホルダの定義
          "ExpressionAttributeNames" : {
            "#category" : "category"
          },
          //検索値のプレースホルダの定義
          "ExpressionAttributeValues" : {
            ":uid": userId,
            ":category":category
          }
      };
    } else if (!start && !category && end) {
      var param = {
          "TableName" : tableName,
          //キー、インデックスによる検索の定義
          "KeyConditionExpression" :
              "userId = :uid AND #timestamp < :end",
          //プライマリーキー以外の属性でのフィルタ
          //属性名のプレースホルダの定義
          "ExpressionAttributeNames" : {
            "#timestamp":"timestamp"
          },
          //検索値のプレースホルダの定義
          "ExpressionAttributeValues" : {
            ":uid": userId,
            ":end":end
          }
      };
    } else if (!category && end && start) {
      var param = {
          "TableName" : tableName,
          //キー、インデックスによる検索の定義
          "KeyConditionExpression" :
              "userId = :uid AND #timestamp BETWEEN :start AND :end",
          //プライマリーキー以外の属性でのフィルタ
          //属性名のプレースホルダの定義
          "ExpressionAttributeNames" : {
            "#timestamp":"timestamp"
          },
          //検索値のプレースホルダの定義
          "ExpressionAttributeValues" : {
            ":uid": userId,
            ":start": start,
            ":end":end
          }
      };
    } else if (category && !end && start) {
      var param = {
          "TableName" : tableName,
          //キー、インデックスによる検索の定義
          "KeyConditionExpression" :
              "userId = :uid AND #timestamp > :start",
          //プライマリーキー以外の属性でのフィルタ
          "FilterExpression" :
              "#category = :category",
          //属性名のプレースホルダの定義
          "ExpressionAttributeNames" : {
            "#timestamp":"timestamp",
            "#category" : "category"
          },
          //検索値のプレースホルダの定義
          "ExpressionAttributeValues" : {
            ":uid": userId,
            ":start": start,
            ":category":category
          }
      };
    } else if (category && end && !start) {
      var param = {
          "TableName" : tableName,
          //キー、インデックスによる検索の定義
          "KeyConditionExpression" :
              "userId = :uid AND #timestamp < :end",
          //プライマリーキー以外の属性でのフィルタ
          "FilterExpression" :
              "#category = :category",
          //属性名のプレースホルダの定義
          "ExpressionAttributeNames" : {
            "#timestamp":"timestamp",
            "#category" : "category"
          },
          //検索値のプレースホルダの定義
          "ExpressionAttributeValues" : {
            ":uid": userId,
            ":end":end,
            ":category":category
          }
      };
    } else {
      var param = {
          "TableName" : tableName,
          //キー、インデックスによる検索の定義
          "KeyConditionExpression" :
              "userId = :uid AND #timestamp BETWEEN :start AND :end",
          //プライマリーキー以外の属性でのフィルタ
          "FilterExpression" :
              "#category = :category",
          //属性名のプレースホルダの定義
          "ExpressionAttributeNames" : {
            "#timestamp":"timestamp",
            "#category" : "category"
          },
          //検索値のプレースホルダの定義
          "ExpressionAttributeValues" : {
            ":uid": userId,
            ":start": start,
            ":end":end,
            ":category":category
          }
      };
    }

    //dynamo.query()を用いてuserIdとpasswordが一致するデータの検索
    dynamo.query(param, function(err, data){
        //userの取得に失敗
        if(err){
            response.statusCode = 500;
            console.log(err);
            response.body = JSON.stringify({"message" : "予期せぬエラーが発生しました"});
            callback(null, response);
            return;
        }
        //TODO: 該当するデータが見つからない場合の処理を記述(ヒント：data.Itemsの中身が空)
        if (!data.Items.length) {
          response.statusCode = 401;
          response.body = JSON.stringify({
            "message" : "エラーです"
          });
          callback(null, response);
          return;
        }
        //TODO: 認証が成功した場合のレスポンスボディとコールバックを記述
        response.body = JSON.stringify(data.Items);
        callback(null, response);
    });
};
