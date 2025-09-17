// Shared types for Google Business features
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Post {
  id: number;
  topicType: string;
  languageCode: string;
  summary: string;
  callToAction: {
    actionType: string;
    url: string;
  };
  media: any[];
  event: any;
  offer: any;
  product: any;
  scheduleTime: string;
  alertType: string;
}
