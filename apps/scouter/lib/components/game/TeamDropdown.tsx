import {useMemo, useRef, useState} from "react";
import {Pressable, ScrollView, View, StyleSheet} from "react-native";
import {MD2Colors, Menu, Portal} from "react-native-paper";
import {TeamInfoInput} from "@/lib/components/game/TeamInfoInput";

type TeamDropdownProps = {
	teams: string[];
	onSelect: (team: string) => void;
	value: string | null;
	error: boolean;
};

export const TeamDropdown = ({teams, onSelect, value, error}: TeamDropdownProps) => {
	const [visible, setVisible] = useState(false);
	const anchorRef = useRef<View>(null);
	const [coordinates, setCoordinates] = useState({x: 0, y: 0});
	const editable = useMemo(() => !visible, [visible]);

	const openMenu = () => {
		requestAnimationFrame(() => {
			anchorRef.current?.measureInWindow((x, y, _, height) => {
				setCoordinates({x, y: y + height});
				setVisible(true);
			});
		});
	};

	return (
		<>
			<Pressable onPress={() => openMenu()}>
				<View ref={anchorRef} pointerEvents="box-only">
					<TeamInfoInput
						label="Team Number"
						onFocus={openMenu}
						showSoftInputOnFocus={false}
						editable={editable}
						value={value ? `Team ${value}` : 'Select team'}
						iconLeft="group"
						iconRight="arrow-drop-down"
						error={error}/>
				</View>
			</Pressable>
			<Portal>
				<Menu
					key={String(visible)}
					visible={visible}
					onDismiss={() => setVisible(false)}
					anchor={coordinates}
					contentStyle={{maxHeight: 300}}>
					<ScrollView style={{maxHeight: 300}}>
						{teams.map((team) => {
							const number = team.replace("frc", "");
							return (
								<Menu.Item
									key={team}
									title={`Team ${number}`}
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
