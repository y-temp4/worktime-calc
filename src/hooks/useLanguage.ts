import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Language, translations } from "../i18n/translations";

export const useLanguage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine language from URL path
  const getLanguageFromPath = (pathname: string): Language => {
    if (pathname.startsWith("/worktime-calc/en")) {
      return "en";
    }
    return "ja";
  };

  const [language, setLanguage] = useState<Language>(() => 
    getLanguageFromPath(location.pathname)
  );

  const t = translations[language];

  // Update language when route changes
  useEffect(() => {
    const newLanguage = getLanguageFromPath(location.pathname);
    setLanguage(newLanguage);
  }, [location.pathname]);

  // Update meta tags when language changes
  useEffect(() => {
    // Update HTML title and lang attribute
    document.title = t.title;
    document.documentElement.lang = language;

    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    const updateMetaProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Update basic meta tags
    updateMetaTag("description", t.meta.description);
    updateMetaTag("keywords", t.meta.keywords);

    // Update Open Graph tags
    updateMetaProperty("og:title", t.meta.ogTitle);
    updateMetaProperty("og:description", t.meta.ogDescription);
    updateMetaProperty("og:type", "website");
    updateMetaProperty("og:url", window.location.href);
    updateMetaProperty("og:locale", language === "ja" ? "ja_JP" : "en_US");
    updateMetaProperty(
      "og:image",
      `https://y-temp4.github.io/worktime-calc/${
        language === "ja" ? "ogp_ja.png" : "ogp_en.png"
      }`
    );
    updateMetaProperty(
      "og:site_name",
      language === "ja" ? "作業時間計算機" : "Work Time Calculator"
    );

    // Update Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", t.meta.ogTitle);
    updateMetaTag("twitter:description", t.meta.ogDescription);
    updateMetaTag(
      "twitter:image",
      `https://y-temp4.github.io/worktime-calc/${
        language === "ja" ? "ogp_ja.png" : "ogp_en.png"
      }`
    );

    // Update or create JSON-LD structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: t.meta.ogTitle,
      description: t.meta.description,
      url: window.location.href,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      inLanguage: language === "ja" ? "ja" : "en",
      author: {
        "@type": "Person",
        name: "y-temp4",
      },
      keywords: t.meta.keywords,
    };

    let jsonLdScript = document.querySelector(
      'script[type="application/ld+json"]'
    ) as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement("script") as HTMLScriptElement;
      jsonLdScript.type = "application/ld+json";
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(structuredData);
  }, [language, t]);

  const toggleLanguage = () => {
    const newLanguage = language === "ja" ? "en" : "ja";
    const newPath = newLanguage === "en" ? "/worktime-calc/en" : "/worktime-calc/";
    navigate(newPath);
  };

  return {
    language,
    t,
    toggleLanguage,
  };
};