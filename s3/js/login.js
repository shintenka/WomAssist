var vm = new Vue({
  el: "#app", // Vue.jsを使うタグのIDを指定
  data: {
    // Vue.jsで使う変数はここに記述する
    mode: "login",
    submitText: "ログイン",
    toggleText: "新規登録",
    user: {
      email: null,
      password: null,
      name: null,
      sex: null,
      age: null
    }
  },
  methods: {
    // Vue.jsで使う関数はここで記述する
    toggleMode: function() {
      if (vm.mode == "login") {
        vm.mode = "signup";
        vm.submitText = "新規登録";
        vm.toggleText = "ログイン";
      } else if (vm.mode == "signup") {
        vm.mode = "login";
        vm.submitText = "ログイン";
        vm.toggleText = "新規登録";
      }
    },
    submit: function() {
      if (vm.mode == "login") {
        // APIにPOSTリクエストを送る
        fetch(url + "/login", {
            method: "POST",
            body: JSON.stringify({
              "email": vm.user.email,
              "password": vm.user.password
            })
          })
          .then(function(response) {
            if (response.status == 200) {
              return response.json();
            }
            // 200番以外のレスポンスはエラーを投げる
            return response.json().then(function(json) {
              throw new Error(json.message);
            });
          })
          .then(function(json) {
            // レスポンスが200番で返ってきたときの処理はここに記述する
            console.log(json);
            localStorage.setItem('token', json.token);
            localStorage.setItem('email', vm.user.email);
            localStorage.setItem('sum_min', json.working_min);
            localStorage.setItem('sum_sec', json.working_sec);
            location.href = "./index.html";
          })
          .catch(function(err) {
            // レスポンスがエラーで返ってきたときの処理はここに記述する
          });

      } else if (vm.mode == "signup") {
        // APIにPOSTリクエストを送る
        fetch(url + "/signup", {
            method: "PUT",
            body: JSON.stringify({
              "email": vm.user.email,
              "password": vm.user.password,
              "name": vm.user.name,
              "age": Number(vm.user.age),
              "sex": Number(vm.user.sex)
            })
          })
          .then(function(response) {
            if (response.status == 200) {
              return response.json();
            }
            // 200番以外のレスポンスはエラーを投げる
            return response.json().then(function(json) {
              throw new Error(json.message);
            });
          })
          .then(function(json) {
            // レスポンスが200番で返ってきたときの処理はここに記述する
            vm.toggleMode()
          })
          .catch(function(err) {
            // レスポンスがエラーで返ってきたときの処理はここに記述する
          });
      }
    }
  },
  created: function() {
    // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
  },
  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
  }
});
