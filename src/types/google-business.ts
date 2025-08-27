export interface GoogleBusinessPost {
  languageCode: string;
  summary: string;
  topicType: 'STANDARD' | 'EVENT' | 'OFFER' | 'PRODUCT';
  callToAction?: {
    actionType: 'LEARN_MORE' | 'BOOK' | 'ORDER_ONLINE' | 'BUY' | 'SIGN_UP' | 'CALL';
    url?: string;
  };
  media?: MediaItem[];
  createTime?: string;
  alertType?: 'NOT_SPECIFIED' | 'COVID_19';
  event?: EventDetails;
  offer?: OfferDetails;
  product?: ProductDetails;
}

export interface MediaItem {
  mediaFormat: 'PHOTO' | 'VIDEO';
  sourceUrl: string;
}

export interface EventDetails {
  title: string;
  schedule: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  };
}

export interface OfferDetails {
  couponCode?: string;
  redeemOnlineUrl?: string;
  termsConditions?: string;
}

export interface ProductDetails {
  name: string;
  category?: string;
  labels?: string[];
}

export interface PostCreationResponse {
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post?: any;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
}
