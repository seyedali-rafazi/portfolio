import { Project, Skill, StatItem, ContactInfo } from "@/types";

export const PERSONAL_INFO = {
  name: "Seyekali Rafazi",
  nameFa: "سید علی رفضی",
  role: "Frontend Engineer",
  techStack: ["React", "Next.js", "TypeScript"],
  bio: {
    fa: "توسعه‌دهنده فرانت‌اند با بیش از ۴ سال تجربه در ساخت رابط‌های کاربری مدرن، سیستم‌های داده‌محور و نقشه‌محور.",
    en: "Frontend Engineer with 4+ years of experience in building modern user interfaces, data-intensive and geospatial systems.",
  },
  aboutMe: {
    introFa:
      "من یک توسعه‌دهنده فرانت‌اند هستم و علاقه‌مند به ساخت رابط‌های کاربری سریع، زیبا و کاربردی. تجربه کار با تکنولوژی‌های مدرن وب، معماری‌های مقیاس‌پذیر و کار با داده‌های حجیم و سیستم‌های نقشه‌محور بخش مهمی از مسیر حرفه‌ای من بوده است.",
    introEn:
      "I'm a frontend engineer passionate about building fast, beautiful, and user-friendly interfaces. I have experience working with modern web technologies, scalable architectures, and data-intensive and geospatial systems.",
    extendedFa:
      "با بیش از چهار سال سابقه متمرکز در اکوسیستم React و Next.js، به بهینه‌سازی عملکرد (Performance Optimization)، رندرینگ پیشرفته (SSR/SSG/ISR)، طراحی کامپوننت‌های دسترسی‌پذیر و تجسم داده‌های جغرافیایی با ابزارهایی نظیر MapLibre و CesiumJS مسلط هستم.",
    extendedEn:
      "With over 4 years dedicated to the React and Next.js ecosystem, I specialize in web performance optimization, modern rendering strategies (SSR/SSG/ISR), accessible design systems, and advanced geospatial visualization using tools like MapLibre and CesiumJS.",
  },
  socials: [
    { name: "GitHub", short: "GH", url: "https://github.com/seyedalirafazi" },
    { name: "LinkedIn", short: "in", url: "https://linkedin.com/in/seyedalirafazi" },
    { name: "Telegram", short: "TG", url: "https://t.me/seyedalirafazi" },
    { name: "X", short: "X", url: "https://x.com/seyedalirafazi" },
  ],
  quote: {
    en: "Technology connects ideas to the world.",
    fa: "تکنولوژی پیونددهنده ایده‌ها با جهان است.",
  },
};

export const CONTACT_DATA: ContactInfo = {
  email: "seyedali.rafazi@gmail.com",
  phone: "+98 912 345 6789",
  location: {
    fa: "تهران، ایران",
    en: "Tehran, Iran",
  },
};

export const STATS: StatItem[] = [
  {
    id: "experience",
    number: "4+",
    symbol: "◈",
    title: {
      fa: "سال تجربه",
      en: "Years of Experience",
    },
    subtitle: {
      fa: "تجربه حرفه‌ای",
      en: "Professional Experience",
    },
  },
  {
    id: "projects",
    number: "12+",
    symbol: "▣",
    title: {
      fa: "پروژه",
      en: "Completed Projects",
    },
    subtitle: {
      fa: "پروژه تکمیل‌شده",
      en: "Successfully Delivered",
    },
  },
  {
    id: "technologies",
    number: "5+",
    symbol: "◇",
    title: {
      fa: "تکنولوژی",
      en: "Technologies",
    },
    subtitle: {
      fa: "تکنولوژی اصلی",
      en: "Core Technologies",
    },
  },
  {
    id: "learning",
    number: "∞",
    symbol: "∞",
    title: {
      fa: "یادگیری",
      en: "Always Learning",
    },
    subtitle: {
      fa: "همیشه در حال یادگیری",
      en: "Always Improving",
    },
  },
];

