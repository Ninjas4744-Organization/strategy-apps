import { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent } from "react-native";

export function useKeyboardHeight() {
	const [keyboardHeight, setKeyboardHeight] = useState(0);

	useEffect(() => {
		const show = Keyboard.addListener("keyboardDidShow", (e: KeyboardEvent) =>
			setKeyboardHeight(e.endCoordinates.height)
		);
		const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardHeight(0));
		return () => {
			show.remove();
			hide.remove();
		};
	}, []);

	return keyboardHeight;
}
