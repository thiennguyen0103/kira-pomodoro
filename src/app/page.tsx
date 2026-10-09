import { PageFrame } from "@/components/layout/page-frame";
import { PracticeScreen } from "@/components/layout/practice-screen";

export default function HomePage() {
  return (
    <PageFrame
      eyebrow="Practice"
      title="Start a focus session"
      description="The timer stays on this screen. Recorded focus time counts only after the server checks it."
    >
      <PracticeScreen />
    </PageFrame>
  );
}
