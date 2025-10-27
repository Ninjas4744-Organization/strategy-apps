import {observer} from "mobx-react-lite";
import {useGlobalSearchParams} from "expo-router";
import adminStore from "@/stores/adminStore";
import {FlatList} from "react-native";
import {DetailedGame} from "@/components/admin/detailed/DetailedGame";

export default observer(function () {
	const {id} = useGlobalSearchParams();
	const {teams} = adminStore;
	const team = teams[Number.parseInt(id as string)];

	return (
		<FlatList
			data={team.games}
			renderItem={({item}) => <DetailedGame game={item} />}
			keyExtractor={item => item.gameNumber}/>
	);
});
