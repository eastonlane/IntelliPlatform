<script lang="ts">
	import DateRangeBar from '$lib/components/DateRangeBar.svelte';
	import { m } from '$lib/paraglide/messages';
	import { type MetricsDO } from '@dal/schema/metrics';
	import { Alert, Button, Card, Chart, MultiSelect, WidgetPlaceholder } from 'flowbite-svelte';
	import type { ActionData, PageServerData } from './$types';

	let timeRangeBegin = $state(new Date());
	let timeRangeEnd = $state(new Date());

	let { data, form }: { form: ActionData; data: PageServerData } = $props();
	const deviceList = data.deviceList;

	let selectedDeviceIdList = $state<string[]>([]);

	type MetricsInSeriesType = {
		x: number | string | Date;
		y: number | null;
	};

	type SeriesType = {
		name: string;
		data: MetricsInSeriesType[];
	};

	let metricsList = $derived<MetricsDO[]>(form?.metricsList ?? []);

	let series = $derived<SeriesType[]>(
		Object.entries(
			metricsList.reduce<Record<string, MetricsInSeriesType[]>>((acc, item) => {
				if (!acc[item.name]) {
					acc[item.name] = [];
				}
				acc[item.name].push({
					x: item.time,
					y: Number(item.valueNumber)
				});
				return acc;
			}, {})
		).map(([name, metricsList]) => ({
			name: name,
			data: metricsList
		}))
	);

	let options: ApexCharts.ApexOptions = {
		chart: {
			height: '400px',
			type: 'line',
			fontFamily: 'Inter, sans-serif',
			dropShadow: {
				enabled: false
			},
			toolbar: {
				show: false
			}
		},
		tooltip: {
			enabled: true,
			x: {
				show: false
			}
		},
		dataLabels: {
			enabled: false
		},
		stroke: {
			width: 6,
			curve: 'smooth'
		},
		grid: {
			show: true,
			strokeDashArray: 4,
			padding: {
				left: 2,
				right: 2,
				top: -26
			}
		},
		// svelte-ignore state_referenced_locally
		series: series,
		legend: {
			show: false
		},
		xaxis: {
			// categories: ['01 Feb', '02 Feb', '03 Feb', '04 Feb', '05 Feb', '06 Feb', '07 Feb'],
			labels: {
				show: true,
				style: {
					fontFamily: 'Inter, sans-serif',
					cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
				}
			},
			axisBorder: {
				show: false
			},
			axisTicks: {
				show: false
			}
		},
		yaxis: {
			show: false
		}
	};
</script>

<div class="flex flex-col justify-start gap-8 px-4 py-4">
	<div>
		{#if form?.err}
			<Alert>
				<span class="red font-sans font-bold">
					{form.err}
				</span>
			</Alert>
		{/if}
	</div>

	<Card class="max-h-full max-w-full">
		<div class="flex flex-row flex-wrap justify-between p-6">
			<DateRangeBar timeRangeStart={timeRangeBegin} {timeRangeEnd} />

			<MultiSelect
				required
				class="min-w-[16rem]"
				placeholder={m['data.deviceSelectBar']()}
				items={deviceList.map((x) => ({ value: x.id, name: x.name }))}
				bind:value={selectedDeviceIdList}
			/>

			<form method="POST" action="?/getMetrics">
				<input type="hidden" name="rangeBegin" bind:value={timeRangeBegin} />
				<input type="hidden" name="rangeEnd" bind:value={timeRangeEnd} />
				{#each selectedDeviceIdList as deviceId, index (index)}
					<input type="hidden" name="deviceId" value={deviceId} />
				{/each}
				<Button disabled={!selectedDeviceIdList.length} type="submit"
					>{m['data.queryMetricsButton']()}</Button
				>
			</form>
		</div>

		<div class="px-8">
			{#if metricsList.length}
				<Chart {options} />
			{:else}
				<WidgetPlaceholder class="max-w-full" />
			{/if}
		</div>
	</Card>
</div>
