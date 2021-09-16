import { SET_MESSAGES, GET_CHANNELS } from "./mutation-types";

const get_message_path = cname =>
  `http://localhost:5000/chat-server-9db44/us-central1/v1/channels/${cname}/messages`;

async function fetch_get_messages(cname) {
  try {
    const res = await fetch(get_message_path(cname));
    const json = await res.json();
    return json.messages; // 성공적으로 promise들이 resolve 됐을 때 반환하는 값. await을 통해 호출하면 값을 그대로 받을 수 있다.
  } catch (error) {
    console.log(e);
  }
}

// Chat.vue에서 메서드로 사용할 것
// 실제로 store에 부착되는 actions들
export default {
  // [SET_MESSAGE]({ commit }, message) {
  //   commit(SET_MESSAGE, message);
  // },

  async ["GET_CHANNELS"]({ commit }) {
    try {
      const res = await fetch(
        "http://localhost:5000/chat-server-9db44/us-central1/v1/channels"
      );
      const data = await res.json();
      commit(GET_CHANNELS, data.channels); //channel state mutation 실행
      // 재귀 함수 같은 것이 아님. ["GET_CHANNELS" 를 사용하는 이유?]
    } catch (error) {
      console.log(error);
    }
  },
  async GET_MESSAGES({ commit }, cname) {
    const messages = await fetch_get_messages(cname);
    // 서버에서 받아온 메시지를 SET_MESSAGES에 커밋함
    commit(SET_MESSAGES, messages); // mutation 실행
  },

  async POST_MESSAGES({ commit }, { cname, message }) {
    // 서버에 POST 요청으로 메시지를 송신함
    // fetch() 의 두번째 인자는 옵션
    // commit은 POST_MESSAGES를 요청한 state에서 주는 callback 객체라 생각하자.
    try {
      const res = await fetch(get_message_path(cname), {
        method: "POST",
        body: JSON.stringify({ body: message }),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });
      const json = await res.json();
      if (json.result === "ok") {
        const messages = await fetch_get_messages(cname);
        commit(SET_MESSAGES, messages); // mutation 실행
      }
    } catch (error) {
      console.log(error);
    }
  }
};
