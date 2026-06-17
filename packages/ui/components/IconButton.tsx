import type {PressableProps} from "react-native";
import styled, {useTheme} from "styled-components/native";
import type {ReactNode} from "react";
import {Icon} from "./Icon";
import type {MaterialIcon} from "../interfaces/MaterialIcon";

type IconButtonIcon = MaterialIcon | "x";

interface IconButtonProps extends PressableProps {
	icon: IconButtonIcon;
	size?: number;
	variant?: "default" | "filled";
	disabled?: boolean;
	color?: string;
	compact?: boolean;
}

const Wrapper = styled.Pressable<{
	$variant: "default" | "filled";
	$disabled: boolean;
	$compact: boolean;
}>`
	min-width: ${({$compact}) => ($compact ? 36 : 44)}px;
	min-height: ${({$compact}) => ($compact ? 40 : 44)}px;
	align-items: center;
	justify-content: center;
	border-radius: 16px;
	opacity: ${({$disabled}) => ($disabled ? 0.5 : 1)};
`;

const Inner = styled.View<{$pressed: boolean}>`
	width: 32px;
	height: 32px;
	border-radius: 16px;
	align-items: center;
	justify-content: center;
	background-color: ${({theme}) => theme.surface};
	opacity: ${({$pressed}) => ($pressed ? 0.75 : 1)};
	transform: ${({$pressed}) => ($pressed ? "scale(0.94)" : "scale(1)")};
`;

const FilledInner = styled(Inner)`
	background-color: ${({theme}) => theme.primary};
`;

function iconName(icon: IconButtonIcon): MaterialIcon {
	return icon === "x" ? "close" : icon;
}

export function IconButton({
	icon,
	onPress,
	size = 18,
	variant = "default",
	disabled,
	color,
	compact = false,
	...props
}: IconButtonProps) {
	const theme = useTheme();

	return (
		<Wrapper
			onPress={onPress}
			disabled={disabled}
			$variant={variant}
			$disabled={!!disabled}
			$compact={compact}
			{...props}
		>
			{({pressed}) => (
				<IconButtonSurface
					$pressed={pressed}
					$variant={variant}>
					<Icon
						name={iconName(icon)}
						size={size}
						color={
							color ??
							(variant === "filled" && !disabled ? theme.primaryText : undefined)
						}
					/>
				</IconButtonSurface>
			)}
		</Wrapper>
	);
}

function IconButtonSurface({
	$pressed,
	$variant,
	children,
}: {
	$pressed: boolean;
	$variant: "default" | "filled";
	children: ReactNode;
}) {
	const Surface = $variant === "filled" ? FilledInner : Inner;

	return <Surface $pressed={$pressed}>{children}</Surface>;
}

