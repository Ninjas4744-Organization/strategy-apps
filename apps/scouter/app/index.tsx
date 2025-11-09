import {useState} from "react";
import styled from 'styled-components/native';
import {useRouter} from "expo-router";
import {BeautifulButton, Text, showSnackbar, AppHeader, TextInput, TextInputIcon, FormGroup} from "@ninjas-strategy/ui";
import {observer} from "mobx-react-lite";
import userStore from "@/lib/stores/userStore";

const Container = styled.SafeAreaView`
	padding: 50px 12px 12px;
	background-color: transparent;
	display: flex;
	flex-direction: column;
`;

export default function Index() {
	return (
		<Container>
			<AppHeader
				icon="sports-esports"
				title="The Ninja Scouter"
				description="Team Performance Analytics" />
			<StartButton />
			<LoginForm />
		</Container>
	);
}

const Section = styled.View`
	padding: 20px;
	gap: 16px;
`;

const StartButton = observer(() => {
	const router = useRouter();
	const {user, goToBaseRoute} = userStore;

	const label = user?.email === 'admin@gmail.com' ? 'To admin panel' : 'Start game';
	const icon = user?.email === 'admin@gmail.com' ? 'admin-panel-settings' : 'play-arrow';

	return user ? <Section>
		<Text>Hi, {user.email}</Text>
		<BeautifulButton onPress={() => goToBaseRoute(router)} icon={icon} label={label} />
	</Section>: null;
});

const LoginForm = observer(() => {
	const {signIn, user, signOut, goToBaseRoute} = userStore;
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	const handleLogin = async () => {
		try {
			if (user)
				await signOut();
			await signIn(email, password);
			setEmail('');
			setPassword('');
			goToBaseRoute(router, email);
		} catch (e: any) {
			if (e.code === 'auth/invalid-email')
				showSnackbar('Invalid email');
			else if (e.code === 'auth/missing-password')
				showSnackbar('Please type a password');
			else if (e.code === 'auth/invalid-credential')
				showSnackbar('Incorrect password');
			else
				showSnackbar(e.message);
		}
	};

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
		</Section>
	);
});
