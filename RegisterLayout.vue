<template>
  <q-layout view="lHh Lpr fff">
    <q-page-container>
      <q-page class="row bgExplain">
        <div class="row col-12">
          <div class="arrowBtn-back" @click="previousRegister">
            <a><span class="arrow-btn"></span></a>
          </div>
          <div class="col-7 q-mx-auto" style="margin-bottom: 2rem">
            <q-linear-progress
              :value="progress"
              rounded
              animationSpeed="600"
              color="negative"
              class="q-mt-sm"
              style="margin-top: 1.2rem; margin-left: -1.2rem"
            />
          </div>
        </div>
        <div class="col-12 row justify-center explainBody">
          <Transition name="fade" mode="out-in">
            <keep-alive>
              <component
                :is="activeComponent.name"
                v-bind="activeComponent.props"
              />
            </keep-alive>
          </Transition>
        </div>
        <div class="col-5 row self-end justify-center" style="width: 100%">
          <q-btn
            v-if="registrationIndex !== 5"
            label="NEXT STEP"
            :disabled="nextDisabled"
            color="primary"
            class="q-mt-sm"
            @click="nextRegister"
          />
          <q-btn
            v-else
            label="JOIN"
            :disabled="nextDisabled"
            color="primary"
            class="q-mt-sm"
            @click="register"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import RegistrationPage1 from "src/pages/Auth/Registration/RegistrationPage1.vue";
import RegistrationPage2 from "src/pages/Auth/Registration/RegistrationPage2.vue";
import RegistrationPage3 from "src/pages/Auth/Registration/RegistrationPage3.vue";
import RegistrationPage4 from "src/pages/Auth/Registration/RegistrationPage4.vue";
import RegistrationPage5 from "src/pages/Auth/Registration/RegistrationPage5.vue";

import { useApiCallStore } from "src/stores/api-calls-store";

const apiCalls = useApiCallStore();
const router = useRouter();
const registrationIndex = ref(1);

const progress = ref(registrationIndex.value * 0.2);
const nextDisabled = ref(false);

const registrationData = reactive({
  side: "",
  dream: "",
  goal: "",
  country: "",
  state: "",
  city: "",
  username: "",
  birthDate: "",
  gender: "",
  email: "",
  password: ""
});
const changeSide = (side: string) => {
  registrationInfo.side = side;
};
const changeGoal = (goal: string) => {
  registrationInfo.goal = goal;
};
const changeDream = (dream: string) => {
  registrationInfo.dream = dream;
};
const changeCountry = (city: string, state: string, country: string) => {
  registrationInfo.city = city;
  registrationInfo.state = state;
  registrationInfo.country = country;
};
const changeDetails = (
  username: string,
  birthDate: string,
  gender: string,
  email: string,
  password: string
) => {
  registrationInfo.username = username;
  registrationInfo.birthDate = birthDate;
  registrationInfo.gender = gender;
  registrationInfo.email = email;
  registrationInfo.password = password;
};

const register = async () => {
  const res = await apiCalls.register(registrationData);
  console.log(res);
};

const comps = [
  {
    name: RegistrationPage1,
    props: { changeSide }
  },
  {
    name: RegistrationPage2,
    props: { changeGoal }
  },
  {
    name: RegistrationPage3,
    props: { changeDream }
  },
  {
    name: RegistrationPage4,
    props: {
      country: registrationInfo.country,
      state: registrationInfo.state,
      city: registrationInfo.city,
      changeCountry
    }
  },
  {
    name: RegistrationPage5,
    props: {
      username: registrationInfo.username,
      birthDate: registrationInfo.birthDate,
      gender: registrationInfo.gender,
      email: registrationInfo.email,
      password: registrationInfo.password,
      changeDetails
    }
  }
];
let activeComponent = comps[registrationIndex.value - 1];

watch(registrationInfo, () => {
  disabledCheck();
  console.log(registrationInfo);
});

const disabledCheck = () => {
  if (registrationIndex.value !== 4 && registrationIndex.value !== 5) {
    nextDisabled.value = false;
  }
  if (registrationIndex.value === 4) {
    if (
      registrationInfo.city === "" ||
      registrationInfo.state === "" ||
      registrationInfo.country === ""
    ) {
      nextDisabled.value = true;
    } else {
      nextDisabled.value = false;
    }
  }
  if (registrationIndex.value === 5) {
    if (
      registrationInfo.side === "" ||
      registrationInfo.goal === "" ||
      registrationInfo.dream === "" ||
      registrationInfo.username === "" ||
      registrationInfo.birthDate === "" ||
      registrationInfo.gender === "" ||
      registrationInfo.email === "" ||
      registrationInfo.password === ""
    ) {
      nextDisabled.value = true;
    } else {
      nextDisabled.value = false;
    }
  }
};
const nextRegister = async () => {
  if (registrationIndex.value + 1 > 5) {
    await router.push({ name: "components" });
  } else {
    progress.value += 0.2;
    registrationIndex.value++;
    activeComponent = comps[registrationIndex.value - 1];
  }
  disabledCheck();
};

const previousRegister = () => {
  if (registrationIndex.value - 1 < 1) {
    router.push({ name: "explainers-page-5" });
  } else {
    progress.value -= 0.2;
    registrationIndex.value--;
    activeComponent = comps[registrationIndex.value - 1];
  }
  disabledCheck();
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
