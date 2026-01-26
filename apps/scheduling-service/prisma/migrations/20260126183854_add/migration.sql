/*
  Warnings:

  - A unique constraint covering the columns `[startsAt]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[endsAt]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[Appointment] ADD CONSTRAINT [Appointment_startsAt_key] UNIQUE NONCLUSTERED ([startsAt]);

-- CreateIndex
ALTER TABLE [dbo].[Appointment] ADD CONSTRAINT [Appointment_endsAt_key] UNIQUE NONCLUSTERED ([endsAt]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
