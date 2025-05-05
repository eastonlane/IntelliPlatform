<script lang="ts">
	import { goto } from '$app/navigation';
	import { localizeUrl } from '$lib/paraglide/runtime';
	import { middleContainerClassString } from '$lib/sylte';
	import { Alert } from 'flowbite-svelte';

	$effect(() => {
		setTimeout(() => {
			goto(localizeUrl('/'), { invalidateAll: true });
		}, 3000);
	});
</script>

<div class={middleContainerClassString}>
	<Alert>You are logout!</Alert>
</div>
