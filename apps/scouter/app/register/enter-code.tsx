import {useState} from "react";
import {TextInput, Title, Subtitle, FormGroup, BeautifulButton, showSnackbar, TextInputIcon} from "@ninjas-strategy/ui";
import styled from "styled-components/native";
import {doc, getDoc} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";
import {useRouter} from "expo-router";
import {useDebounce} from "@/lib/hooks/debounce";
import {KeyboardAvoidingView, Platform, ScrollView, View} from "react-native";
import {z, ZodError} from "zod";
import * as Clipboard from "expo-clipboard";
import {useKeyboardHeight} from "@/lib/hooks/keyboardHeight";

export const registrationCodeSchema = z
	.string()
	.regex(/^ninja-scout-[A-Za-z0-9]{10}$/, {
		message: "Code must start with 'ninja-scout-' and have 10 letters or numbers after it",
	});

const Container = styled.SafeAreaView`
	flex: 1;
	padding: 24px;
`;

const BottomBar = styled(View)`
	padding-top: 12px;
`;

export default function EnterCodePage() {
	const [teamNumber, setTeamNumber] = useState("");
	const [registrationCode, setRegistrationCode] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const keyboardHeight = useKeyboardHeight();

	const debouncedTeam = useDebounce(teamNumber, 250);

	const handleContinue = async () => {
		try {
			setLoading(true);
			try {
				registrationCodeSchema.parse(registrationCode);
			} catch (err) {
				if (err instanceof ZodError) {
					showSnackbar(err.errors[0].message);
					return;
				}
			}

			const ref = doc(db, "registration_codes", debouncedTeam);
			const snap = await getDoc(ref);
			if (!snap.exists()) {
				showSnackbar("Team not found");
				return;
			}
			const data = snap.data();
			let userType: "member" | "admin" | null = null;

			if (registrationCode === data.members_code) userType = "member";
			else if (registrationCode === data.admins_code) userType = "admin";

			if (!userType) {
				showSnackbar("Invalid registration code");
				return;
			}

			router.push({
				pathname: "/register/details",
				params: { teamNumber, userType },
			});
		} catch (e) {
			console.error(e);
			showSnackbar("Failed to verify code");
		} finally {
			setLoading(false);
		}
	};

	const pasteRegistrationCode = async () => {
		const text = await Clipboard.getStringAsync();
		setRegistrationCode(text);
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
			<Container>
				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
						justifyContent: "center",
						paddingBottom: keyboardHeight + 80,
					}}
					keyboardShouldPersistTaps="handled">
					<FormGroup>
						<Title>Join Your Team</Title>
						<Subtitle>Enter your team number and registration code</Subtitle>
						<TextInput
							label="Team Number"
							value={teamNumber}
							onChangeText={setTeamNumber}
							keyboardType="number-pad"/>
						<TextInput
							label="Registration Code"
							value={registrationCode}
							onChangeText={setRegistrationCode}
							right={
								<TextInputIcon
									icon="content-paste"
									onPress={pasteRegistrationCode}
									forceTextInputFocus={false}/>
							}/>

						{registrationCode && !registrationCodeSchema.safeParse(registrationCode).success && (
							<Subtitle style={{ color: "red" }}>
								Code format: ninja-scout-XXXXXXXXXX
							</Subtitle>
						)}
					</FormGroup>
				</ScrollView>

				<BottomBar>
					{!loading && registrationCode && teamNumber && (
						<BeautifulButton
							onPress={handleContinue}
							label="Continue"
							icon="check"/>
					)}
				</BottomBar>
			</Container>
		</KeyboardAvoidingView>
	);
}
