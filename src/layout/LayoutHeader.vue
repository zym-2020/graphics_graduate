<template>
  <div class="layout-header">
    <el-row>
      <el-col :span="7">
        <div class="title">
          
        </div>
      </el-col>
      <el-col :span="3"><div class="item" @click="nav('/')">首页</div></el-col>
      <el-col :span="3"><div class="item" @click="nav('/mapboxSymbolInstance')">点符号渲染</div></el-col>
      <el-col :span="3"><div class="item" @click="nav('/mapboxFlowInstance')">流场渲染</div></el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "@/router";
export default defineComponent({
  setup() {
    const nav = (path: string) => {
      router.push({ path: path });
    };

    return { nav };
  },
});
</script>

<style lang="scss" scoped>
.layout-header {
  height: 100%;
  background: black;
  color: white;
  .el-row {
    height: 100%;
    .title {
      height: 100%;

    }
    .item {
      height: 100%;
      text-align: center;
      line-height: 5rem;
      font-size: 1.5rem;
      cursor: pointer;
    }
  }
}
</style>
