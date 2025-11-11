import styled from "styled-components/native";
import {observer} from "mobx-react-lite";
import {SectionTitle} from "@/lib/components/game/SectionTitle";
import {ScoringCategory} from "@/lib/components/game/ScoringCategory";
import {ScoringElement} from "@/lib/components/game/ScoringElement";
import gameStore from "@/lib/stores/gameStore";
import {CageLevel} from "@/lib/interfaces/CageLevel";
import {MD2Colors, RadioButton, TextInput} from "react-native-paper";
import {BodyScroll, Subtitle, Icon, BeautifulButton, GameForm} from "@ninjas-strategy/ui";
import {useGlobalSearchParams, useRouter} from "expo-router";
import {action} from "mobx";
import {KeyboardAvoidingView, Platform} from "react-native";
import {games} from "@ninjas-strategy/frc-games";

const Container = styled.SafeAreaView`
	background-color: transparent;
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: 8px;
`;

const CageLevelContainer = styled.View<{isSelected: boolean}>`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    background-color: ${props => props.isSelected ? (MD2Colors.blue500 + '20') : 'transparent'};
    border-radius: 12px;
    border-width: 1px;
    border-color: ${props => MD2Colors.blue500 + (props.isSelected ? '' : '20')};
    margin-bottom: 8px;
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
	const {eventId} = useGlobalSearchParams();
	const {data, updateValue, teamNumber, gameNumber} = gameStore;

	return <KeyboardAvoidingView
		behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		style={{ flexGrow: 1, flex: 1 }}>
		<Container>
			<SectionTitle
				title="Teleop Phase"
				subtitle="Drivers control"
				iconLeft="gamepad"/>
			<BodyScroll>
				<GameForm
					{...games[2025]}
					phase="teleop"
					data={data}
					setData={(key, value) => updateValue(key, value)} />
				<ScoringCategory
					color={MD2Colors.white}
					title="Team Information"
					icon="info">
					<TeamInfoInput
						label="Team Number"
						keyboardType="number-pad"
						value={teamNumber}
						onChangeText={action(number => gameStore.teamNumber = number)}
						left={<TextInput.Icon icon={() => <TeamInfoInputIcon name="group" />} />}
						underlineStyle={{display: 'none'}}/>
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
			</BodyScroll>
		</Container>
	</KeyboardAvoidingView>;
});
