"use client";

import { useMemo } from "react";
import { Chrono, type TimelineItem } from "react-chrono";
import "react-chrono/dist/style.css";
import {
  formatEasternTime,
  formatLocalTime,
  getActiveMilestoneIndex,
  getMilestonePhase,
  HACKATHON_MILESTONES,
  type MilestonePhase,
} from "./hackathonSchedule";

function phaseLabel(phase: MilestonePhase): string {
  switch (phase) {
    case "completed":
      return "Completed";
    case "current":
      return "Now";
    default:
      return "Upcoming";
  }
}

export function HackathonTimeline({ now }: { now: number }) {
  const activeIndex = getActiveMilestoneIndex(now);

  const items: TimelineItem[] = useMemo(
    () =>
      HACKATHON_MILESTONES.map((milestone, index) => {
        const phase = getMilestonePhase(now, index);
        const localTime = formatLocalTime(milestone.instant);
        const easternTime = formatEasternTime(milestone.instant);

        return {
          title: `${milestone.emoji} ${milestone.headline}`,
          cardTitle: milestone.cardTitle,
          cardSubtitle: `${phaseLabel(phase)} · ${localTime} · ${easternTime} ET`,
          cardDetailedText: milestone.details,
          active: phase === "current",
        };
      }),
    [now],
  );

  return (
    <div className="hackathon-chrono -mx-4 sm:mx-0">
      <Chrono
        items={items}
        mode="horizontal"
        activeItemIndex={activeIndex}
        disableToolbar
        scrollable={{ scrollbar: true }}
        theme={{ primary: "#f5f0e8", cardBgColor: "#1a5a12" }}
      />

      <style jsx global>{`
        .hackathon-chrono .timeline-main-wrapper {
          background: transparent !important;
        }

        .hackathon-chrono .timeline-card-content {
          border-radius: 1rem !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          color: #e8f5e3 !important;
        }

        .hackathon-chrono .timeline-card-content.active {
          border-color: rgba(255, 255, 255, 0.4) !important;
        }

        .hackathon-chrono .timeline-horizontal-scroll-container {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
}
