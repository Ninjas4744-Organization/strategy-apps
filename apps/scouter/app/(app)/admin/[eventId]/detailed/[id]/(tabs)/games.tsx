import {observer} from "mobx-react-lite";
import {useGlobalSearchParams} from "expo-router";
import {FlatList} from "react-native";
import {DetailedGame} from "@/lib/components/admin/detailed/DetailedGame";
import {FocusWrapper} from "@ninjas-strategy/ui/styles/misc";
import {useContext} from "react";
import {EventContext, EventStore} from "@/lib/stores/eventStore";

export default observer(function () {
	const {id} = useGlobalSearchParams();
	const {teams} = useContext(EventContext) as EventStore;
	const team = teams[Number.parseInt(id as string)];

	if (!team)
		return null;

	return (
		<FocusWrapper>
			<FlatList
				data={team.games}
				renderItem={({item}) => <DetailedGame game={item} />}
				keyExtractor={item => item.gameNumber}/>
		</FocusWrapper>
	);
});
