<template>
  <div class="container" ref="container"></div>
  <control-panel :eventObj="flowMapbox.eventObj" :option="flowMapbox.option"></control-panel>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import mapBoxGl, { MapboxOptions } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ControlPanel from "@/components/ControlPanel.vue";
import { FlowMapbox } from "@/utils/flow-utils.js";
export default defineComponent({
  components: { ControlPanel },
  setup() {
    const container = ref<HTMLDivElement>();
    let map: mapBoxGl.Map;
    const flowMapbox = new FlowMapbox({
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
        maxFillWidth: 5,
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

    const initMap = (layer: { id: string; type: "custom"; onAdd(map: any, gl: any): void; render(gl: any, matrix: any): void }) => {
      const mapOpt: MapboxOptions & { useWebGL2: boolean } = {
        container: container.value!,
        // style: "mapbox://styles/johnnyt/clblx2t3v000a14proaq4e9qv",
        center: [118.785067, 32.059148],
        zoom: 8.8,
        useWebGL2: true,
        antialias: true,
        accessToken: "pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg",
        style: {
          version: 8,
          sources: {
            tdtVec: {
              type: "raster",
              tiles: [
                "http://t0.tianditu.com/vec_w/wmts?tk=35a94ab5985969d0b93229c30db6abd6&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",
              ],
              tileSize: 256,
            },
            txt: {
              type: "raster",
              tiles: [
                "http://t0.tianditu.com/cva_w/wmts?tk=35a94ab5985969d0b93229c30db6abd6&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",
              ],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: "tdtVec",
              type: "raster",
              source: "tdtVec",
            },
            {
              id: "txt",
              type: "raster",
              source: "txt",
            },
          ],
        },
      };
      map = new mapBoxGl.Map(mapOpt);
      map.on("load", () => {
        map.addLayer(layer);
      });
    };

    onMounted(async () => {
      const layer = await flowMapbox.generateCustomLayer("flow");
      initMap(layer);
    });

    return { container, flowMapbox };
  },
});
</script>

<style scoped lang="scss">
.container {
  height: 100%;
}
</style>
