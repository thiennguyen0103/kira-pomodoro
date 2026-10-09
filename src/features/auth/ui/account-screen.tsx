"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { DisplayNameForm } from "./display-name-form";
import {
  readAccount,
  requestGoogleSignIn,
  saveAccountName,
  type AccountUser,
} from "./session-client";

export type AccountPhase =
  | "loading"
  | "unavailable"
  | "signed-out"
  | "signed-in";

export type AccountScreenViewProps = {
  phase: AccountPhase;
  notice: SignInNotice | null;
  signInPending: boolean;
  savedName: string | null;
  onSignIn: () => void;
  onRetry: () => void;
  onSaveName: (
    displayName: string,
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
};

export function AccountScreenView({
  phase,
  notice,
  signInPending,
  savedName,
  onSignIn,
  onRetry,
  onSaveName,
}: AccountScreenViewProps) {
  const noticeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notice || phase !== "signed-out") {
      return;
    }

    noticeRef.current?.focus();
  }, [notice, phase]);

  const title =
    phase === "signed-in" && savedName
      ? savedName
      : phase === "loading"
        ? "Checking your session"
        : phase === "unavailable"
          ? "Account unavailable"
          : "Sign in";

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-8">
      <Card aria-busy={phase === "loading" || signInPending || undefined}>
        <CardHeader>
          <p className="text-sm font-medium text-primary">Account</p>
          <h1 className="font-heading text-2xl font-medium tracking-tight text-card-foreground">
            {title}
          </h1>
          <CardDescription>
            {phase === "signed-in"
              ? "Update the name shown on your account. Your email stays private."
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
          {phase === "signed-in" && savedName ? (
            <DisplayNameForm savedName={savedName} onSave={onSaveName} />
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}

type AccountScreenProps = {
  error: string | null;
  nextPath: string | null;
};

export function AccountScreen({ error, nextPath }: AccountScreenProps) {
  const queryClient = useQueryClient();
  const session = useQuery({
    queryKey: ["session"],
    queryFn: readAccount,
  });
  const [signInPending, setSignInPending] = useState(false);
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

  return (
    <AccountScreenView
      phase={phase}
      notice={phase === "signed-in" ? null : notice}
      signInPending={signInPending}
      savedName={session.data?.displayName ?? null}
      onSignIn={() => {
        void onSignIn();
      }}
      onRetry={() => {
        void session.refetch();
      }}
      onSaveName={async (displayName) => {
        const result = await saveAccountName(displayName);

        if (!result.ok) {
          return result;
        }

        queryClient.setQueryData<AccountUser | null>(["session"], result.user);
        return { ok: true };
      }}
    />
  );
}
