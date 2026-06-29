import { getSessionUser } from "@/lib/session";
import { portfolioRepo } from "@/lib/repositories/portfolio.repo";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { PortfolioClient } from "./_client";
import type { PortfolioResponseDTO } from "@/types/portfolio";

export default async function StudentPortfolioPage() {
  const user = await getSessionUser();

  let portfolio: PortfolioResponseDTO | null = null;
  try {
    portfolio = await portfolioRepo.getByStudentId(user!.userId);
  } catch {
    // 404 = portfolio doesn't exist yet
  }

  return (
    <div>
      <PageHeader
        title="My Portfolio"
        description="Showcase your skills, projects, and attachments."
      />
      <PortfolioClient existing={portfolio} />
    </div>
  );
}
