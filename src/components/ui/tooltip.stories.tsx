import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Short hint shown on hover or focus. `TooltipTrigger` wraps the control. `TooltipContent` holds the hint. A `TooltipProvider` already wraps the Storybook preview and the app.",
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Benchmark: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger
        render={<Button variant="outline">10,000 hours</Button>}
      />
      <TooltipContent>
        An inspirational benchmark, not a mandatory standard.
      </TooltipContent>
    </Tooltip>
  ),
};
