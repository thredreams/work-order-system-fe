<template>
  <div class="box">
    <h1 class="head">404</h1>
    <h3 class="content">该页已经丢失或不存在。</h3>
    <a class="link" @click="back">
      返回来源页
      <span class="el-icon-right content"></span>
    </a>
    <background-ani></background-ani>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import BackgroundAni from "@/components/Etc/BackgroundAni.vue";

export default Vue.extend({
  components: {
    BackgroundAni
  },
  methods: {
    back() {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.replace({ name: "index" });
    }
  }
});
</script>

<style lang="scss" scoped>
.box {
  position: fixed;
  top: 20%;
  left: 30%;

  h1 {
    font-size: 5rem;
    margin-block-end: 0.4em;
  }
}

.head {
  color: #555;
  font-size: 4rem;
}

.content,
.link {
  color: #95a5a6;
}

.link {
  box-shadow: 0px 0.1rem #ddd;
  cursor: pointer;

  & > span {
    transition: transform 0.2s;
  }

  &:hover > span {
    transform: translateX(0.6rem);
  }
}
</style>
