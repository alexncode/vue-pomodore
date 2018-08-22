<template>
  <div class="pomidor">
    <span v-bind:class="{ active: timer.isActive }">{{ timer.time | seconds_to_time }}</span>
  </div>
</template>

<script>
export default {
  name: "Pomidore",
  props: {
    timer: {}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.pomidor {
  color: rgb(236, 60, 47);
  text-shadow: 0 0 8px rgba(236, 60, 47, 0.9);
  cursor: pointer;
  span {
    font-family: "Digital-7 Mono", "Segoe UI", Tahoma, Geneva, Verdana,
      sans-serif;
    font-size: 10vw;
  }
}

.active {
  color: rgba(36, 173, 36, 0.9);
  text-shadow: 0 0 8px rgba(36, 173, 36, 0.9);
}
</style>