export const SKILLS: Skill[] = [
  {
    id: "react",
    name: "React",
    category: "core",
    iconName: "react",
    color: "#61DAFB",
    level: 95,
    experience: {
      fa: "بیش از ۴ سال کار عمیق با هوک‌ها، Context، معماری کامپوننت و بهینه‌سازی رندر",
      en: "4+ years of deep experience with hooks, state, component design, and render optimization",
    },
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "core",
    iconName: "nextjs",
    color: "#ffffff",
    level: 92,
    experience: {
      fa: "تسلط کامل بر App Router، سرور اکشن‌ها، SSR و بهینه‌سازی SEO",
      en: "Expertise in App Router, Server Actions, SSR, ISR, and modern SEO architecture",
    },
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "core",
    iconName: "typescript",
    color: "#3178C6",
    level: 90,
    experience: {
      fa: "تایپ‌دهی امن، جنریک‌ها و سیستم‌های داده مقیاس‌پذیر",
      en: "Strict type safety, advanced generics, and robust scalable frontend architectures",
    },
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "core",
    iconName: "javascript",
    color: "#F7DF1E",
    level: 94,
    experience: {
      fa: "تسلط عمیق بر ES6+، Event Loop، وب ورکرها و کارایی حافظه",
      en: "Deep proficiency in modern ES6+, event loop, async patterns, and memory management",
    },
  },
  {
    id: "redux",
    name: "Redux Toolkit",
    category: "state-tools",
    iconName: "redux",
    color: "#764ABC",
    level: 88,
    experience: {
      fa: "مدیریت استیت سراسری برای اپلیکیشن‌های پیچیده با RTK و RTK Query",
      en: "Global state management for complex enterprise dashboards using RTK and RTK Query",
    },
  },
  {
    id: "react-query",
    name: "React Query",
    category: "state-tools",
    iconName: "reactquery",
    color: "#FF4154",
    level: 92,
    experience: {
      fa: "کشینگ داده‌های سرور، همگام‌سازی لحظه‌ای و Optimistic Updates",
      en: "Server state caching, real-time background sync, and optimistic updates",
    },
  },
  {
    id: "mapbox",
    name: "Mapbox GL JS",
    category: "geospatial",
    iconName: "mapbox",
    color: "#4264FB",
    level: 86,
    experience: {
      fa: "پیاده‌سازی لایه‌های برداری، کلاستربندی پین‌ها و استایل‌های سه‌بعدی",
      en: "Vector tile rendering, dynamic clustering, custom shaders, and 3D terrain",
    },
  },
  {
    id: "leaflet",
    name: "Leaflet",
    category: "geospatial",
    iconName: "leaflet",
    color: "#199900",
    level: 90,
    experience: {
      fa: "نقشه‌های تعاملی سبک، پلاگین‌های اختصاصی و لایه‌های GeoJSON",
      en: "Lightweight interactive maps, custom plugin integration, and GeoJSON overlays",
    },
  },
  {
    id: "cesium",
    name: "CesiumJS",
    category: "geospatial",
    iconName: "cesium",
    color: "#4AA3DF",
    level: 84,
    experience: {
      fa: "رندر ۳بعدی کره زمین، ردیابی مدارهای ماهواره و داده‌های مکانی TLE",
      en: "3D virtual globes, orbital satellite simulation, and temporal TLE datasets",
    },
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "core",
    iconName: "tailwind",
    color: "#06B6D4",
    level: 95,
    experience: {
      fa: "طراحی تم‌های تیره/روشن، دیزاین سیستم‌های ریسپانسیو و انیمیشن‌های روان",
      en: "Dark/light theme engines, modular design systems, and responsive micro-interactions",
    },
  },
  {
    id: "git",
    name: "Git",
    category: "state-tools",
    iconName: "git",
    color: "#F05032",
    level: 90,
    experience: {
      fa: "ورژن کنترل حرفه‌ای، مدیریت برنچ‌ها، CI/CD و بازبینی کد",
      en: "Collaborative Git workflows, merge strategies, CI/CD pipelines, and clean versioning",
    },
  },
  {
    id: "docker",
    name: "Docker",
    category: "state-tools",
    iconName: "docker",
    color: "#2496ED",
    level: 80,
    experience: {
      fa: "کانتینرسازی اپلیکیشن‌های فرانت‌اند برای استقرار بدون چالش",
      en: "Containerization of frontend apps and microservices for streamlined deployments",
    },
  },
];

