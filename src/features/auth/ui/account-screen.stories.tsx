import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { signOutTimerExplanation } from "../domain/sign-out-timer";
import { AccountScreenView } from "./account-screen";

const meta = {
  title: "Auth/Account",
  component: AccountScreenView,
  args: {
    phase: "signed-out",
    notice: null,
    signInPending: false,
    accountName: null,
    onSignIn: () => undefined,
    onRetry: () => undefined,
  },
} satisfies Meta<typeof AccountScreenView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SignedOut: Story = {};

export const Connecting: Story = {
  args: { signInPending: true },
};

export const Cancelled: Story = {
  args: { notice: "cancelled" },
};

export const Failed: Story = {
  args: { notice: "failed" },
};

export const Unavailable: Story = {
  args: { phase: "unavailable" },
};

export const SignedIn: Story = {
  args: {
    phase: "signed-in",
    accountName: "Ada Lovelace",
  },
};

export const SignOutFailed: Story = {
  args: {
    phase: "signed-in",
    accountName: "Ada Lovelace",
    signOutError: "Sign-out didn't finish. You are still signed in.",
  },
};

export const RunningTimer: Story = {
  args: {
    phase: "signed-in",
    accountName: "Ada Lovelace",
    timerExplanation: signOutTimerExplanation("running"),
  },
};

export const PausedTimer: Story = {
  args: {
    phase: "signed-in",
    accountName: "Ada Lovelace",
    timerExplanation: signOutTimerExplanation("paused"),
  },
};
