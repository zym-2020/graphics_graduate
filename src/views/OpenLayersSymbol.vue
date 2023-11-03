<template>
  <div ref="container" class="container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import OSM from "ol/source/OSM.js";
import { Map, View } from "ol";
import WebGLTileLayer from "ol/layer/WebGLTile.js";
import { defaults as defaultControls } from "ol/control";
import { CustomLayer } from "@/utils/ol-symbol";
export default defineComponent({
  setup() {
    const container = ref<HTMLDivElement>();
    let map: Map;

    const OSMLayer = new WebGLTileLayer({
      source: new OSM({
        url: "https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=2d56ae4b9a10405c8d232dcdf2b94a6f",
      }),
    });

    const customLayer = new CustomLayer(
      "/symbol/shader/symbol-ol.vert.glsl",
      "/symbol/shader/symbol-ol.frag.glsl",
      "/symbol/texture/strip.png",
      "/symbol/texture/palette.png",
      "/symbol/json/tbvs.json",
      "/symbol/json/crossroad_NJ.geojson"
    );

    const initMap = async () => {
      console.log(OSMLayer, customLayer)
      await customLayer.prepareData("campfire", 64);
      map = new Map({
        target: container.value,
        layers: [OSMLayer, customLayer],
        view: new View({
          center: [118.81259, 32.048116],
          projection: "EPSG:4326",
          zoom: 10,
        }),
        controls: defaultControls({
          zoom: false,
          rotate: false,
          attribution: false,
        }),
      });
    };

    onMounted(() => {
      initMap();
      
    });

    return { container };
  },
});
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
</style>
