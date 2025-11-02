import styled from "styled-components/native";
import {observer} from "mobx-react-lite";
import {SectionTitle} from "@/lib/components/game/SectionTitle";
import {useState} from "react";
import {Button, Dialog, MD2Colors} from "react-native-paper";
import {Text as RNText} from "react-native";
import {useRouter} from "expo-router";
import {ScoringCategory} from "@/lib/components/game/ScoringCategory";
import {ScoringElement} from "@/lib/components/game/ScoringElement";
import {updateItemAtIndex} from "@/lib/utilities";
import gameStore from "@/lib/stores/gameStore";
import {BodyScroll} from "@ninjas-strategy/ui";
import {levelColors} from "@/lib/components/game/commons";
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
					color={MD2Colors.orange500}
					title="Algae Collection"
					icon="grass">
					<ScoringElement
						title="Net"
						color={MD2Colors.blue500}
						missed={autonomous_net_missed}
						setMissed={action(missed => gameStore.autonomous_net_missed = missed)}
						scored={autonomous_algae_net}
						setScored={action(scored => gameStore.autonomous_algae_net = scored)}/>
					<ScoringElement
						title="Processor"
						color={MD2Colors.green500}
						missed={autonomous_processed_missed}
						setMissed={action(missed => gameStore.autonomous_processed_missed = missed)}
						scored={autonomous_algae_processed}
						setScored={action(scored => gameStore.autonomous_algae_processed = scored)}/>
				</ScoringCategory>
				<ScoringCategory
					color={MD2Colors.white}
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

