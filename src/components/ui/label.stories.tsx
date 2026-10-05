import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const meta = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Text label for a form control. Set `htmlFor` to the control `id` so the label and input share a click target and an accessible name.",
      },
    },
  },
  args: { children: "Skill name" },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ForInput: Story = {
  render: (args) => (
    <div className="grid max-w-md gap-1.5">
      <Label htmlFor="labeled-skill" {...args} />
      <Input id="labeled-skill" defaultValue="Programming" />
    </div>
  ),
};
