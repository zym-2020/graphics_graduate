<template>
  <div class="map" ref="container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import "mapbox-gl/dist/mapbox-gl.css";
import mapBoxGl, { MapboxOptions } from "mapbox-gl";
import { SymbolHandle } from "@/utils/symbol-utils";
export default defineComponent({
  setup() {
    const container = ref<HTMLElement>();
    let map: mapBoxGl.Map;
    const symbolHandle = new SymbolHandle(64, 25);

    const initResource = async () => {
      await symbolHandle.getShader("/symbol/shader/symbol.vert.glsl", "vertex");
      await symbolHandle.getShader(
        "/symbol/shader/symbol.frag.glsl",
        "fragment"
      );
      await symbolHandle.getTexture("/symbol/texture/strip.png", "strip");
      await symbolHandle.getTexture("/symbol/texture/palette.png", "palette");
      await symbolHandle.getData(
        "/symbol/json/crossroad_NJ.geojson",
        "/symbol/json/tbvs.json",
        "campfire"
      );
    };

    const initMap = () => {
      const mapOpt: MapboxOptions & { useWebGL2: boolean } = {
        container: container.value!,
        style: "mapbox://styles/johnnyt/clblx2t3v000a14proaq4e9qv",
        center: [118.785067, 32.059148],
        zoom: 8.8,
        useWebGL2: true,
        antialias: true,
        accessToken:
          "pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg",
      };
      map = new mapBoxGl.Map(mapOpt);
      map.on("load", () => {
        map.addLayer(symbolHandle.generateCustomLayer("symbol", map));
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


<style lang="scss" scoped>
.map {
  height: 100%;
}
</style>