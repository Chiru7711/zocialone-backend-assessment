export enum ComplaintType {
  LIVE_DEMO = 'live_demo',
  BILLING_ISSUE = 'billing_issue',
  TECHNICAL_ISSUE = 'technical_issue',
  FEEDBACK = 'feedback'
}

export enum ComplaintStatus {
  RAISED = 'raised',
  IN_PROGRESS = 'in_progress',
  WAITING_ON_USER = 'waiting_on_user',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum OnboardingStage {
  STAGE_0 = 0,
  STAGE_1 = 1,
  STAGE_2 = 2
}