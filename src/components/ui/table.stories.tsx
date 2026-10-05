import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const meta = {
  title: "UI/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Data table. Compose `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell`. Right-align durations and use `font-mono tabular-nums` so digits stay aligned.",
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Sessions: Story = {
  render: () => (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-subtle">
      <Table>
        <TableCaption>Recent practice sessions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Skill</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead className="text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Programming</TableCell>
            <TableCell>
              <Badge>Focus</Badge>
            </TableCell>
            <TableCell className="text-right font-mono tabular-nums">
              50m 00s
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Guitar</TableCell>
            <TableCell>
              <Badge variant="break">Break</Badge>
            </TableCell>
            <TableCell className="text-right font-mono tabular-nums">
              05m 00s
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};
