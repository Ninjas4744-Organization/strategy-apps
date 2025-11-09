import {Loading, HeaderButtons, TextInput, Subtitle, Icon, TextInputIcon} from "@ninjas-strategy/ui";
import {ScrollView} from "react-native";
import {observer} from "mobx-react-lite";
import {Stack} from "expo-router";
import {Button, Dialog, Portal} from "react-native-paper";
import {useEffect, useMemo, useState} from "react";
import styled from "styled-components/native";
import Animated, {FadeInUp} from "react-native-reanimated";
import {RegistrationCodeItem} from "@/lib/components/admin/RegistrationCodeItem";
import {useDebounce} from "@/lib/hooks/debounce";
import registrationCodesStore from "@/lib/stores/registrationCodesStore";

const Container = styled.View`
	flex: 1;
	padding: 16px;
`;

const SearchBarWrapper = styled.View`
	margin-bottom: 12px;
`;

const EmptyState = styled.View`
	align-items: center;
	justify-content: center;
	flex: 1;
	margin-top: 100px;
`;

export default observer(function RegistrationCodesPage() {
	const {registrationCodes, subscribe, unsubscribe, isLoading, generateRegistrationCode} = registrationCodesStore;
	const [showAddDialog, setShowAddDialog] = useState(false);
	const [registrationTeam, setRegistrationTeam] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedQuery = useDebounce(searchQuery);

	useEffect(() => {
		subscribe();
		return () => unsubscribe();
	}, []);

	const filteredCodes = useMemo(() => {
		const allCodes = Object.values(registrationCodes || {});
		if (!debouncedQuery.trim()) {
			return allCodes;
		}
		const q = debouncedQuery.toLowerCase();
		return allCodes.filter(
			code =>
				code.id.toLowerCase().includes(q) ||
				code.membersCode.toLowerCase().includes(q) ||
				code.adminsCode.toLowerCase().includes(q)
		);
	}, [registrationCodes, debouncedQuery, registrationCodes]);

	if (isLoading)
		return <Loading />;

	return (
		<Container>
			<Stack.Screen
				options={{
					headerShown: true,
					title: 'Registration Codes',
					headerRight: () => (
						<HeaderButtons
							buttons={[{ onPress: () => setShowAddDialog(true), icon: 'person-add' }]}
						/>
					),
				}}
			/>

			<SearchBarWrapper>
				<TextInput
					label="Search team"
					value={searchQuery}
					onChangeText={setSearchQuery}
					left={<TextInputIcon icon="magnify" />}
					clearButtonMode="while-editing"
				/>
			</SearchBarWrapper>

			{filteredCodes.length === 0 ? (
				<EmptyState>
					<Icon name="search" size={72} color="#888" />
					<Subtitle>No matching teams</Subtitle>
				</EmptyState>
			) : (
				<ScrollView contentContainerStyle={{ paddingVertical: 8 }}>
					<Animated.View entering={FadeInUp.duration(400)}>
						{filteredCodes.map((code, i) => (
							<Animated.View key={code.id} entering={FadeInUp.delay(i * 50)}>
								<RegistrationCodeItem {...code} />
							</Animated.View>
						))}
					</Animated.View>
				</ScrollView>
			)}

			<Portal>
				<Dialog visible={showAddDialog} onDismiss={() => setShowAddDialog(false)}>
					<Dialog.Title>Add Team Registration</Dialog.Title>
					<Dialog.Content>
						<TextInput
							label="Team Number"
							keyboardType="number-pad"
							value={registrationTeam}
							onChangeText={setRegistrationTeam}
						/>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => setShowAddDialog(false)}>Cancel</Button>
						<Button
							mode="contained"
							disabled={!registrationTeam}
							onPress={async () => {
								setShowAddDialog(false);
								await generateRegistrationCode(registrationTeam);
								setRegistrationTeam('');
							}}
						>
							Create
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</Container>
	);
});
