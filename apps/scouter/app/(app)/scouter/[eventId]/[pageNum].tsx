import styled from "styled-components/native";
import {observer} from "mobx-react-lite";
import {PageTitle} from "@/lib/components/game/PageTitle";
import gameStore from "@/lib/stores/gameStore";
import {BodyScroll, BeautifulButton, GameForm} from "@ninjas-strategy/ui";
import {useGlobalSearchParams, useRouter} from "expo-router";
import {KeyboardAvoidingView, Platform} from "react-native";
import {games} from "@ninjas-strategy/frc-games";
import eventsStore from "@/lib/stores/eventsStore";

const Container = styled.SafeAreaView`
	background-color: transparent;
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: 8px;
`;

export default observer(function TeleopPage() {
	const router = useRouter();
	const {eventId, pageNum} = useGlobalSearchParams();
	const {data, updateValue} = gameStore;
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
			<PageTitle
				title={page.title}
				subtitle={page.description}
				icon={page.icon}/>
			<BodyScroll>
				<GameForm
					{...games[event.year]}
					pageNum={parseInt(pageNum as string)}
					data={data}
					setData={(key, value) => updateValue(key, value)} />
				{isLastPage && <BeautifulButton
					label="Submit to Firebase"
					icon="cloud-upload"
					onPress={() => gameStore.submitToFirebase(eventId as string).then(() => router.push('/scouter'))} />}
			</BodyScroll>
		</Container>
	</KeyboardAvoidingView>;
});
