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
        `${process.env.VUE_APP_RESOURCE_PREFIX}/symbol/shader/symbol3D.vert.glsl`,
        `${process.env.VUE_APP_RESOURCE_PREFIX}/symbol/shader/symbol3D.frag.glsl`,
        `${process.env.VUE_APP_RESOURCE_PREFIX}/symbol/texture/strip_z.png`,
        `${process.env.VUE_APP_RESOURCE_PREFIX}/symbol/texture/palette_z.png`,
        `${process.env.VUE_APP_RESOURCE_PREFIX}/symbol/json/tbvs_z.json`,
        `${process.env.VUE_APP_RESOURCE_PREFIX}/symbol/json/output.geojson`
      );
      await cesiumSymbol.prepareData(64);

      const view = new Viewer(container.value!, {
        msaaSamples: 2,
        requestRenderMode: true,
        maximumRenderTimeChange: Infinity,
        // terrainProvider: Cesium.createWorldTerrain(),
      });
      view.scene.postProcessStages.fxaa.enabled = true;
      // view.scene.globe.show = false;
      view.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(118.81259, 32.048116, 400000),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-90.0),
        },
      });


      const dataSource = new Cesium.GeoJsonDataSource();
      await dataSource.load(`${process.env.VUE_APP_RESOURCE_PREFIX}/symbol/json/crossroad_NJ.geojson`);
      view.dataSources.add(dataSource);
      dataSource.entities.values.forEach(function (entity) {
        entity.billboard = new Cesium.BillboardGraphics({
          image: `${process.env.VUE_APP_RESOURCE_PREFIX}/symbol/texture/交叉路口.png`, // 图标的路径
          width: 32, // 图标的宽度
          height: 32, // 图标的高度
        });
      });

      function _render_three_frame(scene: any, frustum: any, pass: any) {
        if (pass === "GLOBE") {
          const gl: WebGL2RenderingContext = scene.context._gl;
          cesiumSymbol.prepareRenderResource(gl);
          cesiumSymbol.render(gl, 60, 118.81259, 32.048116, 64, Cesium.Matrix4.toArray(scene.context.uniformState.viewProjection));
        }
      }
      (view.scene as any).render_external_frame_functions = [_render_three_frame];
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

<style scoped lang="scss">
.map {
  height: 100%;
}
</style>
