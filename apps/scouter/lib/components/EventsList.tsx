import React, {useMemo, useRef, useState} from "react";
import {SectionList, TextInput} from "react-native";
import styled from "styled-components/native";
import {Icon} from "@ninjas-strategy/ui";
import {MD2Colors} from "react-native-paper";

export type EventStatus = "current" | "upcoming" | "finished";

export type ScoutingEvent = {
	id: string;
	name: string;
	location?: string;
	startDate: string;
	endDate: string;
	year: number;
	timezone?: string;
};

type Section = {
	id: string;
	title: string;
	year: number;
	status: EventStatus;
	data: ScoutingEvent[];
};

function getEventStatus(now: Date, start: Date, end: Date): EventStatus {
	if (now < start) return "upcoming";
	if (now > end) return "finished";
	return "current";
}

function statusLabel(status: EventStatus) {
	switch (status) {
		case "current":
			return "Current";
		case "upcoming":
			return "Upcoming";
		case "finished":
			return "Finished";
	}
}

function statusEmoji(status: EventStatus) {
	switch (status) {
		case "current":
			return "🟢";
		case "upcoming":
			return "🔵";
		case "finished":
			return "⚪";
	}
}

function formatDateRange(startISO: string, endISO: string) {
	const start = new Date(startISO);
	const end = new Date(endISO);

	const a = start.toLocaleDateString();
	const b = end.toLocaleDateString();
	return `${a} – ${b}`;
}

function buildSections(events: ScoutingEvent[], now = new Date()): Section[] {
	const byYear = new Map<number, ScoutingEvent[]>();
	for (const e of events) {
		const list = byYear.get(e.year) ?? [];
		list.push(e);
		byYear.set(e.year, list);
	}

	const years = Array.from(byYear.keys()).sort((a, b) => b - a);

	const sections: Section[] = [];

	for (const year of years) {
		const list = byYear.get(year)!;

		const buckets: Record<EventStatus, ScoutingEvent[]> = {
			current: [],
			upcoming: [],
			finished: [],
		};

		for (const e of list) {
			const status = getEventStatus(now, new Date(e.startDate), new Date(e.endDate));
			buckets[status].push(e);
		}

		buckets.upcoming.sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate));
		buckets.current.sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate));
		buckets.finished.sort((a, b) => +new Date(b.endDate) - +new Date(a.endDate));

		const pushIfAny = (status: EventStatus) => {
			const data = buckets[status];
			if (!data.length) return;
			sections.push({
				id: `${year}-${status}`,
				title: `${year} • ${statusLabel(status)}`,
				year,
				status,
				data,
			});
		};

		pushIfAny("current");
		pushIfAny("upcoming");
		pushIfAny("finished");
	}

	return sections;
}

function filterEvents(events: ScoutingEvent[], query: string): ScoutingEvent[] {
	const q = query.trim().toLowerCase();
	if (!q) return events;

	return events.filter((e) => {
		const name = e.name.toLowerCase();
		const loc = (e.location ?? "").toLowerCase();
		const key = e.id.toLowerCase();
		return name.includes(q) || loc.includes(q) || key.includes(q);
	});
}

function getYears(events: ScoutingEvent[]) {
	return Array.from(new Set(events.map((e) => e.year))).sort((a, b) => b - a);
}

function findFirstSectionIndexForYear(sections: Section[], year: number) {
	return sections.findIndex((s) => s.year === year);
}

