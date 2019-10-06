import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    userInfo: {},
    userInfoPage: {
      profileBtnIsDisabled: true,
      passwordBtnIsDisabled: false
    }
  },
  mutations: {
    updateUserInfo(state, newUserInfo: object) {
      state.userInfo = Object.assign({}, newUserInfo);
    },
    clearUserInfo(state) {
      state.userInfo = {};
    },
    toggleProfileBtn(state) {
      state.userInfoPage.profileBtnIsDisabled = !state.userInfoPage.profileBtnIsDisabled;
    },
    togglePasswordBtn(state) {
      state.userInfoPage.passwordBtnIsDisabled = !state.userInfoPage.passwordBtnIsDisabled;
    }
  },
  actions: {
    toggleTwoBtn(context) {
      context.commit("togglePasswordBtn");
      context.commit("toggleProfileBtn");
    }
  }
});