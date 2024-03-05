<template>
  <div ref="controlPanel" class="control-panel"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, PropType } from "vue";
import { GUI } from "dat.gui";
import { EventObj, FlowDescriptionType } from "@/type";
export default defineComponent({
  props: {
    eventObj: {
      type: Object as PropType<EventObj>,
    },
    option: {
      type: Object as PropType<FlowDescriptionType>,
    },
  },
  setup(props) {
    const controlPanel = ref<HTMLDivElement>();
    const initControlPanel = (eventObj: EventObj) => {
      const gui = new GUI({
        autoPlace: false,
      });
      controlPanel.value?.appendChild(gui.domElement);
      gui.add({ 速度系数: props.option?.parameter.speedFactor }, "速度系数", props.option?.constraints.minSpeedFactor, props.option?.constraints.maxSpeedFactor).onChange(eventObj.speedFactor);
      gui.add({ 轨迹数量: props.option?.parameter.tracksNumber }, "轨迹数量", props.option?.constraints.minTrajectoryNum, props.option?.constraints.maxTrajectoryNum).onChange(eventObj.tracksNumber);
      gui.add({ 轨迹段数: props.option?.parameter.segmentNumber }, "轨迹段数", props.option?.constraints.minSegmentNum, props.option?.constraints.maxSegmentNum).onChange(eventObj.segmentNumber);
      gui.add({ 轨迹线填充宽度: props.option?.parameter.fillWidth }, "轨迹线填充宽度", props.option?.constraints.minFillWidth, props.option?.constraints.maxFillWidth).onChange(eventObj.fillWidth);
      gui.add({ 轨迹线边界宽度: props.option?.parameter.aaWidth }, "轨迹线边界宽度", props.option?.constraints.minAAWidth, props.option?.constraints.maxAAWidth).onChange(eventObj.aaWidth);
      gui.add({ 着色方案: 0 }, "着色方案", [0, 1, 2]).onChange(eventObj.color);
      gui.add({ 流线图元: 1 }, "流线图元", [0, 1, 2]).onChange(eventObj.primitive);
      gui.add({ 粒子固定死亡率: props.option?.parameter.fixedDropRate }, "粒子固定死亡率", props.option?.constraints.minFixedDropRate, props.option?.constraints.maxFixedDropRate).onChange(eventObj.fixedDropRate);
      gui.add({ 粒子浮动死亡率: props.option?.parameter.extraDropRate }, "粒子浮动死亡率", props.option?.constraints.minExtraDropRate, props.option?.constraints.maxExtraDropRate).onChange(eventObj.extraDropRate);
    };

    onMounted(() => {
      initControlPanel(props.eventObj!);
    });

    return { controlPanel };
  },
});
</script>

<style scoped lang="scss">
.control-panel {
  position: absolute;
}
</style>
