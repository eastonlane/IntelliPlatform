<script>
	import '../app.css';
	import * as m from '$lib/paraglide/messages.js'
	import { page } from '$app/state';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, DarkMode } from 'flowbite-svelte';
	let { children } = $props();

	let activeUrl = $state(page.url.pathname);
</script>

<Navbar>
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Iot</span>
	</NavBrand>
	<NavHamburger />
	<NavUl {activeUrl}>
		<NavLi href="/">{m.topBar_home()}</NavLi>
		<NavLi href="/device">{m.topBar_devices()}</NavLi>
		<NavLi href="/data">{m.topBar_data()}</NavLi>
	</NavUl>
	<DarkMode />
</Navbar>

<div class="container p-12 max-w-screen w-screen">
	{@render children()}
</div>
