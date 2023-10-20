<template>
  <div class="map" ref="container"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Ion, Viewer } from "cesium";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { SymbolCustomPrimitive, initResource } from "@/utils/cesium-primitive";
import { encodeFloatToDouble } from "@/utils/common";
export default defineComponent({
  setup() {
    const container = ref<HTMLElement>();
    Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNjRiYjA0OS0wYTNjLTQwODItYjhmOS1kNTA3NTNlMzhiZWIiLCJpZCI6MTcxNjM3LCJpYXQiOjE2OTcxODE0NDN9.NXFWJtgHshH3lJbrl9QmfjGM3-KRRoQpy5827zZJJV0";

    const initMap = async () => {
      const result = await initResource(
        "campfire",
        64,
        "/symbol/json/crossroad_NJ.geojson",
        "/symbol/json/tbvs.json",
        "/symbol/shader/symbol3D.vert.glsl",
        "/symbol/shader/symbol3D.frag.glsl",
        "/symbol/texture/strip.png",
        "/symbol/texture/palette.png"
      );

      const view = new Viewer(container.value!, {
        msaaSamples: 2,
        requestRenderMode: true,
        maximumRenderTimeChange: Infinity,
        // terrainProvider: Cesium.createWorldTerrain(),
      });
      view.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(118.81259, 32.048116, 400000),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-90.0),
        },
      });

      const center = Cesium.Cartesian3.fromDegrees(118.81259, 32.048116, 0);

      const cartesianX = encodeFloatToDouble(center.x);
      const cartesianY = encodeFloatToDouble(center.y);
      const cartesianZ = encodeFloatToDouble(center.z);

      view.scene.primitives.add(
        new SymbolCustomPrimitive({
          attributeLocations: {
            sampleInfo: 1,
            geoPosition_height: 2,
            geoPosition_low: 3,
            rotation: 4,
          },
          vertexScript: result[4],
          fragmentScript: result[5],
          positionHeight: result[1],
          positionLow: result[2],
          simpleArray: result[0],
          rotationArray: result[3],
          symbolTextureImage: result[6],
          paletteTextureImage: result[7],
          u_bufferSize: [view.canvas.width, view.canvas.height],
          u_mercatorCenterHigh: [cartesianX[0], cartesianY[0], cartesianZ[0]],
          u_mercatorCenterLow: [cartesianX[1], cartesianY[1], cartesianZ[1]],
        })
      );
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
