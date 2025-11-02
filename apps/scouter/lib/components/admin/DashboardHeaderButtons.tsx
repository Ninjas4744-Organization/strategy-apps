import {observer} from "mobx-react-lite";
import styled from "styled-components/native";
import {Icon} from "@ninjas-strategy/ui/components/Icon";
import adminStore from "@/lib/stores/adminStore";
import {useAuth} from "@/lib/context/auth";
import {useRouter} from "expo-router";

const DashboardHeaderButtonsContainer = styled.View`
	display: flex;
	flex-direction: row;
	background-color: transparent;
`;

const Button = styled.TouchableOpacity`
	margin: 10px 15px;
`;

export const DashboardHeaderButtons = observer(function () {
	const {signOut} = useAuth();
	const router = useRouter();
	const {loadTeams, setShowAppSettings} = adminStore;

	return <DashboardHeaderButtonsContainer>
		<Button onPress={() => loadTeams()}>
			<Icon name="refresh" />
		</Button>
		<Button onPress={() => setShowAppSettings(true)}>
			<Icon name="settings" />
		</Button>
		<Button onPress={() => signOut().then(() => router.push('/'))}>
			<Icon name="logout" />
		</Button>
	</DashboardHeaderButtonsContainer>;
});
