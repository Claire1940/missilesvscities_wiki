"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Sparkles,
  Gift,
  GraduationCap,
  Rocket,
  Building2,
  Coins,
  Building,
  Crosshair,
  Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// 8 个模块的导航锚点（与 <section id> 一一对应，工具卡点击滚动到对应模块）
const TOOLS_SECTION_IDS = [
  "codes",
  "beginner-guide",
  "best-missiles-tier-list",
  "city-upgrade-guide",
  "cash-farming-guide",
  "buildings-guide",
  "attack-strategy-guide",
  "stats-and-updates",
] as const;

// 8 个模块标题区图标（每个模块独立图标）
const MODULE_HEADER_ICONS: Record<string, LucideIcon> = {
  codes: Gift,
  "beginner-guide": GraduationCap,
  "best-missiles-tier-list": Rocket,
  "city-upgrade-guide": Building2,
  "cash-farming-guide": Coins,
  "buildings-guide": Building,
  "attack-strategy-guide": Crosshair,
  "stats-and-updates": Activity,
};

// 模块标题区：眉行 + 图标 + 标题 + 简介（居中）
function ModuleHeader({
  sectionId,
  eyebrow,
  title,
  intro,
}: {
  sectionId: string;
  eyebrow: string;
  title: string;
  intro: string;
}) {
  const Icon = MODULE_HEADER_ICONS[sectionId] ?? Sparkles;
  return (
    <div className="text-center mb-8 md:mb-12 scroll-reveal">
      <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
        <Icon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
        <span className="text-xs md:text-sm font-semibold uppercase tracking-wider">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">{title}</h2>
      <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
        {intro}
      </p>
    </div>
  );
}

