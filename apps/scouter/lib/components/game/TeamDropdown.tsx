import {ReactNode, useRef} from "react";
import {ScrollView, TouchableWithoutFeedback, View} from "react-native";
import {Menu} from "react-native-paper";

type TeamDropdownProps = {
	teams: string[];
	visible: boolean;
	setVisible: (visible: boolean) => void;
	onSelect: (team: string) => void;
	children: ReactNode;
};

export const TeamDropdown = ({teams, visible, setVisible, onSelect, children}: TeamDropdownProps) => {
	return (
		<View>
			<Menu
				key={String(visible)}
				visible={visible}
				onDismiss={() => setVisible(false)}
				anchor={
					<View
						onStartShouldSetResponder={() => true}
						onResponderGrant={() => setVisible(true)}
						onTouchEnd={e => e.stopPropagation()}
						style={{flex: 1}}>
						{children}
					</View>
				}
				contentStyle={{ maxHeight: 300 }}>
				<ScrollView style={{ maxHeight: 300 }}>
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
		</View>
	);
}
