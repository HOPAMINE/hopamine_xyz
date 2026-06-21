"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { roboto } from "../../fonts";
import { HACKATHON_JUDGES } from "./hackathonJudges";

type JudgesDialogProps = {
  triggerLabel: string;
  triggerClassName?: string;
};

export function JudgesDialog({
  triggerLabel,
  triggerClassName = "font-bold underline underline-offset-2 hover:text-white/80",
}: JudgesDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className={triggerClassName}>
          {triggerLabel}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className={`${roboto.className} fixed left-1/2 top-1/2 z-50 w-[min(94vw,44rem)] max-h-[85dvh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/25 bg-[#0C4506]/70 p-8 text-[#f5f0e8] shadow-xl outline-none sm:p-10`}
        >
          <Dialog.Title className="text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl">
            ⚖️ Judged by
          </Dialog.Title>
          <ul className="mt-6 space-y-4 text-base text-white/90 sm:text-lg">
            {HACKATHON_JUDGES.map((judge) => (
              <li key={judge.handle}>
                {judge.name} · {judge.role} · {judge.handle}
              </li>
            ))}
          </ul>
          <Dialog.Close asChild>
            <button
              type="button"
              className="mt-8 w-full rounded-full bg-white px-6 py-3 text-base font-bold tracking-[-0.03em] text-[#13450E] hover:opacity-90 sm:text-lg"
            >
              Close
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
