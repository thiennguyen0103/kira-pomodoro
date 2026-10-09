import { AccountScreen } from "@/features/auth/ui/account-screen";

type SignInPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    next?: string | string[];
  }>;
};

function firstParam(value: string | string[] | undefined): string | null {
  return typeof value === "string" ? value : null;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;

  return (
    <AccountScreen
      error={firstParam(params.error)}
      nextPath={firstParam(params.next)}
    />
  );
}
