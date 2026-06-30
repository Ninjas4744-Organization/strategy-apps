import {doc, setDoc} from "firebase/firestore";
import {db} from "@/lib/firebase/firestore";

export const ensureEventTeamDoc = async (eventId: string, teamNumber: string | number) => {
	const normalizedTeamNumber = Number(teamNumber);
	if (!eventId || !Number.isFinite(normalizedTeamNumber) || normalizedTeamNumber <= 0) {
		return;
	}

	const teamRef = doc(db, 'events', eventId, 'teams', normalizedTeamNumber.toString());
	await setDoc(teamRef, {
		team_number: normalizedTeamNumber,
	}, {merge: true});
};
