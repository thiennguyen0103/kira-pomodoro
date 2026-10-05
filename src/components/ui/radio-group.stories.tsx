import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Label } from "@/components/ui/label";
import {
  RadioCard,
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Single choice among several options. `RadioGroupItem` is the compact circle. `RadioCard` is a selectable card; the checked card uses the primary subtle fill. Set `defaultValue` on the group.",
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Items: Story = {
  render: () => (
    <RadioGroup defaultValue="focus" className="max-w-xs">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="focus" id="mode-focus" />
        <Label htmlFor="mode-focus">Focus</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="break" id="mode-break" />
        <Label htmlFor="mode-break">Break</Label>
      </div>
    </RadioGroup>
  ),
};

export const Cards: Story = {
  render: () => (
    <RadioGroup defaultValue="25" className="grid max-w-md grid-cols-3">
      <RadioCard value="25">
        25 min
        <span className="text-[10px] font-normal opacity-70">Standard</span>
      </RadioCard>
      <RadioCard value="50">
        50 min
        <span className="text-[10px] font-normal opacity-70">Deep</span>
      </RadioCard>
      <RadioCard value="custom">
        Custom
        <span className="text-[10px] font-normal opacity-70">Flexible</span>
      </RadioCard>
    </RadioGroup>
  ),
};
