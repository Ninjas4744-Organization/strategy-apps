import {useState} from "react";
import {BeautifulButton, FormGroup, Subtitle, TextInput, Title} from "@ninjas-strategy/ui";
import {TBAEventInput} from "@/lib/components/admin/TBAEventInput";
import {TBAEventSimple} from "@/lib/interfaces/TBAEventSimple";
import {useRouter} from "expo-router";
import {observer} from "mobx-react-lite";
import adminStore from "@/lib/stores/adminStore";

const initialYear = new Date().getFullYear();

export default observer(function AddEventForm () {
	const router = useRouter();
	const {createEvent} = adminStore;
	const [year, setYear] = useState(new Date().getFullYear());
	const [selectedEvent, setSelectedEvent] = useState<TBAEventSimple | null>(null);
	const [eventName, setEventName] = useState('');

	return (
		<FormGroup>
			<Title>Create Event</Title>

			<TextInput
				mode="outlined"
				label="Season Year"
				placeholder="e.g. 2025"
				keyboardType="numeric"
				value={year.toString()}
				onChangeText={(text) => {
					const parsed = parseInt(text, 10);
					if (!isNaN(parsed)) {
						setYear(parsed);
					} else {
						setYear(initialYear);
					}
					setSelectedEvent(null);
				}}
			/>

			<TBAEventInput
				year={year}
				label="FRC Event"
				placeholder="Search event by name, city, or code"
				initialValue={selectedEvent}
				onSelect={(ev) => (setSelectedEvent(ev), setEventName(ev.name))}/>

			{selectedEvent && (
				<>
					<TextInput
						mode="outlined"
						label="Event Name"
						value={eventName}
						onChangeText={setEventName} />
					<Subtitle>✅ Selected: {selectedEvent.name} ({selectedEvent.key})</Subtitle>
					<Subtitle>Start date: {selectedEvent.start_date}</Subtitle>
					<Subtitle>End date: {selectedEvent.end_date}</Subtitle>
					{eventName && <BeautifulButton icon="check" label="Continue" onPress={() => createEvent(eventName, selectedEvent, router)}/>}
				</>
			)}

		</FormGroup>
	);
});
