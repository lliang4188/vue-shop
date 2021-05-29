<template>
  <div class="sub-header">
    <a class="btn-back" @click="$router.go(-1)" v-if="isBack"></a>
    <h1 class="title">{{ title }}</h1>
  </div>
</template>

<script>
  export default {
    name: 'sub-header',
    props: {
      title: {
        type: String,
        default: ''
      },
      isBack: {
        type: Boolean,
        default: true
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "@/assets/css/common/sub-header";
</style>