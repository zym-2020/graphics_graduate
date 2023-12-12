<template>
  <div class="map" ref="container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { defaults as defaultControls } from "ol/control";
import WebGLTileLayer from "ol/layer/WebGLTile.js";
import { Map, View } from "ol";
import OSM from "ol/source/OSM.js";
import { FlowOpenLayers } from "@/utils/flow-utils.js";
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
    const TDTLayer = new WebGLTileLayer({
      source: new OSM({
        // url: "https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=2d56ae4b9a10405c8d232dcdf2b94a6f",
        url: "http://t0.tianditu.com/cva_w/wmts?tk=35a94ab5985969d0b93229c30db6abd6&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",
      }),
    });
    const flowOpenLayers = new FlowOpenLayers({
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
      // await customLayer.prepareAsyncData("/flow/json/flow_field_description.json", shaderScriptAddressArr);
      await flowOpenLayers.prepareAsyncImage();
      map = new Map({
        target: container.value,
        layers: [OSMLayer, TDTLayer, flowOpenLayers],
        view: new View({
          center: [121.024075, 31.765318],
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
