import { redirect } from "next/navigation";
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: PageProps) {
  const { id } = use(params);
  redirect(`/project/${id}/home`);
}
