import {useState} from "react";
import styled, {useTheme} from 'styled-components/native';
import {useRouter} from "expo-router";
import {ActivityIndicator, ScrollView, useWindowDimensions} from "react-native";
import {BeautifulButton, Text, showSnackbar, AppHeader, TextInput, TextInputIcon, FormGroup, Subtitle, Title} from "@ninjas-strategy/ui";
import {observer} from "mobx-react-lite";
import userStore from "@/lib/stores/userStore";
import {About} from "@/lib/components/About";
import {shouldUseFirebaseEmulator} from "@/lib/firebase/emulator";
import {sandboxUserPassword, sandboxUsers} from "@/lib/firebase/sandboxUsers";
import {SafeAreaView} from "react-native-safe-area-context";
import {LinearGradient} from "expo-linear-gradient";

const ScreenGradient = styled(LinearGradient)`
	flex: 1;
`;

const Container = styled(SafeAreaView).attrs({
	edges: ['top', 'bottom'],
})<{$viewportHeight: number}>`
	flex: 1;
	min-height: ${({$viewportHeight}) => `${$viewportHeight}px`};
	padding: 12px;
	background-color: transparent;
	display: flex;
	flex-direction: column;
`;

export default function Index() {
	const {height} = useWindowDimensions();
	const theme = useTheme();

	return (
		<ScreenGradient
			colors={theme.backgroundGradient}
			start={{x: 0, y: 0}}
			end={{x: 1, y: 1}}>
			<Container $viewportHeight={height}>
				<About />
				<AppHeader
					icon="sports-esports"
					title="The Ninja Scouter"
					description="Team Performance Analytics" />
				<LoginForm />
			</Container>
		</ScreenGradient>
	);
}

const Section = styled.View`
	padding: 20px;
	gap: 16px;
`;

const SandboxHeader = styled.View`
	gap: 4px;
`;

const SandboxList = styled(ScrollView)`
	max-height: 360px;
`;

const SandboxUserButton = styled.TouchableOpacity<{$selected: boolean}>`
	min-height: 58px;
	padding: 10px 12px;
	border-radius: 8px;
	border: 1px solid ${({$selected, theme}) => $selected ? theme.success : theme.border};
	background-color: ${({theme}) => theme.card};
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 12px;
`;

const SandboxUserText = styled.View`
	flex: 1;
	min-width: 0;
`;

const SandboxBadge = styled.View`
	padding: 4px 8px;
	border-radius: 8px;
	background-color: ${({theme}) => theme.inputBackground};
`;

const getErrorMessage = (error: unknown, fallback: string) => {
	if (error instanceof Error) {
		return error.message || fallback;
	}

	if (typeof error === 'object' && error && 'message' in error && typeof error.message === 'string') {
		return error.message || fallback;
	}

	return fallback;
};

const getErrorCode = (error: unknown) => {
	if (typeof error === 'object' && error && 'code' in error && typeof error.code === 'string') {
		return error.code;
	}

	return undefined;
};

const LoginForm = observer(() => {
	const {signIn, user, signOut, demoSignIn} = userStore;
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [sandboxQuery, setSandboxQuery] = useState('');
	const [selectedSandboxEmail, setSelectedSandboxEmail] = useState('');
	const [isSandboxSigningIn, setIsSandboxSigningIn] = useState(false);
	const router = useRouter();
	const useEmulatorAuth = shouldUseFirebaseEmulator;
	const filteredSandboxUsers = sandboxUsers.filter(sandboxUser => {
		const query = sandboxQuery.trim().toLowerCase();

		if (!query)
			return true;

		return [
			sandboxUser.displayName,
			sandboxUser.email,
			sandboxUser.role,
			sandboxUser.team.toString(),
		].some(value => value.toLowerCase().includes(query));
	});

	const handleLogin = async () => {
		try {
			if (user)
				await signOut();
			await signIn(email, password);
			setEmail('');
			setPassword('');
			router.replace('/(app)');
		} catch (e: unknown) {
			const errorCode = getErrorCode(e);
			if (errorCode === 'auth/invalid-email')
				showSnackbar('Invalid email');
			else if (errorCode === 'auth/missing-password')
				showSnackbar('Please type a password');
			else if (errorCode === 'auth/invalid-credential')
				showSnackbar('Incorrect password');
			else
				showSnackbar(getErrorMessage(e, 'Failed to log in'));
		}
	};

	const handleDemoLogin = async () => {
		try {
			if (user)
				await signOut();
			await demoSignIn();
			router.replace('/(app)');
		} catch (e: unknown) {
			showSnackbar(getErrorMessage(e, 'Failed to start demo'));
		}
	};

	const handleSandboxLogin = async (sandboxEmail: string) => {
		if (isSandboxSigningIn)
			return;

		try {
			setSelectedSandboxEmail(sandboxEmail);
			setIsSandboxSigningIn(true);
			if (user)
				await signOut();
			await signIn(sandboxEmail, sandboxUserPassword);
			router.replace('/(app)');
		} catch (e: unknown) {
			showSnackbar(getErrorMessage(e, 'Failed to log in'));
		} finally {
			setIsSandboxSigningIn(false);
		}
	};

	if (useEmulatorAuth) {
		return (
			<Section>
				<SandboxHeader>
					<Title>Choose a seeded user</Title>
					<Subtitle>Firebase emulator accounts</Subtitle>
				</SandboxHeader>
				<TextInput
					label="Search users"
					value={sandboxQuery}
					onChangeText={setSandboxQuery}
					left={<TextInputIcon icon="email" />}
					autoCapitalize="none"
					autoCorrect={false}
					editable={!isSandboxSigningIn}
					underlineStyle={{display: 'none'}}/>
				<SandboxList
					nestedScrollEnabled
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{gap: 8}}>
					{filteredSandboxUsers.map(sandboxUser => {
						const selected = selectedSandboxEmail === sandboxUser.email;

						return (
							<SandboxUserButton
								key={sandboxUser.email}
								$selected={selected}
								disabled={isSandboxSigningIn}
								onPress={() => handleSandboxLogin(sandboxUser.email)}>
								<SandboxUserText>
									<Text numberOfLines={1}>{sandboxUser.displayName}</Text>
									<Subtitle numberOfLines={1}>
										Team {sandboxUser.team} | {sandboxUser.role} | {sandboxUser.email}
									</Subtitle>
								</SandboxUserText>
								{selected && isSandboxSigningIn ? (
									<ActivityIndicator size="small" />
								) : (
									<SandboxBadge>
										<Subtitle>Login</Subtitle>
									</SandboxBadge>
								)}
							</SandboxUserButton>
						);
					})}
				</SandboxList>
			</Section>
		);
	}

	return (
		<Section>
			{user && <Text>Login as someone else</Text>}
			<FormGroup>
				<TextInput
					label="Email"
					keyboardType="email-address"
					value={email}
					onChangeText={setEmail}
					left={<TextInputIcon icon="email" />}
					underlineStyle={{display: 'none'}}/>
				<TextInput
					label="Password"
					secureTextEntry
					value={password}
					onChangeText={setPassword}
					left={<TextInputIcon icon="lock" />}
					underlineStyle={{display: 'none'}}/>
			</FormGroup>
			<BeautifulButton onPress={handleLogin} icon="login" label="Login" />
			<BeautifulButton
				onPress={() => router.push('/register/enter-code')}
				label="Need an account? Register"
				icon="person-add"/>
			<BeautifulButton label="Try our app" icon="try" onPress={handleDemoLogin} />
		</Section>
	);
});
