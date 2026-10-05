import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Dropdown for one choice. Put `SelectValue` inside `SelectTrigger` and give it a `placeholder`. Each `SelectItem` supplies its own label, so the closed trigger shows that text. The menu opens under the trigger.",
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Soundscape: Story = {
  render: () => (
    <div className="grid w-56 gap-1.5">
      <Label>Ambient study soundscape</Label>
      <Select defaultValue="rain">
        <SelectTrigger>
          <SelectValue placeholder="Choose a soundscape" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Soundscapes</SelectLabel>
            <SelectItem value="none">None (Silent focus)</SelectItem>
            <SelectItem value="rain">Kyoto Cedar Rain</SelectItem>
            <SelectItem value="vinyl">Warm Analog Vinyl Hiss</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Placeholder: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  ),
};
