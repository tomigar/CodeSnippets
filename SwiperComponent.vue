<template>
  <div class="flicking-camera">
    <Flicking
      :options="flickingOptions"
      :plugins="flickingPlugins"
      @changed="(e) => $emit('changed', props.options[e.index].title)"
    >
      <div
        v-for="item in props.options"
        :key="item.id"
        :class="[props.horizontal ? 'flicking-panel-vertical' : null]"
      >
        <q-img :src="'/src/assets/CategoryIcons/' + item.title + '.png'" />
      </div>
    </Flicking>
  </div>
</template>

<script setup lang="ts">
import { RegistrationOptions } from "src/components/models";
import { PropType } from "vue";
import { Fade } from "@egjs/flicking-plugins";
import Flicking from "@egjs/vue3-flicking";

interface Props {
  options: RegistrationOptions[];
  horizontal: boolean;
}
const props: Props = defineProps({
  options: {
    type: Array as PropType<RegistrationOptions[]>,
    required: true
  },
  horizontal: {
    type: Boolean,
    required: false
  }
});
const flickingOptions = {
  horizontal: props.horizontal,
  inputType: ["mouse", "touch", "pointer"],
  defaultIndex: Math.round(props.options.length / 2) - 1,
  align: "center",
  circular: true
};
const flickingPlugins = [new Fade("", 1)];
const emit = defineEmits(["changed"]);
emit("changed", props.options[flickingOptions.defaultIndex].title);
</script>
<style lang="scss">
.flicking-viewport {
  width: 100%;
  height: 60vh;
}

.flicking-panel-vertical {
  width: 50%;
  height: 50%;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  margin: 10px 0;
}
</style>
