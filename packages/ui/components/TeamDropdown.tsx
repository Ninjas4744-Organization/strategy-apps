import {NativeSelect} from "./NativeSelect";

type TeamDropdownProps = {
	teams: string[];
	onSelect: (team: string) => void;
	value: string | null;
	error: boolean;
	isAvailable?: (team: number) => boolean;
};

export const TeamDropdown = ({teams, onSelect, value, error, isAvailable}: TeamDropdownProps) => (
	<NativeSelect
		label="Team Number"
		value={value}
		valueLabel={value ? `Team ${value}` : undefined}
		placeholder="Select team"
		error={error}
		onSelect={onSelect}
		options={teams.map(team => {
			const number = team.replace("frc", "");

			return {
				label: `Team ${number}`,
				value: number,
				disabled: !!isAvailable && !isAvailable(parseInt(number)),
			};
		})}
	/>
);
