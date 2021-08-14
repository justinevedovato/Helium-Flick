<template>
  <div class="inline-flex space-x-1 px-1">
    <span class="bg-gray-400 w-1 h-1 rounded-full animate-bounce first"></span>
    <span class="bg-gray-400 w-1 h-1 rounded-full animate-bounce second"></span>
    <span class="bg-gray-400 w-1 h-1 rounded-full animate-bounce third"></span>
  </div>
</template>

<style lang="postcss" scoped>
.first {
  animation-delay: 0.1s;
}
.second {
  animation-delay: 0.2s;
}
.third {
  animation-delay: 0.3s;
}
</style>
