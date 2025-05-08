<script lang="ts">
	import DateRangeBar from '$lib/components/DateRangeBar.svelte';
	import { type MetricsDO } from '@dal/schema/metrics';
	import { Card, Chart } from 'flowbite-svelte';

	let timeRangeStart = $state(new Date());
	let timeRangeEnd = $state(new Date());

	type MetricsInSeriesType = {
		x: number | string | Date;
		y: number | null;
	};

	type SeriesType = {
		name: string;
		data: MetricsInSeriesType[];
	};

	const mockData = [
		{
			time: new Date('2025-05-08T08:00:00Z'),
			name: 'temperature',
			valueNumber: '22.3',
			valueBool: null,
			deviceId: 'device-123',
			tagList: [{ name: 'unit', value: 'celsius' }],
			fieldList: [{ name: 'location', value: 'lab-1' }]
		},
		{
			time: new Date('2025-05-08T08:05:00Z'),
			name: 'temperature',
			valueNumber: '23.1',
			valueBool: null,
			deviceId: 'device-123',
			tagList: [{ name: 'unit', value: 'celsius' }],
			fieldList: [{ name: 'location', value: 'lab-1' }]
		},
		{
			time: new Date('2025-05-08T08:10:00Z'),
			name: 'temperature',
			valueNumber: '24.0',
			valueBool: null,
			deviceId: 'device-123',
			tagList: [{ name: 'unit', value: 'celsius' }],
			fieldList: [{ name: 'location', value: 'lab-1' }]
		},
		{
			time: new Date('2025-05-08T08:00:00Z'),
			name: 'door_open',
			valueNumber: null,
			valueBool: true,
			deviceId: 'device-456',
			tagList: [{ name: 'zone', value: 'A' }],
			fieldList: null
		},
		{
			time: new Date('2025-05-08T08:01:00Z'),
			name: 'door_open',
			valueNumber: null,
			valueBool: false,
			deviceId: 'device-456',
			tagList: [{ name: 'zone', value: 'A' }],
			fieldList: null
		},
		{
			time: new Date('2025-05-08T08:10:00Z'),
			name: 'humidity',
			valueNumber: '45.6',
			valueBool: null,
			deviceId: 'device-123',
			tagList: [{ name: 'unit', value: '%' }],
			fieldList: [{ name: 'sensor', value: 'BME280' }]
		},
		{
			time: new Date('2025-05-08T08:15:00Z'),
			name: 'humidity',
			valueNumber: '47.2',
			valueBool: null,
			deviceId: 'device-123',
			tagList: [{ name: 'unit', value: '%' }],
			fieldList: [{ name: 'sensor', value: 'BME280' }]
		},
		{
			time: new Date('2025-05-08T08:20:00Z'),
			name: 'humidity',
			valueNumber: '46.5',
			valueBool: null,
			deviceId: 'device-123',
			tagList: [{ name: 'unit', value: '%' }],
			fieldList: [{ name: 'sensor', value: 'BME280' }]
		}
	];

	let metricsList = $state<MetricsDO[]>(mockData);

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
			categories: ['01 Feb', '02 Feb', '03 Feb', '04 Feb', '05 Feb', '06 Feb', '07 Feb'],
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

<div class="px-4 py-4">
	<Card>
		<div>
			<DateRangeBar {timeRangeStart} {timeRangeEnd} />
		</div>
		<Chart {options} />
	</Card>
</div>
