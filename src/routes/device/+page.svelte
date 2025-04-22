<script lang="ts">
	import {
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		Button,
		Dropdown,
		DropdownItem,
		Checkbox,
		ButtonGroup,
		List,
		Li,
		Modal,
		Label,
		Input,
		Select,
		Textarea
	} from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';
	import * as m from '$lib/paraglide/messages.js';
	import {
		PlusOutline,
		ChevronDownOutline,
		FilterSolid,
		ChevronRightOutline,
		ChevronLeftOutline
	} from 'flowbite-svelte-icons';
	import { type DeviceDO } from '$lib/server/db/schema/device';
	import { type PaginationDto } from '$lib/model/Pagination';
	import fetchWrapper from '../../request';
	import NewDevice from './NewDevice.svelte';

	let deviceList: DeviceDO[] = $state([]);

	let divClass = 'bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden';
	let innerDivClass =
		'flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4';
	let searchClass = 'w-full md:w-1/2 relative';

	let searchTerm = $state('');
	let currentPage = $state(1);
	let totalPages = $state(0);
	let pageSize = $state(10);
	let totalCount = $state(0);
	let startRange = $derived.by(() => (currentPage - 1) * pageSize + 1);
	let endRange = $derived.by(() => Math.min(totalCount, currentPage * pageSize));
	let pagesToShow: Array<number> = $derived.by(() =>
		new Array(5).map((_, i) => i - 2 + currentPage).filter((x) => x > 0)
	);

	const toggleSelect = (id: string) => {
		if (selectedId.includes(id)) {
			selectedId = selectedId.filter(x => x != id)
		} else {
			selectedId = [ ...selectedId, id ]
		}
	}

	let selectedId = $state<string[]>([])
	let isAllSelect = $derived.by(() => deviceList.length === selectedId.length)

	let newDeviceModel: DeviceDO;

	let defaultModal = $state(false);
	const loadNextPage = async () => {
		currentPage += 1;
		goToPage(currentPage);
	};

	const loadPreviousPage = async () => {
		currentPage -= 1;
		goToPage(currentPage);
	};

	const goToPage = (pageNumber: number) => {
		let queryParam = new URLSearchParams({});
		currentPage = pageNumber;
		queryParam.append('searchTerm', searchTerm);
		queryParam.append('pageSize', pageSize.toString());
		queryParam.append('pageNumber', pageNumber.toString());
		fetchWrapper(`/api/device?${queryParam}`).then(async (res) => {
			const paging: PaginationDto<DeviceDO> = res;
			deviceList = paging.items;
			pageSize = paging.pageSize;
			totalPages = paging.pageCount;
			totalCount = paging.total;
		});
	};

	const handleNewDevice = async () => {};

	$effect(() => {
		goToPage(currentPage);
	});
</script>

<Section name="advancedTable" sectionClass="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
	<TableSearch
		placeholder="Search"
		hoverable={true}
		bind:inputValue={searchTerm}
		{divClass}
		{innerDivClass}
		{searchClass}
	>
		{#snippet header()}
			<div
				class="flex w-full flex-shrink-0 flex-col items-stretch justify-end space-y-2 md:w-auto md:flex-row md:items-center md:space-y-0 md:space-x-3"
			>
				<Button on:click={() => (defaultModal = true)}>
					<PlusOutline class="mr-2 h-3.5 w-3.5" />{m['device.addDevice']()}
				</Button>
				<Button color="alternative">Actions<ChevronDownOutline class="ml-2 h-3 w-3 " /></Button>
				<Dropdown simple class="w-44 divide-y divide-gray-100">
					<DropdownItem>Mass Edit</DropdownItem>
					<DropdownItem>Delete all</DropdownItem>
				</Dropdown>
				{#if defaultModal}
					<NewDevice
						bind:defaultModal
						onNewDeviceAdded={() => {
							defaultModal = false;
							goToPage(0);
						}}
					></NewDevice>
				{/if}
			</div>
		{/snippet}

		<TableHead>
			<TableHeadCell class="p-4!">
				<Checkbox bind:checked={isAllSelect}/>
			</TableHeadCell>
			<TableHeadCell class="px-4 py-3" scope="col"
				>{m['device.tableHeader.device_name']()}</TableHeadCell
			>
			<TableHeadCell class="px-4 py-3" scope="col"
				>{m['device.tableHeader.group_name']()}</TableHeadCell
			>
			<TableHeadCell class="px-4 py-3" scope="col"
				>{m['device.tableHeader.belonger']()}</TableHeadCell
			>
			<TableHeadCell class="px-4 py-3" scope="col"
				>{m['device.tableHeader.last_online_time']()}</TableHeadCell
			>
			<TableHeadCell class="px-4 py-3" scope="col"
				>{m['device.tableHeader.register_time']()}</TableHeadCell
			>
		</TableHead>
		<TableBody class="divide-y">
			{#each deviceList as device (device.id)}
				<TableBodyRow>
					<TableHeadCell class="p-4!">
						<Checkbox on:change={() => toggleSelect(device.id)} />
					</TableHeadCell>
					<TableBodyCell class="px-4 py-3">{device.name}</TableBodyCell>
					<TableBodyCell class="px-4 py-3">{device.groupId}</TableBodyCell>
					<TableBodyCell class="px-4 py-3">{device.userId}</TableBodyCell>
					<TableBodyCell class="px-4 py-3">{device.lastOnline}</TableBodyCell>
					<TableBodyCell class="px-4 py-3">{device.created_at}</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>

		{#snippet footer()}
			<div
				class="flex flex-col items-start justify-between space-y-3 p-4 md:flex-row md:items-center md:space-y-0"
				aria-label="Table navigation"
			>
				<span class="text-sm font-normal text-gray-500 dark:text-gray-400">
					Showing
					<span class="font-semibold text-gray-900 dark:text-white">{startRange}-{endRange}</span>
					of
					<span class="font-semibold text-gray-900 dark:text-white">{totalCount}</span>
				</span>
				<ButtonGroup>
					<Button onclick={loadPreviousPage} disabled={currentPage === 0}
						><ChevronLeftOutline size="xs" class="m-1.5" /></Button
					>
					{#each pagesToShow as pageNumber}
						<Button onclick={() => goToPage(pageNumber)}>{pageNumber}</Button>
					{/each}
					<Button onclick={loadNextPage} disabled={totalPages === endRange}
						><ChevronRightOutline size="xs" class="m-1.5" /></Button
					>
				</ButtonGroup>
			</div>
		{/snippet}
	</TableSearch>
</Section>
