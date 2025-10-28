import {observer} from "mobx-react-lite";
import {useGlobalSearchParams} from "expo-router";
import adminStore from "@/lib/stores/adminStore";
import {FlatList} from "react-native";
import {DetailedGame} from "@/lib/components/admin/detailed/DetailedGame";
import {FocusWrapper} from "@/lib/components/styles/misc";

export default observer(function () {
	const {id} = useGlobalSearchParams();
	const {teams} = adminStore;
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
