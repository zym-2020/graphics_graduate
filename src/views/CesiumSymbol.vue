<template>
  <div class="map" ref="container"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Ion, Viewer } from "cesium";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { CesiumSymbol } from "@/utils/cesium-symbol";
export default defineComponent({
  setup() {
    const container = ref<HTMLElement>();
    Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNjRiYjA0OS0wYTNjLTQwODItYjhmOS1kNTA3NTNlMzhiZWIiLCJpZCI6MTcxNjM3LCJpYXQiOjE2OTcxODE0NDN9.NXFWJtgHshH3lJbrl9QmfjGM3-KRRoQpy5827zZJJV0";

    const initMap = async () => {
      const cesiumSymbol = new CesiumSymbol(
        "/symbol/shader/symbol3D.vert.glsl",
        "/symbol/shader/symbol3D.frag.glsl",
        "/symbol/texture/strip.png",
        "/symbol/texture/palette.png",
        "/symbol/json/tbvs.json",
        "/symbol/json/crossroad_NJ.geojson"
      );
      await cesiumSymbol.prepareData("campfire", 64);

      const view = new Viewer(container.value!, {
        msaaSamples: 2,
        requestRenderMode: true,
        maximumRenderTimeChange: Infinity,
        // terrainProvider: Cesium.createWorldTerrain(),
      });
      // view.scene.globe.show = false;
      view.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(118.81259, 32.048116, 400000),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-90.0),
        },
      });

      function _render_three_frame(scene: any, frustum: any, pass: any) {
        if (pass === "GLOBE") {
          const gl: WebGL2RenderingContext = scene.context._gl;
          cesiumSymbol.prepareRenderResource(gl);
          cesiumSymbol.render(gl, 50, 118.81259, 32.048116, 64, Cesium.Matrix4.toArray(scene.context.uniformState.viewProjection));
        }
      }
      (view.scene as any).render_external_frame_functions = [_render_three_frame]
      // if (!(view as any)._cesiumWidget.scene.render_external_frame_functions) (view.scene as any).render_external_frame_functions = [];
      // (view as any)._cesiumWidget.scene.render_external_frame_functions.push(_render_three_frame);
    };

    onMounted(() => {
      initMap();
    });

    return { container };
  },
});
</script>

<style lang="scss" scoped>
.map {
  height: 100%;
}
</style>
