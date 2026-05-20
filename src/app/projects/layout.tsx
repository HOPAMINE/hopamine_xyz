import { ProjectsScrollGate } from "../../../components/ProjectsScrollGate";

export default function ProjectsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ProjectsScrollGate>{children}</ProjectsScrollGate>;
}
