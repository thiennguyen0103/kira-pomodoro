import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";

const meta = {
  title: "UI/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Horizontal meter, 8px tall. `value` is 0–100. `tone` is `primary` for focus, `break` for rest, or `success` for a completed milestone. `ProgressLabel` and `ProgressValue` sit above the track.",
      },
    },
  },
  args: { value: 48, tone: "primary" },
  argTypes: {
    tone: { control: "select", options: ["primary", "break", "success"] },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Focus: Story = {
  render: (args) => (
    <Progress {...args} className="max-w-sm">
      <ProgressLabel>Programming</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="max-w-sm space-y-4">
      <Progress value={48}>
        <ProgressLabel>Focus</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={75} tone="break">
        <ProgressLabel>Break</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={100} tone="success">
        <ProgressLabel>Milestone</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  ),
};
