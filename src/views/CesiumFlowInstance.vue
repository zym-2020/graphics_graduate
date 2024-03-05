<template>
  <div class="container" ref="container"></div>
  <control-panel :eventObj="flowCesium.eventObj" :option="flowCesium.option"></control-panel>
  <process-component :flowInstance="flowCesium"></process-component>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import ProcessComponent from "@/components/ProcessComponent.vue";
import ControlPanel from "@/components/ControlPanel.vue";
import { FlowCesium } from "@/utils/flow-utils.js";
import { Ion, Viewer } from "cesium";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
export default defineComponent({
  components: {
    ControlPanel,
    ProcessComponent,
  },
  setup() {
    const container = ref<HTMLElement>();
    Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNjRiYjA0OS0wYTNjLTQwODItYjhmOS1kNTA3NTNlMzhiZWIiLCJpZCI6MTcxNjM3LCJpYXQiOjE2OTcxODE0NDN9.NXFWJtgHshH3lJbrl9QmfjGM3-KRRoQpy5827zZJJV0";
    const flowCesium = ref<FlowCesium>(new FlowCesium({
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
        minSpeedFactor: 0.5,
        minTrajectoryNum: 4096,
        minSegmentNum: 3,
        minFillWidth: 1,
        minAAWidth: 1,
        minFixedDropRate: 0.001,
        minExtraDropRate: 0.001,
        maxSpeedFactor: 10,
        maxTrajectoryNum: 262144,
        maxSegmentNum: 16,
        maxFillWidth: 25,
        maxAAWidth: 5,
        maxFixedDropRate: 0.1,
        maxExtraDropRate: 0.2,

        maxTextureSize: 4096,
      },
      parameter: {
        speedFactor: 2,
        tracksNumber: 16384,
        segmentNumber: 16,
        fillWidth: 1,
        aaWidth: 2,
        color: 0,
        primitive: 0,
        fixedDropRate: 0.003,
        extraDropRate: 0.002,
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
      projection: "/flow/texture/projection_cesium.png",
      textureSize: {
        seeding: [1024, 558],
        flowField: [1024, 558],
        projection: [1024, 2048],
      },
    }))
    const initMap = async () => {
      await flowCesium.value.prepareAsyncImage();
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
          flowCesium.value.render(gl, Cesium.Matrix4.toArray(scene.context.uniformState.viewProjection));
        }
      }
      (view.scene as any).render_external_frame_functions = [_render_three_frame];
    };

    onMounted(initMap);

    return { container, flowCesium };
  },
});
</script>

<style scoped lang="scss">
.container {
  height: 100%;
}
.control-panel {
  top: calc(5.1rem + 24px);
  left: 0.5rem;
}
.process-component {
  top: 5.1rem;
  left: 0.5rem;
}
</style>
