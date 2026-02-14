import {HeaderButtons, Loading} from "@ninjas-strategy/ui";
import {ScrollView} from "react-native";
import {observer} from "mobx-react-lite";
import {Stack, useRouter} from "expo-router";
import {EventItem} from "@/lib/components/EventItem";
import userStore from "@/lib/stores/userStore";
import eventsStore from "@/lib/stores/eventsStore";
import {UserType} from "@/lib/interfaces/UserType";
import {EventsList} from "@/lib/components/EventsList";

export default observer(function AdminIndex() {
	const {events, isLoading} = eventsStore;
	const router = useRouter();
	const {signOut, userData} = userStore;

	if (isLoading)
		return <Loading />;

	return (
		<>
			<Stack.Screen
				options={{
					headerShown: true,
					title: 'Events',
					headerRight: () => (
						<HeaderButtons
							buttons={[
								userData?.type === UserType.APP_ADMIN && {onPress: () => router.push('/admin/addEvent'), icon: 'add'},
								userData?.type === UserType.APP_ADMIN && {onPress: () => router.push('/admin/registrationCodes'), icon: 'person-add'},
								{onPress: () => signOut().then(() => router.push('/')), icon: 'logout'},
							]} />
					)}}/>
			{events && <EventsList events={Object.values(events)} onSelect={id => router.push(`/admin/${id}`)} />}
		</>
	);
});
