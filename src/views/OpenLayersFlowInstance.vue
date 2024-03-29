<template>
  <div class="container" ref="container"></div>
  <control-panel :eventObj="flowOpenLayers.eventObj" :option="flowOpenLayers.option"></control-panel>
  <process-component :flowInstance="flowOpenLayers"></process-component>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { defaults as defaultControls } from "ol/control";
import WebGLTileLayer from "ol/layer/WebGLTile.js";
import { Map, View } from "ol";
import OSM from "ol/source/OSM.js";
import { FlowOpenLayers } from "@/utils/flow-utils.js";
import ProcessComponent from "@/components/ProcessComponent.vue";
import ControlPanel from "@/components/ControlPanel.vue";
export default defineComponent({
  components: {
    ControlPanel,
    ProcessComponent,
  },
  setup() {
    const container = ref<HTMLDivElement>();
    let map: Map;

    const OSMLayer = new WebGLTileLayer({
      source: new OSM({
        url: "https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=2d56ae4b9a10405c8d232dcdf2b94a6f",
        // url: "http://t0.tianditu.com/vec_w/wmts?tk=35a94ab5985969d0b93229c30db6abd6&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",
      }),
    });
    const TDTLayer = new WebGLTileLayer({
      source: new OSM({
        url: "https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=2d56ae4b9a10405c8d232dcdf2b94a6f",
        // url: "http://t0.tianditu.com/cva_w/wmts?tk=35a94ab5985969d0b93229c30db6abd6&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",
      }),
    });
    const flowOpenLayers = ref<FlowOpenLayers>(
      new FlowOpenLayers({
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
        projection: "/flow/texture/projection_ol.png",
        textureSize: {
          seeding: [1024, 558],
          flowField: [1024, 558],
          projection: [1024, 2048],
        },
      })
    );
    const initMap = async () => {
      await flowOpenLayers.value.prepareAsyncImage();
      map = new Map({
        target: container.value,
        layers: [OSMLayer, TDTLayer, flowOpenLayers.value as any],
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

    return { container, flowOpenLayers };
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
