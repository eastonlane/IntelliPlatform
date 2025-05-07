<script lang="ts">
	import DateRangeBar from '$lib/components/DateRangeBar.svelte';
	import { type MetricsDO } from '@dal/schema/metrics';
	import { metrics } from 'DAL/scheme';
	import { Card, Chart } from 'flowbite-svelte';
	import colors from 'tailwindcss/colors';

	let timeRangeStart = $state(new Date());
	let timeRangeEnd = $state(new Date());

	let metricsList = $props<MetricsDO[]>();

    let series = $derived(
			Array.prototype
				.reduce((acc, item) => {
					const key = item.name;
					if (!acc[key]) {
						acc[key] = [];
					}

					acc[key].push(item);
					return acc;
				}, {})
				.map()
		)

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
		series: series,
		// [
		// 	{
		// 		name: 'Clicks',
		// 		data: [6500, 6418, 6456, 6526, 6356, 6456],
		// 		color: '#1A56DB'
		// 	},
		// 	{
		// 		name: 'CPC',
		// 		data: [6456, 6356, 6526, 6332, 6418, 6500],
		// 		color: '#7E3AF2'
		// 	}
		// ],
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
