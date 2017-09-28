var vm = new Vue({
  el: "#app", // Vue.jsを使うタグのIDを指定
  data: {
    // Vue.jsで使う変数はここに記述する
    user: {
      userId: null,
      password: null,
      nickname: null,
      age: null
    }
  },
  methods: {
    // Vue.jsで使う関数はここで記述する
    submit: function() {
        // APIにPOSTリクエストを送る
      fetch(url + "/user", {
          method: "PUT",
          headers:new Headers({
            "Authorization":localStorage.getItem('token')
          }),
          body: JSON.stringify({
            "userId": vm.user.userId,
            "password": vm.user.password,
            "nickname": vm.user.nickname,
            "age": Number(vm.user.age)
          })
        })
        .then(function(response) {
          if (response.status == 200) {
            location.href = "./index.html";
          }
          // 200番以外のレスポンスはエラーを投げる
          return response.json().then(function(json) {
            throw new Error(json.message);
          });
        })
        .then(function(json) {
          // レスポンスが200番で返ってきたときの処理はここに記述する
        })
        .catch(function(err) {
          // レスポンスがエラーで返ってきたときの処理はここに記述する
        })
      },

    deleteUser: function() {
      fetch(url + "/user", {
          method: "DELETE",
          headers:new Headers({
            "Authorization":localStorage.getItem('token')
          }),
          body: JSON.stringify({
            "userId": vm.user.userId,
            "password": vm.user.password,
            "nickname": vm.user.nickname,
            "age": Number(vm.user.age)
          })
        })
        .then(function(response) {
          if (response.status == 200) {
            location.href = "./index.html";
          }
          // 200番以外のレスポンスはエラーを投げる
          return response.json().then(function(json) {
            throw new Error(json.message);
          });
        })
        .then(function(json) {
          // レスポンスが200番で返ってきたときの処理はここに記述する
        })
        .catch(function(err) {
          // レスポンスがエラーで返ってきたときの処理はここに記述する
        })
      }
    },

  created: function() {
    // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
    // APIにGETリクエストを送る
    fetch(url + "/user?userId=" + localStorage.getItem('userId'), {
          method: "GET",
          headers:new Headers({
            "Authorization":localStorage.getItem('token')
          }),
        })
      .then(function(response) {
        if (response.status == 200) {
          //vm.user.userId = localStorage.getItem('userId');
          return response.json();
        }
        // 200番以外のレスポンスはエラーを投げる
        return response.json().then(function(json) {
          throw new Error(json.message);
        });
      })
      .then(function(json) {
        // レスポンスが200番で返ってきたときの処理はここに記述する
        //console.log(json.userId);
        vm.user.userId = json.Item.userId;
      })
      .catch(function(err) {
        // レスポンスがエラーで返ってきたときの処理はここに記述する
        console.log("キャッチされました");
      });
  },
  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
  }
});
