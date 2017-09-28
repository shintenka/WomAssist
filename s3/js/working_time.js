
var vm = new Vue({
  el: "#app", // Vue.jsを使うタグのIDを指定
  data: {
    // Vue.jsで使う変数はここに記述する
    post: {
      email: null,
      temperature: null
    }
  },
  methods: {
    // Vue.jsで使う関数はここで記述する

    airconup: function() {
      fetch(url + "/air", {
          method: 'POST',
          body: JSON.stringify({
            "email" : localStorage.getItem("email"),
            "temperature": 1
          })
        })
        .then(function(response) {
          if (response.ok) {
            console.log("通りました。");
            return response.json();
          }
          return response.json().then(function(json) {
            throw new Error(json.message);
            console.log("ダメです。");
          });
        })
        .then(function(json) {
          localStorage.setItem("temp_state", json.message);
          if (json.message === "keep") {
            alert("エアコンの温度変化なしです！");
          } else if (json.message == "up"){
            alert("エアコンの温度が１度上がりました！");
            aircon_temp += 1;
            tempDiv.innerHTML = aircon_temp;
          } else if (json.message == "down"){
            alert("エアコンの温度が１度下がりました！");
            aircon_temp -= 1;
            tempDiv.innerHTML = aircon_temp;
          }
        })
        .catch(function(err) {
          window.console.error(err.message);
        });
    },
    aircondown: function() {
      fetch(url + "/air", {
          method: 'POST',
          body: JSON.stringify({
            "email" : localStorage.getItem("email"),
            "temperature": -1
          })
        })
        .then(function(response) {
          if (response.ok) {
            console.log("通りました。");
            return response.json();
          }
          return response.json().then(function(json) {
            throw new Error(json.message);
            console.log("ダメです。");
          });
        })
        .then(function(json) {
          localStorage.setItem("temp_state", json.message);
          if (json.message === "keep") {
            alert("エアコンの温度変化なしです！");
          } else if (json.message == "up"){
            alert("エアコンの温度が１度上がりました！");
            aircon_temp += 1;
            tempDiv.innerHTML = aircon_temp;
          } else if (json.message == "down"){
            alert("エアコンの温度が１度下がりました！");
            aircon_temp -= 1;
            tempDiv.innerHTML = aircon_temp;
          }
        })
        .catch(function(err) {
          window.console.error(err.message);
        });
    }
  },
  created: function() {
    // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
    
  },
  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
  }
});
