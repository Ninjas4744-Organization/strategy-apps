import {useAuth} from '@/lib/context/auth';
import {useState} from "react";
import styled from 'styled-components/native';
import {Button} from "react-native-paper";
import {useRouter} from "expo-router";
import {BeautifulButton, Text, showSnackbar, AppHeader, TextInput, TextInputIcon, FormGroup} from "@ninjas-strategy/ui";

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

const StartButton = () => {
	const {user} = useAuth();
	const nextRoute = useLoginRouter();

	const label = user?.email === 'admin@gmail.com' ? 'To admin panel' : 'Start game';
	const icon = user?.email === 'admin@gmail.com' ? 'admin-panel-settings' : 'play-arrow';

	return user ? <Section>
		<Text>Hi, {user.email}</Text>
		<BeautifulButton onPress={() => nextRoute()} icon={icon} label={label} />
	</Section>: null;
};

const LoginForm = () => {
	const {signIn, user, signOut} = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const nextRoute = useLoginRouter();
	const router = useRouter();

	const handleLogin = async () => {
		try {
			if (user)
				await signOut();
			await signIn(email, password);
			setEmail('');
			setPassword('');
			nextRoute(email);
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
};

const useLoginRouter = () => {
	const {user} = useAuth();
	const router = useRouter();

	return (email?: string | null) => {
		if (!email) {
			if (!user) {
				return;
			}
			email = user.email;
		}
		if (email === 'admin@gmail.com')
			return router.push('/admin');
		router.push('/game/autonomous');
	};
};
