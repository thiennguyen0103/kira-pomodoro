"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import {
  signInErrorPath,
  signInNotice,
  signInNoticeMessage,
  signInReturnPath,
  type SignInNotice,
} from "../domain/sign-in-flow";
import { signOutTimerExplanation } from "../domain/sign-out-timer";
import { clearPrivateClientState } from "./account-cache";
import {
  readAccount,
  requestGoogleSignIn,
  requestSignOut,
  sessionQueryKey,
  type AccountUser,
} from "./session-client";
import { readUnfinishedTimer } from "./unfinished-timer";

export type AccountPhase =
  | "loading"
  | "unavailable"
  | "signed-out"
  | "signed-in";

export type AccountScreenViewProps = {
  phase: AccountPhase;
  notice: SignInNotice | null;
  signInPending: boolean;
  accountName: string | null;
  onSignIn: () => void;
  onRetry: () => void;
  timerExplanation?: string | null;
  signOutPending?: boolean;
  signOutError?: string | null;
  onSignOut?: () => void;
};

export function AccountScreenView({
  phase,
  notice,
  signInPending,
  accountName,
  onSignIn,
  onRetry,
  timerExplanation = null,
  signOutPending = false,
  signOutError = null,
  onSignOut = () => undefined,
}: AccountScreenViewProps) {
  const noticeRef = useRef<HTMLDivElement>(null);
  const signOutErrorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notice || phase !== "signed-out") {
      return;
    }

    noticeRef.current?.focus();
  }, [notice, phase]);

  useEffect(() => {
    if (!signOutError || phase !== "signed-in") {
      return;
    }

    signOutErrorRef.current?.focus();
  }, [signOutError, phase]);

  const title =
    phase === "signed-in" && accountName
      ? accountName
      : phase === "loading"
        ? "Checking your session"
        : phase === "unavailable"
          ? "Account unavailable"
          : "Sign in";

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_at_top,var(--primary-subtle),transparent_70%)]"
      />
      <Card
        className="relative rounded-3xl shadow-card"
        aria-busy={
          phase === "loading" || signInPending || signOutPending || undefined
        }
      >
        <CardHeader>
          <p className="text-sm font-medium text-primary">Account</p>
          <h1 className="font-heading text-2xl font-medium tracking-tight text-card-foreground">
            {title}
          </h1>
          <CardDescription>
            {phase === "signed-in"
              ? "This name comes from your Google account. Your email stays private."
              : "Continue with Google. This screen stays signed out until a session is confirmed."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {phase === "loading" ? (
            <p role="status" className="text-sm text-muted-foreground">
              Checking your session…
            </p>
          ) : null}
          {phase === "unavailable" ? (
            <>
              <Alert variant="destructive">
                <AlertTitle>Could not load your account</AlertTitle>
                <AlertDescription>
                  Check your connection and try again.
                </AlertDescription>
              </Alert>
              <Button
                type="button"
                size="lg"
                className="w-full"
                onClick={onRetry}
              >
                Try again
              </Button>
            </>
          ) : null}
          {phase === "signed-out" && notice ? (
            <Alert ref={noticeRef} tabIndex={-1} variant="destructive">
              <AlertTitle>
                {notice === "cancelled"
                  ? "Sign-in cancelled"
                  : "Sign-in failed"}
              </AlertTitle>
              <AlertDescription>{signInNoticeMessage(notice)}</AlertDescription>
            </Alert>
          ) : null}
          {phase === "signed-out" ? (
            <Button
              type="button"
              size="lg"
              className="w-full"
              loading={signInPending}
              onClick={onSignIn}
            >
              {signInPending ? "Connecting to Google…" : "Continue with Google"}
            </Button>
          ) : null}
          {phase === "signed-in" && accountName ? (
            <>
              {timerExplanation ? (
                <Alert variant="warning">
                  <AlertTitle>Focus session still open</AlertTitle>
                  <AlertDescription>{timerExplanation}</AlertDescription>
                </Alert>
              ) : null}
              {signOutError ? (
                <Alert
                  ref={signOutErrorRef}
                  tabIndex={-1}
                  variant="destructive"
                >
                  <AlertTitle>Sign-out failed</AlertTitle>
                  <AlertDescription>{signOutError}</AlertDescription>
                </Alert>
              ) : null}
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="w-full"
                loading={signOutPending}
                onClick={onSignOut}
              >
                {signOutPending ? "Signing out…" : "Sign out"}
              </Button>
            </>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}

type AccountScreenProps = {
  error: string | null;
  nextPath: string | null;
  profile?: boolean;
};

export function AccountScreen({
  error,
  nextPath,
  profile = false,
}: AccountScreenProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const session = useQuery({
    queryKey: sessionQueryKey,
    queryFn: readAccount,
  });
  const [signInPending, setSignInPending] = useState(false);
  const [signOutPending, setSignOutPending] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const [localNotice, setLocalNotice] = useState<SignInNotice | "clear" | null>(
    null,
  );

  const notice =
    localNotice === "clear" ? null : (localNotice ?? signInNotice(error));

  async function onSignIn() {
    setSignInPending(true);
    setLocalNotice("clear");

    try {
      const callbackURL = signInReturnPath(nextPath);
      const url = await requestGoogleSignIn({
        callbackURL,
        errorCallbackURL: signInErrorPath(callbackURL),
      });
      window.location.assign(url);
    } catch {
      setLocalNotice("failed");
      setSignInPending(false);
    }
  }

  const phase: AccountPhase = session.isPending
    ? "loading"
    : session.isError
      ? "unavailable"
      : session.data
        ? "signed-in"
        : "signed-out";

  useEffect(() => {
    if (phase === "signed-in" && !profile) {
      router.replace("/");
    }
  }, [phase, profile, router]);

  if (phase === "signed-in" && !profile) {
    return null;
  }

  return (
    <AccountScreenView
      phase={phase}
      notice={phase === "signed-in" ? null : notice}
      signInPending={signInPending}
      accountName={session.data?.displayName ?? null}
      onSignIn={() => {
        void onSignIn();
      }}
      timerExplanation={signOutTimerExplanation(readUnfinishedTimer())}
      signOutPending={signOutPending}
      signOutError={signOutError}
      onSignOut={() => {
        void (async () => {
          setSignOutPending(true);
          setSignOutError(null);
          const result = await requestSignOut();
          setSignOutPending(false);

          if (!result.ok) {
            setSignOutError(result.message);
            return;
          }

          clearPrivateClientState(queryClient);
          queryClient.setQueryData<AccountUser | null>(sessionQueryKey, null);
        })();
      }}
      onRetry={() => {
        void session.refetch();
      }}
    />
  );
}
