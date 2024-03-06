<template>
  <div class="container" ref="container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import mapBoxGl, { MapboxOptions } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { SymbolHandle } from "@/utils/symbol-utils";
export default defineComponent({
  setup() {
    const container = ref<HTMLDivElement>();
    let map: mapBoxGl.Map;
    const symbolHandle = new SymbolHandle(64, 40);

    const initResource = async () => {
      await symbolHandle.getShader("/symbol/shader/symbol.vert.glsl", "vertex");
      await symbolHandle.getShader("/symbol/shader/symbol.frag.glsl", "fragment");
      await symbolHandle.getTexture("/symbol/texture/strip_z.png", "strip");
      await symbolHandle.getTexture("/symbol/texture/palette_z.png", "palette");
      await symbolHandle.getData("/symbol/json/output.geojson", "/symbol/json/tbvs_z.json");
    };

    const initMap = () => {
      const mapOpt: MapboxOptions & { useWebGL2: boolean } = {
        container: container.value!,
        // style: "mapbox://styles/johnnyt/clblx2t3v000a14proaq4e9qv",
        center: [118.785067, 32.059148],
        zoom: 8.8,
        useWebGL2: true,
        antialias: true,
        accessToken: "pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg",
        style: "mapbox://styles/johnnyt/cl9cj370u004714pcdxhynqc9",
        // style: "mapbox://styles/johnnyt/clblx2t3v000a14proaq4e9qv",
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
        //       id: "tdtVec",
        //       type: "raster",
        //       source: "tdtVec",
        //     },
        //     {
        //       id: "txt",
        //       type: "raster",
        //       source: "txt",
        //     },
        //   ],
        // },
      };
      map = new mapBoxGl.Map(mapOpt);
      map.on("load", async () => {
        map.addLayer(symbolHandle.generateCustomLayer("symbol", map));
        const crossroad = await axios.get("/symbol/json/crossroad_NJ.geojson").then((res) => res.data);
        map.loadImage("/symbol/texture/交叉路口.png", (err, image) => {
          map.addImage("crossroad", image!);
          map.addSource("pointCrossroad", {
            type: "geojson",
            data: crossroad,
          });
          map.addLayer({
            id: "pointCrossroad",
            type: "symbol",
            source: "pointCrossroad",
            layout: {
              "icon-image": "crossroad",
              "icon-size": 0.3,
              //   "icon-allow-overlap": true,
              "icon-ignore-placement": true,
              "icon-rotate": 0,
            },
          });
        });
      });
    };

    onMounted(async () => {
      await initResource();
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
