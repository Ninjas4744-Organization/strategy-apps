import type {FRCGame, Page} from "@ninjas-strategy/frc-games/types";
import {Section} from "./Section";
import {observer} from "mobx-react-lite";

type GameFormProps = FRCGame & {
	pageNum: number;
	data: Record<string, any>;
	setData: (key: string, value: any) => void;
};

export const GameForm = observer(({data, setData, pageNum, pages, sections}: GameFormProps) => {
	const page: Page = pages[pageNum]!;
	const pageSections = page.sections(data).map(s => sections[s]);

	return <>
		{pageSections.map(section => (
			<Section key={section?.id} {...section!} data={data} setData={setData} pageNum={pageNum} />
		))}
	</>;
});
