import { useCallback } from 'react';

declare global {
  interface Window {
    dataLayer: Array<Record<string, any>>;
  }
}

type Primitive = string | number | boolean | null | undefined;

type GtmContent = {
  id: string;
  quantity?: number;
  item_price?: number;
  item_name?: string;
  item_category?: string;
  [key: string]: Primitive;
};

type CommonEventPayload = {
  value?: number;
  currency?: string;
  email?: string;
  userId?: string | number;
  dealId?: string | number;
  eventSource?: string;
  contents?: GtmContent[];
  numItems?: number;
  coupon?: string;
  paymentMethod?: string;
  invoiceId?: string | number;
  customerId?: string;
  sessionId?: string;
  metadata?: Record<string, Primitive>;
  [key: string]: any;
};

type LessonFinishedPayload = {
  lessonId: string | number;
  stageId?: string | number;
  lessonName?: string;
  stageName?: string;
  courseId?: string | number;
  isFree?: boolean;
  progress?: number;
  [key: string]: any;
};

const ensureDataLayer = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
};

const generateEventId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

const normaliseCurrency = (currency?: string) => currency?.toUpperCase();

export const useGtmEvents = () => {
  const pushEvent = useCallback((eventName: string, payload: Record<string, any> = {}) => {
    const dataLayer = ensureDataLayer();
    if (!dataLayer) {
      return;
    }

    const eventId = payload.event_id ?? generateEventId();
    const pageLocation = typeof window !== 'undefined' ? window.location.href : undefined;
    const pageTitle = typeof document !== 'undefined' ? document.title : undefined;

    const eventPayload = {
      event: eventName,
      event_id: eventId,
      event_source: payload.eventSource || 'web_app',
      page_location: payload.page_location || pageLocation,
      page_title: payload.page_title || pageTitle,
      timestamp: new Date().toISOString(),
      ...payload,
    };

    dataLayer.push(eventPayload);
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[GTM] Event pushed', eventPayload);
    }
  }, []);

  const pushStartTrial = useCallback((payload: CommonEventPayload = {}) => {
    pushEvent('StartTrial', {
      trial_status: payload.trialStatus || 'started',
      value: payload.value ?? 0,
      currency: normaliseCurrency(payload.currency) || 'USD',
      email: payload.email,
      user_id: payload.userId,
      deal_id: payload.dealId,
      sessionId: payload.sessionId,
      metadata: payload.metadata,
    });
  }, [pushEvent]);

  const pushLessonFinished = useCallback((payload: LessonFinishedPayload) => {
    if (!payload?.lessonId) {
      return;
    }

    pushEvent('Lesson_finished', {
      lesson_id: payload.lessonId,
      stage_id: payload.stageId,
      lesson_name: payload.lessonName,
      stage_name: payload.stageName,
      course_id: payload.courseId,
      is_free: payload.isFree ?? true,
      progress: payload.progress ?? 100,
      metadata: payload.metadata,
    });
  }, [pushEvent]);

  const pushInitiateCheckout = useCallback((payload: CommonEventPayload = {}) => {
    pushEvent('InitiateCheckout', {
      value: payload.value,
      currency: normaliseCurrency(payload.currency) || 'USD',
      contents: payload.contents,
      num_items: payload.numItems ?? payload.contents?.length ?? 1,
      email: payload.email,
      user_id: payload.userId,
      deal_id: payload.dealId,
      coupon: payload.coupon,
      session_id: payload.sessionId,
      invoice_id: payload.invoiceId,
      metadata: payload.metadata,
    });
  }, [pushEvent]);

  const pushPurchase = useCallback((payload: CommonEventPayload = {}) => {
    if (!payload.value || !payload.currency) {
      // eslint-disable-next-line no-console
      console.warn('[GTM] Purchase event skipped: value or currency missing');
      return;
    }

    pushEvent('Purchase', {
      value: payload.value,
      currency: normaliseCurrency(payload.currency),
      contents: payload.contents,
      num_items: payload.numItems ?? payload.contents?.length ?? 1,
      user_id: payload.userId,
      email: payload.email,
      coupon: payload.coupon,
      payment_method: payload.paymentMethod,
      session_id: payload.sessionId,
      invoice_id: payload.invoiceId,
      customer_id: payload.customerId,
      metadata: payload.metadata,
    });
  }, [pushEvent]);

  const pushLogin = useCallback((payload: CommonEventPayload = {}) => {
    pushEvent('Login', {
      email: payload.email,
      user_id: payload.userId,
      deal_id: payload.dealId,
      metadata: payload.metadata,
    });
  }, [pushEvent]);

  return {
    pushEvent,
    pushStartTrial,
    pushLogin,
    pushLessonFinished,
    pushInitiateCheckout,
    pushPurchase,
  };
};

