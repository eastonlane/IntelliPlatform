<script>
	import '../app.css';
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/state';
	import {
		Button,
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		DarkMode,
		Dropdown,
		DropdownItem,
		DropdownDivider
	} from 'flowbite-svelte';
	import {
		ArrowRightToBracketOutline,
		ArrowUpFromBracketOutline,
		ChevronDownOutline,
		EditOutline,
		LanguageOutline
	} from 'flowbite-svelte-icons';
	import { PruneSuffix } from '$lib/helper/url-helper';
	import { getLocale, locales, localizeHref } from '$lib/paraglide/runtime';
	let { children, data } = $props();

	let currentLocale = $derived(getLocale());
	let activeUrl = $derived(page.url.pathname);
</script>

<Navbar>
	<NavBrand href={localizeHref('/', { locale: currentLocale })}>
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Iot</span>
	</NavBrand>
	<NavHamburger />
	<NavUl bind:activeUrl>
		<NavLi href={PruneSuffix(localizeHref('/'), '/')}>{m.topBar_home()}</NavLi>
		<NavLi href={localizeHref('/device')}>{m.topBar_devices()}</NavLi>
		<NavLi href={localizeHref('/data')}>{m.topBar_data()}</NavLi>
	</NavUl>

	<div class="flex flex-row justify-around gap-2 align-middle">
		<Button
			>{m['topBar.profileDropdownButton']()}
			<ChevronDownOutline class="text-white dark:text-white" />
		</Button>
		<Dropdown class="w-30">
			{#if data.user}
				<DropdownItem
					href={localizeHref('/logout', { locale: currentLocale })}
					class="flex flex-row justify-between"
				>
					<EditOutline
						class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
					/>
					<sapn>{m['topBar.logout']()}</sapn>
				</DropdownItem>
				<DropdownDivider />
			{:else}
				<DropdownItem
					href={localizeHref('/login', { locale: currentLocale })}
					class="flex flex-row justify-between"
				>
					<ArrowRightToBracketOutline
						class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
					/>
					<span>{m['topBar.login']()}</span>
				</DropdownItem>
				<DropdownItem
					href={localizeHref('/register', { locale: currentLocale })}
					class="flex flex-row justify-between"
				>
					<ArrowUpFromBracketOutline
						class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
					/>
					<span>{m['topBar.signUp']()}</span>
				</DropdownItem>
			{/if}
		</Dropdown>

		<Button color="light"><LanguageOutline /></Button>
		<Dropdown>
			{#each locales as locale}
				<DropdownItem rel="external" href={localizeHref(page.url.pathname, { locale: locale })}>
					{new Intl.DisplayNames([locale], { type: 'language' }).of(locale)}
				</DropdownItem>
			{/each}
		</Dropdown>

		<DarkMode />
	</div>
</Navbar>

<div class="max-w-screen container w-screen p-12">
	{@render children()}
</div>
