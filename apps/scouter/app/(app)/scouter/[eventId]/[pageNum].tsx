import styled from "styled-components/native";
import {observer} from "mobx-react-lite";
import {SectionTitle} from "@/lib/components/game/SectionTitle";
import {ScoringCategory} from "@/lib/components/game/ScoringCategory";
import gameStore from "@/lib/stores/gameStore";
import {MD2Colors, TextInput} from "react-native-paper";
import {BodyScroll, Icon, BeautifulButton, GameForm} from "@ninjas-strategy/ui";
import {useGlobalSearchParams, useRouter} from "expo-router";
import {action} from "mobx";
import {KeyboardAvoidingView, Platform} from "react-native";
import {games} from "@ninjas-strategy/frc-games";
import eventsStore from "@/lib/stores/eventsStore";
import {TeamDropdown} from "@/lib/components/game/TeamDropdown";
import {useState} from "react";

const Container = styled.SafeAreaView`
	background-color: transparent;
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: 8px;
`;

const TeamInfoInput = styled(TextInput)`
	background-color: ${MD2Colors.white}70;
	border-radius: 16px;
`;

const TeamInfoInputIcon = styled(Icon)`
	font-size: 24px;
	color: #555;
`;

export default observer(function TeleopPage() {
	const router = useRouter();
	const {eventId, pageNum} = useGlobalSearchParams();
	const [teamDropdownVisible, setTeamDropdownVisible] = useState(false);
	const {data, updateValue, teamNumber, gameNumber} = gameStore;
	const {events} = eventsStore;

	const event = events[eventId as string];

	if (!event) {
		return <Container />;
	}

	const game = games[event.year];
	const page = game.pages[parseInt(pageNum as string)];
	const isLastPage = parseInt(pageNum as string) === game.pages.length - 1;

	return <KeyboardAvoidingView
		behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		style={{ flexGrow: 1, flex: 1 }}>
		<Container>
			<SectionTitle
				title={page.title}
				subtitle={page.description}
				icon={page.icon}
				isFirstPage={parseInt(pageNum as string) === 0}
				isLastPage={isLastPage}/>
			<BodyScroll>
				<GameForm
					{...games[event.year]}
					pageNum={parseInt(pageNum as string)}
					data={data}
					setData={(key, value) => updateValue(key, value)} />
				{isLastPage && <>
					<ScoringCategory
						color={MD2Colors.white}
						title="Team Information"
						icon="info">
						<TeamDropdown
							teams={event?.teams || []}
							visible={teamDropdownVisible}
							setVisible={setTeamDropdownVisible}
							onSelect={action(number => gameStore.teamNumber = number)}>
							<TeamInfoInput
								label="Team Number"
								editable={false}
								pointerEvents="none"
								value={teamNumber ? `Team ${teamNumber}` : 'Select team'}
								left={<TextInput.Icon icon={() => <TeamInfoInputIcon name="group" />} />}
								right={<TextInput.Icon icon="chevron-down"/>}
								underlineStyle={{display: 'none'}}/>
						</TeamDropdown>
						<TeamInfoInput
							label="Game Number"
							keyboardType="number-pad"
							value={gameNumber}
							onChangeText={action(number => gameStore.gameNumber = number)}
							left={<TextInput.Icon icon={() => <TeamInfoInputIcon name="sports-esports" />} />}
							underlineStyle={{display: 'none'}}/>
					</ScoringCategory>
					<BeautifulButton
						label="Submit to Firebase"
						icon="cloud-upload"
						onPress={() => gameStore.submitToFirebase(eventId as string).then(() => router.push('/scouter'))} />
				</>}
			</BodyScroll>
		</Container>
	</KeyboardAvoidingView>;
});
