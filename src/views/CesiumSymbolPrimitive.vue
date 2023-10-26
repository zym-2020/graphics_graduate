<template>
  <div class="map" ref="container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { Ion, Viewer } from "cesium";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { SymbolCustomPrimitive, initResource } from "@/utils/cesium-primitive";
export default defineComponent({
  setup() {
    const container = ref<HTMLDivElement>();
    Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNjRiYjA0OS0wYTNjLTQwODItYjhmOS1kNTA3NTNlMzhiZWIiLCJpZCI6MTcxNjM3LCJpYXQiOjE2OTcxODE0NDN9.NXFWJtgHshH3lJbrl9QmfjGM3-KRRoQpy5827zZJJV0";

    const initMap = async () => {
      const data = await initResource(
        "campfire",
        64,
        "/symbol/json/crossroad_NJ.geojson",
        "/symbol/json/tbvs.json",
        "/symbol/shader/symbol3D-primitive.vert.glsl",
        "/symbol/shader/symbol3D-primitive.frag.glsl",
        "/symbol/texture/strip.png",
        "/symbol/texture/palette.png"
      );
      const view = new Viewer(container.value!, {
        msaaSamples: 2,
        requestRenderMode: true,
        maximumRenderTimeChange: Infinity,
      });
      view.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(118.81259, 32.048116, 400000),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-90.0),
        },
      });
      view.scene.primitives.add(
        new SymbolCustomPrimitive({
          view: view,
          attributeLocations: { sampleInfo: 1, geoPosition_height: 2, geoPosition_low: 3, rotation: 4 },
          vertexScript: data[4],
          fragmentScript: data[5],
          positionHeight: data[1],
          positionLow: data[2],
          simpleArray: data[0],
          rotationArray: data[3],
          symbolTextureImage: data[6],
          paletteTextureImage: data[7],
          u_bufferSize: [view.scene.canvas.width, view.scene.canvas.height],
        })
      );
    };

    onMounted(initMap)
    return { container };
  },
});
</script>

<style>
.map {
  height: 100%;
}
</style>
