import styled from "styled-components/native";
import {useState} from "react";
import {ScrollView} from "react-native";
import {BodyScroll} from "../styles/misc";
import {MD2Colors} from "react-native-paper";

type Tab = {
	label: string;
	render: React.ReactNode;
};

type TabsProps = {
	tabs: {
		[value: string]: Tab
	};
};

const TabContainer = styled.View`
	flex-direction: row;
	height: 44px;
	margin: 16px;
`;

const TabButton = styled.TouchableOpacity<{ active: boolean }>`
	flex: 1;
	margin-right: 8px;
	padding: 8px;
	align-items: center;
	justify-content: center;
	background-color: ${MD2Colors.white}${({ active }) => (active ? '' : "10")};
	border-radius: 20px;
	border: ${MD2Colors.white}20;
`;

const TabText = styled.Text<{ active: boolean }>`
	color: ${props => props.active ? MD2Colors.black : MD2Colors.white};
	font-weight: 600;
`;

export const Tabs = ({tabs}: TabsProps) => {
	const [tab, setTab] = useState(Object.keys(tabs)[0]);

	return (
		<>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={{
					height: 44,
					flexGrow: 0,
					flexShrink: 0,
				}}
				contentContainerStyle={{
					alignItems: 'center',
				}}>
				<TabContainer>
					{Object.entries(tabs).map(([value, t]) => (
						<TabButton
							key={`tab-${value}`}
							active={tab === value}
							onPress={() => setTab(value)}>
							<TabText active={tab === value}>{t.label}</TabText>
						</TabButton>
					))}
				</TabContainer>
			</ScrollView>
			<BodyScroll>
				{tabs[tab].render}
			</BodyScroll>
		</>
	);
};
