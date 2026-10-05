import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Binary choice. Pair it with a `Label` through `htmlFor` and `id`. `defaultChecked` sets the initial state. `disabled` keeps the choice visible but inactive.",
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="include-break" defaultChecked />
      <Label htmlFor="include-break">Include a 5-minute break</Label>
    </div>
  ),
};

export const Unchecked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="private-session" />
      <Label htmlFor="private-session">Keep this session private</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="locked" disabled defaultChecked />
      <Label htmlFor="locked">Required for ranked practice</Label>
    </div>
  ),
};
