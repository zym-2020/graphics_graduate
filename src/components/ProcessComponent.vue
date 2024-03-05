<template>
  <div class="process-component">
    <el-slider v-model="value" size="small" @change="changeHandle" @mousedown.native="mouseDown" @mouseup.native="mouseup" />
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, ref, watch } from "vue";

export default defineComponent({
  props: {
    flowInstance: {
      type: Object as PropType<any>,
    },
  },
  setup(props) {
    const value = ref(0);
    let flag = true;

    watch(
      () => props.flowInstance.count,
      () => {
        const count = props.flowInstance.count;
        const index = props.flowInstance.imagePre;
        const sum = props.flowInstance.frequency * props.flowInstance.option.flowFields.length;
        if (flag) {
          value.value = ((index * props.flowInstance.frequency + count) / sum) * 100;
        }
      }
    );

    const mouseDown = () => {
      flag = false;
    };

    const mouseup = () => {
      flag = true;
    };

    const changeHandle = (value: number) => {
      const sum = props.flowInstance.frequency * props.flowInstance.option.flowFields.length;
      const res = (value / 100) * sum;
      props.flowInstance.changeState(res);
      console.log(value);
    };

    return { value, changeHandle, mouseDown, mouseup };
  },
});
</script>

<style scoped lang="scss">
.process-component {
  width: 235px;
  position: absolute;
  background-color: #000000;
  padding: 0 5px;
  .el-slider {
    --el-slider-button-size: 13px;
  }
}
</style>
