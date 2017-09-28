Vue.component("common-menu", {
  props: ["current"],
  template: `
        <div class="ui secondary menu">
          <a class="item" href="./index.html" v-bind:class="{active: current=='home'}">
          WomAssit
          </a>
          <a class="item" href="#CARADA" v-bind:class="{active: current=='users'}">
          OFFICE
          </a>
          <div class="right menu">
          <a class="item" href="./profile.html" v-bind:class="{active: current=='profile'}">
          Profile
          </a>
            <button class="item" v-on:click="logout">Logout</button>
          </div>
        </div>
      `,
      methods: {
        logout: function () {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          location.href = "./login.html";
        }
      }
});