// 奇数模块加浅底色，视觉交替
const sectionBg = (index: number) => (index % 2 === 1 ? "bg-white/[0.02]" : "");

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.missilesvscities.wiki";

  const [attackExpanded, setAttackExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Missiles vs Cities Wiki",
        description:
          "Complete Missiles vs Cities Wiki covering codes, missiles, city upgrades, cash farming, PvP tactics, and beginner guides for the Roblox tycoon PvP game.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Missiles vs Cities - Roblox Missile Tycoon PvP",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Missiles vs Cities Wiki",
        alternateName: "Missiles vs Cities",
        url: siteUrl,
        description:
          "Complete Missiles vs Cities Wiki resource hub for codes, missiles, city upgrades, cash farming, PvP tactics, and beginner guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Missiles vs Cities Wiki - Roblox Missile Tycoon PvP",
        },
        sameAs: [
          "https://www.roblox.com/games/112641748896693/Missiles-vs-Cities",
          "https://www.youtube.com/watch?v=Aln_Y_y6VuU",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Missiles vs Cities",
        gamePlatform: ["PC", "Mac", "Mobile", "Roblox"],
        applicationCategory: "Game",
        genre: ["Simulation", "Tycoon", "PvP", "Strategy"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 100,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/112641748896693/Missiles-vs-Cities",
        },
      },
      {
        "@type": "VideoObject",
        name: "Roblox - Missiles vs Cities",
        description:
          "Missiles vs Cities gameplay preview - build cities, launch missiles, and destroy rival buildings in this Roblox tycoon PvP game.",
        uploadDate: "2026-07-07",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/Aln_Y_y6VuU",
        url: "https://www.youtube.com/watch?v=Aln_Y_y6VuU",
      },
    ],
  };

  const codes = t.modules.missilesVsCitiesCodes;
  const beginner = t.modules.missilesVsCitiesBeginnerGuide;
  const missileTiers = t.modules.missilesVsCitiesMissileTiers;
  const cityUpgrades = t.modules.missilesVsCitiesCityUpgrades;
  const cashFarming = t.modules.missilesVsCitiesCashFarming;
  const buildings = t.modules.missilesVsCitiesBuildings;
  const attackStrategy = t.modules.missilesVsCitiesAttackStrategy;
  const stats = t.modules.missilesVsCitiesStats;

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Gift className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/112641748896693/Missiles-vs-Cities"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 之后（容器上限 max-w-5xl） */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature videoId="Aln_Y_y6VuU" title="Roblox - Missiles vs Cities" />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（视频区之后、Latest Updates 之前） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = TOOLS_SECTION_IDS[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={12} />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Codes */}
      <section id="codes" className={`scroll-mt-24 px-4 py-14 md:py-20 ${sectionBg(0)}`}>
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            sectionId="codes"
            eyebrow={codes.eyebrow}
            title={codes.title}
            intro={codes.intro}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 scroll-reveal">
            {codes.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="font-bold text-lg">{item.label}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                    {item.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[hsl(var(--nav-theme-light))] mb-2">
                  {item.reward}
                </p>
                <p className="text-sm text-muted-foreground">{item.playerNote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Beginner Guide */}
      <section id="beginner-guide" className={`scroll-mt-24 px-4 py-14 md:py-20 ${sectionBg(1)}`}>
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            sectionId="beginner-guide"
            eyebrow={beginner.eyebrow}
            title={beginner.title}
            intro={beginner.intro}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {beginner.items.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {step.step}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-2">
                    {step.description}
                  </p>
                  <p className="text-sm text-[hsl(var(--nav-theme-light))]">
                    {step.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Best Missiles Tier List */}
      <section id="best-missiles-tier-list" className={`scroll-mt-24 px-4 py-14 md:py-20 ${sectionBg(2)}`}>
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            sectionId="best-missiles-tier-list"
            eyebrow={missileTiers.eyebrow}
            title={missileTiers.title}
            intro={missileTiers.intro}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {missileTiers.items.map((item: any, index: number) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center gap-4 p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-4 md:w-56 flex-shrink-0">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--nav-theme))] text-white text-2xl font-bold">
                    {item.tier}
                  </span>
                  <div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">
                    <span className="font-semibold text-foreground">Best for: </span>
                    {item.bestFor}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Advice: </span>
                    {item.upgradeAdvice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 4: City Upgrade Guide */}
      <section id="city-upgrade-guide" className={`scroll-mt-24 px-4 py-14 md:py-20 ${sectionBg(3)}`}>
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            sectionId="city-upgrade-guide"
            eyebrow={cityUpgrades.eyebrow}
            title={cityUpgrades.title}
            intro={cityUpgrades.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {cityUpgrades.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="font-bold text-lg">{item.upgradeFocus}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${
                      item.priority === "High"
                        ? "bg-[hsl(var(--nav-theme)/0.2)] border-[hsl(var(--nav-theme)/0.5)] text-[hsl(var(--nav-theme-light))]"
                        : "bg-white/5 border-border text-muted-foreground"
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.purpose}</p>
                <p className="text-sm text-[hsl(var(--nav-theme-light))] mb-2">
                  Best time: {item.bestTimeToUpgrade}
                </p>
                <p className="text-sm text-muted-foreground">{item.playerTip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 5: Cash Farming Guide */}
      <section id="cash-farming-guide" className={`scroll-mt-24 px-4 py-14 md:py-20 ${sectionBg(4)}`}>
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            sectionId="cash-farming-guide"
            eyebrow={cashFarming.eyebrow}
            title={cashFarming.title}
            intro={cashFarming.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {cashFarming.items.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-4 p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                    {step.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold mb-1.5">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 6: Buildings Guide */}
      <section id="buildings-guide" className={`scroll-mt-24 px-4 py-14 md:py-20 ${sectionBg(5)}`}>
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            sectionId="buildings-guide"
            eyebrow={buildings.eyebrow}
            title={buildings.title}
            intro={buildings.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buildings.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                  <span className="text-sm font-semibold text-[hsl(var(--nav-theme-light))]">
                    {item.playerValue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Attack Strategy Guide */}
      <section id="attack-strategy-guide" className={`scroll-mt-24 px-4 py-14 md:py-20 ${sectionBg(6)}`}>
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            sectionId="attack-strategy-guide"
            eyebrow={attackStrategy.eyebrow}
            title={attackStrategy.title}
            intro={attackStrategy.intro}
          />
          <div className="scroll-reveal space-y-2">
            {attackStrategy.items.map((faq: any, index: number) => (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setAttackExpanded(attackExpanded === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold pr-3">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${
                      attackExpanded === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {attackExpanded === index && (
                  <div className="px-5 pb-5 text-muted-foreground text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Stats and Updates */}
      <section id="stats-and-updates" className={`scroll-mt-24 px-4 py-14 md:py-20 ${sectionBg(7)}`}>
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            sectionId="stats-and-updates"
            eyebrow={stats.eyebrow}
            title={stats.title}
            intro={stats.intro}
          />
          <div className="scroll-reveal overflow-hidden border border-border rounded-xl">
            {stats.items.map((item: any, index: number) => (
              <div
                key={index}
                className={`grid grid-cols-1 md:grid-cols-[200px_1fr] gap-1 md:gap-4 px-5 py-4 ${
                  index % 2 === 0 ? "bg-white/[0.02]" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                  <span className="font-semibold text-sm">{item.metric}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                    {item.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 7: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.roblox.com/games/112641748896693/Missiles-vs-Cities"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.roblox}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=Aln_Y_y6VuU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
