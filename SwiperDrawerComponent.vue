<template>
  <div class="postDetailFooter row applyBtnDiv">
    <div class="postDetail-footer">
      <div class="actionDiv">
        <q-btn class="postDetailButton">
          <img src="/src/assets/Icons/accomplishIcon.svg" alt="" />
          HELP ACCOMPLISH
        </q-btn>
        <q-btn class="giftButton" @click="[(dialog = true), cycleDrawer()]">
          <img src="/src/assets/Icons/giftIcon.svg" alt="" />
        </q-btn>
      </div>
      <div class="postRewardDiv">
        <span class="postReward"
          >Reward:
          <img
            src="/src/assets/Icons/KarmaIcon.png"
            alt=""
            class="posDetailKarma"
          />
          2800
        </span>
      </div>
    </div>
    <div v-if="dialog">
      <q-card
        class="slide-drawer slide-drawer--bottom text-white fixed-bottom column no-wrap"
        :class="`slide-drawer--open-${drawerMode}`"
        :style="drawerStyle"
        v-touch-pan.mouse.vertical.prevent="() => {}"
      >
        <q-card-section
          class="slide-drawer__handler--horizontal row flex-center"
          v-touch-pan.mouse.vertical.prevent="slideDrawer"
        >
          <div class="cursor-pointer"></div>
        </q-card-section>

        <q-card-section class="col">
          <q-btn v-touch-pan.mouse.vertical.prevent="null"
            ><img
              src="/src/assets/Icons/redGiftIcon.svg"
              alt=""
              class="swiperDrawer-btn"
            />
            Partial contribution</q-btn
          >
        </q-card-section>

        <q-card-section v-if="drawerMode !== 'handler'" class="col">
          <q-btn
            ><img
              src="/src/assets/Icons/arrowUpIcon.svg"
              alt=""
              class="swiperDrawer-btn"
            />
            Top up the dream</q-btn
          >
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, computed, watch, nextTick } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();

const drawerMinHeight = 36;
const drawerTopOffset = $q.screen.height - 250;
const drawerOpenRatioHalf = 50;
const dialog = ref(false);

const drawerPos = ref(drawerMinHeight);

const drawerMaxHeight = computed(() => {
  return Math.max(0, $q.screen.height - drawerTopOffset);
});

const drawerOpenRatio = computed(() => {
  return Math.round(
    (Math.max(0, drawerPos.value - drawerMinHeight) /
      Math.max(1, drawerMaxHeight.value - drawerMinHeight)) *
      100
  );
});

const drawerStyle = computed(() => {
  return {
    height: `${drawerMaxHeight.value}px`,
    transform: `translateY(${-drawerPos.value}px)`
  };
});

const drawerMode = computed(() => {
  if (drawerOpenRatio.value > drawerOpenRatioHalf) {
    return "full";
  }
  return drawerOpenRatio.value > 0 ? "half" : "handler";
});

let animateTimeout;

const slideDrawer = (ev) => {
  const { direction, delta, isFinal } = ev;
  drawerPos.value = Math.max(
    drawerMinHeight,
    Math.min(drawerMaxHeight.value, drawerPos.value - delta.y)
  );

  if (isFinal === true) {
    nextTick(() => {
      const aboveHalf = drawerOpenRatio.value > drawerOpenRatioHalf;
      const targetHeight =
        direction === "up"
          ? aboveHalf
            ? drawerMaxHeight.value
            : Math.round(drawerMaxHeight.value / 2)
          : null;

      animateDrawerTo(targetHeight);
    });
  }
};

const cycleDrawer = () => {
  const targetHeight = Math.round(drawerMaxHeight.value);
  animateDrawerTo(targetHeight);
};

const animateDrawerTo = (height) => {
  clearTimeout(animateTimeout);

  const diff = height - drawerPos.value;

  if (diff !== 0) {
    drawerPos.value += Math.abs(diff) < 2 ? diff : Math.round(diff / 2);

    animateTimeout = setTimeout(() => {
      animateDrawerTo(height);
    }, 30);
  }
};

watch(
  () => drawerOpenRatio.value,
  (newVal) => {
    if (newVal === 0) {
      animateDrawerTo(drawerMinHeight);
      dialog.value = false;
      console.log(drawerOpenRatio.value);
    }
  }
);
</script>

<style scoped lang="scss">
.postDetail-footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .actionDiv {
    display: flex;
  }
}
.slide-drawer {
  &--bottom {
    border-radius: 20px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    background-color: #333;
    background-image: radial-gradient(
      circle,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.4) 100%
    );
    bottom: unset;
    top: 100%;
    transition: background-color 0.3s ease-in-out;
    z-index: 999999999;

    > div:last-child,
    > img:last-child {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
    &.slide-drawer--open-half {
      opacity: 0.9;
    }
  }
  &__handler {
    &--horizontal {
      cursor: grab;

      > div {
        width: 50%;
        height: 8px;
        border-radius: 4px;
        background-color: rgba(200, 200, 200, 0.7);
      }
    }
  }
}
.slide-drawer::before {
  content: "\A";
  position: absolute;
  width: 1000px;
  height: 1000px;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 1;
  transition: all 0.5s;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
}
</style>
