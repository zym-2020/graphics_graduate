<template>
  <div class="map" ref="container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { defaults as defaultControls } from "ol/control";
import WebGLTileLayer from "ol/layer/WebGLTile.js";
import { Map, View } from "ol";
import XYZ from "ol/source/XYZ";
import { CustomLayer } from "@/utils/ol-flow";
import { FlowEnum } from "@/type";
export default defineComponent({
  setup() {
    const container = ref<HTMLDivElement>();
    let map: Map;

    const OSMLayer = new WebGLTileLayer({
      source: new XYZ({
        url: "https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=2d56ae4b9a10405c8d232dcdf2b94a6f",
        projection: "EPSG:3857",
      }),
    });

    const customLayer = new CustomLayer();

    const initMap = async () => {
      const shaderScriptAddressArr: { key: string; address: string }[] = [
        { key: FlowEnum.UPDATE_VERTEX, address: "/flow/shader/update.vert" },
        { key: FlowEnum.UPDATE_FRAGMENT, address: "/flow/shader/update.frag" },
        {
          key: FlowEnum.TRAJECTORY_VERTEX,
          address: "/flow/shader/trajectory.ol.vert.glsl",
        },
        {
          key: FlowEnum.TRAJECTORY_FRAGMENT,
          address: "/flow/shader/trajectory.noCulling.frag",
        },
        {
          key: FlowEnum.POINT_VERTEX,
          address: "/flow/shader/point.noCulling.vert",
        },
        {
          key: FlowEnum.POINT_FRAGMENT,
          address: "/flow/shader/point.noCulling.frag",
        },
        { key: FlowEnum.POOL_VERTEX, address: "/flow/shader/showPool.vert" },
        { key: FlowEnum.POOL_FRAGMENT, address: "/flow/shader/showPool.frag" },
      ];
      await customLayer.prepareAsyncData("/flow/json/flow_field_description.json", shaderScriptAddressArr);
      map = new Map({
        target: container.value,
        layers: [OSMLayer],
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
