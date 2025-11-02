import styled from "styled-components/native";
import {IconContainer, Title, Icon} from "@ninjas-strategy/ui";
import {MaterialIcon} from "@ninjas-strategy/ui/interfaces/MaterialIcon";

type ScoringCategoryProps = {
	color: string;
	title: string;
	icon: MaterialIcon;
	children: React.ReactNode;
};

const SectionCategoryContainer = styled.View<{ color: string }>`
	margin: 16px;
	padding: 20px;
	background-color: ${props => props.color}20;
	gap: 16px;
	border-radius: 16px;
	display: flex;
	flex-direction: column;
`;

const SectionCategoryHeader = styled.View`
    gap: 16px;
    border-radius: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const CategoryIcon = styled(Icon)<{color: string}>`
	font-size: 24px;
	color: ${props => props.color};
`;

export const ScoringCategory = ({color, title, icon, children}: ScoringCategoryProps) => {
	return <SectionCategoryContainer color={color}>
		<SectionCategoryHeader>
			<IconContainer>
				<CategoryIcon name={icon} color={color} />
			</IconContainer>
			<Title>{title}</Title>
		</SectionCategoryHeader>
		{children}
	</SectionCategoryContainer>;
};
