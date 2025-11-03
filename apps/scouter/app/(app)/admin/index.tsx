import adminStore from "@/lib/stores/adminStore";
import {Loading, showSnackbar, Row, HeaderButtons} from "@ninjas-strategy/ui";
import {ScrollView, Text as RNText} from "react-native";
import {observer} from "mobx-react-lite";
import {Stack, useRouter} from "expo-router";
import {Button, Dialog, MD2Colors} from "react-native-paper";
import {EventItem} from "@/lib/components/admin/EventItem";
import {useAuth} from "@/lib/context/auth";

export default observer(function AdminIndex() {
	const {isLoading, events, updateRegistrationSetting, showAppSettings, setShowAppSettings, loadEvents} = adminStore;
	const router = useRouter();
	const {signOut} = useAuth();

	if (isLoading)
		return <Loading />;

	return <>
		<ScrollView>
			<Stack.Screen
				options={{
					headerShown: true,
					title: 'Events',
					headerRight: () => (
						<HeaderButtons buttons={[
							{onPress: () => loadEvents(), icon: 'refresh'},
							{onPress: () => router.push('/admin/addEvent'), icon: 'add'},
							{onPress: () => signOut().then(() => router.push('/')), icon: 'logout'},
						]} />
					)}}/>
			{Object.values(events).map((event) => (
				<EventItem key={event.id} {...event} />
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
