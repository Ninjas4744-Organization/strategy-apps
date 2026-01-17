import {FormGroup, HeaderButtons, Icon, Loading} from "@ninjas-strategy/ui";
import {ScrollView} from "react-native";
import {observer} from "mobx-react-lite";
import {Stack, useRouter} from "expo-router";
import {EventItem} from "@/lib/components/EventItem";
import userStore from "@/lib/stores/userStore";
import eventsStore from "@/lib/stores/eventsStore";
import {useRef, useState} from "react";
import {Button, Dialog, Portal} from "react-native-paper";
import {TeamDropdown} from "@/lib/components/game/TeamDropdown";
import gameStore from "@/lib/stores/gameStore";
import {Controller, useForm} from "react-hook-form";
import {TeamInfoInput} from "@/lib/components/game/TeamInfoInput";
import styled from "styled-components/native";

type TeamInputFormData = {
	teamNumber: string;
	gameNumber: string;
};

const FormContainer = styled.View`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

export default observer(function ScouterIndex() {
	const {events, isLoading} = eventsStore;
	const router = useRouter();
	const {signOut} = userStore;
	const [startGameEvent, setStartGameEvent] = useState<string|null>(null);
	const {control, handleSubmit, reset, formState: {errors}} = useForm<TeamInputFormData>();
	const {startGame} = gameStore;

	if (isLoading)
		return <Loading />;

	const event = startGameEvent ? eventsStore.events[startGameEvent] : null;

	const onSubmit = (data: TeamInputFormData) => {
		startGame(data.teamNumber, data.gameNumber, event?.year!);
		setStartGameEvent(null);
		router.push(`/scouter/${startGameEvent}/0`);
	}

	return (
		<>
			<ScrollView>
				<Stack.Screen
				options={{
					headerShown: true,
					title: 'Events',
					headerRight: () => (
						<HeaderButtons buttons={[{onPress: () => signOut().then(() => router.push('/')), icon: 'logout'}]} />
					)}}/>
			{events && Object.values(events).map((event) => (
				<EventItem key={event.id} onClick={() => setStartGameEvent(event.id)} {...event} />
			))}
		</ScrollView>
			<Portal>
				<Dialog visible={!!startGameEvent} dismissable onDismiss={() => (reset(), setStartGameEvent(null))}>
					<ScrollView keyboardShouldPersistTaps="handled">
					<Dialog.Title>Scout a game - {event?.name}</Dialog.Title>
					<Dialog.Content>
							<FormGroup>
								<Controller
									name="teamNumber"
									control={control}
									rules={{required: true}}
									render={({field: {onChange, value}}) => (
										<TeamDropdown
											teams={event?.teams || []}
											onSelect={onChange}
											value={value}
											error={!!errors.teamNumber}/>
									)} />
								<Controller
									name="gameNumber"
									control={control}
									rules={{required: true}}
									render={({field: {onChange, value}}) => (
										<TeamInfoInput
											label="Game Number"
											keyboardType="number-pad"
											value={value}
											onChangeText={onChange}
											iconLeft="sports-esports"
											error={!!errors.gameNumber}/>
									)} />
							</FormGroup>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={handleSubmit(onSubmit)}>Start Game</Button>
					</Dialog.Actions>
					</ScrollView>
				</Dialog>
			</Portal>
		</>
	);
});
