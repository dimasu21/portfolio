import HeroImg from "@/assets/images/hero.jpeg";
import Terminal from "@/components/Terminal";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  
  return (
    <>
      <section id="about" className="py-16 md:py-32 text-white bg-[#04081A]">
        <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
          <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl text-white">
            {t("about.title")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
            <div className="relative mb-6 sm:mb-0">
              <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl p-px from-zinc-300 to-transparent">
                <img
                  src={HeroImg}
                  className="rounded-[15px] shadow block"
                  alt="payments illustration"
                  width={1207}
                  height={929}
                />
              </div>
            </div>

            <div className="relative space-y-4">
              <p className="text-white">
                {t("about.intro")}
              </p>
              <p className="text-white">
                {t("about.focus")}
              </p>

              <div className="pt-6">
                <blockquote className="border-l-4 border-gray-300 pl-4">
                  <p className="text-gray-400 italic">
                    "I was reminded of what is perhaps the fundamental rule of
                    technological progress: if something can be done, it
                    probably will be done, and possibly already has been."
                  </p>
                  <div className="mt-6 space-y-3">
                    <div className="mt-6 space-y-3">
                      <cite className="block font-medium text-gray-400 italic">
                        —Edward Snowden
                      </cite>
                    </div>
                  </div>
                </blockquote>
              </div>
            </div>
          </div>
          
          {/* Interactive Terminal */}
          <div className="pt-8">
            <h3 className="text-2xl font-bold text-center mb-4 gradient-text">
              {t("about.terminalTitle")}
            </h3>
            <p className="text-gray-400 text-center mb-6">
              {t("about.terminalHint")}
            </p>
            <Terminal />
          </div>
        </div>
      </section>
    </>
  );
}
