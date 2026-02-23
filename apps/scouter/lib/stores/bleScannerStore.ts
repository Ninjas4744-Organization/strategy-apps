import {action, makeObservable, observable, runInAction} from "mobx";
import {Observable, type Subscription} from "rxjs";
import {isExpoGo} from "@/lib/utilities";
import * as Ble from "munim-bluetooth";
import {decodePresence, PRESENCE_SERVICE_UUID} from "@/lib/blePrescence";

type Device = {
	shortId: number;
	status: string;
	teamNumber: number;
	matchNumber: number;
	rssi?: number;
	lastSeen: number;
};

type Devices = {
	[shortId: string]: Device;
};

class BleScannerStore {
	@observable isScanning: boolean = true;
	@observable devices: Devices = {};
	private subscription: Subscription | null = null;

	constructor() {
		makeObservable(this);
	}

	@action.bound
	subscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}

		if (isExpoGo()) {
			return;
		}

		Ble.startScan({
			serviceUUIDs: [PRESENCE_SERVICE_UUID],
			allowDuplicates: true,
			scanMode: 'balanced',
		});

		const $devices = new Observable(subscriber => {
			if (this.isScanning) {
				Ble.addEventListener('deviceFound', (device) => {
					subscriber.next(device);
				});
			}
			return () => subscriber.unsubscribe();
		});

		this.subscription = $devices.subscribe((device: any) => {
			runInAction(() => {
				const manufacturerHex =
					device?.manufacturerData ??
					device?.advertisingData?.manufacturerData ??
					device?.advertisementData?.manufacturerData ??
					device?.advertisingData?.manufacturerDataHex ??
					device?.advertisementData?.manufacturerDataHex;

				const parsed = typeof manufacturerHex === "string" ? decodePresence(manufacturerHex) : null;
				if (!parsed) {
					return;
				}

				const rssi =
					device?.rssi ??
					device?.advertisingData?.rssi ??
					device?.advertisementData?.rssi;

				const now = Date.now();

				this.devices[parsed.shortId] = {
					shortId: parsed.shortId,
					status: parsed.status,
					teamNumber: parsed.teamNumber,
					matchNumber: parsed.matchNumber,
					rssi: typeof rssi === "number" ? rssi : undefined,
					lastSeen: now,
				};
			});
		});
	}

	@action.bound
	unsubscribe() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
		this.subscription = null;
		Ble.stopScan();
	}
}

const bleScannerStore = new BleScannerStore();
export default bleScannerStore;
