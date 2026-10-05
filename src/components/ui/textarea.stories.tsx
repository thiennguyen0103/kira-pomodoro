import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Multi-line text field with the same border and focus ring as `Input`. Set `aria-invalid` for an error and `disabled` when notes cannot be edited.",
      },
    },
  },
  args: {
    placeholder: "What did you practice?",
    disabled: false,
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Notes: Story = {
  render: (args) => (
    <div className="grid max-w-md gap-1.5">
      <Label htmlFor="notes">Session note</Label>
      <Textarea id="notes" {...args} />
    </div>
  ),
};

export const Invalid: Story = {
  args: { placeholder: "Add a short note", "aria-invalid": true },
  render: (args) => (
    <div className="grid max-w-md gap-1.5">
      <Label htmlFor="notes-invalid">Session note</Label>
      <Textarea id="notes-invalid" {...args} />
    </div>
  ),
};
