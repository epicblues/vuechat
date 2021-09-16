<template lang="pug">
el-container
  el-aside
    ul
      li(v-for="channel in channels") 
        router-link(:to="'/channel/' + channel") {{ channel }}
  el-container
    el-header {{cname}}
    el-main
      message-list(:messages="messages")
    el-footer
      el-input(type="text" v-model="message" @keyon="send_message")
      el-button(@click="send_message") SEND
</template>



<script>
import { mapGetters, mapActions } from "vuex";
import { GET_CHANNELS } from "@/store/mutation-types";
import MessageList from "@/components/MessageList"



export default {
  name: "chat",
  components : {
    MessageList
  },
  data() {
    return {
      message: "",
      //messages는 getter에 매핑되어 있으므로 중복 제거
      //channels도 computed의 getter에 매핑되어 있으므로 중복 제거
    };
  },
  computed: {
    // getterjs와 연결되는 부분 getter.js는 state의 데이터를 어느 정도 가공해서 전달해준다.
    ...mapGetters(["messages","channels"]),
    // 템플릿에서 messages를 data나 computed가 아닌 state에 있는 messages에서 가져온다.
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
    ...mapActions([
      "GET_MESSAGES"
      ,GET_CHANNELS,
      "POST_MESSAGES"
    ]), // state와 관련된 action들을 이 인스턴스에서사용 가능하게 해주겠다.
    send_message(e) {
      console.log(e);
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


<style>
ul {
  list-style-type: none;
  padding: 0;
}

.el-header {
 border-bottom:1px solid black; 
}

.el-header, .el-footer {
  background-color: #ffffff;
  color:#333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #4a3a4a;
  text-align:center;
  width: 100px!important;
}

.el-aside a {
  color: #ffffff;
  text-decoration : none;
  font-weight: bold;
}

.el-main {
  background-color:#ffffff;
  color:#333;
  text-align:center;
}

.el-container {
  height:100vh;
}

.el-input {
  width: 50%;
}

.el-table {
  width: 100%;
}

.grid-content {
  min-height : 25px;
  padding: 0 6px;
}

.name {
  font-weight: bold;
  font-size: 12px;
  text-align: center;
}

.date {
  font-size : 12px;
}

.message {
  font-size: 14px;
}
</style>
