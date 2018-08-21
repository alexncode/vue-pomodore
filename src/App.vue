<template>
  <div id='app'>
    <div class="container-grid">
      <button class="settings_btn" @click='isSettingsShow = true'>|||</button>
      <Pomidore v-for="n in 3" v-bind:key='n' v-bind:timer='whatOrder(n-2)' />
      <div class='form'>
        <button class='start_btn' @click='startTimer'>Start Timer</button>
        <button class='stop_btn' @click='stopTimer'>Stop Timer</button>
        <button class='clear_btn' @click='clearTimer'>Clear Timer</button>
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
  pomidore: 25,
  long: 30,
  short: 5
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

@media (max-width: 580px) {
  :root {
    --grid-columns: 1fr;
    --grid-rows: auto-fit 1fr 1fr 1fr 0.5fr;
    --form-column: 1;
    --settings-column: 1;
  }
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
  grid-gap: 10px;
}

.form {
  grid-column: var(--form-column);
  button {
    padding: 0.3rem 0.5rem 0.3rem 0.5rem;
    border-radius: 5px;
    margin-right: 1rem;
    border: 0;
  }
  button.start_btn {
    background-color: #64c264;
  }
  button.stop_btn {
    background-color: #e35c5c;
  }
  button.clear_btn {
    background-color: #cece5e;
  }
}

.settings_btn {
  justify-self: end;
  grid-column: var(--settings-column);
  margin-right: 5px;
  margin-top: 5px;
  padding: 3px 5px 4px 5px;
  border: 0;
  border-radius: 3px;
  background-color: $settings-btn-bg;
}
</style>
