import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const meta = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "On/off control. `size` is `default` or `sm`. Pair it with a `Label` through `id` and `htmlFor`. `defaultChecked` starts the switch on.",
      },
    },
  },
  args: { size: "default", defaultChecked: true },
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FocusMode: Story = {
  render: (args) => (
    <div className="flex items-center justify-between gap-3">
      <Label htmlFor="focus-mode">Distraction-free mode</Label>
      <Switch id="focus-mode" {...args} />
    </div>
  ),
};

export const Small: Story = {
  args: { size: "sm" },
  render: (args) => (
    <div className="flex items-center justify-between gap-3">
      <Label htmlFor="private-goal">Private goal</Label>
      <Switch id="private-goal" {...args} />
    </div>
  ),
};
