import {useCallback, useMemo, useState} from "react";
import {ActivityIndicator, FlatList, TouchableOpacity, View} from "react-native";
import axios from "axios";
import {BottomSheet, Icon, NativeTextField, Text, TextInput, TextInputIcon} from "@ninjas-strategy/ui";
import styled from "styled-components/native";
import {TBAEventSimple} from "@/lib/interfaces/TBAEventSimple";
import {useDebounce} from "@/lib/hooks/debounce";

type TBAEventInputProps = {
	year: number;
	label?: string;
	placeholder?: string;
	initialValue?: TBAEventSimple | null;
	onSelect?: (ev: TBAEventSimple) => void;
	disabled?: boolean;
};

const TBA_BASE = "https://www.thebluealliance.com/api/v3";

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

const ErrorText = styled(Text)`
	color: ${({theme}) => theme.danger};
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

const Divider = styled.View`
	height: 1px;
	background-color: ${({theme}) => theme.border};
`;

const ResultRow = styled.View`
	flex-direction: row;
	align-items: center;
	gap: 12px;
	padding: 12px;
`;

const ResultText = styled.View`
	flex: 1;
	min-width: 0;
`;

const ResultTitle = styled(Text)`
	font-weight: 700;
`;

const RetryButton = styled.Pressable`
	align-self: flex-start;
	min-height: 40px;
	border-radius: 12px;
	padding: 9px 14px;
	background-color: ${({theme}) => theme.primary};
`;

const RetryText = styled.Text`
	color: ${({theme}) => theme.primaryText};
	font-weight: 700;
`;

export const TBAEventInput: React.FC<TBAEventInputProps> = ({year, label = "FRC Event", placeholder = "Search by name / city / code…", initialValue = null, onSelect, disabled}) => {
	const [allEvents, setAllEvents] = useState<TBAEventSimple[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState<string | null>(null);

	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 200);

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
				label={label}
				placeholder={placeholder}
				value={selected ? `${selected.name} (${selected.key})` : ""}
				onFocus={openModal}
				right={<TextInputIcon icon={modalVisible ? "chevron-up" : "chevron-down"} onPress={openModal} disabled={disabled}/>}
				editable={false}
				disabled={disabled}
			/>

			<BottomSheet
				isPresented={modalVisible}
				onDismiss={closeModal}
				title={`Choose FRC Event • ${year}`}>
				<TitleContainer>
					<NativeTextField
						placeholder={placeholder}
						value={query}
						onChangeText={setQuery}
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
						<ErrorText>{err}</ErrorText>
						<RetryButton onPress={loadEvents}>
							<RetryText>Retry</RetryText>
						</RetryButton>
					</ErrorContainer>
				) : (
					<ResultsList
						data={filtered}
						keyExtractor={(item) => item.key}
						keyboardShouldPersistTaps="always"
						initialNumToRender={20}
						renderItem={({item}) => (
							<TouchableOpacity onPress={() => handlePick(item)}>
								<ResultRow>
									<Icon name="calendar-today" size={22} />
									<ResultText>
										<ResultTitle numberOfLines={1}>{item.name}</ResultTitle>
										<Text numberOfLines={2}>
											{item.city ?? ""}{item.city ? ", " : ""}{item.country ?? ""} • {item.start_date} → {item.end_date} • {item.key}
										</Text>
									</ResultText>
									<ResultContainer>
										<Text>{item.event_code.toUpperCase()}</Text>
									</ResultContainer>
								</ResultRow>
							</TouchableOpacity>
						)}
						ListEmptyComponent={
							<NoResultsContainer>
								<Text>No events match “{debouncedQuery}”.</Text>
							</NoResultsContainer>
						}
						ItemSeparatorComponent={Divider}/>
				)}
			</BottomSheet>
		</View>
	);
};
