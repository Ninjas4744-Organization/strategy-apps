import {observer} from "mobx-react-lite";
import {BreakdownSection} from '@/lib/components/admin/detailed/Breakdown';
import {useGlobalSearchParams} from "expo-router";
import {ScoreTrend} from '@/lib/components/admin/analytics/ScoreTrend';
import {BodyScroll, FocusWrapper} from "@ninjas-strategy/ui";
import {useContext} from "react";
import {EventContext, EventStore} from "@/lib/stores/eventStore";
import {Team} from "@ninjas-strategy/frc-games";

export default observer(function () {
	const {id} = useGlobalSearchParams();
	const {teams} = useContext(EventContext) as EventStore;
	const team = teams[Number.parseInt(id as string)];

	return <BodyScroll>
		<FocusWrapper>
			<ScoreTrend team={team}/>
			{team.game.teamDetailedBreakdowns.map((section, index) => (
				<BreakdownSection<Team>
					key={"team-" + team.id + '-breakdown-' + index}
					{...section}
					item={team} />
			))}
		</FocusWrapper>
	</BodyScroll>;
});
