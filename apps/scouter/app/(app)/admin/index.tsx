import {HeaderButtons, Loading} from "@ninjas-strategy/ui";
import {observer} from "mobx-react-lite";
import {Stack, useRouter} from "expo-router";
import userStore from "@/lib/stores/userStore";
import eventsStore from "@/lib/stores/eventsStore";
import {UserType} from "@/lib/interfaces/UserType";
import {EventsList} from "@/lib/components/EventsList";
import {ScreenHeader} from "@/lib/components/ScreenHeader";

export default observer(function AdminIndex() {
	const {events, isLoading} = eventsStore;
	const router = useRouter();
	const {signOut, userData} = userStore;

	if (isLoading)
		return <Loading />;

	return (
		<>
			<Stack.Screen options={{headerShown: false}}/>
			<ScreenHeader
				title="Events"
				right={<HeaderButtons
					buttons={[
						userData?.type === UserType.APP_ADMIN && {onPress: () => router.push('/admin/addEvent'), icon: 'add'},
						userData?.type === UserType.APP_ADMIN && {onPress: () => router.push('/admin/registrationCodes'), icon: 'person-add'},
						{onPress: () => signOut().then(() => router.replace('/')), icon: 'logout'},
					]} />} />
			{events && <EventsList
				events={Object.values(events)}
				onSelect={id => {
					if (!id || id === 'undefined') return;
					router.push(`/admin/${id}`);
				}} />}
		</>
	);
});
