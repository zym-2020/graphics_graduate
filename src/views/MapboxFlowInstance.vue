<template>
  <div class="container" ref="container"></div>
  <control-panel :eventObj="flowMapbox.eventObj" :option="flowMapbox.option"></control-panel>
  <process-component :flowInstance="flowMapbox"></process-component>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import mapBoxGl, { MapboxOptions } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ProcessComponent from "@/components/ProcessComponent.vue";
import ControlPanel from "@/components/ControlPanel.vue";
import { FlowMapbox } from "@/utils/flow-utils.js";
export default defineComponent({
  components: { ControlPanel, ProcessComponent },
  setup() {
    const container = ref<HTMLDivElement>();
    let map: mapBoxGl.Map;
    const flowMapbox = ref<FlowMapbox>(
      new FlowMapbox({
        seeding: [
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_100.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_101.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_102.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_103.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_104.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_105.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_106.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_107.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_108.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_109.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_110.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_111.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_112.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_113.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_114.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_115.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_116.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_117.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_118.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_119.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_120.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_121.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_122.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_123.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_124.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_125.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/mask_126.png`,
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
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_100.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_101.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_102.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_103.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_104.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_105.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_106.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_107.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_108.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_109.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_110.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_111.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_112.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_113.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_114.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_115.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_116.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_117.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_118.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_119.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_120.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_121.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_122.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_123.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_124.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_125.png`,
          `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/uv_126.png`,
        ],
        projection: `${process.env.VUE_APP_RESOURCE_PREFIX}/flow/texture/projection_mapbox.png`,
        textureSize: {
          seeding: [1024, 558],
          flowField: [1024, 558],
          projection: [1024, 2048],
        },
      })
    );

    // const wind = ref<FlowMapbox>(
    //   new FlowMapbox({
    //     seeding: ["/flow/texture/mask_0.png", "/flow/texture/mask_0.png"],
    //     constraints: {
    //       minSpeedFactor: 0.5,
    //       minTrajectoryNum: 4096,
    //       minSegmentNum: 3,
    //       minFillWidth: 1,
    //       minAAWidth: 1,
    //       minFixedDropRate: 0.001,
    //       minExtraDropRate: 0.001,
    //       maxSpeedFactor: 10,
    //       maxTrajectoryNum: 262144,
    //       maxSegmentNum: 16,
    //       maxFillWidth: 25,
    //       maxAAWidth: 5,
    //       maxFixedDropRate: 0.1,
    //       maxExtraDropRate: 0.2,

    //       maxTextureSize: 4096,
    //     },
    //     parameter: {
    //       speedFactor: 2,
    //       tracksNumber: 206384,
    //       segmentNumber: 16,
    //       fillWidth: 1,
    //       aaWidth: 2,
    //       color: 0,
    //       primitive: 0,
    //       fixedDropRate: 0.003,
    //       extraDropRate: 0.002,
    //     },
    //     extent: [0.8374743838415425, 0.42819046408647427, 0.8374960543212129, 0.42815421254642927],
    //     flowBoundary: {
    //       uMax: 2.04285,
    //       uMin: -2.46302,
    //       vMax: 0.776148,
    //       vMin: -3.39616,
    //     },
    //     flowFields: ["/flow/texture/uv_0.png", "/flow/texture/uv_0.png"],
    //     projection: "/flow/texture/projection_mapbox_0.png",
    //     textureSize: {
    //       seeding: [1024, 1551],
    //       flowField: [1024, 1551],
    //       projection: [1024, 2048],
    //     },
    //   })
    // );

    const initMap = (layer: { id: string; type: "custom"; onAdd(map: any, gl: any): void; render(gl: any, matrix: any): void }) => {
      const mapOpt: MapboxOptions & { useWebGL2: boolean } = {
        container: container.value!,
        style: "mapbox://styles/johnnyt/clblx2t3v000a14proaq4e9qv",
        center: [121.024075, 31.765318],
        zoom: 8.8,
        useWebGL2: true,
        antialias: true,
        accessToken: "pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg",
        // style: {
        //   version: 8,
        //   sources: {
        //     tdtVec: {
        //       type: "raster",
        //       tiles: [
        //         "http://t0.tianditu.com/vec_w/wmts?tk=35a94ab5985969d0b93229c30db6abd6&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",
        //       ],
        //       tileSize: 256,
        //     },
        //     txt: {
        //       type: "raster",
        //       tiles: [
        //         "http://t0.tianditu.com/cva_w/wmts?tk=35a94ab5985969d0b93229c30db6abd6&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",
        //       ],
        //       tileSize: 256,
        //     },
        //   },
        //   layers: [
        //     {
        //       id: "background",
        //       type: "background",
        //       paint: {
        //         "background-color": "black",
        //       },
        //     },
        //     // {
        //     //   id: "tdtVec",
        //     //   type: "raster",
        //     //   source: "tdtVec",
        //     // },
        //     // {
        //     //   id: "txt",
        //     //   type: "raster",
        //     //   source: "txt",
        //     // },
        //   ],
        // },
      };
      map = new mapBoxGl.Map(mapOpt);
      map.on("load", () => {
        map.addLayer(layer);
      });
    };

    onMounted(async () => {
      const layer = await flowMapbox.value.generateCustomLayer("flow");
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
.control-panel {
  top: calc(5.1rem + 24px);
  left: 0.5rem;
}
.process-component {
  top: 5.1rem;
  left: 0.5rem;
}
</style>
