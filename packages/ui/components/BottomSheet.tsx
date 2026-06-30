import {BottomSheet as ExpoBottomSheet, RNHostView} from "@expo/ui";
import type {SnapPoint} from "@expo/ui";
import type {ReactNode} from "react";
import {Dimensions, KeyboardAvoidingView, Modal, Platform, Pressable, useWindowDimensions} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import styled from "styled-components/native";
import {IconButton} from "./IconButton";
import {Text} from "../styles/Text";

interface BottomSheetProps {
	children: ReactNode;
	closeAccessibilityLabel?: string;
	contentWidth?: number;
	isPresented: boolean;
	matchContents?: boolean;
	onDismiss: () => void;
	onClosePress?: () => void;
	showDragIndicator?: boolean;
	snapPoints?: SnapPoint[];
	testID?: string;
	title: string;
}

const SheetContent = styled.View<{ $bottomInset: number }>`
	min-height: 120px;
	max-width: 100%;
	position: relative;
	overflow: visible;
	align-items: stretch;
	padding: 14px 16px ${({$bottomInset}) => Math.max($bottomInset + 18, 24)}px 16px;
	gap: 14px;
`;

const SheetHeader = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding-bottom: 10px;
	border-bottom-width: 1px;
	border-bottom-color: ${({theme}) => theme.border};
`;

const SheetTitle = styled(Text).attrs({
	numberOfLines: 1,
})`
	flex: 1;
	min-width: 0px;
	font-weight: 900;
	font-size: 20px;
	line-height: 24px;
`;

const AndroidBackdrop = styled(Pressable)`
	flex: 1;
	justify-content: flex-end;
	background-color: rgba(0, 0, 0, 0.42);
`;

const AndroidPanel = styled.View`
	max-height: 92%;
	border-top-left-radius: 24px;
	border-top-right-radius: 24px;
	background-color: ${({theme}) => theme.surface};
	overflow: hidden;
`;

const AndroidPanelInner = styled.View`
	width: 100%;
`;

export function BottomSheet({
	children,
	closeAccessibilityLabel,
	contentWidth,
	isPresented,
	matchContents = true,
	onClosePress,
	onDismiss,
	showDragIndicator = true,
	snapPoints,
	testID,
	title,
}: BottomSheetProps) {
	const {width: windowWidth} = useWindowDimensions();
	const insets = useSafeAreaInsets();
	const screenWidth = Dimensions.get("screen").width;
	const defaultWidth = Platform.OS === "web" ? windowWidth : Math.max(windowWidth, screenWidth);
	const sheetWidth = contentWidth ?? Math.max(320, defaultWidth);

	if (Platform.OS === "android") {
		return (
			<Modal
				animationType="slide"
				transparent
				visible={isPresented}
				onRequestClose={onDismiss}
				statusBarTranslucent
				testID={testID}>
				<KeyboardAvoidingView behavior="height" style={{flex: 1}}>
					<AndroidBackdrop onPress={onDismiss}>
						<Pressable onPress={event => event.stopPropagation()}>
							<AndroidPanel>
								<AndroidPanelInner style={{width: sheetWidth}}>
									<SheetContent $bottomInset={insets.bottom} style={{width: sheetWidth}}>
										<SheetHeader>
											<SheetTitle>{title}</SheetTitle>
											<IconButton
												icon="x"
												onPress={onClosePress ?? onDismiss}
												accessibilityLabel={closeAccessibilityLabel ?? `Close ${title}`}
											/>
										</SheetHeader>
										{children}
									</SheetContent>
								</AndroidPanelInner>
							</AndroidPanel>
						</Pressable>
					</AndroidBackdrop>
				</KeyboardAvoidingView>
			</Modal>
		);
	}

	return (
		<ExpoBottomSheet
			isPresented={isPresented}
			onDismiss={onDismiss}
			showDragIndicator={showDragIndicator}
			snapPoints={snapPoints ?? (Platform.OS === "android" ? ["full"] : undefined)}
			testID={testID}>
			<RNHostView matchContents={matchContents} style={{width: sheetWidth}}>
				<SheetContent $bottomInset={insets.bottom} style={{width: sheetWidth}}>
					<SheetHeader>
						<SheetTitle>{title}</SheetTitle>
						<IconButton
							icon="x"
							onPress={onClosePress ?? onDismiss}
							accessibilityLabel={closeAccessibilityLabel ?? `Close ${title}`}
						/>
					</SheetHeader>
					{children}
				</SheetContent>
			</RNHostView>
		</ExpoBottomSheet>
	);
}

export type {BottomSheetProps};
