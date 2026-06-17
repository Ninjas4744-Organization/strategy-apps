import {useRef, useState} from "react";
import {ScrollView, TouchableOpacity, View} from "react-native";
import styled from "styled-components/native";
import {BasicInput} from "./BasicInput";
import {Text} from "../styles/Text";

type TeamDropdownProps = {
	teams: string[];
	onSelect: (team: string) => void;
	value: string | null;
	error: boolean;
	isAvailable?: (team: number) => boolean;
};

export const TeamDropdown = ({teams, onSelect, value, error, isAvailable}: TeamDropdownProps) => {
	const [visible, setVisible] = useState(false);
	const anchorRef = useRef<View>(null);
	const [inputWidth, setInputWidth] = useState(0);

	const openMenu = () => {
		setVisible(true);
	};

	return (
		<>
			<TouchableOpacity onPress={() => openMenu()}>
				<View ref={anchorRef} pointerEvents="none">
					<BasicInput
						style={{ width: "100%", minWidth: 1 }}
						multiline={false}
						numberOfLines={1}
						label="Team Number"
						editable={false}
						value={value ? `Team ${value}` : "Select team"}
						iconRight="arrow-drop-down"
						error={error}
						onLayout={event => setInputWidth(event.nativeEvent.layout.width)} />
				</View>
			</TouchableOpacity>
			{visible ? (
				<DropdownPanel style={{width: inputWidth || undefined}}>
					<ScrollView style={{maxHeight: 300}} keyboardShouldPersistTaps="handled">
						{teams.map((team) => {
							const number = team.replace("frc", "");
							const disabled = !!isAvailable && !isAvailable(parseInt(number));
							return (
								<DropdownItem
									key={team}
									disabled={disabled}
									$disabled={disabled}
									onPress={() => {
										onSelect(number);
										setVisible(false);
									}}>
									<Text>Team {number}</Text>
								</DropdownItem>
							);
						})}
					</ScrollView>
				</DropdownPanel>
			) : null}
		</>
	);
};

const DropdownPanel = styled.View`
	margin-top: 6px;
	max-height: 300px;
	border-radius: 12px;
	background-color: ${({theme}) => theme.card};
	border: 1px solid ${({theme}) => theme.border};
	overflow: hidden;
`;

const DropdownItem = styled.Pressable<{ $disabled: boolean }>`
	padding: 12px 14px;
	opacity: ${({$disabled}) => $disabled ? 0.45 : 1};
	border-bottom-width: 1px;
	border-bottom-color: ${({theme}) => theme.border};
`;
