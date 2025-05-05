<script lang="ts">
	import { Button, Label, Input, Checkbox, Alert } from 'flowbite-svelte';
	import type { ActionData } from './$types';
	import { page } from '$app/state';
	import { middleContainerClassString } from '$lib/sylte';
	import * as m from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { form }: { form: ActionData } = $props();
	let callerMessage = $derived(page.url.searchParams.get('message'));
</script>

<div class={middleContainerClassString}>
	{#if callerMessage}
		<Alert>
			<span class="red font-medium">
				{callerMessage}
			</span>
		</Alert>
	{/if}

	{#if form?.message}
		<Alert>
			<span class="red font-medium">
				{form.message}
			</span>
		</Alert>
	{/if}

	<form class="flex flex-col space-y-6" method="POST">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
			{m['login.sign_in_to_platform']()}
		</h3>
		<Label class="space-y-2">
			<span>{m['login.username']()}</span>
			<Input type="text" name="username" placeholder={m['login.username_placeholder']()} required />
		</Label>
		<Label class="space-y-2">
			<span>{m['login.password']()}</span>
			<Input
				type="password"
				name="password"
				placeholder={m['login.password_placeholder']()}
				required
			/>
		</Label>
		<div class="flex flex-row">
			<Checkbox>{m['login.remember']()}</Checkbox>
			<a
				href={localizeHref('/forgePassword')}
				class="text-primary-700 dark:text-primary-500 ms-auto text-sm hover:underline"
			>
				{m['login.lost_password']()}
			</a>
		</div>
		<Button type="submit" class="w-full1">{m['login.submit']()}</Button>
		<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
			{m['login.noAccount']()}
			<a
				href={localizeHref('/register')}
				class="text-primary-700 dark:text-primary-500 hover:underline"
			>
				{m['login.createAccount']()}
			</a>
		</div>
	</form>
</div>