type EventsListProps = {
	events: ScoutingEvent[];
	onSelect: (id: string) => void;
}
export function EventsList({events, onSelect}: EventsListProps) {
	const allEvents = useMemo<ScoutingEvent[]>(() => events, []);

	const [search, setSearch] = useState("");
	const listRef = useRef<SectionList<ScoutingEvent, Section>>(null);

	const filtered = useMemo(() => filterEvents(allEvents, search), [allEvents, search]);
	const sections = useMemo(() => buildSections(filtered, new Date()), [filtered]);
	const years = useMemo(() => getYears(allEvents), [allEvents]);

	const scrollToYear = (year: number) => {
		const sectionIndex = findFirstSectionIndexForYear(sections, year);
		if (sectionIndex < 0) return;

		listRef.current?.scrollToLocation({
			sectionIndex,
			itemIndex: 0,
			animated: true,
			viewPosition: 0,
		});
	};

	return (
		<>
			<TopBar>
				<SearchBox>
					<SearchIcon>
						<Icon name="search" />
					</SearchIcon>
					<SearchInput
						value={search}
						onChangeText={setSearch}
						placeholder="Search events…"
						placeholderTextColor="rgba(255,255,255,0.5)"
						autoCapitalize="none"
						autoCorrect={false}
						clearButtonMode="while-editing"
					/>
				</SearchBox>

				<YearsRow horizontal showsHorizontalScrollIndicator={false}>
					{years.map((y) => (
						<YearChip key={y} onPress={() => scrollToYear(y)}>
							<YearChipText>{y}</YearChipText>
						</YearChip>
					))}
				</YearsRow>
			</TopBar>

			<SectionList
				ref={listRef}
				sections={sections}
				keyExtractor={(item) => item.id}
				stickySectionHeadersEnabled
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{paddingBottom: 24}}
				renderSectionHeader={({section}) => (
					<SectionHeader>
						<SectionTitle>
							{statusEmoji(section.status)} {section.title}
						</SectionTitle>
					</SectionHeader>
				)}
				renderItem={({item}) => (
					<EventRow onPress={() => onSelect(item.id)}>
						<EventTopLine>
							<EventName numberOfLines={1}>{item.name}</EventName>
							<Badge status={getEventStatus(new Date(), new Date(item.startDate), new Date(item.endDate))}>
								<BadgeText>
									{statusLabel(getEventStatus(new Date(), new Date(item.startDate), new Date(item.endDate)))}
								</BadgeText>
							</Badge>
						</EventTopLine>

						<EventMeta numberOfLines={1}>
							{formatDateRange(item.startDate, item.endDate)}
							{item.location ? ` • ${item.location}` : ""}
						</EventMeta>

						<EventKey numberOfLines={1}>{item.id}</EventKey>
					</EventRow>
				)}
				ListEmptyComponent={
					<EmptyWrap>
						<EmptyTitle>No events found</EmptyTitle>
						<EmptySubtitle>Try changing your search.</EmptySubtitle>
					</EmptyWrap>
				}
			/>
		</>
	);
}

const TopBar = styled.View`
	padding: 12px 12px 6px 12px;
`;

const SearchBox = styled.View`
	  flex-direction: row;
	  align-items: center;
	  border-radius: 14px;
	  padding: 10px 12px;
	  background: rgba(255, 255, 255, 0.08);
`;

const SearchIcon = styled.Text`
	  margin-right: 8px;
	  font-size: 14px;
	  opacity: 0.9;
`;

const SearchInput = styled(TextInput)`
	  flex: 1;
	  color: rgba(255, 255, 255, 0.95);
	  font-size: 15px;
`;

const YearsRow = styled.ScrollView`
	  margin-top: 10px;
`;

const YearChip = styled.Pressable`
	  padding: 8px 10px;
	  border-radius: 999px;
	  background: rgba(255, 255, 255, 0.08);
	  margin-right: 8px;
`;

const YearChipText = styled.Text`
	  color: rgba(255, 255, 255, 0.9);
	  font-size: 13px;
`;

const SectionHeader = styled.View`
	  padding: 10px 14px;
	  background: rgba(255, 255, 255, 0.05);
	  border-top-width: 1px;
	  border-top-color: rgba(255, 255, 255, 0.06);
`;

const SectionTitle = styled.Text`
	  color: rgba(255, 255, 255, 0.85);
	  font-size: 13px;
`;

const EventRow = styled.Pressable`
	  padding: 14px;
	  border-bottom-width: 1px;
	  border-bottom-color: rgba(255, 255, 255, 0.06);
`;

const EventTopLine = styled.View`
	  flex-direction: row;
	  align-items: center;
	  justify-content: space-between;
	  gap: 10px;
`;

const EventName = styled.Text`
	  flex: 1;
	  color: rgba(255, 255, 255, 0.95);
	  font-size: 16px;
`;

const EventMeta = styled.Text`
	  margin-top: 6px;
	  color: rgba(255, 255, 255, 0.75);
	  font-size: 12px;
`;

const EventKey = styled.Text`
	  margin-top: 6px;
	  color: rgba(255, 255, 255, 0.55);
	  font-size: 11px;
`;

const EmptyWrap = styled.View`
	  padding: 30px 16px;
	  align-items: center;
`;

const EmptyTitle = styled.Text`
	  color: rgba(255, 255, 255, 0.9);
	  font-size: 16px;
`;

const EmptySubtitle = styled.Text`
	  margin-top: 6px;
	  color: rgba(255, 255, 255, 0.65);
	  font-size: 13px;
`;

// Badge
const Badge = styled.View<{status: EventStatus}>`
	padding: 6px 10px;
	border-radius: 999px;
    background: ${({status}) => {
        switch (status) {
            case "current":
                return `${MD2Colors.green500}18`;
            case "upcoming":
                return `${MD2Colors.blue500}18`;
            case "finished":
                return `${MD2Colors.grey500}10`;
        }
    }};
	border-width: 1px;
	border-color: ${({status}) => {
        switch (status) {
            case "current":
                return `${MD2Colors.green500}35`;
            case "upcoming":
                return `${MD2Colors.blue500}35`;
            case "finished":
                return `${MD2Colors.grey500}18`;
        }
    }};
`;

const BadgeText = styled.Text`
	  color: ${MD2Colors.white};
	  font-size: 12px;
`;
