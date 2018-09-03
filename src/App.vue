<template>
  <div id='app'>
    <div class="container-grid">
      <img class="settings_btn" @click='isSettingsShow = true' src="./assets/baseline-menu-24px.svg" alt="menu icon">
      <Pomidore v-for="n in 3" v-bind:key='n' v-bind:timer='whatOrder(n-2)' />
      <div class="statistic">Completed pomodoras: <span>{{ numberOfPomodoras }}</span></div>
      <div class='form'>
        <img class='btn start_btn' @click='startTimer' src="./assets/baseline-play_arrow-24px.svg" alt="play">
        <img class='btn stop_btn' @click='stopTimer' src="./assets/baseline-stop-24px.svg" alt="stop">
        <img class='btn clear_btn' @click='clearTimer' src="./assets/baseline-replay-24px.svg" alt="reset">
      </div>
    </div>
    <Settings v-if='isSettingsShow' v-on:close-sett='isSettingsShow = false' v-bind:allTheSettings='allSettings'></Settings>
  </div>
</template>

<script>
import Pomidore from "./components/Pomidore.vue";
import Settings from "./components/Settings.vue";
import nth from "lodash/nth";

// Timers to initialize
const timers = {
  pomidore: 25 * 60,
  long: 30 * 60,
  short: 5 * 60
};

export default {
  name: "app",
  components: {
    Pomidore,
    Settings
  },
  data() {
    return {
      pomTimer: {
        range: timers.pomidore,
        time: timers.pomidore,
        isActive: false,
        message: "You need to work for another 25 min."
      },
      longBreak: {
        range: timers.long,
        time: timers.long,
        isActive: false,
        message: "You worked hard you can rest for half a hour!"
      },
      shortBreak: {
        range: timers.short,
        time: timers.short,
        isActive: false,
        message: "You can take short break for 5 min."
      },
      timer: null,
      currentTimerIndex: 0,
      numberOfPomodoras: 0,
      isSettingsShow: false,
      isRunning: false
    };
  },
  created: function() {
    //Order of timers
    this.pattern = [
      this.pomTimer,
      this.shortBreak,
      this.pomTimer,
      this.shortBreak,
      this.pomTimer,
      this.shortBreak,
      this.pomTimer,
      this.longBreak
    ];
    this.pattern[this.currentTimerIndex].isActive = true;
    //Aviable settings sended to Settings component
    this.allSettings = {
      pomidor: this.pomTimer,
      long: this.longBreak,
      short: this.shortBreak
    };
  },
  mounted: function() {
    // Ask browser for permission to show notifications. Bad practice add button to toggle notifications!
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  },
  watch: {
    currentTimerIndex: function(val) {
      this.pattern[val].isActive = true;
    }
  },
  methods: {
    startTimer: function() {
      let vm = this;
      // Update timer
      function tick() {
        const curTimer = vm.pattern[vm.currentTimerIndex];
        if (curTimer.time > 0) {
          curTimer.time--;
        } else {
          vm.nextTimer();
          if (curTimer === vm.pomTimer) {
            vm.numberOfPomodoras++;
          }
          // Show notification
          vm.notify("Pomodoro", vm.pattern[vm.currentTimerIndex].message);
        }
      }
      this.timer = window.setInterval(tick, 1000);
    },
    stopTimer: function() {
      clearInterval(this.timer);
    },
    clearTimer: function() {
      clearInterval(this.timer);
      this.pattern[this.currentTimerIndex].time = this.pattern[
        this.currentTimerIndex
      ].range;
    },
    nextTimer: function() {
      const curTimer = this.pattern[this.currentTimerIndex];
      //Reset current timer
      curTimer.time = curTimer.range;
      curTimer.isActive = false;
      //Move to next timer
      if (this.currentTimerIndex < this.pattern.length - 1) {
        this.currentTimerIndex++;
      } else {
        this.currentTimerIndex = 0;
      }
    },
    notify: function(title, message) {
      new Notification(title, {
        body: message
      });
    },
    showSettings: function() {
      this.isSettingsShow = true;
    },
    //Show Previous, Current and Next timer
    whatOrder: function(order) {
      if (this.currentTimerIndex + order === this.pattern.length) {
        order = -this.pattern.length + 1;
      }
      return nth(this.pattern, this.currentTimerIndex + order);
    }
  }
};
</script>

<style lang='scss'>
$body-bg: #242222;
$settings-btn-bg: darkgray;

:root {
  --form-column: 1 / 4;
  --settings-column: 1 / 4;
}

body {
  margin: 0;
  background-color: $body-bg;
  width: 100vw;
  height: inherit;
  overflow: hidden;
}

.container-grid {
  text-align: center;
  display: grid;
  padding: 10% 3% 6%;
  background-image: url("./assets/digital_clock.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  margin: 0 1%;
}

@media screen and (min-width: 1000px) {
  .container-grid {
    transform: scale(0.7);
  }
}

.statistic {
  color: darkgray;
  font-size: 24px;
  span {
    font-weight: bold;
  }
}

.form {
  grid-column: 2;
  .btn {
    border-radius: 5px;
    margin: 0 1.5vw 0 1.5vw;
    border: 0;
    width: 3vw;
    background-color: darkgray;
  }
}

.settings_btn {
  justify-self: end;
  grid-column: var(--settings-column);
  margin-right: 1vw;
  margin-top: 10px;
  width: 3vw;
  border: 0;
  border-radius: 3px;
  background-color: $settings-btn-bg;
  img {
    padding-top: 4px;
  }
}
.settings_btn:hover {
  background-color: lighten($color: $settings-btn-bg, $amount: 10%);
}
</style>
