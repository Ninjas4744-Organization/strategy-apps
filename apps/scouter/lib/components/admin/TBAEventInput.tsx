import {useCallback, useEffect, useMemo, useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";
import {ActivityIndicator, Divider, List, Modal, Portal, Text, useTheme, Button} from "react-native-paper";
import axios from "axios";
import {TextInput, TextInputIcon} from "@ninjas-strategy/ui";
import styled from "styled-components/native";
import {TBAEventSimple} from "@/lib/interfaces/TBAEventSimple";

type TBAEventInputProps = {
	year: number;
	label?: string;
	placeholder?: string;
	initialValue?: TBAEventSimple | null;
	onSelect?: (ev: TBAEventSimple) => void;
	disabled?: boolean;
};

const TBA_BASE = "https://www.thebluealliance.com/api/v3";

function useDebounced<T>(value: T, delay = 250) {
	const [v, setV] = useState(value);
	useEffect(() => {
		const id = setTimeout(() => setV(value), delay);
		return () => clearTimeout(id);
	}, [value, delay]);
	return v;
}

const TitleContainer = styled.View`
	padding: 8px 12px;
`;

const LoadingContainer = styled.View`
	padding: 24px;
	align-items: center;
`;

const ErrorContainer = styled.View`
	padding: 16px;
`;

const ErrorText = styled(Text)<{color: string}>`
	color: ${props => props.color};
	margin-bottom: 8px;
`;

const ResultsList = styled(FlatList<TBAEventSimple>)`
	max-height: 420px;
`;

const ResultContainer = styled.View`
	justify-content: center;
	padding-right: 8px;
`;

const NoResultsContainer = styled.View`
	padding: 16px;
`;

const CloseContainer = styled.View`
	padding: 8px;
	align-items: flex-end;
`;

export const TBAEventInput: React.FC<TBAEventInputProps> = ({year, label = "FRC Event", placeholder = "Search by name / city / code…", initialValue = null, onSelect, disabled}) => {
	const theme = useTheme();
	const [allEvents, setAllEvents] = useState<TBAEventSimple[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState<string | null>(null);

	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounced(query, 200);

	const [modalVisible, setModalVisible] = useState(false);
	const [selected, setSelected] = useState<TBAEventSimple | null>(initialValue);

	const loadEvents = useCallback(async () => {
		setLoading(true);
		setErr(null);
		try {
			const res = await axios.get(`${TBA_BASE}/events/${year}/simple`, {
				headers: {
					"X-TBA-Auth-Key": process.env.EXPO_PUBLIC_TBA_API_KEY,
				},
			});
			if (!res.data) {
				throw new Error(`Error ${res.status}: ${res.statusText}`);
			}
			const data: TBAEventSimple[] = res.data;
			data.sort((a, b) => a.name.localeCompare(b.name));
			setAllEvents(data);
		} catch (e: any) {
			setErr(e?.message || "Failed to load TBA events");
		} finally {
			setLoading(false);
		}
	}, [year]);

	const openModal = useCallback(() => {
		setModalVisible(true);
		if (!allEvents && !loading) {
			loadEvents();
		}
	}, [allEvents, loading, loadEvents]);

	const closeModal = useCallback(() => setModalVisible(false), []);

	const filtered = useMemo(() => {
		if (!allEvents) return [];
		const q = debouncedQuery.trim().toLowerCase();
		if (!q) return allEvents.slice(0, 50);
		return allEvents.filter((e) => {
			const parts = [
				e.name,
				e.city ?? "",
				e.state_prov ?? "",
				e.country ?? "",
				e.event_code,
				e.key,
			].join(" ").toLowerCase();
			return parts.includes(q);
		});
	}, [allEvents, debouncedQuery]);

	const handlePick = useCallback(
		(ev: TBAEventSimple) => {
			setSelected(ev);
			onSelect?.(ev);
			setModalVisible(false);
		},
		[onSelect]
	);

	return (
		<View>
			<TextInput
				mode="outlined"
				label={label}
				placeholder={placeholder}
				value={selected ? `${selected.name} (${selected.key})` : ""}
				onFocus={openModal}
				right={<TextInputIcon icon={modalVisible ? "chevron-up" : "chevron-down"} onPress={openModal} disabled={disabled}/>}
				editable={false}
				disabled={disabled}
			/>

			<Portal>
				<Modal
					visible={modalVisible}
					onDismiss={closeModal}
					contentContainerStyle={{
						margin: 16,
						borderRadius: 12,
						backgroundColor: theme.colors.background,
						paddingVertical: 8,
						maxHeight: "80%",
					}}>
					<TitleContainer>
						<Text variant="titleMedium">Choose FRC Event • {year}</Text>
						<TextInput
							mode="flat"
							placeholder={placeholder}
							value={query}
							onChangeText={setQuery}
							autoFocus
							left={<TextInputIcon icon="magnify" />}
						/>
					</TitleContainer>

					<Divider />

					{loading ? (
						<LoadingContainer>
							<ActivityIndicator />
						</LoadingContainer>
					) : err ? (
						<ErrorContainer>
							<ErrorText color={theme.colors.error}>{err}</ErrorText>
							<Button mode="contained-tonal" onPress={loadEvents} icon="reload">Retry</Button>
						</ErrorContainer>
					) : (
						<ResultsList
							data={filtered}
							keyExtractor={(item) => item.key}
							keyboardShouldPersistTaps="always"
							initialNumToRender={20}
							renderItem={({item}) => (
								<TouchableOpacity onPress={() => handlePick(item)}>
									<List.Item
										title={item.name}
										description={`${item.city ?? ""}${item.city ? ", " : ""}${item.country ?? ""} • ${item.start_date} → ${item.end_date} • ${item.key}`}
										left={(props) => <List.Icon {...props} icon="calendar" />}
										right={() => (
											<ResultContainer>
												<Text>{item.event_code.toUpperCase()}</Text>
											</ResultContainer>
										)}
									/>
								</TouchableOpacity>
							)}
							ListEmptyComponent={
								<NoResultsContainer>
									<Text>No events match “{debouncedQuery}”.</Text>
								</NoResultsContainer>
							}
							ItemSeparatorComponent={Divider}/>
					)}

					<CloseContainer>
						<Button onPress={closeModal}>Close</Button>
					</CloseContainer>
				</Modal>
			</Portal>
		</View>
	);
};
