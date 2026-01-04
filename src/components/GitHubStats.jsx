import React from "react";
import { useTranslation } from "react-i18next";

const GitHubStats = ({ username = "dimasu21" }) => {
  const { t } = useTranslation();
  const theme = "tokyonight";
  
  return (
    <div className="w-full py-8">
      <h3 className="text-2xl font-bold text-center mb-8 gradient-text">
        {t("github.title")}
      </h3>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 flex-wrap">
        {/* GitHub Stats Card */}
        <a 
          href={`https://github.com/${username}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="transform hover:scale-105 transition-transform duration-300"
        >
          <img
            src={`https://github-readme-stats-theta-hazel.vercel.app/api?username=${username}&show_icons=true&theme=${theme}&hide_border=true&bg_color=0d1117`}
            alt="GitHub Stats"
            className="rounded-lg"
            loading="lazy"
          />
        </a>
        
        {/* Top Languages Card */}
        <a 
          href={`https://github.com/${username}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="transform hover:scale-105 transition-transform duration-300"
        >
          <img
            src={`https://github-readme-stats-theta-hazel.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${theme}&hide_border=true&bg_color=0d1117`}
            alt="Top Languages"
            className="rounded-lg"
            loading="lazy"
          />
        </a>
        

      </div>
    </div>
  );
};

export default GitHubStats;
