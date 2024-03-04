<template>
  <!-- <button @click="clickHandle">按钮</button> -->
  <div class="map" ref="container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import "mapbox-gl/dist/mapbox-gl.css";
import mapBoxGl, { MapboxOptions } from "mapbox-gl";
import { FlowMapbox } from "@/utils/flow-utils.js";
export default defineComponent({
  setup() {
    const container = ref<HTMLDivElement>();
    let map: mapBoxGl.Map;
    // const flowMapbox = new FlowMapbox({
    //   seeding: [
    //     "/flow/texture/mask_100.png",
    //     "/flow/texture/mask_101.png",
    //     "/flow/texture/mask_102.png",
    //     "/flow/texture/mask_103.png",
    //     "/flow/texture/mask_104.png",
    //     "/flow/texture/mask_105.png",
    //     "/flow/texture/mask_106.png",
    //     "/flow/texture/mask_107.png",
    //     "/flow/texture/mask_108.png",
    //     "/flow/texture/mask_109.png",
    //     "/flow/texture/mask_110.png",
    //     "/flow/texture/mask_111.png",
    //     "/flow/texture/mask_112.png",
    //     "/flow/texture/mask_113.png",
    //     "/flow/texture/mask_114.png",
    //     "/flow/texture/mask_115.png",
    //     "/flow/texture/mask_116.png",
    //     "/flow/texture/mask_117.png",
    //     "/flow/texture/mask_118.png",
    //     "/flow/texture/mask_119.png",
    //     "/flow/texture/mask_120.png",
    //     "/flow/texture/mask_121.png",
    //     "/flow/texture/mask_122.png",
    //     "/flow/texture/mask_123.png",
    //     "/flow/texture/mask_124.png",
    //     "/flow/texture/mask_125.png",
    //     "/flow/texture/mask_126.png",
    //   ],
    //   constraints: {
    //     maxDropRate: 0.1,
    //     maxDropRateBump: 0.2,
    //     maxSegmentNum: 16,
    //     maxTrajectoryNum: 262144,
    //     maxTextureSize: 4096,
    //   },
    //   extent: [0.8334519409367115, 0.4087464036632672, 0.8388303296774701, 0.40586521884815613],
    //   flowBoundary: {
    //     uMax: 2.3461,
    //     uMin: -2.1176,
    //     vMax: 2.0175,
    //     vMin: -1.8959,
    //   },
    //   flowFields: [
    //     "/flow/texture/uv_100.png",
    //     "/flow/texture/uv_101.png",
    //     "/flow/texture/uv_102.png",
    //     "/flow/texture/uv_103.png",
    //     "/flow/texture/uv_104.png",
    //     "/flow/texture/uv_105.png",
    //     "/flow/texture/uv_106.png",
    //     "/flow/texture/uv_107.png",
    //     "/flow/texture/uv_108.png",
    //     "/flow/texture/uv_109.png",
    //     "/flow/texture/uv_110.png",
    //     "/flow/texture/uv_111.png",
    //     "/flow/texture/uv_112.png",
    //     "/flow/texture/uv_113.png",
    //     "/flow/texture/uv_114.png",
    //     "/flow/texture/uv_115.png",
    //     "/flow/texture/uv_116.png",
    //     "/flow/texture/uv_117.png",
    //     "/flow/texture/uv_118.png",
    //     "/flow/texture/uv_119.png",
    //     "/flow/texture/uv_120.png",
    //     "/flow/texture/uv_121.png",
    //     "/flow/texture/uv_122.png",
    //     "/flow/texture/uv_123.png",
    //     "/flow/texture/uv_124.png",
    //     "/flow/texture/uv_125.png",
    //     "/flow/texture/uv_126.png",
    //   ],
    //   projection: {
    //     projectionMapbox: "/flow/texture/projection_mapbox.png",
    //     projectionCesium: "/flow/texture/projection_cesium.png",
    //     projectionOl: "/flow/texture/projection_ol.png",
    //   },
    //   textureSize: {
    //     seeding: [1024, 558],
    //     flowField: [1024, 558],
    //     projection: [1024, 2048],
    //   },
    // });
    const clickHandle = () => {
      // flowMapbox.changeState(22);
    };
    const initMap = (layer: { id: string; type: "custom"; onAdd(map: any, gl: any): void; render(gl: any, matrix: any): void }) => {
      const mapOpt: MapboxOptions & { useWebGL2: boolean } = {
        container: container.value!,
        style: "mapbox://styles/johnnyt/clblx2t3v000a14proaq4e9qv",
        center: [121.024075, 31.765318],
        zoom: 8.8,
        useWebGL2: true,
        antialias: true,
        accessToken: "pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg",
      };
      map = new mapBoxGl.Map(mapOpt);
      map.on("load", () => {
        map.addLayer(layer);
      });
    };

    onMounted(async () => {
      // const layer = await flowMapbox.generateCustomLayer("flow");
      // initMap(layer);
    });

    return { container, clickHandle };
  },
});
</script>

<style lang="scss" scoped>
.map {
  height: 100%;
}
</style>
