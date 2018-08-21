import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";

Vue.config.productionTip = false;

Vue.filter("seconds_to_time", function(value) {
  var minutes = parseInt(value / 60);
  var seconds = value % 60;
  minutes = minutes.toString();
  seconds = seconds.toString();
  if (minutes.length === 1) {
    minutes = "0" + minutes;
  }
  if (seconds.length === 1) {
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds;
});

new Vue({
  render: h => h(App)
}).$mount("#app");
