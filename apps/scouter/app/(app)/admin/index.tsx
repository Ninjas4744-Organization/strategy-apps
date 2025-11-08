import adminStore from "@/lib/stores/adminStore";
import {Loading, showSnackbar, Row, HeaderButtons} from "@ninjas-strategy/ui";
import {ScrollView, Text as RNText} from "react-native";
import {observer} from "mobx-react-lite";
import {Stack, useRouter} from "expo-router";
import {Button, Dialog, MD2Colors} from "react-native-paper";
import {EventItem} from "@/lib/components/admin/EventItem";
import {useAuth} from "@/lib/context/auth";

export default observer(function AdminIndex() {
	const {isLoading, events, loadEvents} = adminStore;
	const router = useRouter();
	const {signOut} = useAuth();

	if (isLoading)
		return <Loading />;

	return (
		<ScrollView>
			<Stack.Screen
				options={{
					headerShown: true,
					title: 'Events',
					headerRight: () => (
						<HeaderButtons buttons={[
							{onPress: () => loadEvents(), icon: 'refresh'},
							{onPress: () => router.push('/admin/addEvent'), icon: 'add'},
							{onPress: () => router.push('/admin/registrationCodes'), icon: 'person-add'},
							{onPress: () => signOut().then(() => router.push('/')), icon: 'logout'},
						]} />
					)}}/>
			{Object.values(events).map((event) => (
				<EventItem key={event.id} {...event} />
			))}
		</ScrollView>
	);
});
