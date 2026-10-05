import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Single-line text field, 40px tall with a focus ring. Set `aria-invalid` for an error state and `disabled` when the value cannot be edited. Use `font-mono tabular-nums` for durations and hour counts.",
      },
    },
  },
  args: {
    placeholder: "Skill name",
    disabled: false,
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="grid max-w-md gap-1.5">
      <Label htmlFor="skill">Skill name</Label>
      <Input id="skill" {...args} />
    </div>
  ),
};

export const Invalid: Story = {
  args: { placeholder: "Skill name required", "aria-invalid": true },
  render: (args) => (
    <div className="grid max-w-md gap-1.5">
      <Label htmlFor="skill-invalid">Skill name</Label>
      <Input id="skill-invalid" {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { defaultValue: "Programming", disabled: true },
  render: (args) => (
    <div className="grid max-w-md gap-1.5">
      <Label htmlFor="skill-disabled">Skill name</Label>
      <Input id="skill-disabled" {...args} />
    </div>
  ),
};

export const Numeric: Story = {
  render: () => (
    <div className="grid max-w-md gap-1.5">
      <Label htmlFor="hours">Target milestone (hours)</Label>
      <Input
        id="hours"
        type="number"
        defaultValue={500}
        className="font-mono tabular-nums"
      />
    </div>
  ),
};
