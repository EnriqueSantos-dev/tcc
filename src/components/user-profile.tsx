import { UserButton } from "@clerk/nextjs";

export default function UserProfile({
  showNameInReverseOrder,
  fallback
}: {
  showNameInReverseOrder?: boolean;
  fallback?: React.ReactNode;
}) {
  const flexDirection = showNameInReverseOrder ? "row-reverse" : "row";
  const justifyContent = showNameInReverseOrder ? "flex-end" : "flex-start";

  return (
    <UserButton
      fallback={fallback}
      showName
      appearance={{
        elements: {
          rootBox: {
            width: "100%"
          },
          userButtonTrigger: {
            width: "100%"
          },
          userButtonBox: {
            width: "100%",
            gap: "1rem",
            color: "hsl(var(--foreground))",
            flexDirection,
            justifyContent
          },
          userButtonOuterIdentifier: {
            paddingLeft: "0"
          }
        }
      }}
    />
  );
}
