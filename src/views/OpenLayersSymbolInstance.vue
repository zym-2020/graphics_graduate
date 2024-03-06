<template>
  <div ref="container" class="container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import OSM from "ol/source/OSM.js";
import ol, { Map, View } from "ol";
import WebGLTileLayer from "ol/layer/WebGLTile.js";
import VectorLayer from "ol/layer/Vector";
import { defaults as defaultControls } from "ol/control";
import { CustomLayer } from "@/utils/ol-symbol";
import { Icon, Style } from "ol/style.js";
import GeoJSON from "ol/format/GeoJSON.js";
import { Vector } from "ol/source.js";
export default defineComponent({
  setup() {
    const container = ref<HTMLDivElement>();
    let map: Map;

    const OSMLayer = new WebGLTileLayer({
      source: new OSM({
        // url: "https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=2d56ae4b9a10405c8d232dcdf2b94a6f",
        url: "http://t0.tianditu.com/vec_w/wmts?tk=35a94ab5985969d0b93229c30db6abd6&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",
      }),
    });

    const customLayer = new CustomLayer(
      "/symbol/shader/symbol-ol.vert.glsl",
      "/symbol/shader/symbol-ol.frag.glsl",
      "/symbol/texture/strip_z.png",
      "/symbol/texture/palette_z.png",
      "/symbol/json/tbvs_z.json",
      "/symbol/json/output.geojson",
      40
    );

    const stylyFunction = () => {
      return new Style({
        image: new Icon({
          src: "/symbol/texture/交叉路口.png", // 图标的路径
          scale: 0.3, // 图标的缩放比例
          anchor: [0.5, 0.5], // 图标的锚点位置（相对于图标的宽度和高度）
        }),
      });
    };

    const geojsonSource = new Vector({
      url: "/symbol/json/crossroad_NJ.geojson", // GeoJSON文件的路径
      format: new GeoJSON(),
    });

    const vectorLayer = new VectorLayer({
      source: geojsonSource,
      style: stylyFunction, // 使用样式函数渲染要素
    });

    const initMap = async () => {
      console.log(OSMLayer, customLayer);
      await customLayer.prepareData(64);
      map = new Map({
        target: container.value,
        layers: [OSMLayer, vectorLayer, customLayer],
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

<style scoped lang="scss">
.container {
  height: 100%;
}
</style>
