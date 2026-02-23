import {useRef, useState} from "react";
import {Platform, ScrollView, TouchableOpacity, View} from "react-native";
import {Menu, Portal} from "react-native-paper";
import {BasicInput} from "./BasicInput";

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
	const [coordinates, setCoordinates] = useState({x: 0, y: 0});

	const openMenu = () => {
		requestAnimationFrame(() => {
			anchorRef.current?.measureInWindow((x, y, _, height) => {
				let coorY = y + height;
				if (Platform.OS === 'android')
					coorY += 25;
				setCoordinates({x, y: coorY});
				setVisible(true);
			});
		});
	};

	return (
		<>
			<TouchableOpacity onPress={() => openMenu()}>
				<View ref={anchorRef} pointerEvents="box-none">
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
			<Portal>
				<Menu
					key={String(visible)}
					visible={visible}
					onDismiss={() => setVisible(false)}
					anchor={coordinates}
					contentStyle={{maxHeight: 300, width: inputWidth}}>
					<ScrollView style={{maxHeight: 300}}>
						{teams.map((team) => {
							const number = team.replace("frc", "");
							return (
								<Menu.Item
									key={team}
									title={`Team ${number}`}
									disabled={isAvailable && !isAvailable(parseInt(number))}
									onPress={() => {
										onSelect(number);
										setVisible(false);
									}}/>
							);
						})}
					</ScrollView>
				</Menu>
			</Portal>
		</>
	);
};
