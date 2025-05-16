<script lang="ts">
	import { isNotNullValue } from '$lib/helper/typeHelper';
	import { m } from '$lib/paraglide/messages';
	import { DeviceActionDataType, type DeviceActionDO } from '@dal/schema/command';
	import {
		Button,
		Checkbox,
		CloseButton,
		Drawer,
		FloatingLabelInput,
		Helper,
		Input,
		Select,
		Textarea
	} from 'flowbite-svelte';
	import { CheckOutline, CircleMinusOutline, CirclePlusOutline } from 'flowbite-svelte-icons';
	import toast from 'svelte-french-toast';

	const partitionContainerClass =
		'border-brown relative box-border flex flex-col gap-6 rounded-xl border-2 p-4 pt-6';
	const partiionTitleClass =
		'absolute left-1/2 top-[-10px] -translate-x-1/2 transform rounded-full bg-white px-2 py-1 text-xs font-bold text-black shadow-sm';

	let actionName = $state('');
	let description = $state('');
	let selectedDataType = $state<DeviceActionDataType>();
	let keyName = $state('');
	let isRequired = $state(false);

	let minValue = $state<number>();
	let maxValue = $state<number>();

	let minLength = $state<number>(0);
	let maxLength = $state<number>(16);

	let enumList = $state<string[]>([]);
	let addingEnum = $state(false);
	let newEnumValue = $state('');

	let defaultValue = $state<string | boolean | Number | null>();

	interface Property {
		addActionStatus: boolean;
		handleAdd: (deviceAction: DeviceActionDO) => void;
	}

	let { addActionStatus = $bindable<boolean>(), handleAdd }: Property = $props();

	type ErrorSourceType = 'EnumListEmpty';
	let validationErrors = $state<{ source: ErrorSourceType; msg: string }[]>([]);

	function onConfirmAddingAction() {
		const actionToAdd: DeviceActionDO = {
			id: '',
			name: actionName,
			description: description,
			key: keyName,
			type: 'string',
			required: isRequired
		};

		switch (selectedDataType) {
			case DeviceActionDataType.boolean:
				if (typeof defaultValue === 'boolean') {
					actionToAdd.defaultValue = defaultValue.toString();
				} else {
					actionToAdd.defaultValue = null;
				}
				actionToAdd.type = 'boolean';
				break;

			case DeviceActionDataType.int:
				if (
					(isNotNullValue(minValue) && !Number.isInteger(minValue)) ||
					(isNotNullValue(maxValue) && !Number.isInteger(maxValue))
				) {
					throw new Error('Min and max values must be integers.');
				}

			case DeviceActionDataType.float:
				if (
					typeof defaultValue === 'number' &&
					typeof minValue === 'number' &&
					defaultValue < minValue
				) {
					throw new Error('Default value must be greater than or equal to min value.');
				}

				if (
					typeof defaultValue === 'number' &&
					typeof maxValue === 'number' &&
					defaultValue > maxValue
				) {
					throw new Error('Default value must be less than or equal to max value.');
				}
				actionToAdd.type = 'number';
				actionToAdd.minValue = minValue?.toString();
				actionToAdd.maxValue = maxValue?.toString();
				actionToAdd.defaultValue = defaultValue?.toString();
				break;

			case DeviceActionDataType.enum:
				if (!enumList?.length) {
					validationErrors.push({
						source: 'EnumListEmpty',
						msg: 'This List cannot be empty'
					});
					return;
				}
				if (typeof defaultValue === 'string' && !enumList.includes(defaultValue)) {
					throw new Error('Default value must be one of the enum values.');
				}

				actionToAdd.type = 'enum';
				actionToAdd.enumList = enumList;
				actionToAdd.defaultValue = defaultValue as string;
				break;

			case DeviceActionDataType.string:
				if (minLength > maxLength) {
					throw new Error('Min length must be less than or equal to max length.');
				}
				if (
					typeof defaultValue === 'string' &&
					(defaultValue.length < minLength || defaultValue.length > maxLength)
				) {
					throw new Error('Default value length must be within the specified range.');
				}

				actionToAdd.type = 'string';
				actionToAdd.minLength = minLength;
				actionToAdd.maxLength = maxLength;
				actionToAdd.defaultValue = defaultValue as string;
				break;

			default:
				throw new Error('Invalid data type.');
		}

		if (!actionToAdd) {
			throw new Error('Failed to create action.');
		}

		handleAdd(actionToAdd);
	}
</script>

