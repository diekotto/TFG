<template>
  <div class="container login">
    <h1>Economato social</h1>
    <form>
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input
          type="text"
          class="form-control"
          id="username"
          aria-describedby="username field input"
          v-model="email"
        />
        <div id="emailHelp" class="form-text">
          We'll never share your email with anyone else.
        </div>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="password"
          aria-describedby="password field input"
          v-model="password"
        />
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1" />
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
      </div>
      <button type="button" class="btn btn-primary" v-on:click="login">
        Log in
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import { LoginResponseDto, loginService } from "@/services/login/login-service";

export default class Home extends Vue {
  email = "asdfasdf";
  password = "zxcvzxcv";

  login = async () => {
    let result: LoginResponseDto;
    try {
      result = await loginService.request(this.email, this.password);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };
}
</script>

<style scoped>
.login {
  max-width: 500px;
  text-align: left;
  margin-top: 40px;
}
</style>
