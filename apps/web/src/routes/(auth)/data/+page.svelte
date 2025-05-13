<script lang="ts">
	import DateRangeBar from '$lib/components/DateRangeBar.svelte';
	import { m } from '$lib/paraglide/messages';
	import { type MetricsDO } from '@dal/schema/metrics';
	import { Button, Card, Chart, MultiSelect, WidgetPlaceholder } from 'flowbite-svelte';
	import fetchWrapper from '../../../request';
	import toast, { Toaster } from 'svelte-french-toast';

	let timeRangeBegin = $state(new Date());
	let timeRangeEnd = $state(new Date());

	let { data } = $props();

	let selectedDeviceIdList = $state<string[]>([]);

	type MetricsInSeriesType = {
		x: number | string | Date;
		y: number | null;
	};

	type SeriesType = {
		name: string;
		data: MetricsInSeriesType[];
	};

	let metricsList = $state<MetricsDO[]>([]);

	function getMetrics() {
		const queryParam = new URLSearchParams();
		queryParam.append('rangeBegin', timeRangeBegin.toString());
		queryParam.append('rangeEnd', timeRangeEnd.toString());
		selectedDeviceIdList.forEach((deviceId) => {
			queryParam.append('deviceId', deviceId);
		});
		fetchWrapper(`/api/data?${queryParam.toString()}`)
			.then((resp) => {
				const metricsFetched = resp.metricsList;
				if (!metricsFetched?.length) {
					toast.error(m['data.noMetricsFound']());
					return;
				}

				metricsList = metricsFetched;
			})
			.catch((err) => {
				toast.error(err);
			});
	}

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

	let options: ApexCharts.ApexOptions = $derived({
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
	});
</script>

<div class="flex flex-col justify-start gap-8 px-4 py-4">
	<Toaster />

	<Card class="max-h-full max-w-full">
		<div class="flex flex-row flex-wrap justify-between p-6">
			<DateRangeBar bind:timeRangeBegin bind:timeRangeEnd />

			{#await data.getDeviceList then deviceList}
				<MultiSelect
					required
					class="min-w-[16rem]"
					placeholder={m['data.deviceSelectBar']()}
					items={deviceList.map((x) => ({ value: x.id, name: x.name }))}
					bind:value={selectedDeviceIdList}
				/>
			{/await}

			<Button disabled={!selectedDeviceIdList.length} on:click={getMetrics}
				>{m['data.queryMetricsButton']()}</Button
			>
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
