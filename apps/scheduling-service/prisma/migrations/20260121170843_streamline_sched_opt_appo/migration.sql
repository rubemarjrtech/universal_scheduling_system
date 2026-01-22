/*
  Warnings:

  - You are about to drop the `Scheduling` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `duration` to the `ScheduleOptions` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ScheduleOptions] ADD [duration] INT NOT NULL;

-- DropTable
DROP TABLE [dbo].[Scheduling];

-- CreateTable
CREATE TABLE [dbo].[Appointment] (
    [id] NVARCHAR(1000) NOT NULL,
    [startsAt] DATETIME2 NOT NULL,
    [endsAt] DATETIME2 NOT NULL,
    [provider_id] INT NOT NULL,
    [customer_id] INT NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Appointment_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Appointment_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
