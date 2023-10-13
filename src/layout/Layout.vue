<template>
  <div class="layout">
    <div class="header">
      <layout-header />
    </div>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LayoutHeader from "@/layout/LayoutHeader.vue";
export default defineComponent({
  components: { LayoutHeader },
  setup() {},
});
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
  .header {
    height: 5rem;
  }
  .main {
    height: calc(100% - 5rem);
  }
}
</style>
