<template>
  <div class="home">
    <video loop autoplay muted class="video-class">
      <source :src="videoSrc" />
    </video>
    <img :src="imgSrc" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeView",
  setup() {
    const imgSrc = `${process.env.VUE_APP_RESOURCE_PREFIX}/nnu-1.png`;
    const videoSrc = `${process.env.VUE_APP_RESOURCE_PREFIX}/video/nnu.mp4`;

    return { imgSrc, videoSrc };
  },
});
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  video {
    position: absolute;
    /* Vertical and Horizontal center*/
    top: 5rem;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: calc(100% - 5rem);
    object-fit: cover;
    z-index: -1;
  }
  img {
    object-fit: cover;
    width: 500px;
  }
}
</style>
