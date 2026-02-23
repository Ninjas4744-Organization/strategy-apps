import {observer} from "mobx-react-lite";
import {Card, FormDialog, Row, IconContainer, Icon, Title, FlexGrow} from "@ninjas-strategy/ui";
import {Portal} from "react-native-paper";
import {useState} from "react";
import gameStore from "@/lib/stores/gameStore";
import eventsStore from "@/lib/stores/eventsStore";
import {Href, useGlobalSearchParams, useRouter} from "expo-router";
import {TouchableOpacity} from "react-native";
import {games} from "@ninjas-strategy/frc-games";
import pitStore from "@/lib/stores/pitStore";

type GameInputFormData = {
	teamNumber: string;
	gameNumber: string;
};

type PitInputFormData = {
	teamNumber: string;
}

export default observer(function ScouterIndex() {
	const router = useRouter();
	const {eventId} = useGlobalSearchParams();
	const {startGame} = gameStore;
	const {startPit} = pitStore;
	const [showGameDialog, setShowGameDialog] = useState<boolean>(false);
	const [showPitDialog, setShowPitDialog] = useState<boolean>(false);

	const event = eventsStore.events[eventId as string];

	const scoutGame = (data: GameInputFormData) => {
		startGame(data.teamNumber, data.gameNumber, event?.year!);
		setShowGameDialog(false);
		router.push(`/scouter/${eventId}/game/0`);
	};

	const scoutPit = (data: PitInputFormData) => {
		setShowPitDialog(false);
		startPit(event?.year!, data.teamNumber);
		router.push(`/scouter/${eventId}/pit/${data.teamNumber}` as Href);
	};

	return <>
		<TouchableOpacity onPress={() => setShowGameDialog(true)}>
			<Card>
				<Row>
					<IconContainer>
						<Icon name="sports-esports" size={32} />
					</IconContainer>
					<Title>Game Scouting</Title>
					<FlexGrow />
					<Icon name="chevron-right" size={24} />
				</Row>
			</Card>
		</TouchableOpacity>
		{games[event?.year!]?.pitScoutingAttributes && <TouchableOpacity onPress={() => setShowPitDialog(true)}>
			<Card>
				<Row>
					<IconContainer>
						<Icon name="checklist" size={32}/>
					</IconContainer>
					<Title>Pit Scouting</Title>
					<FlexGrow/>
					<Icon name="chevron-right" size={24}/>
				</Row>
			</Card>
		</TouchableOpacity>}
		<Portal>
			<FormDialog<GameInputFormData>
				visible={showGameDialog}
				onDismiss={() => setShowGameDialog(false)}
				title={`Scout a game`}
				onSubmit={scoutGame}
				fields={[
					{
						name: "teamNumber",
						label: "Team Number",
						type: 'team',
						rules: {required: true},
						teams: event?.teams || [],
					},
					{
						name: "gameNumber",
						label: 'Game Number',
						type: 'number',
						iconLeft: 'sports-esports',
						rules: {required: true},
					}
				]} />
			<FormDialog<PitInputFormData>
				visible={showPitDialog}
				onDismiss={() => setShowPitDialog(false)}
				title="Scout a team"
				onSubmit={scoutPit}
				fields={[
					{
						name: "teamNumber",
						label: "Team Number",
						type: 'team',
						rules: {required: true},
						teams: event?.teams || [],
					},
				]} />
		</Portal>
	</>;
});
