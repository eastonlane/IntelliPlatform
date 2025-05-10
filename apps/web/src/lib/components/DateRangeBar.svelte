<script lang="ts">
	import { Button, Datepicker, Dropdown, DropdownItem } from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import type { ITimeRange } from '$lib/model/TimeRange';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';

	let {
		timeRangeBegin = $bindable<Date>(),
		timeRangeEnd = $bindable<Date>(),
		timeRangeOptions
	}: {
		timeRangeBegin: Date;
		timeRangeEnd: Date;
		timeRangeOptions?: ITimeRange[];
	} = $props();

	const buildInTimeRanges: ITimeRange[] = [
		{
			name: m['components.timeRange.options.today'](),
			timeRangeCalculator: (now: Date) => {
				const from = new Date(now);
				from.setHours(0, 0, 0, 0);

				const to = new Date(now);
				to.setHours(23, 59, 59, 999);

				return { from, to };
			}
		},
		{
			name: m['components.timeRange.options.yesterday'](),
			timeRangeCalculator: (now: Date) => {
				const from = new Date(now);
				from.setDate(from.getDate() - 1);
				from.setHours(0, 0, 0, 0);

				const to = new Date(now);
				to.setDate(to.getDate() - 1);
				to.setHours(23, 59, 59, 999);

				return { from, to };
			}
		},
		{
			name: m['components.timeRange.options.last3d'](),
			timeRangeCalculator: (now: Date) => {
				const from = new Date(now);
				from.setDate(from.getDate() - 2);
				from.setHours(0, 0, 0, 0);

				const to = new Date(now);
				to.setHours(23, 59, 59, 999);

				return { from, to };
			}
		},
		{
			name: m['components.timeRange.options.last7d'](),
			timeRangeCalculator: (now: Date) => {
				const from = new Date(now);
				from.setDate(from.getDate() - 6);
				from.setHours(0, 0, 0, 0);

				const to = new Date(now);
				to.setHours(23, 59, 59, 999);

				return { from, to };
			}
		}
	];
	timeRangeOptions ??= buildInTimeRanges;
	let selectedTimeRangeIndex = $state(0);
</script>

<div class="flex flex-row justify-between gap-4">
	<Button color="alternative" class="px-3 py-2"
		>{selectedTimeRangeIndex < 0
			? m['components.timeRange.options.customRange']()
			: timeRangeOptions[selectedTimeRangeIndex].name}
		<ChevronDownOutline class="ms-1.5 h-2.5 w-2.5" />
	</Button>
	<Dropdown>
		<DropdownItem>{m['components.timeRange.options.customRange']()}</DropdownItem>
		{#each timeRangeOptions as { name: optionName, timeRangeCalculator }, index (optionName)}
			<DropdownItem
				on:click={() => {
					({ from: timeRangeBegin, to: timeRangeEnd } = timeRangeCalculator(new Date()));
					selectedTimeRangeIndex = index;
				}}
			>
				{optionName}
			</DropdownItem>
		{/each}
	</Dropdown>

	<div class="inline-block min-w-[16rem] pr-6">
		<Datepicker
			range={true}
			bind:rangeFrom={timeRangeBegin}
			bind:rangeTo={timeRangeEnd}
			locale={getLocale()}
			on:select={() => {
				selectedTimeRangeIndex = -1;
			}}
		/>
	</div>
</div>
