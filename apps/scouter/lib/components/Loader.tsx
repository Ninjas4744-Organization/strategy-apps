import {observer} from "mobx-react-lite";
import {useEffect} from "react";

type LoaderProps = {
	subscribe: () => void;
	unsubscribe: () => void;
};

export const Loader = observer(({subscribe, unsubscribe}: LoaderProps) => {
	useEffect(() => {
		subscribe();
		return () => unsubscribe();
	}, []);

	return null;
});