import {useAuth} from '@/lib/context/auth';
import {useState} from "react";
import {Pulse} from "@/lib/components/animations/pulse";
import styled from 'styled-components/native';
import {MD2Colors, TextInput} from "react-native-paper";
import {Text} from '@/lib/components/styles/Text';
import {Icon} from "@/lib/components/Icon";
import {useRouter} from "expo-router";
import {IconContainer} from "@/lib/components/styles/IconContainer";
import {BeautifulButton} from "@/lib/components/styles/BeautifulButton";

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
					<Icon color={MD2Colors.grey500} name="sports-esports" size={36}/>
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

	const label = user?.email === 'admin@gmail.com' ? 'To admin panel' : 'Start game';
	const icon = user?.email === 'admin@gmail.com' ? 'admin-panel-settings' : 'play-arrow';

	return user ? <Section>
		<Text>Hi, {user.email}</Text>
		<BeautifulButton onPress={() => nextRoute()} icon={icon} label={label} />
	</Section>: null;
};

const FormGroup = styled.View`
	padding: 20px;
	background-color: ${MD2Colors.white}10;
	gap: 16px;
	border: ${MD2Colors.white}20;
	border-radius: 16px;
`;

const LoginTextInput = styled(TextInput)`
	background-color: ${MD2Colors.white}70;
	border-radius: 16px;
`;

const LoginForm = () => {
	const {signIn, user, signOut} = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const nextRoute = useLoginRouter();

	const handleLogin = async () => {
		if (user)
			await signOut();
		await signIn(email, password);
		nextRoute(email);
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
				secureTextEntry
				value={password}
				onChangeText={setPassword}
				left={<TextInput.Icon icon="lock" />}
				underlineStyle={{display: 'none'}}/>
		</FormGroup>
		<BeautifulButton onPress={() => handleLogin()} icon="login" label="Login" />
	</Section>;
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
