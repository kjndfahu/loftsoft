-- AlterTable
ALTER TABLE "Distributive" ADD COLUMN     "logoUrl" TEXT;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "photo" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WithdrawRequest" ALTER COLUMN "phone" SET DATA TYPE TEXT;