export const PROJECTS: Project[] = [
  {
    id: "asemanyar",
    title: "AsemanYar",
    category: "geospatial",
    tags: ["React", "MapLibre", "Live Data"],
    image: "/project-asemanyar.jpg",
    summary: {
      fa: "نقشه رهگیری زنده پروازها با استفاده از داده‌های OpenSky و نمایش موقعیت هواپیماها در منطقه ایران و خلیج فارس.",
      en: "Real-time aircraft tracking and monitoring application using OpenSky data and interactive maps over Iranian and Persian Gulf airspace.",
    },
    description: {
      fa: "سامانه مانیتورینگ بلادرنگ آسمان با قابلیت پردازش هزاران داده پروازی در هر ثانیه. این پروژه با استفاده از MapLibre GL و رندرهای بهینه‌شده وکتور، موقعیت، سرعت، ارتفاع و مسیر پرواز هواپیماهای تجاری در منطقه خاورمیانه را به صورت زنده نمایش می‌دهد.",
      en: "A real-time flight monitoring radar application capable of parsing telemetry for thousands of aircraft per second. Built using MapLibre GL and hardware-accelerated vector rendering, it visualizes coordinates, velocity, altitude vectors, and trajectory forecasts in real time.",
    },
    features: {
      fa: [
        "ردیابی زنده با استریم داده‌های OpenSky Network",
        "کلاستربندی هوشمند هواپیماها در سطوح زوم مختلف",
        "نمایش مشخصات پرواز، مسیر حرکتی و تل‌متری ماهواره‌ای",
        "تم رادار تاریک با نرخ فریم ۶۰ هرتز و حداقل مصرف رم",
      ],
      en: [
        "Live telemetry ingestion via OpenSky Network REST/WebSocket APIs",
        "Smart spatial clustering and level-of-detail rendering across zoom levels",
        "Interactive flight HUD with flight plans, altitude graphs, and heading vectors",
        "Hardware-accelerated dark radar UI maintaining solid 60 FPS",
      ],
    },
    metrics: {
      fa: "بیش از ۳۵۰۰ هواپیمای همزمان بدون افت فریم",
      en: "3,500+ simultaneous tracked flights at 60 FPS",
    },
    githubUrl: "https://github.com/seyedalirafazi/asemanyar",
    liveUrl: "https://asemanyar-demo.local",
  },
  {
    id: "kihannama",
    title: "Kihannama",
    category: "geospatial",
    tags: ["React", "CesiumJS", "Satellite"],
    image: "/project-kihannama.jpg",
    summary: {
      fa: "نمایش ماهواره‌ها، ایستگاه‌های فضایی و داده‌های فضایی با استفاده از TLE Cesium .",
      en: "Interactive satellite and space-object visualization using CesiumJS and real-time orbital mechanics.",
    },
    description: {
      fa: "پلتفرم تحلیلی ۳بعدی نجومی برای مشاهده و شبیه‌سازی موقعیت ماهواره‌های مدار پایین و مدار ژئواستیشنری. با استفاده از CesiumJS و محاسبات کپلری SGP4، مدارهای دقیق ماهواره‌ها با جو و سایه‌های واقع‌گرایانه زمین شبیه‌سازی شده‌اند.",
      en: "A 3D spatial analytics platform for simulating and tracking Low Earth Orbit (LEO) and Geostationary satellites. Powered by CesiumJS and SGP4 orbital propagation algorithms, it models accurate orbits, footprints, sensor cones, and atmospheric day/night terminator transitions.",
    },
    features: {
      fa: [
        "محاسبه موقعیت لحظه‌ای بیش از ۲۵۰۰ ماهواره فعال با کدهای TLE",
        "مدل‌سازی سه‌بعدی ایستگاه فضایی بین‌المللی (ISS) و رد عبور آن",
        "فیلتر بر اساس کاربرد (علمی، مخابراتی، هواشناسی و ناوبری)",
        "پخش زمانی با سرعت متغیر و تحلیل پنجره‌های دید زمینی",
      ],
      en: [
        "Real-time propagation of 2,500+ active satellites from Norad TLE feeds",
        "High-fidelity 3D modeling of the ISS, Starlink constellations, and orbit footprints",
        "Filtering by operational classification (communication, weather, research)",
        "Timeline scrubbing with variable speed playback and ground-station pass predictor",
      ],
    },
    metrics: {
      fa: "پیش‌بینی دقیق مدارها تا ۷۲ ساعت آینده",
      en: "High-precision 72-hour orbital trajectory forecasting",
    },
    githubUrl: "https://github.com/seyedalirafazi/kihannama",
    liveUrl: "https://kihannama-demo.local",
  },
  {
    id: "artisa",
    title: "Artisa Gallery",
    category: "fullstack",
    tags: ["Next.js", "Tailwind", "E-commerce"],
    image: "/project-artisa.svg",
    summary: {
      fa: "فروشگاه آنلاین آثار هنری با Next.js, FastAPI و پرداخت آنلاین و مدیریت محتوا.",
      en: "Modern art e-commerce platform with Next.js, FastAPI backend, dynamic checkout, and CMS curation.",
    },
    description: {
      fa: "بازارچه تخصصی فروش تابلوهای نقاشی و آثار هنری فاخر با قابلیت پیش‌نمایش در ابعاد واقعی روی دیوار (AR/Wall Preview). این پروژه با Next.js App Router و Tailwind CSS پیاده‌سازی شده و از پنل مدیریت اختصاصی و تسویه‌حساب ایمن برخوردار است.",
      en: "A high-end art marketplace for curated original paintings and fine art prints. Featuring an interactive wall-preview scaling simulator, server-rendered dynamic catalog, secure stripe/local gateway checkout, and an administrative curator portal.",
    },
    features: {
      fa: [
        "رندر سمت سرور فوق سریع با زمان بارگذاری زیر ۱ ثانیه",
        "شبیه‌ساز ابعاد تابلو روی دیوار اتاق با مقیاس سانتی‌متر",
        "سبد خرید بهینه‌شده با استیت‌های خوش‌بینانه (Optimistic UI)",
        "پنل ادمین برای مدیریت هنرمندان، قیمت‌گذاری و اصالت‌سنجی آثار",
      ],
      en: [
        "Blazing-fast Next.js SSR with sub-second initial load time",
        "Interactive room scale simulator to preview paintings in real living rooms",
        "Optimistic cart interactions and streamlined multi-step checkout workflow",
        "Curator admin dashboard for artist verification and artwork provenance certificates",
      ],
    },
    metrics: {
      fa: "امتیاز ۹۹ در Google Lighthouse Performance",
      en: "99+ Google Lighthouse score across all metrics",
    },
    githubUrl: "https://github.com/seyedalirafazi/artisa-gallery",
    liveUrl: "https://artisa-demo.local",
  },
];
