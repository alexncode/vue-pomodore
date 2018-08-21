<template>
    <div class='settings-form'>
      <span>Settings:</span>
      <div class="inputs">
        <label>Pomodoro timer </label>
        <input type='number' v-model='allTheSettings.pomidor.range'>
        <label>Long rest timer </label>
        <input type='number' v-model='allTheSettings.long.range'> 
        <label>Short rest timer </label>
        <input type='number' v-model='allTheSettings.short.range'>
      </div>
      <img class='close-button' src="../assets/close.svg" alt="close" v-on:click='$emit("close-sett")'>
    </div>
</template>

<script>
export default {
  name: "Settings",
  props: {
    allTheSettings: { pomidor: Object, long: Object, short: Object }
  },
  mounted: function() {
    let vm = this;
    setTimeout(function() {
      vm.$el.classList.add("show-anim");
    }, 50);
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
  height: 8em;
  background-color: slategray;
  padding: 1rem;
  transition: all 300ms ease-in-out;
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
