var AWS = require("aws-sdk");
var dynamo = new AWS.DynamoDB.DocumentClient();
var tableName_1 = "team-c-aircon-want";
var tableName_2 = "team-c-aircon-changed";

exports.handler = (event, context, callback) => {
    var response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify({"message" : ""})
    };

    var body = JSON.parse(event.body);
    var time = Date.now();

    var today = new Date();
    var year = Number(today.getFullYear());
    var month = Number(today.getMonth())+1;
    var date = Number(today.getDate());

    var timeNew = 0;

    if(!body.email || !body.temperature) {
      response.statusCode = 400;
      response.body = JSON.stringify({"message" : "入力されていない項目があります"});
      callback(null, response);
      return;
  }
    //TODO: DBに登録するための情報をparamオブジェクトとして宣言する（中身を記述）

    //エアコン設定変更ログテーブルから今日の変更履歴を取得

    var param_1 = {
        "TableName" : tableName_2,
        "ProjectionExpression": "#timestamp",
        //属性名のプレースホルダの定義
        "ExpressionAttributeNames" : {
          "#timestamp":"timestamp"
        }
    };

    dynamo.scan(param_1, function(err, data){
        if(err){
            response.statusCode = 500;
            console.log(err);
            response.body = JSON.stringify({"message" : "予期せぬエラーが発生しました(param_1)"});
            callback(null, response);
            return;
        }
        //TODO: 認証が成功した場合のレスポンスボディとコールバックを記述
        //取得したItemsから最新＝最大のタイムスタンプ取得
        timeNew = Math.max.apply(null, data.Items.map(function(o){return o.timestamp;}));
        checkEnquete(timeNew);
    });

    //各個人のエアコン温度変更希望を記録
    var param_2 = {
        "TableName" : tableName_1,
        "Item" : {
            "id":1,
            "timestamp" : time,
            "email" : body.email,
            "temperature" : body.temperature
        }
    };

    dynamo.put(param_2, function(err, data) {
        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                "message" : "予期せぬエラーが発生しました(param_2)"
            });
            callback(null, response);
            return;
        } else {
            //TODO: 登録に成功した場合の処理を記述
        }
    });

    //最新の変更時間から、一定数以上票が溜まっていたらエアコン温度変更
    function checkEnquete(timeNew){
      var countDown = 0;
      var countUp = 0;
      var tn = parseInt(timeNew);

      var param_3 = {
          "TableName" : tableName_1,
          "KeyConditionExpression" :
              "#id = :id AND #timestamp > :tn",
          //検索値のプレースホルダの定義
          "ExpressionAttributeNames" :{
            "#id" : "id",
            "#timestamp":"timestamp"
          },
          "ExpressionAttributeValues" :{
            ":tn" : tn,
            ":id" : Number(1)
          }
      };

      dynamo.query(param_3, function(err, data){
          if(err){
              response.statusCode = 500;
              console.log(err);
              response.body = JSON.stringify({"message" : "予期せぬエラーが発生しました(param_3)"});
              callback(null, response);
              return;
          }
          //TODO: 認証が成功した場合のレスポンスボディとコールバックを記述
          var upArray = data.Items.filter(function(item, index){
            if (item.temperature == 1) return true;
          });
          countUp = Object.keys(upArray).length;

          var downArray = data.Items.filter(function(item, index){
            if (item.temperature == -1) return true;
          });
          countDown = Object.keys(downArray).length;

          changeTemperature(countUp, countDown, tableName_2, time, date, month, year);
          return;
      });
    }

    function changeTemperature(up, down, tableName_2, time, date, month, year){
      var diff = up - down;
      var change = '';

      if(diff >= 5){
        change = 'up';
      }else if(diff <= -5){
        change = 'down';
      }

      console.log("diff" + diff);
      console.log("change" + change);
      if(change == 'up' || change == 'down'){
        var param_4 = {
            "TableName" : tableName_2,
            "Item" : {
                "timestamp" : time,
                "change" : change,
                "date" : date,
                "month" : month,
                "year" : year
            }
        };

        dynamo.put(param_4, function(err, data) {
          if (err) {
              response.statusCode = 500;
              response.body = JSON.stringify({
                  "message" : "予期せぬエラーが発生しました(aircon-log)"
              });
              callback(null, response);
              return;
          } else {
              //TODO: 登録に成功した場合の処理を記述
              response.body = JSON.stringify({"message":change});
              callback(null, response);
              return;
          }
        });
      }else{
        response.body = JSON.stringify({"message":"keep"});
        callback(null, response);
        return;
      }
    }
};
