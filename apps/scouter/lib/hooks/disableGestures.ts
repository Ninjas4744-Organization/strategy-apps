import {useEffect} from "react";
import {useNavigation} from "expo-router";

export const useDisableGestures = () => {
	const navigation = useNavigation();

	useEffect(() => {
		let parent = navigation.getParent();
		while (parent) {
			parent.setOptions({ gestureEnabled: false });
			parent = parent.getParent();
		}

		return () => {
			let parent = navigation.getParent();
			while (parent) {
				parent.setOptions({ gestureEnabled: true });
				parent = parent.getParent();
			}
		};
	}, [navigation]);
}
