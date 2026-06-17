import {observer} from "mobx-react-lite";
import {Card, Row, IconContainer, Icon, Title, FlexGrow} from "@ninjas-strategy/ui";
import {Stack, useRouter} from "expo-router";
import {TouchableOpacity} from "react-native";
import userStore from "@/lib/stores/userStore";
import {MD2Colors} from "react-native-paper";

export default observer(function DemoRouter() {
	const router = useRouter();
	const {signOut} = userStore;

	return <>
		<Stack.Screen
			options={{
				headerStyle: {backgroundColor: MD2Colors.indigo900},
				headerTintColor: MD2Colors.white,
				contentStyle: {backgroundColor: 'transparent'},
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
