import {Loading, HeaderButtons} from "@ninjas-strategy/ui";
import {ScrollView} from "react-native";
import {observer} from "mobx-react-lite";
import {Stack, useRouter} from "expo-router";
import {EventItem} from "@/lib/components/admin/EventItem";
import userStore from "@/lib/stores/userStore";
import eventsStore from "@/lib/stores/eventsStore";

export default observer(function AdminIndex() {
	const {events, isLoading} = eventsStore;
	const router = useRouter();
	const {signOut} = userStore;

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
							{onPress: () => router.push('/admin/addEvent'), icon: 'add'},
							{onPress: () => router.push('/admin/registrationCodes'), icon: 'person-add'},
							{onPress: () => signOut().then(() => router.push('/')), icon: 'logout'},
						]} />
					)}}/>
			{events && Object.values(events).map((event) => (
				<EventItem key={event.id} {...event} />
			))}
		</ScrollView>
	);
});
