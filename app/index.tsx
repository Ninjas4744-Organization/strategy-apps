import { useAuth } from '../lib/context/auth';
import {useState} from "react";
import {Pulse} from "../components/animations/pulse";
import styled from 'styled-components/native';
import {TextInput} from "react-native-paper";
import {Text} from '../components/styles/Text';
import {Icon} from "../components/Icon";
import {useRouter} from "expo-router";
import {IconContainer} from "../components/styles/IconContainer";
import {BeautifulButton} from "../components/styles/BeautifulButton";
import {KeyboardAvoidingView, Platform, ScrollView} from "react-native";

const Container = styled.SafeAreaView`
	padding: 50px 12px 12px;
	background-color: transparent;
	display: flex;
	flex-direction: column;
`;

const HeaderContainer = styled(Pulse)`
	padding: 16px;
	gap: 12px;
	justify-content: center;
	align-items: center;
`;

const Title = styled(Text)`
	font-size: 24px;
	font-weight: bold;
`;

const Subtitle = styled(Text)`
	font-size: 14px;
	opacity: 0.8;
`;

export default function Index() {
	return (
		<Container>
			<HeaderContainer>
				<IconContainer>
					<Icon color='#e8e8e8' name="sports-esports" size={36}/>
				</IconContainer>
				<Title>Ninjas Scouting App</Title>
				<Subtitle>Team Performance Analytics</Subtitle>
			</HeaderContainer>
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
	return user ? <Section>
		<Text>Hi, {user.email}</Text>
		<BeautifulButton onPress={() => nextRoute()} icon="play-arrow" label="Start game" />
	</Section>: null;
};

const FormGroup = styled.View`
	padding: 20px;
	background-color: #FFFFFF20;
	gap: 16px;
	border-radius: 16px;
`;

const LoginTextInput = styled(TextInput)`
	background-color: #FFFFFF70;
	border-radius: 16px;
`;

const LoginForm = () => {
	const {signIn, user, signOut} = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [seePassword, setSeePassword] = useState(false);
	const nextRoute = useLoginRouter();

	const handleLogin = async () => {
		if (user)
			await signOut();
		await signIn(email, password);
		nextRoute();
	};

	return <Section>
		{user && <Text>Login as someone else</Text>}
		<FormGroup>
			<LoginTextInput
				label="Email"
				keyboardType="email-address"
				value={email}
				onChangeText={setEmail}
				left={<TextInput.Icon icon="email" />}
				underlineStyle={{display: 'none'}}/>
			<LoginTextInput
				label="Password"
				secureTextEntry={!seePassword}
				value={password}
				onChangeText={setPassword}
				left={<TextInput.Icon icon="lock" />}
				// right={<TextInput.Icon icon={seePassword ? 'eye' : 'eye-off'} onPress={() => setSeePassword(!seePassword)} />}
				underlineStyle={{display: 'none'}}/>
		</FormGroup>
		<BeautifulButton onPress={() => handleLogin()} icon="login" label="Login" />
	</Section>;
};

const useLoginRouter = () => {
	const {user} = useAuth();
	const router = useRouter();

	return () => {
		if (!user)
			return;
		if (user.email === 'admin@gmail.com')
			return router.push('/admin');
		router.push('/game/autonomous');
	};
};
