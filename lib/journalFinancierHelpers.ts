// 📂 app/server/journalFinancierNode.ts
import prisma from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { StatutJournee } from "@prisma/client";

const TIME_ZONE = "Africa/Douala";

/**
 * Synchronise ou crée le journal financier du jour
 * Recalcule totalRecettes, totalDepenses, resultatNet et statut
 * Crée un ApportExterne automatique si deficit
 */
export async function syncJournalFinancierNode(
  dateOpt?: Date,
  autoApport = true
) {
  const today = dateOpt ?? new Date();
  const zonedDate = toZonedTime(today, TIME_ZONE);

  const start = fromZonedTime(startOfDay(zonedDate), TIME_ZONE);
  const end = fromZonedTime(endOfDay(zonedDate), TIME_ZONE);

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

  let statutJournee: StatutJournee = "NEUTRE";
  let commentaire = "Journée neutre.";

  if (resultatNet > 4500) {
    statutJournee = "BENEFICIAIRE";
    commentaire = `Journée bénéficiaire : résultat net ${resultatNet.toFixed(
      2
    )}.`;
  } else if (resultatNet < 4500) {
    statutJournee = "DEFICITAIRE";
    commentaire = `Journée déficitaire : perte de ${Math.abs(
      resultatNet
    ).toFixed(2)}.`;
  }

  const existing = await prisma.journalFinancier.findUnique({
    where: { date: start },
  });

  if (existing) {
    await prisma.journalFinancier.update({
      where: { id: existing.id },
      data: {
        totalRecettes,
        totalDepenses,
        resultatNet,
        statutJournee,
        commentaire,
      },
    });
  } else {
    await prisma.journalFinancier.create({
      data: {
        date: start,
        totalRecettes,
        totalDepenses,
        resultatNet,
        statutJournee,
        commentaire,
      },
    });
  }

  // Apport externe automatique si déficit
  if (resultatNet < 4500 && autoApport) {
    const patron = await prisma.users.findFirst({ where: { role: "ADMIN" } });
    if (patron) {
      const alreadyApport = await prisma.apportExterne.findFirst({
        where: { journal: { date: start }, source: "Patron" },
      });
      if (!alreadyApport) {
        await prisma.apportExterne.create({
          data: {
            montant: Math.abs(resultatNet),
            source: "Patron",
            commentaire: `Apport automatique pour compenser la perte de ${Math.abs(
              resultatNet
            ).toFixed(2)}`,
            journal: { connect: { date: start } },
          },
        });
      }
    }
  }

  return {
    totalRecettes,
    totalDepenses,
    resultatNet,
    statutJournee,
    commentaire,
  };
}
