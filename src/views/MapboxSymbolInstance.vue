<template>
  <div class="container" ref="container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import mapBoxGl, { MapboxOptions } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
export default defineComponent({
  setup() {
    const container = ref<HTMLDivElement>();
    let map: mapBoxGl.Map;

    const initMap = () => {
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
      map.on("load", async () => {
        const res = await axios.get("/symbol/json/output.geojson").then((res) => res.data);
        const crossroad = await axios.get("/symbol/json/crossroad_NJ.geojson").then((res) => res.data);
        const promise1 = new Promise((res, rej) => {
          map.loadImage("/symbol/texture/轮船.png", (error, image) => {
            map.addImage("ship", image!);
            res(null);
          });
        });
        const promise2 = new Promise((res, rej) => {
          map.loadImage("/symbol/texture/交叉路口.png", (err, image) => {
            map.addImage("crossroad", image!);
            res(null);
          });
        });
        Promise.all([promise1, promise2]).then(() => {
          map.addSource("pointShip", {
            type: "geojson",
            data: res as any,
          });
          map.addLayer({
            id: "pointShip",
            type: "symbol",
            source: "pointShip",
            layout: {
              "icon-image": "ship",
              "icon-size": 0.5,
              //   "icon-allow-overlap": true,
              "icon-ignore-placement": true,
              "icon-rotate": 0,
            },
          });

          map.addSource("pointCrossroad", {
            type: "geojson",
            data: crossroad as any,
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
