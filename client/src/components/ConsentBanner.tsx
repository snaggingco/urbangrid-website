import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  CONSENT_CHANGED_EVENT,
  getConsentState,
  OPEN_CONSENT_EVENT,
  setConsentChoice,
} from "@/lib/consent";

type ConsentChoice = "accepted" | "rejected";

export default function ConsentBanner() {
  const [isOpen, setIsOpen] = useState(() => getConsentState().choice === null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const syncConsent = () => {
      const current = getConsentState();
      if (current.choice !== null && current.persisted) {
        setIsOpen(false);
        setNotice("");
      } else {
        setNotice("");
        setIsOpen(true);
      }
    };
    const reopenPreferences = () => {
      setNotice("");
      setIsOpen(true);
    };

    window.addEventListener(CONSENT_CHANGED_EVENT, syncConsent);
    window.addEventListener(OPEN_CONSENT_EVENT, reopenPreferences);
    syncConsent();

    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, syncConsent);
      window.removeEventListener(OPEN_CONSENT_EVENT, reopenPreferences);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isOpen) {
      root.dataset.ugConsentBannerOpen = "true";
    } else {
      delete root.dataset.ugConsentBannerOpen;
    }
    return () => {
      delete root.dataset.ugConsentBannerOpen;
    };
  }, [isOpen]);

  function choose(choice: ConsentChoice) {
    try {
      const result = setConsentChoice(choice);
      if (result.persisted) {
        setNotice("");
        setIsOpen(false);
        return;
      }

      setIsOpen(true);
      setNotice(
        `Your choice to ${choice === "accepted" ? "accept" : "reject"} optional cookies applies for this visit, but could not be saved on this device. You may need to choose again next time.`
      );
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Your choice could not be applied. Please reload and try again.");
    }
  }

  if (!isOpen) return null;

  return (
    <aside
      aria-labelledby="ug-consent-title"
      aria-describedby="ug-consent-description"
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-6 sm:pb-5"
    >
      <section className="mx-auto max-h-[calc(100dvh-16px)] max-w-5xl overflow-y-auto rounded-xl border border-[#d8d2c3] bg-[#f4f0e4] text-[#171b18] shadow-[0_12px_45px_rgba(20,32,25,0.2)]">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-7 sm:px-6 sm:py-5">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2.5">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#08634b]" />
              <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#08634b]">
                Your privacy, your choice
              </p>
            </div>
            <h2
              id="ug-consent-title"
              className="m-0 font-inter text-lg font-semibold leading-tight tracking-[-0.025em] sm:text-xl"
            >
              Cookie & privacy preferences
            </h2>
            <p
              id="ug-consent-description"
              className="mb-0 mt-1.5 max-w-2xl text-xs leading-relaxed text-[#484b46] sm:text-[13px]"
            >
              We use essential storage to make this site work. You can accept
              or reject optional analytics and advertising cookies. Your choice won’t affect your
              property inspection experience.
            </p>
            <p className="mb-0 mt-2 text-[11px] leading-relaxed text-[#62645d]">
              Essential cookies are always on.{" "}
              <Link
                href="/privacy-policy"
                className="font-semibold text-[#075b46] underline decoration-[#8ea99d] underline-offset-2 hover:text-[#043d30] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#08634b]"
              >
                Read our privacy policy
              </Link>
            </p>
            {notice && (
              <p
                role="status"
                aria-live="polite"
                className="mb-0 mt-3 rounded-md border border-[#b58742] bg-[#fbf4e6] px-3 py-2 text-xs leading-relaxed text-[#493713]"
              >
                {notice}
              </p>
            )}
            {notice && getConsentState().choice !== null && (
              <button type="button" onClick={() => setIsOpen(false)} className="mt-2 min-h-11 text-xs font-semibold text-[#075b46] underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#08634b]">
                Continue with this choice for this visit
              </button>
            )}
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-2 sm:w-[304px] sm:grid-cols-1">
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="min-h-12 rounded-md border border-[#075b46] bg-[#075b46] px-3 py-2 text-xs font-semibold leading-tight text-[#fffdf6] transition-colors hover:bg-[#064936] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171b18] sm:text-[13px]"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => choose("rejected")}
              className="min-h-12 rounded-md border border-[#075b46] bg-[#f4f0e4] px-3 py-2 text-xs font-semibold leading-tight text-[#075b46] transition-colors hover:bg-[#e9e4d6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171b18] sm:text-[13px]"
            >
              Reject
            </button>
          </div>
        </div>
      </section>
    </aside>
  );
}