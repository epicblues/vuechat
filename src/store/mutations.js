import { SET_MESSAGES, GET_CHANNELS } from "./mutation-types";

// commit이라는 메서드로 수행된다.

export default {
  [SET_MESSAGES](state, messages) {
    state.messages = messages;
  },

  [GET_CHANNELS](state, channels) {
    state.channels = channels;
  }
};
