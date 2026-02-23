import {action, computed, makeObservable, observable} from "mobx";
import {encodePresence, PRESENCE_SERVICE_UUID, PresenceStatus} from "@/lib/blePrescence";
import {startAdvertising, stopAdvertising} from "munim-bluetooth";
import Constants from "expo-constants";
import userStore from "@/lib/stores/userStore";
import {isExpoGo} from "@/lib/utilities";

class BleStore {
	_shortId: number;
	@observable private deviceId: string | null = null;
	@observable status: PresenceStatus = 'available';

	constructor() {
		makeObservable(this);
		this._shortId = Math.floor(Math.random() * 2 ** 32) >>> 0;
	}

	@computed
	get id() {
		return this.deviceId;
	}

	@action
	setId(id: string) {
		this.deviceId = id;
	}

	@action
	clearId() {
		this.deviceId = null;
	}

	@action
	advertise(status: PresenceStatus, teamNumber: number, matchNumber: number = 0) {
		if (isExpoGo()) {
			return;
		}

		const manufacturerData = encodePresence({status, teamNumber, matchNumber, shortId: this._shortId});

		startAdvertising({
			serviceUUIDs: [PRESENCE_SERVICE_UUID],
			localName: userStore.userData?.name,
			manufacturerData,
		});
	}

	@action
	stop() {
		if (isExpoGo()) {
			return;
		}

		stopAdvertising();
	}
}

const bleStore = new BleStore();
export default bleStore;
