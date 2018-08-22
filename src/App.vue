<template>
  <div id='app'>
      <div class="container-grid">
      <img class="settings_btn" @click='isSettingsShow = true' src="./assets/baseline-menu-24px.svg" alt="menu icon">
      <Pomidore v-for="n in 3" v-bind:key='n' v-bind:timer='whatOrder(n-2)' />
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
      long: this.shortBreak,
      short: this.longBreak
    };
  },
  mounted: function() {
    // Ask browser for permission to show notifications
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
          //Reset current timer
          curTimer.time = curTimer.range;
          curTimer.isActive = false;
          //Move to next timer
          if (vm.currentTimerIndex < vm.pattern.length - 1) {
            vm.currentTimerIndex++;
          } else {
            vm.currentTimerIndex = 0;
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
  --grid-columns: auto-fit 1fr 1fr;
  --grid-rows: 0.2fr 0.5fr;
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
  grid-template-columns: var(--grid-columns);
  grid-template-rows: var(--grid-rows);
  // grid-gap: 10px;
  padding: 10% 3% 6%;
  background-image: url("./assets/digital_clock.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  margin: 0 1%;
}

.form {
  // grid-column: var(--form-column);
  grid-column: 2;
  .btn {
    border-radius: 5px;
    margin: 0 1.5vw 0 1.5vw;
    border: 0;
    width: 3vw;
  }
  .btn.start_btn {
    background-color: #64c264;
  }
  .btn.stop_btn {
    background-color: #e35c5c;
  }
  .btn.clear_btn {
    background-color: #cece5e;
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
