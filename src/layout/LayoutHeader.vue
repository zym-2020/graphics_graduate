<template>
  <div class="layout-header">
    <el-row>
      <el-col :span="7">
        <div class="image">
          <img :src="imgSrc" alt="" />
        </div>
      </el-col>
      <el-col :span="3"><div class="item" @click="nav('/')">首页</div></el-col>
      <el-col :span="3"
        ><el-dropdown @command="commandHandle">
          <div class="item">
            点符号渲染
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="/mapboxSymbolInstance">Mapbox平台</el-dropdown-item>
              <el-dropdown-item command="/olSymbolInstance">Openlayers平台</el-dropdown-item>
              <el-dropdown-item command="/cesiumSymbolInstance">Cesium平台</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown></el-col
      >
      <el-col :span="3">
        <el-dropdown @command="commandHandle">
          <div class="item">
            流场渲染
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="/mapboxFlowInstance">Mapbox平台</el-dropdown-item>
              <el-dropdown-item command="/olFlowInstance">Openlayers平台</el-dropdown-item>
              <el-dropdown-item command="/cesiumFlowInstance">Cesium平台</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "@/router";
export default defineComponent({
  setup() {
    const imgSrc = `${process.env.VUE_APP_RESOURCE_PREFIX}/nnu.png`;
    const nav = (path: string) => {
      router.push({ path: path });
    };

    const commandHandle = (command: string) => {
      router.push({ path: command });
    };

    return { imgSrc, nav, commandHandle };
  },
});
</script>

<style lang="scss" scoped>
.layout-header {
  height: 100%;
  background: black;
  .image {
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
  .el-dropdown {
    width: 100%;
  }
  .el-tooltip__trigger {
    outline: none;
  }
  .el-row {
    height: 100%;
    .title {
      height: 100%;
    }
    .item {
      height: 100%;
      width: 100%;
      line-height: 5rem;
      font-size: 1.5rem;
      cursor: pointer;
      color: white;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
