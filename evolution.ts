
// model JournalFinancier {
//   id            String          @id @default(uuid())
//   date          DateTime        @unique
//   totalRecettes Float           @default(0)
//   totalDepenses Float           @default(0)
//   resultatNet   Float           @default(0)
//   statutJournee StatutJournee
//   commentaire   String?
//   createdAt     DateTime        @default(now())
//   apports       ApportExterne[]
// }

// model ApportExterne {
//   id          String            @id @default(uuid())
//   montant     Float
//   source      String // "Patron", "Banque", etc.
//   date        DateTime          @default(now())
//   commentaire String?
//   journalId   String?
//   journal     JournalFinancier? @relation(fields: [journalId], references: [id])
// }

// enum StatutJournee {
//   BENEFICIAIRE
//   NEUTRE
//   DEFICITAIRE
// }
