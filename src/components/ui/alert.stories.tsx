import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlertCircleIcon, CheckIcon, InfoIcon } from "lucide-react";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const meta = {
  title: "UI/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Inline status message. Compose `AlertTitle`, `AlertDescription`, and an optional `AlertAction`. `variant` is `default`, `success`, `warning`, or `destructive`. Place an icon as the first child.",
      },
    },
  },
  args: { variant: "default" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "destructive"],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-xl">
      <InfoIcon />
      <AlertTitle>Break interval reminder</AlertTitle>
      <AlertDescription>
        Break sessions do not count toward skill milestones.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  args: { variant: "success" },
  render: (args) => (
    <Alert {...args} className="max-w-xl">
      <CheckIcon />
      <AlertTitle>Session synchronized</AlertTitle>
      <AlertDescription>25 minutes credited to Programming.</AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  args: { variant: "warning" },
  render: (args) => (
    <Alert {...args} className="max-w-xl">
      <AlertCircleIcon />
      <AlertTitle>Prolonged session</AlertTitle>
      <AlertDescription>
        Three focus intervals finished without a break.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: { variant: "destructive" },
  render: (args) => (
    <Alert {...args} className="max-w-xl">
      <AlertCircleIcon />
      <AlertTitle>Sync interrupted</AlertTitle>
      <AlertDescription>Progress is cached locally.</AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline">
          Retry
        </Button>
      </AlertAction>
    </Alert>
  ),
};
