import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Badge } from "@/components/ui/badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Compact status label. Use `variant` to match the session state: focus, break, success, warning, interrupted, or a quiet secondary/outline label.",
      },
    },
  },
  args: { children: "Focus mode", variant: "default" },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "break",
        "success",
        "warning",
        "destructive",
        "secondary",
        "outline",
      ],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Focus: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Focus mode</Badge>
      <Badge variant="break">Rest break</Badge>
      <Badge variant="success">Completed</Badge>
      <Badge variant="warning">Paused</Badge>
      <Badge variant="destructive">Interrupted</Badge>
      <Badge variant="secondary">Private goal</Badge>
      <Badge variant="outline">Custom length</Badge>
    </div>
  ),
};
