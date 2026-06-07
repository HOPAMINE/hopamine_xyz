"use client";

import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { roboto } from "../../fonts";
import { QuestionLabel } from "./QuestionLabel";
import { QUESTION_LABELS } from "./questionLabels";

const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzGJPXeBCGQ-GhxzmLZ-vo7fQ52oFOBYSUyMDEOwZlNQznM2ayD1CHB4_zusyZCremrKg/exec";

const hopathonBg = "bg-[#13450E]";

const INTRO_SECTIONS = [
  {
    title: "What is The Green Hackathon?",
    body: "A 48-hour sprint. Build software that solves a global environmental problem, owned locally. Every archetype belongs here — you do not need to code.",
  },
  {
    title: "What does the winner get?",
    body: "The winning idea gets campaigned across @Mawuli.xyz (50k) and @Hopamine.xyz on Instagram, with the goal of driving 10,000 users to their solution. The first drop in a series of tools made for and by humans.",
  },
] as const;

const inputBase =
  "w-full rounded-lg border border-white/25 bg-[#13450E] px-4 py-3 text-base text-[#f5f0e8] outline-none placeholder:text-white/35 focus:border-white/50 tracking-[-0.03em]";

const helpClass = `${roboto.className} mt-1.5 block text-[10px] font-semibold uppercase leading-snug tracking-[-0.03em] text-white/55`;

const fieldErrorClass = `${roboto.className} mt-2 text-sm font-semibold text-red-300`;

function FieldError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className={fieldErrorClass} role="alert">
      {message}
    </p>
  );
}

function Label({
  stepIndex,
  priority = false,
}: {
  stepIndex: number;
  priority?: boolean;
}) {
  const label = QUESTION_LABELS[stepIndex];
  return <QuestionLabel {...label} priority={priority} />;
}

