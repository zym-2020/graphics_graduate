<template>
  <div class="map" ref="container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import "mapbox-gl/dist/mapbox-gl.css";
import mapBoxGl, { MapboxOptions } from "mapbox-gl";
import { FlowEnum } from "@/type";
import { FlowHandle } from "@/utils/flow-utils";
export default defineComponent({
  setup() {
    const container = ref<HTMLDivElement>();
    let map: mapBoxGl.Map;
    const flowHandle = new FlowHandle();
    const initMap = () => {
      const mapOpt: MapboxOptions & { useWebGL2: boolean } = {
        container: container.value!,
        style: "mapbox://styles/johnnyt/clblx2t3v000a14proaq4e9qv",
        center: [121.024075, 31.765318],
        zoom: 8.8,
        useWebGL2: true,
        antialias: true,
        accessToken:
          "pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg",
      };
      map = new mapBoxGl.Map(mapOpt);
      map.on("load", () => {
        const customLayer = flowHandle.generateCustomLayer("flow");
        map.addLayer(customLayer);
      });
    };

    onMounted(async () => {
      const shaderScriptAddressArr: { key: string; address: string }[] = [
        { key: FlowEnum.UPDATE_VERTEX, address: "/flow/shader/update.vert" },
        { key: FlowEnum.UPDATE_FRAGMENT, address: "/flow/shader/update.frag" },
        {
          key: FlowEnum.TRAJECTORY_VERTEX,
          address: "/flow/shader/trajectory.noCulling.vert",
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

      await flowHandle.prepareAsyncData(
        "/flow/json/flow_field_description.json",
        shaderScriptAddressArr
      );
      initMap();
    });

    return { container };
  },
});
</script>

<style lang="scss" scoped>
.map {
  height: 100%;
}
</style>