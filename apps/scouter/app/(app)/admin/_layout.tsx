import {Stack} from 'expo-router';
import {observer} from "mobx-react-lite";
import adminStore from "@/lib/stores/adminStore";
import {Loading, StackWrapper} from "@ninjas-strategy/ui";
import {useEffect} from "react";

export default observer(function AdminLayout() {
	const {isLoading, loadEvents, loaded} = adminStore;

	useEffect(() => {
		if (!loaded)
			loadEvents();
	}, []);

	if (isLoading)
		return <Loading />;

	return <StackWrapper>
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: {backgroundColor: 'transparent'},
			}}/>
	</StackWrapper>;
});
