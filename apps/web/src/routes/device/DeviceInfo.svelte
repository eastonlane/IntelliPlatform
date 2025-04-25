<script lang="ts">
	import { Button, Input, Label, Modal } from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import fetchWrapper from '../../request';
	import isEqual from 'loadsh/isEqual';

	let { device = $bindable(), refreshData, showingDeviceInfo = $bindable() } = $props();

	let deviceForEdit = $state({ ...device });

	let isNotSubmitable = $derived.by(() => isEqual(device, deviceForEdit));

	const handleSubmit = async () => {
		await fetchWrapper(`/api/device/${device.id}`, {
			method: 'PUT',
			body: JSON.stringify(deviceForEdit)
		});

        refreshData();
	};
</script>

<Modal title={m['device.deviceInfoFrom.formTitile']()} bind:open={showingDeviceInfo}>
	<form>
		<div class="lg mb-4 flex flex-col content-end justify-between gap-10">
			<div>
				<Label for="id" class="mb-2">{m['device.deviceInfoFrom.deviceIdLabel']()}</Label>
				<Input type="text" id="id" bind:value={deviceForEdit.id} disabled={true} />
			</div>
			<div>
				<Label for="name" class="mb-2">{m['device.deviceInfoFrom.deviceNameLable']()}</Label>
				<Input type="text" id="name" bind:value={deviceForEdit.name} />
			</div>
			<Button type="submit" class="w-52" disabled={isNotSubmitable} on:click={handleSubmit}>
				<svg
					class="-ml-1 mr-1 h-6 w-6"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
						clip-rule="evenodd"
					/></svg
				>
				{m['device.deviceInfoFrom.submitButton']()}
			</Button>
		</div>
	</form>
</Modal>
