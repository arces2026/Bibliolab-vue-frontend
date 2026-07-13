<template>
  <div class="container">
  <slot name="header"></slot>
  <slot name="content"></slot>
  <slot name="footer"></slot>
  </div>
</template>

<style scoped>
.container {
  width: 20vw;
  height: 40vh;
  border: 1px solid rgb(204, 200, 200);
  border-radius: 10px;
}
</style>
