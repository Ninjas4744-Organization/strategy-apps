import type {FRCGame} from "@ninjas-strategy/frc-games/types";
import {Section} from "./Section";
import {observer} from "mobx-react-lite";

type GameFormProps = FRCGame & {
	phase: string;
	data: Record<string, any>;
	setData: (key: string, value: any) => void;
};

export const GameForm = observer(({sections, phase, data, setData}: GameFormProps) => {
	return <>
		{sections.filter((section) => section.phase === phase).map(section => (
			<Section key={section.id} {...section} data={data} setData={setData} />
		))}
	</>;
});
