import Vue from "vue";
import Vuex from "vuex";
import * as getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

// import

Vue.use(Vuex); // Vue에서 Vuex 사용

const state = {
  messages: [],
  channels: []

  // Chat.vue에서 정의된 데이터를 Vuex를 통해 상태 관리 선언
}; // 컴포넌트 간의 공유할 데이터

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
}); // 인스턴스 생성
