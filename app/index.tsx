import {useAuth} from '@/lib/context/auth';
import {useState} from "react";
import {Pulse} from "@/lib/components/animations/pulse";
import styled from 'styled-components/native';
import {Button, MD2Colors, TextInput} from "react-native-paper";
import {Text} from '@/lib/components/styles/Text';
import {Icon} from "@/lib/components/Icon";
import {useRouter} from "expo-router";
import {IconContainer} from "@/lib/components/styles/IconContainer";
import {BeautifulButton} from "@/lib/components/styles/BeautifulButton";
import {z} from "zod";
import snackbar from "@/lib/stores/snackbar";

const userSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z.string().min(8, { message: "Password must be at least 8 characters long" })
		.regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
		.regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
		.regex(/[0-9]/, { message: "Password must contain at least one number" })
		.regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"],
});

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
	const {signIn, user, signOut, signUp} = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const nextRoute = useLoginRouter();
	const [registerMode, setRegisterMode] = useState(false);

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
				snackbar.show('Invalid email');
			else if (e.code === 'auth/missing-password')
				snackbar.show('Please type a password');
			else if (e.code === 'auth/invalid-credential')
				snackbar.show('Incorrect password');
			else
				snackbar.show(e.message);
		}
	};

	const handleRegister = async () => {
		try {
			userSchema.parse({email, password, confirmPassword});
			await signUp(email, password);
			snackbar.show('Registration successful!');
			setRegisterMode(false);
			setEmail('');
			setPassword('');
			setConfirmPassword('');
		} catch (e: any) {
			if (e instanceof z.ZodError) {
				snackbar.show(e.issues[0].message);
			} else {	//firebase errors
				if (e.code === 'auth/email-already-in-use')
					snackbar.show('Email already in use');
				else
					snackbar.show(e.message);
			}
		}
	}

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
			{registerMode && <LoginTextInput
				label="Confirm Password"
				secureTextEntry
				value={confirmPassword}
				onChangeText={setConfirmPassword}
				left={<TextInput.Icon icon="lock"/>}
				underlineStyle={{display: 'none'}}/>}
		</FormGroup>
		<BeautifulButton onPress={registerMode ? handleRegister : handleLogin} icon={registerMode ? "person-add" : "login"} label={registerMode ? "Register" : "Login"} />
		<Button onPress={() => setRegisterMode(!registerMode)} mode="elevated">
			{registerMode ? 'Already have an account? Login' : 'Need an account? Register'}
		</Button>
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
