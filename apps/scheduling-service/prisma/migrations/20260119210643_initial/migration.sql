BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Customer] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [cellphone] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Customer_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Customer_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [Customer_cellphone_key] UNIQUE NONCLUSTERED ([cellphone])
);

-- CreateTable
CREATE TABLE [dbo].[Provider] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [cellphone] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Provider_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Provider_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Provider_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [Provider_cellphone_key] UNIQUE NONCLUSTERED ([cellphone])
);

-- CreateTable
CREATE TABLE [dbo].[ScheduleOptions] (
    [id] INT NOT NULL IDENTITY(1,1),
    [dayOfWeek] INT NOT NULL,
    [startTime] INT NOT NULL,
    [endTime] INT NOT NULL,
    [provider_id] INT NOT NULL,
    CONSTRAINT [ScheduleOptions_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Scheduling] (
    [id] NVARCHAR(1000) NOT NULL,
    [startsAt] DATETIME2 NOT NULL,
    [endsAt] DATETIME2 NOT NULL,
    [provider_id] INT NOT NULL,
    [customer_id] INT NOT NULL,
    CONSTRAINT [Scheduling_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[ScheduleOptions] ADD CONSTRAINT [ScheduleOptions_provider_id_fkey] FOREIGN KEY ([provider_id]) REFERENCES [dbo].[Provider]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
