<script lang="ts">
	import { middleContainerClassString } from '$lib/sylte';
	import { Button, Label, Input } from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';
	let password1st = $state('');
	let password2nd = $state('');
	let isSubmitForbidden = $derived.by(
		() => !(password1st.length && password2nd.length && password1st === password2nd)
	);
</script>

<div class={middleContainerClassString}>
	<form class="flex flex-col space-y-6" method="POST">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">{m['register.title']()}</h3>
		<Label class="space-y-2">
			<span>{m['register.username']()}</span>
			<Input
				type="email"
				name="username"
				placeholder={m['register.username_placeholder']()}
				required
			/>
		</Label>
		<Label class="space-y-2">
			<span>{m['register.password']()}</span>
			<Input
				type="password"
				bind:value={password1st}
				name="password"
				placeholder="•••••"
				required
			/>
		</Label>
		<Label class="space-y-2">
			<span>{m['register.passwordAgain']()}</span>
			<Input
				type="password"
				bind:value={password2nd}
				placeholder={m['register.password_placeholder']()}
				required
			/>
		</Label>
		<Button type="submit" disabled={isSubmitForbidden} class="w-full"
			>{m['register.submit']()}</Button
		>
		<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
			{m['register.hasAccount']()}<a
				href={localizeHref('/login')}
				class="text-primary-700 dark:text-primary-500 hover:underline"
			>
				{m['register.login']()}
			</a>
		</div>
	</form>
</div>
