import {CardSurface, SkeletonCircle, SkeletonLine} from "@ninjas-strategy/ui";
import styled from "styled-components/native";

const TeamItemSkeletonContainer = styled(CardSurface)`
	margin: 8px;
	padding: 20px;
	flex-direction: row;
	align-items: center;
`;

const Details = styled.View`
	flex: 1;
	flex-direction: column;
	gap: 8px;
`;

const NavButtons = styled.View`
  flex-direction: column;
  gap: 20px;
`;

export const TeamItemSkeleton = () => (
	<TeamItemSkeletonContainer>
		<SkeletonCircle size={40} />
		<Details>
			<SkeletonLine width="40%" />
			<SkeletonLine width="70%" />
		</Details>
		<NavButtons>
			<SkeletonCircle size={20} />
			<SkeletonCircle size={20} />
		</NavButtons>
	</TeamItemSkeletonContainer>
);
