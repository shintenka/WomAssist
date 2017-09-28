exports.handler = (event, context, callback) => {
  var response = {
    statusCode : 200,
        headers: {
            "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify({"message" : ""})
  };

  //TODO: 変数qnameにクエリストリングのnameに該当する値を代入してください。
  var qname = event.queryStringParameters.name;
  //TODO: responseオブジェクトのbodyプロパティに変数qnameを代入してください。
  response.body = JSON.stringify({"message" : qname});
  //コールバック関数でレスポンスを返す
  callback(null, response);
};
