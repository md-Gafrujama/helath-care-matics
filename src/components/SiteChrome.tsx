"use client";

import SubscribeModal, { Toast } from "@/components/SubscribeModal";

/** Lazy-loaded client chrome (modal + toast) so it doesn't block first paint. */
export default function SiteChrome() {
  return (
    <>
      <SubscribeModal />
      <Toast />
    </>
  );
}
