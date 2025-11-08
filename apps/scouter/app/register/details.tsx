import {useState} from "react";
import {TextInput, Title, Subtitle, FormGroup, showSnackbar, BeautifulButton} from "@ninjas-strategy/ui";
import {useLocalSearchParams, useRouter} from "expo-router";
import styled from "styled-components/native";
import {updateProfile} from "firebase/auth";
import {db} from "@/lib/firebase/firestore";
import {doc, setDoc} from "firebase/firestore";
import {z, ZodError} from "zod";
import {KeyboardAvoidingView, Platform, ScrollView, View} from "react-native";
import {userStore} from "@/lib/stores/userStore";
import {observer} from "mobx-react-lite";

const userSchema = z
	.object({
		email: z.string().email({ message: "Invalid email address" }),
		password: z
			.string()
			.min(8, { message: "Password must be at least 8 characters long" })
			.regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
			.regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
			.regex(/[0-9]/, { message: "Password must contain at least one number" })
			.regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

const Container = styled.View`
	flex: 1;
	padding: 24px;
`;

const BottomBar = styled(View)`
	padding-top: 12px;
`;

export default observer(function RegistrationDetailsPage() {
	const router = useRouter();
	const {teamNumber, userType} = useLocalSearchParams();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const {signUp} = userStore;

	const handleRegister = async () => {
		try {
			setLoading(true);
			userSchema.parse({email, password, confirmPassword});

			const userCred = await signUp(email, password);
			await updateProfile(userCred.user, {displayName: name});

			await setDoc(doc(db, "users", userCred.user.uid), {
				name,
				teamNumber,
				userType,
			});

			router.replace("/");
			showSnackbar("Welcome to Team " + teamNumber + "!");
		} catch (err: any) {
			if (err instanceof ZodError) {
				showSnackbar(err.errors[0].message);
			} else {
				console.error(err);
				showSnackbar(err.message || "Failed to register");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView
			style={{flex: 1}}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
			<Container>
				<ScrollView
					contentContainerStyle={{flexGrow: 1, justifyContent: "center"}}
					keyboardShouldPersistTaps="handled">
					<FormGroup>
						<Title>Register</Title>
						<Subtitle>
							Team {teamNumber} ({userType})
						</Subtitle>

						<TextInput label="Full Name" value={name} onChangeText={setName} />

						<TextInput
							label="Email"
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"/>

						<TextInput
							label="Password"
							value={password}
							onChangeText={setPassword}
							secureTextEntry/>

						<TextInput
							label="Confirm Password"
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							secureTextEntry/>
					</FormGroup>
				</ScrollView>

				<BottomBar>
					{name && email && password && confirmPassword && !loading && (
						<BeautifulButton
							onPress={handleRegister}
							label="Register"
							icon="person-add"/>
					)}
				</BottomBar>
			</Container>
		</KeyboardAvoidingView>
	);
})
