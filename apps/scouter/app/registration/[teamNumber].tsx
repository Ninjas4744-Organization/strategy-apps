import {z} from "zod";
import {useLocalSearchParams} from "expo-router";
import {FormGroup, Title} from "@ninjas-strategy/ui";

const userSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z.string().min(8, { message: "Password must be at least 8 characters long" })
		.regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
		.regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
		.regex(/[0-9]/, { message: "Password must contain at least one number" })
		.regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
	confirmPassword: z.string(),
	displayName: z.string()
		.min(1, { message: "Full name is required" })
		.max(50, { message: "Full name cannot exceed 50 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"],
});

export default function RegistrationPage() {
	const {teamNumber} = useLocalSearchParams();

	return <FormGroup>
		<Title>{teamNumber}</Title>
	</FormGroup>
}
