import styled from "styled-components/native";
import adminStore from "@/lib/stores/adminStore";
import {Icon, Loading, showSnackbar, Row, BeautifulButton} from "@ninjas-strategy/ui";
import {ScrollView, Text as RNText} from "react-native";
import {observer} from "mobx-react-lite";
import {Stack} from "expo-router";
import {DashboardHeaderButtons} from "@/lib/components/admin/DashboardHeaderButtons";
import {Button, Dialog, MD2Colors} from "react-native-paper";
import {EventItem} from "@/lib/components/admin/EventItem";

const IconsRow = styled.View`
	display: flex;
	flex-direction: row;
	margin: 8px;
`;

export default observer(function AdminIndex() {
	const {isLoading, events, updateRegistrationSetting, showAppSettings, setShowAppSettings} = adminStore;

	if (isLoading)
		return <Loading />;

	return <>
		<ScrollView>
			<Stack.Screen options={{title: 'Events', headerRight: () => <DashboardHeaderButtons />}}/>
			{Object.values(events).map((event) => (
				<EventItem key={event.id} id={event.id} year={event.year} />
			))}
		</ScrollView>
		<Dialog visible={showAppSettings} onDismiss={() => setShowAppSettings(false)}>
			<Dialog.Title>App Settings</Dialog.Title>
			<Dialog.Content>
				<RNText style={{marginBottom: 16}}>Allow new users to register for the app?</RNText>
				<Row>
					<Button mode="elevated" buttonColor={MD2Colors.green500} onPress={async () => {
						await updateRegistrationSetting(true);
						setShowAppSettings(false);
						showSnackbar('Registration enabled! New users can now register.');
					}}>
						Enable
					</Button>
					<Button mode="elevated" buttonColor={MD2Colors.orange500} onPress={async () => {
						await updateRegistrationSetting(false);
						setShowAppSettings(false);
						showSnackbar('Registration disabled! New users cannot register.');
					}}>
						Disable
					</Button>
				</Row>
			</Dialog.Content>
		</Dialog>
	</>;
});
