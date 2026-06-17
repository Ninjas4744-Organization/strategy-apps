import {Redirect, Stack, useGlobalSearchParams} from 'expo-router';
import {Header} from "@/lib/components/game/Header";
import {Loading, StackWrapper, useThemeBundle} from "@ninjas-strategy/ui";
import {observer} from "mobx-react-lite";
import eventsStore from "@/lib/stores/eventsStore";

export default observer(function GameLayout() {
	const {eventId} = useGlobalSearchParams();
	const eventIdString = Array.isArray(eventId) ? eventId[0] : eventId;
	const {events, isLoading} = eventsStore;
	const event = eventIdString ? events[eventIdString] : undefined;
	const {appTheme} = useThemeBundle();

	if (!eventIdString || eventIdString === 'undefined') {
		return <Redirect href="/(app)/scouter" />;
	}

	if (!event && !isLoading) {
		return <Redirect href="/(app)/scouter" />;
	}

	if (!event) {
		return <Loading />;
	}

	return <StackWrapper>
		<Stack
			screenOptions={{
				header: ({route}) => <Header route={route} />,
				contentStyle: {backgroundColor: appTheme.background},
				headerBlurEffect: 'light',
				gestureEnabled: false,
			}}
		/>
	</StackWrapper>;
});
