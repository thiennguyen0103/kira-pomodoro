import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Skeleton } from "@/components/ui/skeleton";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Pulsing placeholder while content loads. Set width and height with utility classes so the skeleton matches the layout it will replace.",
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SessionCard: Story = {
  render: () => (
    <div className="max-w-sm space-y-2 rounded-lg border border-border p-3">
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-2 w-4/5" />
    </div>
  ),
};
