<template>
  <div class="map" ref="container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { Ion, Viewer } from "cesium";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { CesiumFlow } from "@/utils/cesium-flow";
import { FlowEnum } from "@/type";
export default defineComponent({
  setup() {
    const container = ref<HTMLElement>();
    Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNjRiYjA0OS0wYTNjLTQwODItYjhmOS1kNTA3NTNlMzhiZWIiLCJpZCI6MTcxNjM3LCJpYXQiOjE2OTcxODE0NDN9.NXFWJtgHshH3lJbrl9QmfjGM3-KRRoQpy5827zZJJV0";
    const cesiumFlow = new CesiumFlow();
    const initMap = async () => {
      const shaderScriptAddressArr: { key: string; address: string }[] = [
        { key: FlowEnum.UPDATE_VERTEX, address: "/flow/shader/update.vert" },
        { key: FlowEnum.UPDATE_FRAGMENT, address: "/flow/shader/update.frag" },
        {
          key: FlowEnum.TRAJECTORY_VERTEX,
          address: "/flow/shader/trajectory.noCulling.vert",
        },
        {
          key: FlowEnum.TRAJECTORY_FRAGMENT,
          address: "/flow/shader/trajectory.noCulling.frag",
        },
        {
          key: FlowEnum.POINT_VERTEX,
          address: "/flow/shader/point.noCulling.vert",
        },
        {
          key: FlowEnum.POINT_FRAGMENT,
          address: "/flow/shader/point.noCulling.frag",
        },
        { key: FlowEnum.POOL_VERTEX, address: "/flow/shader/showPool.vert" },
        { key: FlowEnum.POOL_FRAGMENT, address: "/flow/shader/showPool.frag" },
      ];
      await cesiumFlow.prepareAsyncData("/flow/json/flow_field_description.json", shaderScriptAddressArr);
      const view = new Viewer(container.value!, {
        msaaSamples: 2,
        // requestRenderMode: true,
        // maximumRenderTimeChange: Infinity,
      });
      view.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(121.024075, 31.765318, 400000),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-90.0),
        },
      });
      function _render_three_frame(scene: any, frustum: any, pass: any) {
        if (pass === "GLOBE") {
          const gl: WebGL2RenderingContext = scene.context._gl;
          cesiumFlow.render(gl, Cesium.Matrix4.toArray(scene.context.uniformState.viewProjection));
        }
      }
      (view.scene as any).render_external_frame_functions = [_render_three_frame];
    };
    onMounted(initMap);

    return { container };
  },
});
</script>

<style>
.map {
  height: 100%;
}
</style>
