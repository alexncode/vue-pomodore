<template>
    <div class='settings-form' v-on-clickaway='closeSettings'>
      <span>Settings:</span>
      <div class="inputs">
        <label>Pomodoro </label>
        <input type='number' v-model='pomidor'>
        <label>Long rest</label>
        <input type='number' v-model='long'> 
        <label>Short rest</label>
        <input type='number' v-model='short'>
      </div>
      <img class='close-button' src="../assets/close.svg" alt="close" v-on:click='$emit("close-sett")'>
    </div>
</template>

<script>
import { mixin as clickaway } from "vue-clickaway";

export default {
  name: "Settings",
  mixins: [clickaway],
  props: {
    allTheSettings: { pomidor: Object, long: Object, short: Object }
  },
  data: function() {
    return {
      pomidor: this.allTheSettings.pomidor.range / 60,
      long: this.allTheSettings.long.range / 60,
      short: this.allTheSettings.short.range / 60
    };
  },
  mounted: function() {
    let vm = this;
    //Do it needed be that way for animation to work?
    setTimeout(function() {
      vm.$el.classList.add("show-anim");
    }, 4);
  },
  watch: {
    pomidor: function(val) {
      //Apply the settings if timer is not active
      if (
        this.allTheSettings.pomidor.time === this.allTheSettings.pomidor.range
      ) {
        this.allTheSettings.pomidor.time = val * 60;
        this.allTheSettings.pomidor.range = val * 60;
      } else {
        this.allTheSettings.pomidor.range = val * 60;
      }
    },
    long: function(val) {
      if (this.allTheSettings.long.time === this.allTheSettings.long.range) {
        this.allTheSettings.long.time = val * 60;
        this.allTheSettings.long.range = val * 60;
      } else {
        this.allTheSettings.long.range = val * 60;
      }
    },
    short: function(val) {
      if (this.allTheSettings.short.time === this.allTheSettings.short.range) {
        this.allTheSettings.short.time = val * 60;
        this.allTheSettings.short.range = val * 60;
      } else {
        this.allTheSettings.short.range = val * 60;
      }
    }
  },
  methods: {
    closeSettings: function() {
      this.$emit("close-sett");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.settings-form {
  position: absolute;
  top: 0;
  right: -200px;
  width: 200px;
  height: 100%;
  background-color: slategray;
  padding: 1rem;
  transition: right 300ms ease-out;
  border-left: 1px solid black;
  z-index: 2;
  .inputs {
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-row-gap: 5px;
    padding-top: 1rem;
    input {
      height: 1rem;
      width: 8ch;
    }
  }
  .close-button {
    position: absolute;
    top: 0;
    right: 0;
    width: 22px;
    height: 22px;
    margin: 5px;
  }
  .close-button:hover {
    border-radius: 5px;
    opacity: 0.8;
    background-color: red;
  }
}
.settings-form.show-anim {
  right: 0;
}
</style>
