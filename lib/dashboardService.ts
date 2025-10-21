// 📂 lib/dashboardNode.ts
import prisma from "@/lib/prisma";
import { ChartDataPoint, DashboardData, DashboardStats, DashboardSummary, PeriodeType } from "@/type";
import { startOfDay, endOfDay, subDays, eachDayOfInterval } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";


const TIME_ZONE = "Africa/Douala";

/**
 * Totaux financiers et données du graphe par période
 */
export async function getStatsByPeriodeNode(
  periode: PeriodeType
): Promise<DashboardStats> {
  const now = new Date();
  const zonedNow = toZonedTime(now, TIME_ZONE);

  let start: Date;
  switch (periode) {
    case "semaine":
      start = subDays(fromZonedTime(startOfDay(zonedNow), TIME_ZONE), 7);
      break;
    case "mois":
      start = subDays(fromZonedTime(startOfDay(zonedNow), TIME_ZONE), 30);
      break;
    case "annee":
      start = subDays(fromZonedTime(startOfDay(zonedNow), TIME_ZONE), 365);
      break;
    default:
      start = fromZonedTime(startOfDay(zonedNow), TIME_ZONE);
  }

  const end = fromZonedTime(endOfDay(zonedNow), TIME_ZONE);

  const transactions = await prisma.transaction.findMany({
    where: { createdAt: { gte: start, lte: end } },
  });

  const totalRecettes = transactions
    .filter((t) => t.type === "Recette")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalDepenses = transactions
    .filter((t) => t.type === "Depense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const resultatNet = totalRecettes - totalDepenses;
  const statut: DashboardStats["statut"] =
    resultatNet > 4500
      ? "BENEFICIAIRE"
      : resultatNet < 4500
      ? "DEFICITAIRE"
      : "NEUTRE";

  // Préparer les données du graphe (recette vs depense par jour)
  const jours = eachDayOfInterval({ start, end });
  const chartData: ChartDataPoint[] = jours.map((day) => {
    const recettesJour = transactions
      .filter(
        (t) =>
          t.type === "Recette" &&
          t.createdAt.getDate() === day.getDate() &&
          t.createdAt.getMonth() === day.getMonth()
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const depensesJour = transactions
      .filter(
        (t) =>
          t.type === "Depense" &&
          t.createdAt.getDate() === day.getDate() &&
          t.createdAt.getMonth() === day.getMonth()
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return {
      date: day.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
      recettes: recettesJour,
      depenses: depensesJour,
    };
  });

  return {
    periode,
    totalRecettes,
    totalDepenses,
    resultatNet,
    statut,
    chartData,
  };
}

/**
 * Résumé global du dashboard
 */
export async function getDashboardSummaryNode(): Promise<DashboardSummary> {
  const totalTransactionsCount = await prisma.transaction.count();
  const employeesCount = await prisma.users.count();
  const categoriesCount = await prisma.category.count();
  return { totalTransactionsCount, employeesCount, categoriesCount };
}

/**
 * Données complètes du dashboard pour le front
 */
export async function getDashboardDataNode(
  periode: PeriodeType
): Promise<DashboardData> {
  const stats = await getStatsByPeriodeNode(periode);
  const summary = await getDashboardSummaryNode();
  return { ...stats, ...summary };
}
