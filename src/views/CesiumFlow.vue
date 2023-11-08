<template>
  <div class="map" ref="container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { Ion, Viewer } from "cesium";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { FlowEnum } from "@/type";
import { FlowCesium } from "@/utils/flow-utils.js";
export default defineComponent({
  setup() {
    const container = ref<HTMLElement>();
    Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNjRiYjA0OS0wYTNjLTQwODItYjhmOS1kNTA3NTNlMzhiZWIiLCJpZCI6MTcxNjM3LCJpYXQiOjE2OTcxODE0NDN9.NXFWJtgHshH3lJbrl9QmfjGM3-KRRoQpy5827zZJJV0";
    const flowCesium = new FlowCesium({
      seeding: [
        "/flow/texture/mask_100.png",
        "/flow/texture/mask_101.png",
        "/flow/texture/mask_102.png",
        "/flow/texture/mask_103.png",
        "/flow/texture/mask_104.png",
        "/flow/texture/mask_105.png",
        "/flow/texture/mask_106.png",
        "/flow/texture/mask_107.png",
        "/flow/texture/mask_108.png",
        "/flow/texture/mask_109.png",
        "/flow/texture/mask_110.png",
        "/flow/texture/mask_111.png",
        "/flow/texture/mask_112.png",
        "/flow/texture/mask_113.png",
        "/flow/texture/mask_114.png",
        "/flow/texture/mask_115.png",
        "/flow/texture/mask_116.png",
        "/flow/texture/mask_117.png",
        "/flow/texture/mask_118.png",
        "/flow/texture/mask_119.png",
        "/flow/texture/mask_120.png",
        "/flow/texture/mask_121.png",
        "/flow/texture/mask_122.png",
        "/flow/texture/mask_123.png",
        "/flow/texture/mask_124.png",
        "/flow/texture/mask_125.png",
        "/flow/texture/mask_126.png",
      ],
      constraints: {
        maxDropRate: 0.1,
        maxDropRateBump: 0.2,
        maxSegmentNum: 16,
        maxTrajectoryNum: 262144,
        maxTextureSize: 4096,
      },
      extent: [0.8334519409367115, 0.4087464036632672, 0.8388303296774701, 0.40586521884815613],
      flowBoundary: {
        uMax: 2.3461,
        uMin: -2.1176,
        vMax: 2.0175,
        vMin: -1.8959,
      },
      flowFields: [
        "/flow/texture/uv_100.png",
        "/flow/texture/uv_101.png",
        "/flow/texture/uv_102.png",
        "/flow/texture/uv_103.png",
        "/flow/texture/uv_104.png",
        "/flow/texture/uv_105.png",
        "/flow/texture/uv_106.png",
        "/flow/texture/uv_107.png",
        "/flow/texture/uv_108.png",
        "/flow/texture/uv_109.png",
        "/flow/texture/uv_110.png",
        "/flow/texture/uv_111.png",
        "/flow/texture/uv_112.png",
        "/flow/texture/uv_113.png",
        "/flow/texture/uv_114.png",
        "/flow/texture/uv_115.png",
        "/flow/texture/uv_116.png",
        "/flow/texture/uv_117.png",
        "/flow/texture/uv_118.png",
        "/flow/texture/uv_119.png",
        "/flow/texture/uv_120.png",
        "/flow/texture/uv_121.png",
        "/flow/texture/uv_122.png",
        "/flow/texture/uv_123.png",
        "/flow/texture/uv_124.png",
        "/flow/texture/uv_125.png",
        "/flow/texture/uv_126.png",
      ],
      projection: {
        projectionMapbox: "/flow/texture/projection_mapbox.png",
        projectionCesium: "/flow/texture/projection_cesium.png",
        projectionOl: "/flow/texture/projection_ol.png",
      },
      textureSize: {
        seeding: [1024, 558],
        flowField: [1024, 558],
        projection: [1024, 2048],
      },
    });
    const initMap = async () => {

      await flowCesium.prepareAsyncImage()
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
          flowCesium.render(gl, Cesium.Matrix4.toArray(scene.context.uniformState.viewProjection));
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
