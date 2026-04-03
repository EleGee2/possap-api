export enum QueueName {
  Cron = 'cron',
  Email = 'email',
}

export enum CronJob {
  Init = 'init',
}

export enum EmailJob {
  SendVerificationEmail = 'send-verification-email',
  SendPasswordResetEmail = 'send-password-reset-email',
}
