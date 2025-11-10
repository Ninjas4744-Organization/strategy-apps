import styled from "styled-components/native";
import {observer} from "mobx-react-lite";
import {SectionTitle} from "@/lib/components/game/SectionTitle";
import {useState} from "react";
import {Button, Dialog, MD2Colors} from "react-native-paper";
import {Text as RNText} from "react-native";
import {useGlobalSearchParams, useRouter} from "expo-router";
import {ScoringCategory} from "@/lib/components/game/ScoringCategory";
import {ScoringElement} from "@/lib/components/game/ScoringElement";
import gameStore from "@/lib/stores/gameStore";
import {BodyScroll} from "@ninjas-strategy/ui";
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
	} = gameStore;
	const [showAutoEndDialog, setShowAutoEndDialog] = useState(false);
	const {eventId} = useGlobalSearchParams();

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
					<ScoringElement
						title={"Level " + 4}
						color={MD2Colors.purple500}
						missed={gameStore.autonomous_corals_missed_l4}
						setMissed={action(missed => gameStore.autonomous_corals_missed_l4 = missed)}
						scored={gameStore.autonomous_corals_scored_l4}
						setScored={action(scored => gameStore.autonomous_corals_scored_l4 = scored)}/>
					<ScoringElement
						title={"Level " + 3}
						color={MD2Colors.blue500}
						missed={gameStore.autonomous_corals_missed_l3}
						setMissed={action(missed => gameStore.autonomous_corals_missed_l3 = missed)}
						scored={gameStore.autonomous_corals_scored_l3}
						setScored={action(scored => gameStore.autonomous_corals_scored_l3 = scored)}/>
					<ScoringElement
						title={"Level " + 2}
						color={MD2Colors.green500}
						missed={gameStore.autonomous_corals_missed_l2}
						setMissed={action(missed => gameStore.autonomous_corals_missed_l2 = missed)}
						scored={gameStore.autonomous_corals_scored_l2}
						setScored={action(scored => gameStore.autonomous_corals_scored_l2 = scored)}/>
					<ScoringElement
						title={"Level " + 1}
						color={MD2Colors.orange500}
						missed={gameStore.autonomous_corals_missed_l1}
						setMissed={action(missed => gameStore.autonomous_corals_missed_l1 = missed)}
						scored={gameStore.autonomous_corals_scored_l1}
						setScored={action(scored => gameStore.autonomous_corals_scored_l1 = scored)}/>
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
				<Button onPress={() => (setShowAutoEndDialog(false), router.push(`/scouter/${eventId}/teleop`))}>OK</Button>
			</Dialog.Actions>
		</Dialog>
	</>;
});

