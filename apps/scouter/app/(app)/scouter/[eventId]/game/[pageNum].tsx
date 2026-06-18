import styled from "styled-components/native";
import {observer} from "mobx-react-lite";
import {PageTitle} from "@/lib/components/game/PageTitle";
import gameStore from "@/lib/stores/gameStore";
import {BodyScroll, BeautifulButton, BottomSafeArea, GameForm} from "@ninjas-strategy/ui";
import {useGlobalSearchParams, useRouter} from "expo-router";
import {KeyboardAvoidingView, Platform} from "react-native";
import {games} from "@ninjas-strategy/frc-games";
import eventsStore from "@/lib/stores/eventsStore";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import {useDisableGestures} from "@/lib/hooks/disableGestures";

const Container = styled.SafeAreaView`
	background-color: transparent;
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: 8px;
`;

export default observer(function TeleopPage() {
	const router = useRouter();
	const {eventId: eventIdParam, pageNum: pageNumParam} = useGlobalSearchParams();
	const eventId = Array.isArray(eventIdParam) ? eventIdParam[0] : eventIdParam;
	const pageNum = Array.isArray(pageNumParam) ? pageNumParam[0] : pageNumParam;
	const {data, updateValue} = gameStore;
	const {events} = eventsStore;

	useDisableGestures();

	const event = eventId ? events[eventId] : undefined;

	if (!event || !pageNum) {
		return <Container />;
	}

	const game = games[event.year];
	if (!game) {
		return <Container />;
	}

	const page = game.pages[parseInt(pageNum as string)];
	if (!page) {
		return <Container />;
	}

	const isLastPage = parseInt(pageNum as string) === game.pages.length - 1;

	return <KeyboardAvoidingView
		behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		style={{ flexGrow: 1, flex: 1 }}>
		<Container>
			<PageTitle
				title={page.title}
				subtitle={page.description}
				icon={page.icon}/>
			<KeyboardAwareScrollView ScrollViewComponent={BodyScroll}>
				<GameForm
					{...game}
					pageNum={parseInt(pageNum as string)}
					data={data}
					setData={(key, value) => updateValue(key, value)} />
				{isLastPage && (
					<BottomSafeArea>
						<BeautifulButton
							label="Submit to Firebase"
							icon="cloud-upload"
							onPress={() => gameStore.submitToFirebase(eventId).then(sent => sent && router.push('/scouter'))} />
					</BottomSafeArea>
				)}
			</KeyboardAwareScrollView>
		</Container>
	</KeyboardAvoidingView>;
});
