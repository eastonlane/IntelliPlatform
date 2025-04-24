<script lang="ts">
	import { Button, Input, Label, Modal } from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import fetchWrapper from '../../request';

	let { defaultModal = $bindable(), onNewDeviceAdded } = $props();
	let newDeviceName = $state('');

	const handleNewDevice = async () => {
		console.log(111);
		fetchWrapper('/api/device', {
			method: 'POST',
			body: JSON.stringify({
				name: newDeviceName
			})
		}).then(() => {
			onNewDeviceAdded();
		});
	};
</script>

<Modal title={m['device.addDevice']()} bind:open={defaultModal} autoclose>
	<form>
		<div class="lg mb-4 flex flex-col content-end justify-between gap-10">
			<div>
				<Label for="name" class="mb-2">{m['device.addDeviceForm.nameLabel']()}</Label>
				<Input
					type="text"
					id="name"
					bind:value={newDeviceName}
					placeholder={m['device.addDeviceForm.nameLabelPlaceHolder']()}
					required
				/>
			</div>
			<Button type="submit" class="w-52" on:click={handleNewDevice}>
				<svg
					class="mr-1 -ml-1 h-6 w-6"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
						clip-rule="evenodd"
					/></svg
				>
				{m['device.addDeviceForm.submitButton']()}
			</Button>
		</div>
	</form>
</Modal>