function ContinueButton({
  onClick,
  label = "Continue →",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${roboto.className} mt-4 cursor-pointer rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-[-0.03em] text-[#13450E] transition-opacity hover:opacity-90 sm:text-base`}
    >
      {label}
    </button>
  );
}

function DoneAnswer({
  children,
  onEdit,
}: {
  children: ReactNode;
  onEdit: () => void;
}) {
  return (
    <div
      onClick={onEdit}
      className="group cursor-pointer py-1 transition-opacity hover:opacity-70"
    >
      <p
        className={`${roboto.className} text-xl leading-snug text-[#f5f0e8] sm:text-2xl`}
      >
        {children}
        <span
          className={`${roboto.className} ml-2 align-middle text-[10px] font-semibold uppercase tracking-[-0.03em] text-white/50 opacity-0 transition-opacity group-hover:opacity-100`}
        >
          edit
        </span>
      </p>
    </div>
  );
}

function ChoiceButton({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${roboto.className} flex min-h-12 w-full items-center rounded-lg border px-4 py-3 text-left text-sm font-semibold uppercase leading-snug tracking-[-0.03em] transition-colors sm:text-base ${
        selected
          ? "border-white/40 bg-white/10 text-[#f5f0e8]"
          : "border-white/25 bg-[#13450E] text-[#f5f0e8] hover:border-white/40"
      }`}
    >
      {label}
    </button>
  );
}

function AutoTextarea({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className={`${className} min-h-24 resize-none overflow-hidden`}
    />
  );
}

/** -1 = intro, 0–11 = active questions, 12 = review/submit */
const INTRO_STEP = -1;
const SUBMIT_STEP = 12;

function FormHeader() {
  return (
    <header className="mb-8 flex items-center justify-between gap-3 border-b border-white/10 pb-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hopathon/the-green-hackathon.svg"
        alt="The Green Hackathon"
        width={340}
        height={138}
        decoding="async"
        fetchPriority="high"
        className="h-10 w-auto max-w-[55vw] sm:h-12"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hopathon/group-171.svg"
        alt="Hopamine"
        width={178}
        height={46}
        decoding="async"
        loading="lazy"
        className="h-7 w-auto shrink-0 sm:h-8"
      />
    </header>
  );
}

export function HackathonForm() {
  const [step, setStep] = useState(INTRO_STEP);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [name, setName] = useState("");
  const [discord, setDiscord] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [timezone, setTimezone] = useState("");
  const [devoverlap, setDevoverlap] = useState("");
  const [skills, setSkills] = useState("");
  const [idea, setIdea] = useState("");
  const [teamsolo, setTeamsolo] = useState("");
  const [commitment, setCommitment] = useState("");
  const [teammate, setTeammate] = useState("");
  const [buildidea, setBuildidea] = useState("");

  const topRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef(step);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const discordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const timezoneRef = useRef<HTMLInputElement>(null);
  const skillsRef = useRef<HTMLInputElement>(null);

  const inputClass = `${roboto.className} ${inputBase}`;

  function scrollFormToTop() {
    const scrollRoot = document.getElementById("hopathon-scroll");
    if (scrollRoot) {
      scrollRoot.scrollTop = 0;
    }
    topRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
    stepRefs.current[0]?.scrollIntoView({ behavior: "auto", block: "start" });
  }

  useEffect(() => {
    const next = QUESTION_LABELS[step + 1];
    if (!next) return;
    const img = new Image();
    img.src = next.src;
  }, [step]);

  useLayoutEffect(() => {
    const prev = prevStepRef.current;
    prevStepRef.current = step;

    if (prev !== INTRO_STEP || step !== 0) return;

    scrollFormToTop();

    const focusId = window.setTimeout(() => nameRef.current?.focus(), 100);
    return () => window.clearTimeout(focusId);
  }, [step]);

  useEffect(() => {
    if (step <= 0) return;

    let attempts = 0;
    const id = window.setInterval(() => {
      const el = stepRefs.current[step];
      attempts += 1;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.clearInterval(id);
      } else if (attempts > 24) {
        window.clearInterval(id);
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [step]);

  function readField(ref: RefObject<HTMLInputElement | null>, fallback: string) {
    return (ref.current?.value ?? fallback).trim();
  }

  function goToStep(nextStep: number) {
    setFieldError(null);
    setStep(nextStep);
  }

  function continueText(
    ref: RefObject<HTMLInputElement | null>,
    fallback: string,
    setValue: (value: string) => void,
    nextStep: number,
    required = true,
  ) {
    const value = readField(ref, fallback);
    if (required && !value) {
      setFieldError("Please fill this in to continue.");
      ref.current?.focus();
      return;
    }
    setValue(value);
    goToStep(nextStep);
  }

  const devLabels: Record<string, string> = {
    Yes: "Yes, I can be the Developer",
    Little: "A little (no-code / light)",
    No: "No, different superpower",
  };

  const ideaLabels: Record<string, string> = {
    Lead: "Yes, leading one",
    Flexible: "Yes, but flexible",
    Join: "No, want to join one",
  };

  const teamLabels: Record<string, string> = {
    Match: "Match me into a team",
    Own: "I'll find my own",
    Either: "Either is fine",
  };

  const commitmentLabels: Record<string, string> = {
    "All-in": "I'm all in!",
    Sessions: "I can put in a few solid sessions",
    Casual: "I can come in here & there",
  };

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);

    const data: Record<string, string> = {
      name: name.trim(),
      discord: discord.trim(),
      email: email.trim(),
      phone: phone.trim(),
      timezone: timezone.trim(),
      devoverlap,
      skills: skills.trim(),
      idea,
      teamsolo,
      commitment,
      teammate: teammate.trim(),
      buildidea: buildidea.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data),
      });
      setDone(true);
      setTimeout(
        () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        80,
      );
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  function setStepRef(index: number) {
    return (el: HTMLDivElement | null) => {
      stepRefs.current[index] = el;
    };
  }

  function startRegistration() {
    setFieldError(null);
    setStep(0);
  }

  if (done) {
    return (
      <div
        ref={topRef}
        className={`relative min-h-dvh w-full ${hopathonBg}`}
      >
        <div className="relative flex min-h-dvh justify-center px-5 py-16 md:px-8 md:py-24">
          <div
            className={`flex w-full max-w-2xl flex-col items-center px-8 py-12 text-center md:px-12 md:py-14 ${hopathonBg}`}
          >
            <h2
              className={`${roboto.className} text-4xl font-bold text-[#f5f0e8] md:text-5xl`}
            >
              You&apos;re in
            </h2>
            <p
              className={`${roboto.className} mt-4 max-w-sm text-base text-white/80 md:text-lg`}
            >
              Check Discord for your team thread before kickoff. When in doubt:
              lead with love.
            </p>
            <Link
              href="/hopathon"
              className={`${roboto.className} mt-8 text-sm font-semibold uppercase tracking-[-0.03em] text-white/70 underline`}
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={topRef}
      className={`relative min-h-dvh w-full ${hopathonBg} pb-[max(3rem,env(safe-area-inset-bottom))]`}
    >
      <div className="relative flex justify-center px-5 pb-32 pt-6 md:px-8 md:pt-10">
        <div className={`w-full max-w-2xl px-2 py-4 md:px-4 md:py-6 ${hopathonBg}`}>
          <FormHeader />

          <div className={step === INTRO_STEP ? "" : "hidden"} aria-hidden={step !== INTRO_STEP}>
            <p
              className={`${roboto.className} mb-8 text-base font-semibold uppercase tracking-[-0.03em] text-white sm:text-lg`}
            >
              THINK GLOBALLY · BUILD LOCALLY
            </p>
            <div className="space-y-8">
              {INTRO_SECTIONS.map((section) => (
                <section key={section.title}>
                  <h2
                    className={`${roboto.className} text-xl font-bold tracking-[-0.03em] text-[#f5f0e8] sm:text-2xl`}
                  >
                    {section.title}
                  </h2>
                  <p
                    className={`${roboto.className} mt-3 text-base leading-relaxed tracking-[-0.03em] text-white/80 sm:text-lg`}
                  >
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
            <div className="mt-3 flex justify-center">
              <ContinueButton
                onClick={startRegistration}
                label="Start registration →"
              />
            </div>
          </div>

          <div className={step === INTRO_STEP ? "hidden" : ""} aria-hidden={step === INTRO_STEP}>
          <div className="space-y-8">
            {/* Step 0 — Name */}
            <div ref={setStepRef(0)}>
              {step > 0 ? (
                <DoneAnswer onEdit={() => goToStep(0)}>
                  I&apos;m <span className="text-white">{name}</span>.
                </DoneAnswer>
              ) : (
                <>
                  <Label stepIndex={0} priority />
                  <input
                    ref={nameRef}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setFieldError(null);
                    }}
                    placeholder="Jane Doe"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        continueText(nameRef, name, setName, 1);
                      }
                    }}
                    className={inputClass}
                  />
                  <FieldError message={step === 0 ? fieldError : null} />
                  <ContinueButton
                    onClick={() => continueText(nameRef, name, setName, 1)}
                  />
                </>
              )}
            </div>

            {/* Step 1 — Discord */}
            {step >= 1 && (
              <div ref={setStepRef(1)}>
                {step > 1 ? (
                  <DoneAnswer onEdit={() => goToStep(1)}>
                    Discord: <span className="text-white">{discord}</span>
                  </DoneAnswer>
                ) : (
                  <>
                    <Label stepIndex={1} />
                    <input
                      ref={discordRef}
                      autoFocus
                      value={discord}
                      onChange={(e) => {
                        setDiscord(e.target.value);
                        setFieldError(null);
                      }}
                      placeholder="@username"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          continueText(discordRef, discord, setDiscord, 2);
                        }
                      }}
                      className={inputClass}
                    />
                    <FieldError message={step === 1 ? fieldError : null} />
                    <ContinueButton
                      onClick={() => continueText(discordRef, discord, setDiscord, 2)}
                    />
                  </>
                )}
              </div>
            )}

            {/* Step 2 — Email */}
            {step >= 2 && (
              <div ref={setStepRef(2)}>
                {step > 2 ? (
                  <DoneAnswer onEdit={() => goToStep(2)}>
                    Email: <span className="text-white">{email}</span>
                  </DoneAnswer>
                ) : (
                  <>
                    <Label stepIndex={2} />
                    <input
                      ref={emailRef}
                      autoFocus
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setFieldError(null);
                      }}
                      placeholder="you@email.com"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          continueText(emailRef, email, setEmail, 3);
                        }
                      }}
                      className={inputClass}
                    />
                    <FieldError message={step === 2 ? fieldError : null} />
                    <ContinueButton
                      onClick={() => continueText(emailRef, email, setEmail, 3)}
                    />
                  </>
                )}
              </div>
            )}

            {/* Step 3 — Phone (optional) */}
            {step >= 3 && (
              <div ref={setStepRef(3)}>
                {step > 3 ? (
                  <DoneAnswer onEdit={() => goToStep(3)}>
                    {phone.trim() ? (
                      <>Phone: <span className="text-white">{phone}</span></>
                    ) : (
                      <span className="text-white/60">No phone provided</span>
                    )}
                  </DoneAnswer>
                ) : (
                  <>
                    <Label stepIndex={3} />
                    <input
                      ref={phoneRef}
                      autoFocus
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setPhone(readField(phoneRef, phone));
                          goToStep(4);
                        }
                      }}
                      className={inputClass}
                    />
                    <ContinueButton
                      onClick={() => {
                        setPhone(readField(phoneRef, phone));
                        goToStep(4);
                      }}
                      label={phone.trim() ? "Continue →" : "Skip →"}
                    />
                  </>
                )}
              </div>
            )}

            {/* Step 4 — Timezone */}
            {step >= 4 && (
              <div ref={setStepRef(4)}>
                {step > 4 ? (
                  <DoneAnswer onEdit={() => goToStep(4)}>
                    Time zone / city: <span className="text-white">{timezone}</span>
                  </DoneAnswer>
                ) : (
                  <>
                    <Label stepIndex={4} />
                    <input
                      ref={timezoneRef}
                      autoFocus
                      value={timezone}
                      onChange={(e) => {
                        setTimezone(e.target.value);
                        setFieldError(null);
                      }}
                      placeholder="EST / Montreal"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          continueText(timezoneRef, timezone, setTimezone, 5);
                        }
                      }}
                      className={inputClass}
                    />
                    <FieldError message={step === 4 ? fieldError : null} />
                    <ContinueButton
                      onClick={() => continueText(timezoneRef, timezone, setTimezone, 5)}
                    />
                  </>
                )}
              </div>
            )}

            {/* Step 5 — Developer */}
            {step >= 5 && (
              <div ref={setStepRef(5)}>
                {step > 5 ? (
                  <DoneAnswer onEdit={() => goToStep(5)}>
                    Developer: <span className="text-white">{devLabels[devoverlap]}</span>
                  </DoneAnswer>
                ) : (
                  <>
                    <Label stepIndex={5} />
                    <div className="space-y-2">
                      {(["Yes", "Little", "No"] as const).map((v) => (
                        <ChoiceButton
                          key={v}
                          selected={devoverlap === v}
                          onClick={() => {
                            setDevoverlap(v);
                            setFieldError(null);
                          }}
                          label={devLabels[v]}
                        />
                      ))}
                    </div>
                    <FieldError message={step === 5 ? fieldError : null} />
                    <ContinueButton
                      onClick={() => {
                        if (!devoverlap) {
                          setFieldError("Pick an option to continue.");
                          return;
                        }
                        goToStep(6);
                      }}
                    />
                  </>
                )}
              </div>
            )}

            {/* Step 6 — Skills (optional) */}
            {step >= 6 && (
              <div ref={setStepRef(6)}>
                {step > 6 ? (
                  <DoneAnswer onEdit={() => goToStep(6)}>
                    {skills.trim() ? (
                      <>Skills: <span className="text-white">{skills}</span></>
                    ) : (
                      <span className="text-white/60">Skipped skills</span>
                    )}
                  </DoneAnswer>
                ) : (
                  <>
                    <Label stepIndex={6} />
                    <input
                      ref={skillsRef}
                      autoFocus
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="React, Figma, soil science…"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setSkills(readField(skillsRef, skills));
                          goToStep(7);
                        }
                      }}
                      className={inputClass}
                    />
                    <ContinueButton
                      onClick={() => {
                        setSkills(readField(skillsRef, skills));
                        goToStep(7);
                      }}
                      label={skills.trim() ? "Continue →" : "Skip →"}
                    />
                  </>
                )}
              </div>
            )}

            {/* Step 7 — Idea */}
            {step >= 7 && (
              <div ref={setStepRef(7)}>
                {step > 7 ? (
                  <DoneAnswer onEdit={() => goToStep(7)}>
                    Idea: <span className="text-white">{ideaLabels[idea]}</span>
                  </DoneAnswer>
                ) : (
                  <>
                    <Label stepIndex={7} />
                    <div className="space-y-2">
                      {(["Lead", "Flexible", "Join"] as const).map((v) => (
                        <ChoiceButton
                          key={v}
                          selected={idea === v}
                          onClick={() => {
                            setIdea(v);
                            setFieldError(null);
                          }}
                          label={ideaLabels[v]}
                        />
                      ))}
                    </div>
                    <FieldError message={step === 7 ? fieldError : null} />
                    <ContinueButton
                      onClick={() => {
                        if (!idea) {
                          setFieldError("Pick an option to continue.");
                          return;
                        }
                        goToStep(8);
                      }}
                    />
                  </>
                )}
              </div>
            )}

            {/* Step 8 — Team or solo */}
            {step >= 8 && (
              <div ref={setStepRef(8)}>
                {step > 8 ? (
                  <DoneAnswer onEdit={() => goToStep(8)}>
                    Team: <span className="text-white">{teamLabels[teamsolo]}</span>
                  </DoneAnswer>
                ) : (
                  <>
                    <Label stepIndex={8} />
                    <div className="space-y-2">
                      {(["Match", "Own", "Either"] as const).map((v) => (
                        <ChoiceButton
                          key={v}
                          selected={teamsolo === v}
                          onClick={() => {
                            setTeamsolo(v);
                            setFieldError(null);
                          }}
                          label={teamLabels[v]}
                        />
                      ))}
                    </div>
                    <FieldError message={step === 8 ? fieldError : null} />
                    <ContinueButton
                      onClick={() => {
                        if (!teamsolo) {
                          setFieldError("Pick an option to continue.");
                          return;
                        }
                        goToStep(9);
                      }}
                    />
                  </>
                )}
              </div>
            )}

            {/* Step 9 — Commitment */}
            {step >= 9 && (
              <div ref={setStepRef(9)}>
                {step > 9 ? (
                  <DoneAnswer onEdit={() => goToStep(9)}>
                    Commitment:{" "}
                    <span className="text-white">{commitmentLabels[commitment]}</span>
                  </DoneAnswer>
                ) : (
                  <>
                    <Label stepIndex={9} />
                    <span className={helpClass}>
                      The hackathon is for the weekend of the 13th–14th of June.
                    </span>
                    <div className="mt-3 space-y-2">
                      {(["All-in", "Sessions", "Casual"] as const).map((v) => (
                        <ChoiceButton
                          key={v}
                          selected={commitment === v}
                          onClick={() => {
                            setCommitment(v);
                            setFieldError(null);
                          }}
                          label={commitmentLabels[v]}
                        />
                      ))}
                    </div>
                    <FieldError message={step === 9 ? fieldError : null} />
                    <ContinueButton
                      onClick={() => {
                        if (!commitment) {
                          setFieldError("Pick an option to continue.");
                          return;
                        }
                        goToStep(10);
                      }}
                    />
                  </>
                )}
              </div>
            )}

            {/* Step 10 — Teammate (optional) */}
            {step >= 10 && (
              <div ref={setStepRef(10)}>
                {step > 10 ? (
                  <DoneAnswer onEdit={() => goToStep(10)}>
                    {teammate.trim() ? (
                      <>
                        Looking for:{" "}
                        <span className="text-white">&ldquo;{teammate}&rdquo;</span>
                      </>
                    ) : (
                      <span className="text-white/60">Skipped teammate preferences</span>
                    )}
                  </DoneAnswer>
                ) : (
                  <>
                    <Label stepIndex={10} />
                    <AutoTextarea
                      value={teammate}
                      onChange={setTeammate}
                      placeholder="Someone who complements your skills…"
                      className={inputClass}
                    />
                    <ContinueButton
                      onClick={() => goToStep(11)}
                      label={teammate.trim() ? "Continue →" : "Skip →"}
                    />
                  </>
                )}
              </div>
            )}

            {/* Step 11 — Build idea (optional) */}
            {step >= 11 && (
              <div ref={setStepRef(11)}>
                {step > 11 ? (
                  <DoneAnswer onEdit={() => goToStep(11)}>
                    {buildidea.trim() ? (
                      <>
                        Building:{" "}
                        <span className="text-white">&ldquo;{buildidea}&rdquo;</span>
                      </>
                    ) : (
                      <span className="text-white/60">Skipped build idea</span>
                    )}
                  </DoneAnswer>
                ) : (
                  <>
                    <Label stepIndex={11} />
                    <AutoTextarea
                      value={buildidea}
                      onChange={setBuildidea}
                      placeholder="Even a one-line hunch helps us pair you well."
                      className={inputClass}
                    />
                    <ContinueButton
                      onClick={() => goToStep(SUBMIT_STEP)}
                      label={buildidea.trim() ? "Continue →" : "Skip →"}
                    />
                  </>
                )}
              </div>
            )}

            {/* Submit */}
            {step >= SUBMIT_STEP && (
              <div ref={setStepRef(SUBMIT_STEP)} className="border-t border-white/10 pt-6">
                <p
                  className={`${roboto.className} mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55`}
                >
                  Almost there
                </p>
                <h2
                  className={`${roboto.className} mb-6 text-2xl font-bold text-[#f5f0e8] md:text-3xl`}
                >
                  Reserve your place in the Green Hackathon.
                </h2>
                {error ? (
                  <p
                    className={`${roboto.className} mb-4 text-center text-sm text-red-300`}
                    role="alert"
                  >
                    {error}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => void handleSubmit()}
                  disabled={submitting}
                  className={`${roboto.className} w-full rounded-full bg-white py-4 text-xl font-bold uppercase tracking-[-0.03em] text-[#13450E] transition-opacity disabled:opacity-50 sm:w-auto sm:px-10 sm:text-2xl`}
                >
                  {submitting ? "Sending…" : "Reserve my place!"}
                </button>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
