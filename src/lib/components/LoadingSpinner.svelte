<script lang="ts">
  export let size = 'w-8 h-8';
  export let center = false;
</script>

<div class={`loading-spinner ${size} ${center ? 'mx-auto' : ''}`}>
  <div class="inner"></div>
</div>

<style>
  .loading-spinner {
    @apply relative inline-block;
  }

  .inner {
    @apply absolute inset-0 rounded-full;
    border: 2px solid transparent;
    border-top-color: rgb(34, 211, 238); /* Cyan 400 */
    border-right-color: rgb(34, 211, 238);
    animation: spinner 0.8s linear infinite;
    box-shadow: 0 0 15px rgba(34, 211, 238, 0.3);
  }

  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
</style>