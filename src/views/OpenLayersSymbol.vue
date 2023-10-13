<template>
  <div ref="container" class="container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { Feature, Map, View } from "ol";
import TileLayer from "ol/layer/Tile.js";
import { defaults as defaultControls } from "ol/control";
import XYZ from "ol/source/XYZ";
export default defineComponent({
  setup() {
    const container = ref<HTMLDivElement>();
    let map: Map;

    const baseLayer = new TileLayer({
      source: new XYZ({
        url: "https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=2d56ae4b9a10405c8d232dcdf2b94a6f",
        projection: "EPSG:3857",
      }),
    });

    const initMap = () => {
      map = new Map({
        target: container.value,
        layers: [baseLayer],
        view: new View({
          center: [120.851, 31.864],
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
