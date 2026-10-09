import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  AccountScreenView,
  type AccountScreenViewProps,
} from "./account-screen";

const saveName: AccountScreenViewProps["onSaveName"] = async () => ({
  ok: true,
});

const meta = {
  title: "Auth/Account",
  component: AccountScreenView,
  args: {
    phase: "signed-out",
    notice: null,
    signInPending: false,
    savedName: null,
    onSignIn: () => undefined,
    onRetry: () => undefined,
    onSaveName: saveName,
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
    savedName: "Ada",
    onSaveName: async () => ({ ok: true }),
  },
};

export const SaveFailed: Story = {
  args: {
    phase: "signed-in",
    savedName: "Ada",
    onSaveName: async () => ({
      ok: false,
      message: "Could not save your name. Try again.",
    }),
  },
};
