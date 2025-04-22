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
		Li
	} from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';
	import * as m from '$lib/paraglide/messages.js'
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
	

	let deviceList: DeviceDO[] = $state([]);

	let divClass = 'bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden';
	let innerDivClass =
		'flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4';
	let searchClass = 'w-full md:w-1/2 relative';

	let searchTerm = $state('');
	let currentPage = $state(0);
	let totalPages = $state(0);
	let pageSize = $state(10);
	let pagesToShow: number[] = $state([]);
	let totalCount = $state(0);
	let startRange = $derived(() => (currentPage - 1) * pageSize + 1);
	let endRange = $derived(() => Math.min(totalCount, currentPage * pageSize));

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

	$effect(() => {
		goToPage(1);
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

		<TableHead>
			<TableHeadCell class="px-4 py-3" scope="col">{m['device.tableHeader.device_name']()}</TableHeadCell>
			<TableHeadCell class="px-4 py-3" scope="col">{m['device.tableHeader.group_name']()}</TableHeadCell>
			<TableHeadCell class="px-4 py-3" scope="col">{m['device.tableHeader.belonger']()}</TableHeadCell>
			<TableHeadCell class="px-4 py-3" scope="col">{m['device.tableHeader.last_online_time']()}</TableHeadCell>
			<TableHeadCell class="px-4 py-3" scope="col">{m['device.tableHeader.register_time']()}</TableHeadCell>
		</TableHead>
		<TableBody class="divide-y">
			{#each deviceList as device (device.id)}
				<TableBodyRow>
					<TableBodyCell class="px-4 py-3">{device.name}</TableBodyCell>
					<TableBodyCell class="px-4 py-3">{device.groupId}</TableBodyCell>
					<TableBodyCell class="px-4 py-3">{device.userId}</TableBodyCell>
					<TableBodyCell class="px-4 py-3">{device.updated_at}</TableBodyCell>
					<TableBodyCell class="px-4 py-3">{device.created_at}</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>

	</TableSearch>
</Section>
