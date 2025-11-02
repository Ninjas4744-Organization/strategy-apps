import styled from "styled-components/native";
import {observer} from "mobx-react-lite";
import {SectionTitle} from "@/lib/components/game/SectionTitle";
import {BodyScroll} from "@ninjas-strategy/ui/styles/misc";
import {ScoringCategory} from "@/lib/components/game/ScoringCategory";
import {ScoringElement} from "@/lib/components/game/ScoringElement";
import gameStore from "@/lib/stores/gameStore";
import {updateItemAtIndex} from "@/lib/utilities";
import {levelColors} from "@/lib/components/game/commons";
import {CageLevel} from "@/lib/interfaces/CageLevel";
import {MD2Colors, RadioButton, TextInput} from "react-native-paper";
import {Subtitle} from "@ninjas-strategy/ui/styles/Text";
import {Icon} from "@ninjas-strategy/ui/Icon";
import {BeautifulButton} from "@ninjas-strategy/ui/styles/BeautifulButton";
import {useRouter} from "expo-router";
import {action} from "mobx";
import {KeyboardAvoidingView, Platform} from "react-native";

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

export default observer(function AutonomousPage() {
	const router = useRouter();
	const {algae_net, algae_net_missed, algae_processed, algae_processed_missed, corals_left, corals_right, cage_level, teamNumber, gameNumber} = gameStore;

	return <KeyboardAvoidingView
		behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		style={{ flexGrow: 1, flex: 1 }}>
		<Container>
			<SectionTitle
				title="Teleop Phase"
				subtitle="Drivers control"
				iconLeft="gamepad"/>
			<BodyScroll>
				<ScoringCategory
					color={MD2Colors.green500}
					title="Algae Collection"
					icon="grass">
					<ScoringElement
						title="Net"
						color={MD2Colors.blue500}
						missed={algae_net_missed}
						scored={algae_net}
						setMissed={action(missed => gameStore.algae_net_missed = missed)}
						setScored={action(scored => gameStore.algae_net = scored)}/>
					<ScoringElement
						title="Processor"
						color={MD2Colors.green500}
						missed={algae_processed_missed}
						scored={algae_processed}
						setMissed={action(missed => gameStore.algae_processed_missed = missed)}
						setScored={action(scored => gameStore.algae_processed = scored)}/>
				</ScoringCategory>
				<ScoringCategory
					color={MD2Colors.white}
					title="Coral Scoring"
					icon="sports-volleyball">
					{levelColors.map((color, level) => (
						<ScoringElement
							key={"corals_level_" + level}
							title={"Level " + (level + 1)}
							color={color}
							missed={corals_left[level]}
							setMissed={(missed) => updateItemAtIndex(level, missed, corals_left, action(v => gameStore.corals_left = v))}
							scored={corals_right[level]}
							setScored={(scored) => updateItemAtIndex(level, scored, corals_right, action(v => gameStore.corals_right = v))}/>)).reverse()}
				</ScoringCategory>
				<ScoringCategory
					color={MD2Colors.blue500}
					title="Cage Level"
					icon="water-drop">
					<RadioButton.Group
						onValueChange={action(value => gameStore.cage_level = (value as CageLevel))} value={cage_level}>
						{Object.values(CageLevel).map(level => <CageLevelContainer key={level} isSelected={cage_level === level}>
							<RadioButton value={level} color={MD2Colors.blue500} />
							<Subtitle>{level}</Subtitle>
						</CageLevelContainer>)}
					</RadioButton.Group>
				</ScoringCategory>
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
					onPress={() => gameStore.submitToFirebase().then(() => router.push('/game/autonomous'))} />
			</BodyScroll>
		</Container>
	</KeyboardAvoidingView>;
});
