import {useState} from "react";
import {BeautifulButton, FormGroup, Subtitle, TextInput, Title} from "@ninjas-strategy/ui";
import {TBAEventInput} from "@/lib/components/admin/TBAEventInput";
import {TBAEventSimple} from "@/lib/interfaces/TBAEventSimple";
import {Stack, useRouter} from "expo-router";
import {observer} from "mobx-react-lite";
import adminStore from "@/lib/stores/adminStore";

const initialYear = new Date().getFullYear();

export default observer(function AddEventForm () {
	const router = useRouter();
	const {createEvent} = adminStore;
	const [year, setYear] = useState(new Date().getFullYear());
	const [selectedEvent, setSelectedEvent] = useState<TBAEventSimple | null>(null);

	return (
		<>
			<Stack.Screen options={{title: 'Create Event'}}/>
			<FormGroup>
				<Title>Create Event</Title>

				<TextInput
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
					}}/>

				<TBAEventInput
					year={year}
					label="FRC Event"
					placeholder="Search event by name, city, or code"
					initialValue={selectedEvent}
					onSelect={(ev) => setSelectedEvent(ev)}/>

				{selectedEvent && (
					<BeautifulButton
						icon="check"
						label="Continue"
						onPress={() => createEvent(selectedEvent, router)}/>
				)}
			</FormGroup>
		</>
	);
});
