var vm = new Vue({
  el: "#app", // Vue.jsを使うタグのIDを指定
  data: {
    users:[],
    query: {
      nickname: null,
      start: null,
      end: null
    }
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
  },
  created: function() {
    // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
    fetch(url + "/users", {
          method: "GET",
          headers:new Headers({
            "Authorization":localStorage.getItem('token')
          }),
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
        vm.users = json.users;
      })
      .catch(function(err) {
        // レスポンスがエラーで返ってきたときの処理はここに記述する
        console.log(err);
      });
  },
  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
    filteredUsers: function() {
      var result = this.users;
      if (this.query.nickname) {
        result = result.filter(function (target) {
            return target.nickname.match(vm.query.nickname);
          });
      }
      if (this.query.start) {
        result = result.filter(function(target) {
          return target.age >= vm.query.start;
        });
      }
      if (this.query.end) {
        result = result.filter(function(target){
          return target.age <= vm.query.end;
        });
      }
      return result;
    }
  }
});
