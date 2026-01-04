import { ReactLenis } from "lenis/react";
import { useTransform, motion, useScroll } from "framer-motion";
import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Github, Globe } from "lucide-react";
import GridBackground from "@/components/GridBackground";
import { useTranslation } from "react-i18next";

// --- ASSETS IMPORT ---
import houseImg from "../../assets/images/pratinjau.png";
import potholeImg from "../../assets/images/Demo.png";
import dssImg from "../../assets/images/screenshot-main.png";
import portfolioImg from "../../assets/images/portofolio.png";
import netraImg from "../../assets/images/netra-preview.png";

// --- PROJECT DATA ---
const getProjects = (t) => [
  {
    title: t("projects.items.netra.title"),
    description: t("projects.items.netra.description"),
    src: netraImg,
    color: "#3b82f6", // Blue
    githubLink: "#",
    liveLink: "https://netraku.my.id/",
  },
  {
    title: t("projects.items.house.title"),
    description: t("projects.items.house.description"),
    src: houseImg,
    color: "#f59e0b", // Amber
    githubLink: "https://github.com/DimasTriM/prediksi_harga_rumah.git",
    liveLink: "#",
  },
  {
    title: t("projects.items.pothole.title"),
    description: t("projects.items.pothole.description"),
    src: potholeImg,
    color: "#14b8a6", // Teal
    githubLink: "https://github.com/DimasTriM/pothole-detection.git",
    liveLink: "https://pothole-detection-yolov8.streamlit.app/",
  },
  {
    title: t("projects.items.dss.title"),
    description: t("projects.items.dss.description"),
    src: dssImg,
    color: "#3b82f6", // Blue
    githubLink: "https://github.com/DimasTriM/proyek_spk_laptop.git",
    liveLink: "#",
  },
  {
    title: t("projects.items.portfolio.title"),
    description: t("projects.items.portfolio.description"),
    src: portfolioImg,
    color: "#8b5cf6", // Purple
    githubLink: "https://github.com/DimasTriM/modern-portfolio.git",
    liveLink: "https://modern-portofolio.vercel.app/projects/",
  },
];

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function Projects() {
  const { t } = useTranslation();
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Fix resolusi khusus untuk Laptop 1366x768
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @media screen and (width: 1366px) and (height: 768px),
             screen and (width: 1367px) and (height: 768px),
             screen and (width: 1368px) and (height: 769px) {
        .project-card { scale: 0.85; margin-top: -5vh; }
        .project-container { height: 90vh; }
      }
    `;
    document.head.appendChild(style);

    const checkResolution = () => {
      const isTargetResolution =
        window.innerWidth >= 1360 &&
        window.innerWidth <= 1370 &&
        window.innerHeight >= 760 &&
        window.innerHeight <= 775;

      if (isTargetResolution) {
        document.documentElement.style.setProperty("--project-scale", "0.85");
        document.documentElement.style.setProperty("--project-margin", "-5vh");
      } else {
        document.documentElement.style.setProperty("--project-scale", "1");
        document.documentElement.style.setProperty("--project-margin", "0");
      }
    };

    checkResolution();
    window.addEventListener("resize", checkResolution);
    return () => {
      document.head.removeChild(style);
      window.removeEventListener("resize", checkResolution);
    };
  }, []);

  return (
    <ReactLenis root>
      <main className="bg-[#04081A] relative" ref={container}>
        <GridBackground />
        <section className="text-white w-full relative z-10">
          {/* Header Section */}
          <div className="pt-24 text-center pb-2 px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="pt-10 text-4xl md:text-5xl font-bold gradient-text mb-6">
                {t("projects.title")}
              </h2>
              <motion.p
                className="text-gray-400 max-w-2xl mx-auto text-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {t("projects.subtitle")}
              </motion.p>
            </motion.div>
          </div>

          {/* Projects Loop */}
          {getProjects(t).map((project, i) => {
            const targetScale = 1 - (getProjects(t).length - i) * 0.05;
            return (
              <Card
                key={`p_${i}`}
                i={i}
                {...project}
                url={project.src}
                progress={scrollYProgress}
                range={[i * 0.25, 1]}
                targetScale={targetScale}
                t={t}
              />
            );
          })}
        </section>
      </main>
    </ReactLenis>
  );
}

function Card({
  i,
  title,
  description,
  url,
  color,
  progress,
  range,
  targetScale,
  githubLink,
  liveLink,
  t,
}) {
  const container = useRef(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="h-screen flex items-center justify-center sticky top-0 project-container"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
          transform: `scale(var(--project-scale, 1))`,
          marginTop: "var(--project-margin, 0)",
        }}
        // Settingan posisi: -top-[30%] agar lebih rapat ke atas (Header)
        className="relative -top-[30%] h-auto w-[90%] md:w-[85%] lg:w-[75%] xl:w-[65%] origin-top project-card"
        whileHover={{
          y: -8,
          transition: { duration: 0.3 },
        }}
      >
        <div className="w-full flex flex-col md:flex-row bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl group">
          {/* Image Section */}
          <div className="w-full md:w-[55%] h-[250px] md:h-[400px] lg:h-[450px] relative overflow-hidden">
            <motion.img
              src={url}
              alt={title}
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
            <motion.div
              className="absolute inset-0"
              style={{ backgroundColor: color, mixBlendMode: "soft-light" }}
              initial={{ opacity: 0.1 }}
              whileHover={{ opacity: 0.4 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10">
              0{i + 1}
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full md:w-[45%] p-6 md:p-8 lg:p-10 flex flex-col justify-between bg-[#0B1121]">
            <div>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div
                  className="w-3 h-3 rounded-full shadow-[0_0_10px] shadow-current"
                  style={{ backgroundColor: color }}
                />
                <div className="h-[1px] w-16 bg-gray-700" />
              </div>

              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
                {title}
              </h2>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800/50">
              <div className="flex items-center gap-6">
                <motion.a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ x: 3 }}
                >
                  <Github size={20} />
                  <span className="text-sm font-medium">{t("projects.sourceCode")}</span>
                </motion.a>

                {liveLink && liveLink !== "#" && (
                  <motion.a
                    href={liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 transition-colors"
                    style={{ color: color }}
                    whileHover={{ x: 3 }}
                  >
                    <Globe size={20} />
                    <span className="text-sm font-medium">{t("projects.liveDemo")}</span>
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

Card.propTypes = {
  i: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  progress: PropTypes.object.isRequired,
  range: PropTypes.array.isRequired,
  targetScale: PropTypes.number.isRequired,
  githubLink: PropTypes.string.isRequired,
  liveLink: PropTypes.string,
};
