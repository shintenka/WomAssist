exports.handler = (event, context, callback) => {
  var response = {
    statusCode : 200,
        headers: {
            "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify({"message" : ""})
  };

  //TODO: 変数rbodyにリクエストボディのオブジェクトを代入してください。
  var rbody = JSON.parse(event.body);
  //TODO: responseオブジェクトのbodyプロパティに変数rbodyを代入
  response.body = JSON.stringify(rbody)
  //コールバック関数でレスポンスを返す
  callback(null, response);
};
