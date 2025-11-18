import IconCloud from "./ui/icon-cloud";

const slugs = [
  "javascript",
  "react",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "mongodb",
  "docker",
  "git",
  "github",
  "gitlab",
  "figma",
  "python",
  "tailwindcss",
  "vite",
  "flutter",
  "dart",
  "linux",
  "nginx",
  "vercel",
  "cypress",
];

function IconCloudDemo() {
  return (
    <div className="relative flex size-full max-w-lg items-center justify-center overflow-hidden rounded-lg px-20 pb-20 pt-8 bg-transparent">
      <IconCloud iconSlugs={slugs} />
    </div>
  );
}

export default IconCloudDemo;
