import styled from "styled-components/native";
import adminStore from "@/lib/stores/adminStore";
import {SectionTitle} from "@/lib/components/game/SectionTitle";
import {Subtitle, Title} from "@/lib/components/styles/Text";
import {Icon} from "@/lib/components/Icon";
import {TeamItem} from "@/lib/components/admin/TeamItem";
import {ScrollView, View, Text as RNText} from "react-native";
import {observer} from "mobx-react-lite";
import {Loading} from "@/lib/components/Loading";
import {Stack} from "expo-router";
import {DashboardHeaderButtons} from "@/lib/components/admin/DashboardHeaderButtons";
import {Button, Dialog, MD2Colors} from "react-native-paper";
import {Row} from "@/lib/components/styles/FlexDir";
import snackbar from "@/lib/stores/snackbar";

const IconsRow = styled.View`
	display: flex;
	flex-direction: row;
	margin: 8px;
`;

export default observer(function AdminIndex() {
	const {teamsRanked, isLoading, totalGamesCount, updateRegistrationSetting, showAppSettings, setShowAppSettings} = adminStore;

	if (isLoading)
		return <Loading />;

	const [topTeam] = teamsRanked;

	return <>
			<ScrollView>
				<Stack.Screen options={{title: 'Admin Dashboard', headerRight: () => <DashboardHeaderButtons />}}/>
				<SectionTitle
					title="Team Analytics Dashboard"
					subtitle={`${teamsRanked.length} teams analyzed • ${totalGamesCount} total games`} />
				<IconsRow>
					<StatCard>
						<StatIcon name="emoji-events" color={MD2Colors.amber500}/>
						<Title>{topTeam.teamNumber}</Title>
						<Subtitle>Top Team</Subtitle>
					</StatCard>
					<StatCard>
						<StatIcon name="trending-up" color={MD2Colors.green500}/>
						<Title>{topTeam.averageTotalScore.toFixed(2)}</Title>
						<Subtitle>Avg Score</Subtitle>
					</StatCard>
					<StatCard>
						<StatIcon name="sports-esports" color={MD2Colors.blue500}/>
						<Title>{totalGamesCount}</Title>
						<Subtitle>Total Games</Subtitle>
					</StatCard>
				</IconsRow>
				<View style={{margin: 8}}>
					<Title>Team Rankings</Title>
				</View>
				{teamsRanked.map((team, index) => <TeamItem
					key={team.teamNumber}
					{...team}
					averageTotalScore={team.averageTotalScore.toFixed(2)}
					index={index}/>)}
			</ScrollView>
			<Dialog visible={showAppSettings} onDismiss={() => setShowAppSettings(false)}>
				<Dialog.Title>App Settings</Dialog.Title>
				<Dialog.Content>
					<RNText style={{marginBottom: 16}}>Allow new users to register for the app?</RNText>
					<Row>
						<Button mode="elevated" buttonColor={MD2Colors.green500} onPress={async () => {
							await updateRegistrationSetting(true);
							setShowAppSettings(false);
							snackbar.show('Registration enabled! New users can now register.');
						}}>
							Enable
						</Button>
						<Button mode="elevated" buttonColor={MD2Colors.orange500} onPress={async () => {
							await updateRegistrationSetting(false);
							setShowAppSettings(false);
							snackbar.show('Registration disabled! New users cannot register.');
						}}>
							Disable
						</Button>
					</Row>
				</Dialog.Content>
			</Dialog>
		</>;
});


const StatCard = styled.View`
	flex: 1;
	display: flex;
	flex-direction: column;
	margin: 8px;
	padding: 10px;
	background-color: ${MD2Colors.white}10;
	gap: 16px;
	border: ${MD2Colors.white}20;
	border-radius: 16px;
	align-items: center;
`;

const StatIcon = styled(Icon)<{color: string}>`
	font-size: 20px;
	color: ${props => props.color};
`;
