import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Preview } from "@storybook/nextjs-vite";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import { useLayoutEffect, type ComponentType } from "react";
import "../src/styles/globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const fontVariables = [beVietnam.variable, jetbrains.variable];

function StoryShell({ Story }: { Story: ComponentType }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add(...fontVariables);
    return () => {
      root.classList.remove(...fontVariables);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <TooltipProvider>
        <div className="p-6">
          <Story />
        </div>
        <Toaster />
      </TooltipProvider>
    </div>
  );
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [(Story) => <StoryShell Story={Story} />],
};

export default preview;
