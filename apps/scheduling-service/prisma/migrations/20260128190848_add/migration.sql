/*
  Warnings:

  - A unique constraint covering the columns `[provider_id,dayOfWeek]` on the table `ScheduleOptions` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[ScheduleOptions] ADD CONSTRAINT [ScheduleOptions_provider_id_dayOfWeek_key] UNIQUE NONCLUSTERED ([provider_id], [dayOfWeek]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
