import { ref } from "vue";
import { defineStore } from "pinia";
import type { AdminBootstrapPayload, InquiryRecord, SubscriberRecord } from "../types/admin";
import { apiPost } from "../services/http";
import { updateMockInquiry } from "../services/mockAdmin";
import { useSessionStore } from "./session";

export const useCrmStore = defineStore("crm", () => {
  const inquiries = ref<InquiryRecord[]>([]);
  const subscribers = ref<SubscriberRecord[]>([]);

  const hydrate = (payload: Pick<AdminBootstrapPayload, "inquiries" | "subscribers">) => {
    inquiries.value = payload.inquiries;
    subscribers.value = payload.subscribers;
  };

  const updateInquiry = async (record: InquiryRecord) => {
    const sessionStore = useSessionStore();

    if (!sessionStore.token) {
      throw new Error("未登录或登录已过期。");
    }

    if (sessionStore.isMockMode) {
      const updated = updateMockInquiry(record);
      const index = inquiries.value.findIndex((item) => item.id === updated.id);

      if (index >= 0) {
        inquiries.value.splice(index, 1, updated);
      }

      return;
    }

    const updated = await apiPost<InquiryRecord>(
      "/admin/inquiries/update",
      {
        id: record.id,
        status: record.status,
        assignee: record.assignee
      },
      {
        token: sessionStore.token
      }
    );
    const index = inquiries.value.findIndex((item) => item.id === updated.id);

    if (index >= 0) {
      inquiries.value.splice(index, 1, updated);
    }
  };

  return {
    inquiries,
    subscribers,
    hydrate,
    updateInquiry
  };
});
