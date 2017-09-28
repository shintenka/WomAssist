var vm = new Vue({
  el: "#app", // Vue.jsを使うタグのIDを指定
  data: {
    posts:[],
    post: {
      userId: null,
      timestamp: null,
      text: null,
      category: null
    }
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
  },
  created: function() {
    // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
    fetch(url + "/articleoperator", {
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
        vm.posts = json.posts;
      })
      .catch(function(err) {
        // レスポンスがエラーで返ってきたときの処理はここに記述する
        console.log(err);
      });
  },
  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
  }
});
