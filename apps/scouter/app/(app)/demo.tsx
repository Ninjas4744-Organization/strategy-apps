import {observer} from "mobx-react-lite";
import {Card, Row, IconContainer, Icon, Title, FlexGrow, useThemeBundle} from "@ninjas-strategy/ui";
import {Stack, useRouter} from "expo-router";
import {TouchableOpacity} from "react-native";
import userStore from "@/lib/stores/userStore";

export default observer(function DemoRouter() {
	const router = useRouter();
	const {signOut} = userStore;
	const {appTheme} = useThemeBundle();

	return <>
		<Stack.Screen
			options={{
				headerStyle: {backgroundColor: appTheme.surface},
				headerTintColor: appTheme.text,
				headerTitleStyle: {color: appTheme.text},
				contentStyle: {backgroundColor: appTheme.background},
				headerShown: true,
				title: 'The Ninja Scouter Demo',
				headerBackVisible: false,
			}}/>
		<TouchableOpacity onPress={() => router.push('/(app)/scouter')}>
			<Card>
				<Row>
					<IconContainer>
						<Icon name="list" size={32} />
					</IconContainer>
					<Title>Scouter View</Title>
					<FlexGrow />
					<Icon name="chevron-right" size={24} />
				</Row>
			</Card>
		</TouchableOpacity>
		<TouchableOpacity onPress={() => router.push('/(app)/admin')}>
			<Card>
				<Row>
					<IconContainer>
						<Icon name="analytics" size={32}/>
					</IconContainer>
					<Title>Admin View</Title>
					<FlexGrow/>
					<Icon name="chevron-right" size={24}/>
				</Row>
			</Card>
		</TouchableOpacity>
		<TouchableOpacity onPress={() => signOut().then(() => router.replace('/'))}>
			<Card>
				<Row>
					<IconContainer>
						<Icon name="logout" size={32}/>
					</IconContainer>
					<Title>Log Out</Title>
					<FlexGrow/>
					<Icon name="chevron-right" size={24}/>
				</Row>
			</Card>
		</TouchableOpacity>
	</>;
});