<Drawer hidden={false} placement="right" activateClickOutside={false} width="w-1/2">
	<class class="flex items-center justify-around">
		<h5
			id="drawer-label"
			class="mb-6 inline-flex items-center text-base font-semibold uppercase text-gray-500 dark:text-gray-400"
		>
			{m['command.newActionDrawer.title']()}
		</h5>
		<CloseButton
			on:click={() => {
				addActionStatus = false;
			}}
			class="mb-4 dark:text-white"
		/>
	</class>
	<form class="flex min-h-full flex-col gap-12" onsubmit={onConfirmAddingAction}>
		<div class={partitionContainerClass}>
			<div class={partiionTitleClass}>
				{m['command.newActionDrawer.partitionTitles.basic']()}
			</div>
			<FloatingLabelInput type="text" bind:value={actionName} minlength={1} maxlength={64} required>
				{m['command.newActionDrawer.actionNameInput']()}
			</FloatingLabelInput>
			<Textarea
				maxlength={256}
				bind:value={description}
				placeholder={m['command.newActionDrawer.descriptinTextAreaPlaceholder']()}
			/>
		</div>

		<div class={partitionContainerClass}>
			<div class={partiionTitleClass}>
				{m['command.newActionDrawer.partitionTitles.property']()}
			</div>
			<FloatingLabelInput type="text" bind:value={keyName} maxlength={16} required>
				{m['command.newActionDrawer.keyNameInputPlaceholder']()}
			</FloatingLabelInput>

			<Select
				items={Object.values(DeviceActionDataType).map((dataType) => ({
					value: dataType.toString(),
					name: dataType.toString()
				}))}
				bind:value={selectedDataType}
				on:change={() => {
					minValue = undefined;
					maxValue = undefined;
					defaultValue = null;
				}}
				placeholder={m['command.newActionDrawer.dataTypeSelectorPlaceholder']()}
				required
			></Select>

			<Checkbox bind:checked={isRequired}>
				{m['command.newActionDrawer.isRequireeCheckbox']()}
			</Checkbox>

			{#if selectedDataType === DeviceActionDataType.boolean}
				<Select
					items={[
						{ name: 'true', value: true },
						{ name: 'false', value: false }
					]}
					bind:value={defaultValue as boolean}
					placeholder={m['command.newActionDrawer.defaultValueInputPlaceholder']()}
				/>
			{:else if selectedDataType === DeviceActionDataType.enum}
				<div class="flex flex-col gap-2">
					<div id="enum-list-division" class={partitionContainerClass + ' relative'}>
						<div class={partiionTitleClass}>Enum List</div>

						<div class="absolute right-4 top-[-18px] flex flex-row justify-end">
							<Button
								disabled={addingEnum}
								color="blue"
								size="xs"
								on:click={() => (addingEnum = true)}
								><CirclePlusOutline />
							</Button>
						</div>

						{#each enumList as _, index (index)}
							<div class="flex items-center gap-2">
								<Input type="text" bind:value={enumList[index]} class="flex-1" />
								<Button
									color="red"
									size="xs"
									on:click={() => {
										enumList = enumList.filter((x) => x != enumList[index]);
									}}
								>
									<CircleMinusOutline />
								</Button>
							</div>
						{:else}
							<Helper color="red" class="font-extrabold font-normal"
								>{m['command.newActionDrawer.warningForEnumList']()}</Helper
							>
						{/each}
						{#if validationErrors.find((x) => x.source === 'EnumListEmpty')}{/if}

						{#if addingEnum}
							<div class="flex items-center gap-2">
								<Input type="text" bind:value={newEnumValue} class="flex-1" />
								<Button
									size="xs"
									color="dark"
									on:click={() => {
										newEnumValue = '';
										addingEnum = false;
									}}
								>
									<CircleMinusOutline />
								</Button>
								<Button
									size="xs"
									color="green"
									disabled={!!enumList.find((x) => x === newEnumValue)}
									on:click={() => {
										enumList = [...enumList, newEnumValue];
										validationErrors = validationErrors.filter((x) => x.source !== 'EnumListEmpty');
										newEnumValue = '';
										addingEnum = false;
									}}
								>
									<CheckOutline />
								</Button>
							</div>
						{/if}
					</div>
				</div>

				<Select
					disabled={!enumList.length}
					items={enumList.map((x) => ({ name: x.toString(), value: x.toString() }))}
					bind:value={defaultValue}
					placeholder={m['command.newActionDrawer.defaultValueInputPlaceholder']()}
				></Select>
			{:else if selectedDataType === DeviceActionDataType.string}
				<Input
					type="number"
					min="0"
					max="15"
					clearable
					bind:value={minLength}
					placeholder={m['command.newActionDrawer.stringTypeMinLength']()}
				/>

				<Input
					type="number"
					min="1"
					max="16"
					bind:value={maxLength}
					placeholder={m['command.newActionDrawer.stringTypeMaxLength']()}
				/>

				<Input
					type="text"
					bind:value={defaultValue as string}
					maxlength={maxLength}
					minlength={minLength}
					placeholder={m['command.newActionDrawer.defaultValueInputPlaceholder']()}
				/>
			{:else if selectedDataType === DeviceActionDataType.int || selectedDataType === DeviceActionDataType.float}
				<Input
					type="number"
					bind:value={minValue}
					step={selectedDataType === DeviceActionDataType.int ? 1 : 0.01}
					clearable
					placeholder={m['command.newActionDrawer.numberTypeMinValue']()}
				/>

				<Input
					type="number"
					bind:value={maxValue}
					step={selectedDataType === DeviceActionDataType.int ? 1 : 0.01}
					clearable
					placeholder={m['command.newActionDrawer.numberTypeMaxValue']()}
				/>

				<Input
					type="number"
					step={selectedDataType === DeviceActionDataType.int ? 1 : 0.01}
					bind:value={defaultValue as number}
					bind:min={minValue}
					bind:max={maxValue}
					clearable
					placeholder={m['command.newActionDrawer.defaultValueInputPlaceholder']()}
				/>
			{/if}
		</div>

		<div class={partitionContainerClass}>
			<div class={partiionTitleClass}>
				{m['command.newActionDrawer.partitionTitles.actions']()}
			</div>

			<Button type="submit">
				{m['command.newActionDrawer.addNewActionButton']()}
			</Button>
		</div>
	</form>
</Drawer>
