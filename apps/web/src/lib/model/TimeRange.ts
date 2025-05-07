export interface ITimeRange {
	name: string;
	timeRangeCalculator: (now: Date) => { from: Date; to: Date };
}
