import styled from "styled-components/native";
import {observer} from "mobx-react-lite";
import {SectionTitle} from "../../../components/game/SectionTitle";
import {useState} from "react";
import {Button, Dialog} from "react-native-paper";
import {Text as RNText} from "react-native";
import {useRouter} from "expo-router";
import {ScoringCategory} from "../../../components/game/ScoringCategory";
import {ScoringElement} from "../../../components/game/ScoringElement";
import {Colors} from "../../../components/styles/colors";
import {updateItemAtIndex} from "../../../lib/utilities";
import gameStore from "../../../stores/game_store";
import {BodyScroll} from "../../../components/styles/misc";
import {levelColors} from "../../../components/game/commons";
import {action} from "mobx";

const Container = styled.SafeAreaView`
    background-color: transparent;
    display: flex;
    flex-direction: column;
    flex: 1;
`;

export default observer(function AutonomousPage() {
	const router = useRouter();
	const {
		autonomous_algae_net,
		autonomous_net_missed,
		autonomous_algae_processed,
		autonomous_processed_missed,
		autonomous_corals_right,
		autonomous_corals_left
	} = gameStore;
	const [showAutoEndDialog, setShowAutoEndDialog] = useState(false);

	return <>
		<Container>
			<SectionTitle
				title="Autonomous Phase"
				subtitle="Full auto control"
				iconLeft="sports-esports"
				iconRight="arrow-forward"
				onLeftClick={() => setShowAutoEndDialog(true)}/>
			<BodyScroll>
				<ScoringCategory
					color="#FF9800"
					title="Algae Collection"
					icon="grass">
					<ScoringElement
						title="Net"
						color={Colors.blue}
						missed={autonomous_net_missed}
						setMissed={action(missed => gameStore.autonomous_net_missed = missed)}
						scored={autonomous_algae_net}
						setScored={action(scored => gameStore.autonomous_algae_net = scored)}/>
					<ScoringElement
						title="Processor"
						color={Colors.green}
						missed={autonomous_processed_missed}
						setMissed={action(missed => gameStore.autonomous_processed_missed = missed)}
						scored={autonomous_algae_processed}
						setScored={action(scored => gameStore.autonomous_algae_processed = scored)}/>
				</ScoringCategory>
				<ScoringCategory
					color="#FFFFFF"
					title="Coral Scoring"
					icon="sports-volleyball">
					{levelColors.map((color, level) => <ScoringElement
						key={"auto_corals_level_" + level}
						title={"Level " + (level + 1)}
						color={color}
						missed={autonomous_corals_left[level]}
						setMissed={(missed) => updateItemAtIndex(level, missed, autonomous_corals_left, action(missed => gameStore.autonomous_corals_left = missed))}
						scored={autonomous_corals_right[level]}
						setScored={(scored) => updateItemAtIndex(level, scored, autonomous_corals_right, action(scored => gameStore.autonomous_corals_right = scored))}/>).reverse()}
				</ScoringCategory>
			</BodyScroll>
		</Container>
		<Dialog visible={showAutoEndDialog} onDismiss={() => setShowAutoEndDialog(false)}>
			<Dialog.Title>Teleop Switch</Dialog.Title>
			<Dialog.Content>
				<RNText>You're about to switch to teleop phase. There's no turning back!</RNText>
			</Dialog.Content>
			<Dialog.Actions>
				<Button onPress={() => setShowAutoEndDialog(false)}>Cancel</Button>
				<Button onPress={() => (setShowAutoEndDialog(false), router.push('/game/teleop'))}>OK</Button>
			</Dialog.Actions>
		</Dialog>
	</>;
});

