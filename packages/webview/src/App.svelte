<script lang="ts">
import { getContext, onMount } from 'svelte';
import { States } from '/@/state/states';

const states = getContext<States>(States);
const availableContexts = states.stateAvailableContextsInfoUI;

onMount(() => {
  return availableContexts.subscribe();
});
</script>

{availableContexts.data?.contextNames}
