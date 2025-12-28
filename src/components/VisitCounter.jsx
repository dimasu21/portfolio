import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

const VisitCounter = () => {
  const { t } = useTranslation();
  const [visitCount, setVisitCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get visit count from localStorage
    const storedCount = localStorage.getItem("portfolioVisitCount");
    const lastVisit = localStorage.getItem("portfolioLastVisit");
    const today = new Date().toDateString();

    let count = storedCount ? parseInt(storedCount, 10) : 0;

    // Increment only if it's a new day or first visit
    if (lastVisit !== today) {
      count += 1;
      localStorage.setItem("portfolioVisitCount", count.toString());
      localStorage.setItem("portfolioLastVisit", today);
    }

    // Simulate slight delay for animation effect
    setTimeout(() => {
      setVisitCount(count);
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="flex items-center gap-2 text-gray-400 text-sm">
      <Eye size={16} className="text-teal-400" />
      <span>
        {isLoading ? (
          <span className="inline-block w-8 h-4 bg-gray-700 rounded animate-pulse" />
        ) : (
          <>
            <span className="font-semibold text-teal-400">{visitCount.toLocaleString()}</span>
            <span className="ml-1">{t("footer.visits")}</span>
          </>
        )}
      </span>
    </div>
  );
};

export default VisitCounter;
