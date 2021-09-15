<template lang="pug">
.view 
  .chanel 
    ul 
      li(v-for="channel in channels") 
        router-link(:to="'/channel/' + channel") {{ channel }}
  .channel-name {{ $route.params.cname }}
  .messages 
    ul
      li(v-for="enteredMessage in messages") {{ enteredMessage.user.name }} : {{ enteredMessage.body }}
  .form 
    input(v-model="message", @keyup="send_message")
    input(value="SEND", type="button", @click="send_message")
</template>


<script>
import { mapGetters, mapActions } from "vuex";
import { GET_CHANNELS, SET_MESSAGES } from "../../store/mutation-types";

export default {
  name: "chat",
  data() {
    return {
      message: "",
      //messages는 getter에 매핑되어 있으므로 중복 제거
      //channels도 computed의 getter에 매핑되어 있으므로 중복 제거
    };
  },
  computed: {
    // getterjs와 연결되는 부분 getter.js는 state의 데이터를 어느 정도 가공해서 전달해준다.
    ...mapGetters(["messages"]),
    // 템플릿에서 messages를 data나 computed가 아닌 state에 있는 messages에서 가져온다.
    ...mapGetters(["channels"]), // 헬퍼 함수 사용
    cname() {
      return this.$route.params.cname;
    },
  }, // 스토어에 있는 getter에 정의된 매서드를 매핑
  watch: {
    async cname(changedCname) {
      await this.GET_MESSAGES(changedCname);
      console.log("computed인 cname 변경할 때마다 watch 메소드 수행");
    },
  },
  async mounted() {
    await this.GET_CHANNELS();
    await this.GET_MESSAGES(this.cname); // 인스턴스가 형성된 이후라서 watch의 기능들도 다 작동하고 있는 듯하다. computed, watch, method 다 사용가능할 듯
  },

  methods: {
    ...mapActions(["GET_MESSAGES"]), // state와 관련된 action을 이 인스턴스에서사용 가능하게 해주겠다.
    ...mapActions([GET_CHANNELS]),
    ...mapActions(["POST_MESSAGES"]), // 헬퍼 함수 사용
    send_message(e) {
      if (e.keyCode === 13 || e instanceof PointerEvent) {
        // action에서 객체로 인자를 받는 이상 그에 맞는 객체 명과 인자를 줘야 한다. ;
        this.POST_MESSAGES({
          cname: this.cname,
          message: this.message,
        });

        // state에서 만든 SET_MESSAGE 액션 호출
        // 이제 message는 어디에서든 호출 가능.
        this.message = "";
        console.log(this.messages);
      }
    },
  },
};
</script>


<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

.view {
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-template-rows: auto 1fr auto;
}

.chanel {
  grid-row: 1 / span 3;
  grid-column: 1 / 2;
}

.channel-name {
  grid-area: 1 / 2;
}

.messages {
  grid-area: 2 / 2;
  height: 300px;
  overflow: scroll;
}

.form {
  grid-area: 3 / 2;
}
</style>
