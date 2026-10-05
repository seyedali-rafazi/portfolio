import {
  Project,
  Skill,
  StatItem,
  ContactInfo,
  WorkExperienceItem,
  EducationItem,
} from "@/types";

export const PERSONAL_INFO = {
  name: "Seyedali Rafazi",
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
    { name: "GitHub", short: "GH", url: "https://github.com/seyedali-rafazi" },
    {
      name: "LinkedIn",
      short: "in",
      url: "https://www.linkedin.com/in/seyedali-rafazi",
    },
    { name: "Telegram", short: "TG", url: "https://t.me/ali_rfzt" },
  ],
  quote: {
    en: "Technology connects ideas to the world.",
    fa: "تکنولوژی پیونددهنده ایده‌ها با جهان است.",
  },
};

export const CONTACT_DATA: ContactInfo = {
  email: "seyedalirafazi80@gmail.com",
  phone: "+98 937 989 8954",
  telegram: "@ali_rfzt",
  location: {
    fa: "تهران، ایران",
    en: "Tehran, Iran",
  },
};

export const STATS: StatItem[] = [
  {
    id: "experience",
    number: "4+",
    numberFa: "۴+",
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
    numberFa: "۱۲+",
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
    numberFa: "۵+",
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
    numberFa: "∞",
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

export const WORK_EXPERIENCES: WorkExperienceItem[] = [
  {
    id: "estinas",
    period: {
      en: "2026 – Present",
      fa: "۲۰۲۶ – اکنون",
    },
    role: {
      en: "Frontend Engineer",
      fa: "مهندس فرانت‌اند",
    },
    company: {
      en: "Estinas",
      fa: "شرکت استیناس",
    },
    employmentType: {
      en: "Contract",
      fa: "قراردادی",
    },
    isCurrent: true,
    location: {
      en: "Tehran, Iran",
      fa: "تهران، ایران",
    },
    highlights: {
      en: [
        "Designed and developed a production-grade enterprise Telecom & B2B Platform using React, TypeScript, and Tailwind CSS, enabling centralized lifecycle management for telecom organizations, subscribers, and SIM cards.",
        "Built interactive telemetry and data traffic visualization dashboards using Apache ECharts, tracking real-time network data consumption (upload/download traffic trends, voucher utilization, and quota limits).",
      ],
      fa: [
        "طراحی و توسعه پلتفرم سازمانی و B2B در حوزه تلکام با استفاده از React، TypeScript و Tailwind CSS جهت مدیریت متمرکز چرخه عمر سازمان‌های مخابراتی، مشترکین و سیم‌کارت‌ها.",
        "پیاده‌سازی داشبوردهای تعاملی تله‌متری و مصورسازی ترافیک مصرفی دیتا با Apache ECharts برای مانیتورینگ بلادرنگ روند ترافیک آپلود/دانلود، مصرف ووچرها و سقف بسته‌های دیتا.",
      ],
    },
    technologies: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Apache ECharts",
      "Telecom & B2B",
      "Telemetry Dashboards",
      "REST APIs",
    ],
  },
  {
    id: "sharif-hamrah-pajouhan",
    period: {
      en: "2024 – 2026",
      fa: "۲۰۲۴ – ۲۰۲۶",
    },
    role: {
      en: "Frontend Engineer",
      fa: "مهندس فرانت‌اند",
    },
    company: {
      en: "Sharif Hamrah Pajouhan",
      fa: "شرکت شریف همراه پژوهان",
    },
    employmentType: {
      en: "Full-time",
      fa: "تمام‌وقت",
    },
    isCurrent: false,
    location: {
      en: "Tehran, Iran",
      fa: "تهران، ایران",
    },
    highlights: {
      en: [
        "Designed and developed production-grade geospatial applications using React, TypeScript, monorepo (Nx, Turborepo), and MUI, supporting enterprise-level operational workflows.",
        "Designed and developed complex and interactive dashboards and geospatial visualization systems using Mapbox, Cesium, Leaflet, AG Grid, and AG Charts, enabling real-time monitoring, analysis, and visualization of large-scale geospatial data.",
      ],
      fa: [
        "طراحی و توسعه سامانه‌های مکانی و جغرافیایی (GIS) سازمانی با بهره‌گیری از React، TypeScript، ساختار مونو‌ریپو (Nx، Turborepo) و MUI برای پشتیبانی از ورک‌فلوهای عملیاتی حساس.",
        "طراحی و پیاده‌سازی داشبوردهای تعاملی و پیشرفته تحلیل و مصورسازی داده‌های مکانی با Mapbox، Cesium، Leaflet، AG Grid و AG Charts جهت پایش و مانیتورینگ بلادرنگ داده‌های کلان جغرافیایی.",
      ],
    },
    technologies: [
      "React",
      "TypeScript",
      "Nx",
      "Turborepo",
      "MUI",
      "Mapbox",
      "Cesium",
      "Leaflet",
      "AG Grid",
      "AG Charts",
    ],
  },
  {
    id: "freelancer",
    period: {
      en: "2022 – 2023",
      fa: "۲۰۲۲ – ۲۰۲۳",
    },
    role: {
      en: "Full-Stack Engineer",
      fa: "مهندس فول‌استک",
    },
    company: {
      en: "Freelance",
      fa: "فریلنسر",
    },
    employmentType: {
      en: "Freelance",
      fa: "فریلنسر / پروژه‌ای",
    },
    isCurrent: false,
    location: {
      en: "Remote",
      fa: "دورکاری",
    },
    highlights: {
      en: [
        "Designed and developed full-stack web applications using React, Next.js, TypeScript, and FastAPI.",
        "Built RESTful backend APIs, authentication and authorization systems, database integrations, and business logic using FastAPI and MongoDB.",
      ],
      fa: [
        "طراحی و توسعه وب‌اپلیکیشن‌های فول‌استک مدرن با استفاده از React، Next.js، TypeScript و FastAPI.",
        "پیاده‌سازی APIهای RESTful، سیستم‌های احراز هویت و سطوح دسترسی، مدل‌سازی دیتابیس و لاجیک بک‌اند با FastAPI و MongoDB.",
      ],
    },
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "FastAPI",
      "Python",
      "MongoDB",
      "RESTful APIs",
      "Auth & Security",
    ],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    id: "msc-ai",
    degree: {
      en: "Master of Science (M.Sc.)",
      fa: "کارشناسی ارشد",
    },
    field: {
      en: "Soft Computing and Artificial Intelligence",
      fa: "محاسبات نرم و هوش مصنوعی",
    },
    institution: {
      en: "Islamic Azad University, Science and Research Branch",
      fa: "دانشگاه آزاد اسلامی واحد علوم و تحقیقات",
    },
    period: {
      en: "2023 – 2026",
      fa: "۲۰۲۳ – ۲۰۲۶",
    },
    location: {
      en: "Tehran, Iran",
      fa: "تهران، ایران",
    },
  },
  {
    id: "bsc-cs",
    degree: {
      en: "Bachelor of Science (B.Sc.)",
      fa: "کارشناسی",
    },
    field: {
      en: "Computer Science",
      fa: "علوم کامپیوتر",
    },
    institution: {
      en: "Islamic Azad University, Science and Research Branch",
      fa: "دانشگاه آزاد اسلامی واحد علوم و تحقیقات",
    },
    period: {
      en: "2019 – 2023",
      fa: "۲۰۱۹ – ۲۰۲۳",
    },
    location: {
      en: "Tehran, Iran",
      fa: "تهران، ایران",
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

export const FEATURED_PROJECTS: Project[] = [
  {
    id: "artisa",
    title: "Artisa Gallery",
    titleFa: "آرتیسا گالری",
    category: "fullstack",
    tags: [
      "Next.js 16",
      "React 19",
      "Tailwind CSS v4",
      "TanStack Query",
      "E-Commerce",
      "Admin CMS",
    ],
    image: "/project-artisa.svg",
    summary: {
      fa: "پلتفرم فروشگاهی آنلاین آثار هنری و صنایع دستی فاخر با معماری Next.js 16 App Router، مدیریت سفارشات و پنل ادمین.",
      en: "Modern art gallery & luxury handcrafts e-commerce platform built with Next.js 16 App Router, custom admin panel, and dynamic order workflows.",
    },
    description: {
      fa: "آرتیسا (Artisa) یک بازارگاه دیجیتال و گالری آنلاین مدرن برای معرفی، اصالت‌سنجی و فروش آثار هنری اصیل و صنایع دستی فاخر است. این پلتفرم با تمرکز بر سرعت فوق‌العاده و تجربه کاربری چشم‌نواز با استفاده از جدیدترین تکنولوژی‌های وب از جمله Next.js 16، React 19، Tailwind CSS v4 و TanStack Query v5 پیاده‌سازی شده است. از ویژگی‌های بارز این سامانه می‌توان به سبد خرید بهینه‌شده با استیت خوش‌بینانه، احراز هویت دومرحله‌ای و Google OAuth 2.0، پشتیبانی دو زبانه کامل فارسی و انگلیسی با سوئیچ آنی RTL/LTR و پنل مدیریت جامع برای نظارت بر سفارش‌ها، انبارداری و بررسی نظرات کاربران اشاره کرد.",
      en: "Artisa is a high-performance web platform designed for an online art gallery and luxury handcrafts marketplace. Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4, Artisa offers a rich user experience with dual-language i18n support, persistent client-side shopping cart, Google OAuth 2.0 SSO, and a comprehensive Admin Control Panel for full inventory, order, and review moderation workflows.",
    },
    features: {
      fa: [
        "کاتالوگ پیشرفته چندمعیاره با فیلتر دسته‌بندی، بازه قیمت، پیشنهادهای ویژه و مرتب‌سازی زنده",
        "سبد خرید پایدار در سمت کلاینت با محاسبات بلادرنگ، کدهای تخفیف و استیت‌های Optimistic",
        "پنل کنترل مدیریت اختصاصی (/app/(admin)) برای تعریف محصولات، مدیریت وضعیت سفارشات و تایید دیدگاه‌ها",
        "سیستم احراز هویت کامل با ورود تک‌مرحله‌ای گوگل (SSO)، توکن‌های ایمن و کوکی‌های HttpOnly",
        "پشتیبانی دوزبانه (فارسی و انگلیسی) با سوئیچ سریع جهت صفحه (RTL/LTR) و تایپوگرافی وزیرمتن و اینتر",
        "معماری بهینه‌شده با Server Components و زمان پاسخ‌دهی زیر ثانیه در تمام صفحات",
      ],
      en: [
        "Multi-criteria product catalog with advanced search, category filters, and live sorting",
        "Interactive shopping cart with persistent client-side state and real-time checkout calculations",
        "Dedicated Admin Control Panel (/app/(admin)) for inventory CRUD, order tracking, and review moderation",
        "Full authentication workflow including Google OAuth 2.0 and secure HttpOnly cookie management",
        "Comprehensive dual-language internationalization (Persian/English) with instant RTL/LTR switching",
        "Blazing-fast Next.js Server Components with sub-second initial load times across all routes",
      ],
    },
    techStackDetailed: [
      {
        category: { fa: "هسته و فریم‌ورک", en: "Core Framework" },
        items: ["Next.js 16.2 App Router", "React 19.2", "TypeScript 5.x"],
      },
      {
        category: { fa: "استایل و رابط کاربری", en: "Styling & UI" },
        items: ["Tailwind CSS v4", "Lucide React", "Sonner Toasts", "PostCSS"],
      },
      {
        category: { fa: "مدیریت استیت و فرم", en: "State & Forms" },
        items: ["TanStack Query v5", "React Hook Form", "Zod", "Context API"],
      },
      {
        category: { fa: "امنیت و ارتباطات", en: "Auth & Networking" },
        items: ["@react-oauth/google", "Axios", "HttpOnly Auth Cookies"],
      },
    ],
    challenges: [
      {
        title: {
          fa: "رندرینگ سریع کاتالوگ با تعداد زیاد تصاویر پرکیفیت آثار هنری",
          en: "Fast catalog rendering with high-resolution artwork imagery",
        },
        solution: {
          fa: "استفاده از سیستم بهینه‌سازی Next.js Image به همراه فرمت مدرن WebP/AVIF و کشینگ هوشمند سمت سرور.",
          en: "Implemented Next.js Image optimization pipeline with AVIF/WebP generation and aggressive edge caching.",
        },
      },
      {
        title: {
          fa: "همگام‌سازی استیت سبد خرید میان رندرهای سمت سرور و کلاینت بدون Hydration Mismatch",
          en: "Cart state synchronization between SSR and client without hydration mismatch",
        },
        solution: {
          fa: "طراحی کانتکست ایزوله‌شده با ذخیره‌سازی محلی مقاوم و استفاده از هوک‌های هیدریشن تاخیردار.",
          en: "Engineered an isolated cart context with resilient localStorage persistence and deferred hydration hooks.",
        },
      },
    ],
    metrics: {
      fa: "امتیاز ۹۹ در Google Lighthouse Performance با رندر سمت سرور فوق سریع",
      en: "99+ Google Lighthouse score across Performance, SEO, and Accessibility",
    },
    githubUrl: "https://github.com/seyedali-rafazi/artisa",
    liveUrl: "https://www.artisagallery.ir/",
  },
  {
    id: "kihannama",
    title: "KihanNama",
    titleFa: "کیهان‌نما",
    category: "geospatial",
    tags: [
      "React 19",
      "CesiumJS",
      "Resium",
      "FastAPI",
      "3D Globe",
      "Orbital Telemetry",
    ],
    image: "/project-kihannama.jpg",
    summary: {
      fa: "پلتفرم ۳بعدی تعاملی هوافضا برای رصد ماهواره‌ها، شبیه‌سازی مدارهای کپلری و کاوشگر ایستگاه‌های فضایی.",
      en: "Interactive 3D aerospace and space exploration platform for real-time satellite tracking, orbital mechanics, and space station catalogs.",
    },
    description: {
      fa: "کیهان‌نما (KihanNama) یک پلتفرم ۳بعدی و فول‌استک در حوزه علوم هوافضا برای رهگیری زنده ماهواره‌ها در مدارهای پایین (LEO)، میانی (MEO) و زمین‌آهنگ (GEO) است. با به‌کارگیری CesiumJS، Resium و الگوریتم‌های پیشرفته SGP4، مدارهای دقیق فضایی به همراه سایه‌ها و فازهای جوی زمین در بستر استریم کدهای CZML بازسازی می‌شوند. علاوه بر رهگیری ماهواره‌ها، این سامانه کاتالوگ جامعی از موشک‌های فضایی مدرن (Falcon 9، Starship، Soyuz و Ariane) و ایستگاه‌های فضایی بین‌المللی (ISS و تیانگونگ) را در یک واسط گرافیکی تاریک و مدرن ارائه می‌دهد.",
      en: "KihanNama is an interactive full-stack 3D aerospace platform for tracking active satellites, simulating orbital mechanics, and exploring space stations and launch vehicles. Powered by CesiumJS, Resium, React 19, and a FastAPI backend with PostgreSQL and MongoDB, it streams orbital paths and coordinates using Lagrange 5th-degree interpolation and CZML. The platform includes launch vehicle profiles, space station modules (ISS & Tiangong), and deep-space ground station networks.",
    },
    features: {
      fa: [
        "کره زمین ۳بعدی با موتور CesiumJS و استریم بسته‌های دینامیک CZML با الگوریتم اینترپولیشن لاگرانژ درجه ۵",
        "رهگیری ماهواره‌های فعال با فیلتر رژیم‌های مداری (LEO, MEO, GEO) و حوزه‌های کاربردی (ناوبری، هواشناسی، علمی)",
        "کنسول تله‌متری کپلری با نمایش لحظه‌ای ارتفاع، سرعت مداری، دوره تناوب، زاویه شیب و RAAN",
        "کاتالوگ موشک‌های فضایی حامل با مشخصات فنی مراحل بوستر، تراست موتورها و ظرفیت حمل بار تا مدار",
        "کاوشگر ماژولار ایستگاه‌های فضایی (ISS و ایستگاه فضایی چین تیانگونگ) و فضاپیماهای متصل",
        "ابزارهای ناوبری شامل پرواز خودکار دوربین روی ماهواره انتخاب‌شده، قطب‌نما، تغییر لایه‌های نقشه و کنترل سرعت زمان",
      ],
      en: [
        "High-performance 3D Earth globe powered by CesiumJS with dynamic CZML streaming and Lagrange 5th-degree interpolation",
        "Real-time satellite propagation from NORAD TLE feeds across LEO, MEO, and GEO regimes",
        "Keplerian telemetry telemetry HUD: altitude, orbital period, inclination, and RAAN",
        "Orbital rocket catalog detailing booster stages, engine configurations, and payload capacity",
        "Interactive 3D space station module explorer (ISS & Tiangong) and global spaceport directory",
        "Advanced navigation controls: fly-to satellite targeting, camera pitch lock, and multi-speed timeline scrubbing",
      ],
    },
    techStackDetailed: [
      {
        category: {
          fa: "هسته سه‌بعدی و فرانت‌اند",
          en: "3D Engine & Frontend",
        },
        items: [
          "React 19",
          "CesiumJS 1.142",
          "Resium 1.23",
          "Vite 8",
          "TypeScript 5",
        ],
      },
      {
        category: { fa: "کامپوننت و مدیریت استیت", en: "UI & State" },
        items: [
          "Material UI (MUI 9)",
          "Emotion",
          "TanStack React Query v5",
          "React Router 7",
        ],
      },
      {
        category: { fa: "بک‌اند و موتور محاسبات", en: "Backend & Propulsion" },
        items: [
          "Python 3.10+",
          "FastAPI",
          "Uvicorn ASGI",
          "SGP4 Orbit Propagator",
          "CZML Generator",
        ],
      },
      {
        category: { fa: "پایگاه داده", en: "Databases" },
        items: [
          "PostgreSQL (Neon Serverless)",
          "MongoDB (Motor Driver)",
          "SQLAlchemy Async",
        ],
      },
    ],
    challenges: [
      {
        title: {
          fa: "محاسبه دقیق مدار صدها ماهواره بدون ایجاد لگ یا کندی در مرورگر",
          en: "Accurate orbital propagation for hundreds of satellites without browser lag",
        },
        solution: {
          fa: "انتقال محاسبات سنگین مداری به بک‌اند پایتون SGP4، تولید پکت‌های فشرده CZML و استفاده از رندر کارت گرافیک با WebGL.",
          en: "Offloaded heavy SGP4 propagation to async Python backend, generating batched CZML packets with GPU-accelerated rendering.",
        },
      },
      {
        title: {
          fa: "مدیریت بار حافظه موتور CesiumJS در سشن‌های طولانی‌مدت کاربر",
          en: "CesiumJS memory management during extended user sessions",
        },
        solution: {
          fa: "پیاده‌سازی مکانیزم پاکسازی خودکار بافرها، محدودسازی رهگیری فعال همزمان به حداکثر ۱۰ ماهواره و آزادسازی بافت‌های غیرضروری.",
          en: "Implemented automatic buffer eviction, capped concurrent active tracking to 10 satellites, and detached off-screen primitives.",
        },
      },
    ],
    metrics: {
      fa: "نرخ رندر پایدار ۶۰ FPS با شبیه‌سازی همزمان مدارهای فضایی",
      en: "Consistent 60 FPS rendering under active dynamic CZML orbital streams",
    },
    githubUrl: "https://github.com/seyedali-rafazi/KihanNama",
    liveUrl: "https://www.kihannama.ir/",
  },
  {
    id: "asemanyar",
    title: "AsemanYar",
    titleFa: "آسمان‌یار",
    category: "geospatial",
    tags: [
      "React 19",
      "MapLibre GL",
      "deck.gl 9",
      "FastAPI",
      "ADS-B",
      "Real-Time Telemetry",
    ],
    image: "/project-asemanyar.jpg",
    summary: {
      fa: "سامانه پایش هوایی و رهگیری بلادرنگ پروازها بر فراز ایران با لایه‌های WebGL و ابزارهای نقشه‌برداری تاکتیکی.",
      en: "Next-generation flight tracking and airspace surveillance platform with deck.gl WebGL layers, tactical GIS tools, and virtualized fleet directories.",
    },
    description: {
      fa: "آسمان‌یار (AsemanYar) یک سامانه مانیتورینگ هوایی و نقشه تعاملی پروازها بر فراز حریم هوایی ایران و خاورمیانه است. با ترکیب React 19، MapLibre GL و لایه‌های شتاب‌یافته deck.gl 9، هزاران داده تله‌متری زنده ADS-B پردازش شده و با الگوریتم Dead Reckoning و درون‌یابی زاویه‌ای با نرخ فرکانس ۲۰ هرتز به شکلی کاملاً روان و بدون پرش نمایش داده می‌شوند. این پلتفرم همچنین مجهز به جعبه ابزارهای نقشه‌کشی تاکتیکی (خط‌کش ژئودزیک، رسم چندضلعی و محدوده)، ناوبری بر اساس مختصات UTM و دایرکتوری پروازها با رندر مجازی‌سازی‌شده است.",
      en: "AsemanYar is an interactive aviation situational awareness and flight monitoring platform centered on Middle Eastern and Iranian airspace. Leveraging React 19, MapLibre GL, and deck.gl 9 WebGL pipelines, it streams live ADS-B vectors with high-frequency client-side motion interpolation (~20 Hz dead reckoning). Features include 4 token-free basemaps (Balad, Dark Matter, Streets, Satellite), full tactical GIS drawing tools, coordinate navigation (Lat/Lon & UTM), and a virtualized fleet catalog.",
    },
    features: {
      fa: [
        "رندر گرافیکی هزاران هواپیما با لایه‌های بهینه‌شده deck.gl IconLayer و PathLayer روی وب‌جی‌ال",
        "الگوریتم محاسباتی Dead Reckoning با فرکانس ۲۰ هرتز جهت حرکت روان هواپیماها میان فواصل دریافت سیگنال",
        "۴ استایل نقشه بدون نیاز به توکن شامل نقشه بومی نشان/بلد، کارتو تاریک، خیابان و ماهواره‌ای باکیفیت",
        "مجموعه ابزارهای ترسیم روی نقشه شامل خط چندنقطه‌ای، چندضلعی، دایره با نمایش شعاع و تشخیص تقاطع‌ها",
        "ناوبری مستقیم به مختصات جغرافیایی اعشاری (Lat/Lon) یا شبکه مختصات جهانی مرکاتور UTM",
        "دایرکتوری جامع ناوگان با رندر مجازی‌سازی‌شده (@tanstack/react-virtual) و جستجوی لحظه‌ای با Callsign و ICAO",
      ],
      en: [
        "Hardware-accelerated WebGL flight rendering via deck.gl IconLayer and PathLayer",
        "High-frequency motion smoothing (~20 Hz dead reckoning) preventing jitter during telemetry lags",
        "4 token-free basemap styles: Balad vector, Carto Dark Matter, Voyager Streets, and Satellite",
        "Comprehensive tactical drawing toolkit: markers, polylines, circles, polygons, and geodesic distance rulers",
        "Precision coordinate navigation via Decimal Degrees (Lat/Lon) and UTM coordinates",
        "High-density virtualized aircraft fleet directory powered by TanStack Virtual maintaining 60 FPS",
      ],
    },
    techStackDetailed: [
      {
        category: { fa: "موتور نقشه و رندر", en: "GIS & Map Engines" },
        items: [
          "MapLibre GL 5",
          "deck.gl 9 (IconLayer, PathLayer)",
          "Turf.js Geodesics",
        ],
      },
      {
        category: { fa: "فرانت‌اند و تایپ‌سیفتی", en: "Frontend & UI" },
        items: [
          "React 19",
          "TypeScript 5",
          "Material UI 7",
          "Vite 5",
          "@tanstack/react-virtual",
        ],
      },
      {
        category: { fa: "سرویس‌های سمت سرور", en: "Backend & Ingestion" },
        items: [
          "Python 3.10+",
          "FastAPI",
          "OpenSky Network API",
          "AirLabs ADS-B Feed",
        ],
      },
      {
        category: { fa: "عملکرد و کشینگ", en: "Performance & Caching" },
        items: [
          "In-Memory Telemetry Ring Buffer",
          "Disk Cache Quota Shield",
          "Dual-Channel State Subscriptions",
        ],
      },
    ],
    challenges: [
      {
        title: {
          fa: "جلوگیری از پرش موقعیت هواپیماها هنگام تاخیرهای چندثانیه‌ای داده‌های سنسور رادار",
          en: "Preventing aircraft marker jumping during intermittent radar telemetry updates",
        },
        solution: {
          fa: "طراحی ماژول ریاضی درون‌یابی حرکت (Dead Reckoning) با معادلات کروی هاورسین که حرکت هواپیما را بر مبنای بردار سرعت و زاویه ادامه می‌دهد.",
          en: "Engineered a client-side dead reckoning module executing at 20 Hz using spherical haversine math to extrapolate smooth flight trajectories.",
        },
      },
      {
        title: {
          fa: "رندر همزمان بیش از ۳۵۰۰ پرواز فعال بدون کاهش نرخ فریم از ۶۰ هرتز",
          en: "Simultaneously rendering 3,500+ active flights without dipping below 60 FPS",
        },
        solution: {
          fa: "استفاده از پایپ‌لاین رندر کارت گرافیک در deck.gl و تجمیع داده‌ها در بافرهای باینری Float32Array.",
          en: "Leveraged GPU instanced rendering via deck.gl and binary Float32Array coordinate packing.",
        },
      },
    ],
    metrics: {
      fa: "بیش از ۳۵۰۰ هواپیمای همزمان با نرخ فریم ۶۰ هرتز و درون‌یابی ۲۰ هرتز",
      en: "3,500+ simultaneous tracked flights at smooth 60 FPS with 20 Hz dead reckoning",
    },
    githubUrl: "https://github.com/seyedali-rafazi/asemanha",
    liveUrl: "https://www.asemanyar.ir/",
  },
  {
    id: "langarnama",
    title: "Langarnama",
    titleFa: "لنگرنما",
    category: "geospatial",
    tags: [
      "React 19",
      "MapLibre GL",
      "deck.gl 9",
      "FastAPI",
      "AIS Live Stream",
      "Nautical GIS",
    ],
    image: "/project-langarnama.jpg",
    summary: {
      fa: "سامانه اطلاعات مکانی و نظارت دریایی بلادرنگ با رصد کشتی‌ها در خلیج فارس، دریای عمان و خزر بر اساس داده‌های AIS.",
      en: "Interactive real-time maritime surveillance, vessel tracking, and nautical GIS platform centered on Persian Gulf and Caspian Sea.",
    },
    description: {
      fa: "لنگرنما (Langarnama) یک پلتفرم پیشرفته نظارت و پایش دریایی با تم تاریک برای رصد زنده شناورهای تجاری، نفتکش‌ها، کشتی‌های باری، مسافربری و صیادی در خلیج فارس، تنگه هرمز، دریای عمان و دریای خزر است. این سامانه با استفاده از React 19، MapLibre GL، deck.gl 9 و بک‌اند آسنکرون FastAPI، داده‌های راداری AIS را از وب‌سوکت‌های زنده دریافت نموده و با الگوریتم درون‌یابی هاورسین با فرکانس ۲۰ هرتز، مسیر شناورها را بازسازی می‌کند. از ویژگی‌های آن می‌توان به کدگذاری رنگی استاندارد برای ۶ گروه شناور، ۵ نقشه پایه دریایی بدون نیاز به توکن، ابزارهای اندازه‌گیری ژئودزیک دریایی و دایرکتوری ناوگان دریایی اشاره کرد.",
      en: "Langarnama is a specialized dark-themed maritime intelligence and vessel tracking application covering strategic Middle Eastern waters — the Persian Gulf, Strait of Hormuz, Gulf of Oman, and the Caspian Sea. Built with React 19, MapLibre GL, deck.gl 9, and FastAPI, it ingests live AIS telemetry via WebSockets into an async backend with in-memory spatial indexing. It features 20 Hz dead reckoning along COG/SOG, vessel classification with distinctive color codes, token-free nautical basemaps, tactical GIS drawing tools, and virtualized fleet directories.",
    },
    features: {
      fa: [
        "استریم بلادرنگ داده‌های دریایی AIS با وب‌سوکت از طریق AISStream.io و شاخص‌گذاری مکانی در حافظه با صفر تاخیر",
        "کدگذاری رنگی شناورها بر مبنای نوع: نفتکش (قرمز)، کانتینر/باری (نارنجی)، صیادی (سبز)، مسافری (آبی)، یدک‌کش (زرد) و گشتی نظامی (خاکستری)",
        "درون‌یابی حرکتی ناوبری با فرکانس ۲۰ هرتز با استفاده از معادلات کروی هاورسین بر مبنای زاویه COG و سرعت گره دریایی SOG",
        "۵ استایل نقشه ناوبری دریایی بدون توکن (Carto Dark Matter, Voyager, Positron, Esri Satellite, Balad)",
        "مجموعه ابزارهای ژئودزیک دریایی شامل اندازه‌گیری فاصله با گره و کیلومتر، ابزارهای رسم تاکتیکی و انتقال مختصات UTM",
        "دایرکتوری ناوگان دریایی (/ship) با رندر مجازی‌سازی‌شده و جستجوی شماره شناسایی MMSI، کد IMO و ابعاد کشتی",
      ],
      en: [
        "Live maritime AIS ingestion & streaming via AISStream.io WebSocket into async FastAPI backend with in-memory spatial indexing",
        "Color-coded vessel radar classification: Oil Tankers (red), Cargo (orange), Fishing (green), Passenger (blue), Tug (yellow), Naval (slate)",
        "High-frequency dead reckoning (~20 Hz) using spherical haversine math along COG (Course Over Ground) and SOG (Speed Over Ground)",
        "5 token-free nautical basemaps (Dark Matter, Voyager Streets, Positron Light, Satellite, Balad)",
        "Tactical nautical GIS toolkit: geodesic distance rulers, UTM navigators, image draping, and PNG chart capture",
        "High-density virtualized fleet directory (/ship) powered by TanStack Virtual with detailed vessel particulars",
      ],
    },
    techStackDetailed: [
      {
        category: {
          fa: "موتور نقشه و لایه‌های دریایی",
          en: "Maritime GIS & Visualization",
        },
        items: [
          "MapLibre GL 4.7+",
          "deck.gl 9 (IconLayer, PathLayer, ScatterplotLayer)",
          "Turf.js Nautical Calculations",
        ],
      },
      {
        category: { fa: "فرانت‌اند و تایپ‌سیفتی", en: "Frontend & UI" },
        items: [
          "React 19",
          "TypeScript 5",
          "Material UI 7",
          "Vite 5",
          "@tanstack/react-virtual",
        ],
      },
      {
        category: { fa: "استریم و پردازش داده", en: "Streaming & Backend" },
        items: [
          "Python 3.10+",
          "FastAPI",
          "AISStream.io WebSocket Feed",
          "Zero-Latency Spatial Indexer",
        ],
      },
      {
        category: { fa: "پایداری و آفلاین", en: "Resilience & Fallback" },
        items: [
          "Persian Gulf & Caspian Baseline Dataset",
          "20 Hz Motion Interpolation",
          "Token-Free Vector Basemaps",
        ],
      },
    ],
    challenges: [
      {
        title: {
          fa: "محاسبه جهت چرخش آیکون شناورها و انحنای بیداری آب در تنگه هرمز و کانال‌های باریک",
          en: "Accurate vessel icon heading rotation and wake path curves in narrow straits",
        },
        solution: {
          fa: "استفاده از IconLayer با ترنسفورم ماتریسی سخت‌افزاری در deck.gl و محاسبه زاویه دقیق جهت‌گیری از داده‌های Course Over Ground.",
          en: "Utilized deck.gl hardware matrix transformations for heading rotation and spherical arc calculations along vessel trails.",
        },
      },
      {
        title: {
          fa: "پوشش سراسری آب‌های خلیج فارس و خزر بدون وابستگی به کلیدهای تحریمی سرویس‌های نقشه خارجی",
          en: "Complete coverage of Iranian waters without reliance on restricted external map APIs",
        },
        solution: {
          fa: "پیکربندی ۵ پرووایدر تایل وکتور و رستر رایگان و متن‌باز با دسترسی مستقیم و پایدار.",
          en: "Configured 5 open-access and Iranian local tile providers operating token-free with zero authentication bottlenecks.",
        },
      },
    ],
    metrics: {
      fa: "نرخ درون‌یابی ۲۰ هرتز با رندر بلادرنگ صدها شناور در آب‌های خلیج فارس بدون افت کارایی",
      en: "20 Hz nautical dead-reckoning interpolation with sub-millisecond layer updates",
    },
    githubUrl: "https://github.com/seyedali-rafazi/langarnama",
    liveUrl: "https://langarnama.ir/",
  },
];

export const BOT_PROJECTS: Project[] = [
  {
    id: "python-bale-bot",
    title: "Bale Downloader Bot",
    titleFa: "ربات دانلودر و دستیار هوشمند بله",
    category: "bot",
    tags: [
      "Python 3.10+",
      "Bale API",
      "yt-dlp",
      "FFmpeg",
      "Pillow",
      "AI Assistant",
      "OCR",
    ],
    image: "/project-balebot.svg",
    botId: "@PerYTDownloaderbot",
    botUrl: "https://ble.ir/PerYTDownloaderbot",
    botPlatform: "bale",
    githubUrl: "https://github.com/seyedali-rafazi/python-bale-bot",
    liveUrl: "https://ble.ir/PerYTDownloaderbot",
    summary: {
      fa: "ربات چندمنظوره پیام‌رسان بله برای دانلود مدیا از یوتیوب و اینستاگرام، استخراج صوت MP3، پردازش تصویر، ساخت PDF و ابزارهای هوش مصنوعی.",
      en: "Multi-purpose Bale messenger bot for downloading media from YouTube & Instagram, MP3 audio extraction, image processing, PDF compilation, and AI tools.",
    },
    description: {
      fa: "ربات دانلودر و پردازش چندرسانه‌ای بله (@PerYTDownloaderbot) یک سیستم خودکارسازی پیشرفته بر پایه پایتون ۳.۱۰+ و وب‌هوک‌های tapi.bale.ai است. این ربات به کاربران امکان می‌دهد انواع ویدیوهای یوتیوب را با کیفیت‌های گوناگون (از 144p تا 720p) همراه با امکان استخراج آنی فایل صوتی MP3 (تا ۳۲۰ کیلوبیت بر ثانیه) دریافت نمایند. همچنین این ربات مجهز به پایپ‌لاین پیشرفته کار با تصاویر (تبدیل تا ۲۰ تصویر به یک فایل PDF منسجم، تغییر فرمت و تغییر ابعاد)، دانلود ریلز و پست‌های اینستاگرام و تیک‌تاک، موتور تشخیص هوشمند موزیک (مشابه Shazam) و دستیار هوش مصنوعی به همراه سیستم کش اشتراکی برای تحویل پرسرعت محتوا است.",
      en: "Bale Downloader Bot (@PerYTDownloaderbot) is a powerful Python-based automation bot tailored for the Bale messenger ecosystem via webhook and polling architectures (tapi.bale.ai). It empowers users to download YouTube videos across varying resolutions (144p to 720p) and extract audio as high-fidelity MP3 files or ZIP packages. Beyond video downloading, it features an image manipulation suite (PDF compilation from up to 20 photos, image format conversion, and resizing), Instagram/TikTok reel downloading, Shazam-like music identification, AI chat assistance, and OCR text extraction backed by an asynchronous processing queue.",
    },
    features: {
      fa: [
        "دانلود پرسرعت ویدیوهای یوتیوب با کیفیت‌های متنوع (144p تا 720p) و تفکیک استریم‌های صوتی/تصویری با yt-dlp",
        "استخراج صدا از ویدیوهای یوتیوب و ارسال به صورت فایل موزیک قابل پخش MP3 (زیر ۵۰ مگابایت) و آرشیو ZIP",
        "جستجوی پیشرفته یوتیوب درون کانال‌های خاص، آخرین ۵ ویدیو، و دسترسی آنی از طریق کش اشتراکی فایل‌ها",
        "تولید فایل PDF از تصاویر: تبدیل هوشمند تا ۲۰ عکس مجزا به یک سند PDF یکپارچه با Pillow",
        "مجموعه ابزارهای ویرایش تصویر: تغییر فرمت بین PNG، JPG، WEBP، BMP و تغییر اندازه درصدی و پیکسلی",
        "دانلودر اینستاگرام و تیک‌تاک برای ریلزها و پست‌های چندرسانه‌ای تنها با ارسال لینک",
        "تشخیص هوشمند موسیقی (Music Recognition) با شناسایی قطعه صوتی از روی فایل ویدیو یا صوت ارسالی",
        "ابزارهای هوش مصنوعی شامل دستیار پاسخگویی هوشمند، استخراج متن از تصویر (OCR) و تبدیل متن به گفتار (TTS)",
        "معماری آسنکرون با صف پردازش دانلود در پس‌زمینه (asyncio Queue) و پاکسازی خودکار فایل‌های قدیمی پس از ۲ ساعت",
      ],
      en: [
        "YouTube video downloading across multiple quality options (144p through 720p) using optimized yt-dlp pipelines",
        "Direct high-fidelity MP3 audio extraction with metadata tagging and fallback ZIP archives for large tracks",
        "Smart channel searching, top-5 video discovery, and instant delivery via shared file caching",
        "Batch Image to PDF converter: merges up to 20 images into a compact PDF document using Pillow",
        "Comprehensive image manipulation tools: format conversion (PNG/JPG/WEBP/BMP), resizing, and AI background removal",
        "Direct link media extraction for Instagram Reels, Posts, and trending TikTok clips",
        "Shazam-like audio fingerprinting to identify music tracks from recorded voice notes or video clips",
        "AI capabilities including conversational chat assistant, optical character recognition (OCR), and text-to-speech synthesis",
        "Asynchronous worker queue architecture (asyncio) with automated disk cleanup for files older than 2 hours",
      ],
    },
    techStackDetailed: [
      {
        category: {
          fa: "معماری ربات و سرور",
          en: "Bot Architecture & Runtime",
        },
        items: [
          "Python 3.10+",
          "python-telegram-bot 20.x",
          "Bale Bot API (tapi.bale.ai)",
          "Webhook & Polling",
          "Asyncio Worker Queue",
        ],
      },
      {
        category: {
          fa: "موتور پردازش رسانه و ویدیو",
          en: "Media Engines & FFmpeg",
        },
        items: [
          "yt-dlp",
          "FFmpeg",
          "Pillow (PIL)",
          "Mutagen (ID3 Tags)",
          "ShazamIO Engine",
        ],
      },
      {
        category: {
          fa: "خزشگر وب و ابزارهای هوش مصنوعی",
          en: "Web Automation & AI",
        },
        items: [
          "Playwright (Chromium)",
          "BeautifulSoup4",
          "OpenAI API",
          "Tesseract OCR Engine",
        ],
      },
      {
        category: { fa: "داده‌ها و پایداری", en: "Data & Storage" },
        items: [
          "aiosqlite / SQLite",
          "PostgreSQL",
          "Shared Hash Cache",
          "Automatic GC Cleaner",
        ],
      },
    ],
    challenges: [
      {
        title: {
          fa: "محدودیت حجم آپلود فایل در پلتفرم بله و استریم‌های حجیم یوتیوب",
          en: "Bale platform upload limits and large YouTube media handling",
        },
        solution: {
          fa: "پیاده‌سازی مکانیزم تحویل دوگانه: ارسال مستقیم فایل‌های صوتی/تصویری زیر سقف حجم مجاز، و فشرده‌سازی خودکار در قالب پارت‌های ZIP برای فایل‌های حجیم به همراه کش پایدار.",
          en: "Implemented a dual delivery mechanism: direct video/audio dispatch for sub-50MB files and automated multi-part ZIP packaging for larger media with persistent SHA256 caching.",
        },
      },
      {
        title: {
          fa: "جلوگیری از اشغال فضای دیسک سرور در اثر انباشت فایل‌های موقت دانلود",
          en: "Server disk saturation prevention from accumulated media files",
        },
        solution: {
          fa: "طراحی تسک زمان‌بندی‌شده دوره‌ای (JobQueue) با اجرای هر ۲ ساعت یکبار که فایل‌های دانلودی قدیمی‌تر از ۷۲۰۰ ثانیه را به صورت ایمن از پوشه‌های موقت پاکسازی می‌کند.",
          en: "Engineered an asynchronous JobQueue routine executing every 2 hours that safely purges downloaded media files older than 7,200 seconds while retaining metadata in cache.",
        },
      },
    ],
    metrics: {
      fa: "بیش از ۱۰ قابلیت چندرسانه‌ای با پاسخ‌دهی زیر ۳ ثانیه در بستر پیام‌رسان بله",
      en: "10+ multi-media modules with sub-3s response time on Bale Messenger API",
    },
  },
];

export const PACKAGE_PROJECTS: Project[] = [
  {
    id: "mapixa",
    title: "Mapixa",
    titleFa: "کتابخانه مپیکسا (Mapixa)",
    category: "package",
    tags: [
      "React",
      "MapLibre GL",
      "TypeScript",
      "NPM Package",
      "GIS",
      "Lucide Icons",
      "Pure CSS",
    ],
    image: "/project-mapixa.svg",
    githubUrl: "https://github.com/seyedali-rafazi/Mapixa",
    liveUrl: "https://www.npmjs.com/package/mapixa",
    npmUrl: "https://www.npmjs.com/package/mapixa",
    packageName: "mapixa",
    installCommand: "npm i mapixa",
    summary: {
      fa: "مجموعه ابزارهای ماژولار، سبک و بدون وابستگی برای ترسیم هندسی، محاسبه مساحت، خط‌کش ژئودزیک، سوئیچر بیس‌مپ و مدیریت لایه‌ها در MapLibre و React منتشر شده در NPM.",
      en: "A high-performance, modular, and extensible suite of drawing, measurement, navigation, and layer visibility tools for MapLibre GL JS and React published on NPM.",
    },
    description: {
      fa: "مپیکسا (Mapixa) یک پکیج جامع و مدرن متن‌باز برای اکوسیستم نقشه‌خوانی MapLibre GL JS و کامپوننت‌های React است که با زبان تایپ‌اسکریپت و بدون هیچ وابستگی سنگین به فریمورک‌های UI توسعه داده شده است. این کتابخانه ابزارهای کاملی شامل ترسیم مارکر سفارشی، خطوط چندنقطه‌ای (Polyline)، چندضلعی (Polygon) با محاسبه کروی مساحت، دایره‌های ژئودزیک، مستطیل، طراحی دست‌آزاد (Freehand)، تشخیص تقاطع خطوط، پاک‌کن تعاملی اشکال و پنل مدیریت لایه‌های ترسیم‌شده (با قابلیت مرتب‌سازی z-index لایه‌ها و جابجایی) را در اختیار برنامه‌نویسان قرار می‌دهد. علاوه بر این، ابزارهای تخصصی اندازه‌گیری فواصل با فرمول Haversine، خط‌کش چندمقطعی، خروجی اسکرین‌شات از محدوده نقشه، پرش سریع به مختصات (Fly-to)، سوئیچر پیشرفته بیس‌مپ‌های وکتور و رستر، و رویدادهای کامل چرخه حیات ترسیم (onDrawEnd, onDrawChange, onDrawDelete) در آن پیاده‌سازی شده است.",
      en: "Mapixa is an extensible, zero-framework-bloat GIS mapping toolkit engineered for MapLibre GL JS and React. Built strictly in TypeScript with modern pure CSS styling and CSS custom properties, Mapixa equips web developers with an all-in-one drawing suite (custom markers, polylines, spherical area polygons, geodesic circles, rectangles, freehand sketching, and self-intersection detector), an interactive shape eraser, and a live drawn layer manager supporting dynamic z-index reordering. It additionally bundles geodesic distance rulers, canvas bounding-box screenshot capture, fly-to coordinate jumper, dynamic raster/vector basemap switchers, and full lifecycle draw events with real-time metrics (distance in km, spherical area in m² and km², radius, and perimeter) ready for production dashboards.",
    },
    features: {
      fa: [
        "جعبه‌ابزار کامل ترسیم هندسی: مارکر اختصاصی، خطوط چندنقطه‌ای، چندضلعی، دایره ژئودزیک، مستطیل و ترسیم دست‌آزاد (Freehand)",
        "پنل مدیریت عارضه‌ها (Live Drawn Layer Manager) با قابلیت تغییر نام، کنترل شفافیت، تغییر z-index لایه‌ها با Drag & Drop و زوم به عارضه",
        "پاک‌کن تعاملی اشکال (Interactive Eraser) برای حذف سریع هر عارضه تنها با یک کلیک روی نقشه",
        "محاسبات ژئودزیک پیشرفته: محاسبه بلادرنگ مساحت کروی بر حسب مترمربع و کیلومترمربع و خط‌کش محاسبه طول بر پایه فرمول Haversine",
        "سوئیچر نقشه‌های پایه (Basemap Switcher) با پشتیبانی از تایل‌های وکتور و رستر دارک، لایت، ماهواره‌ای و لایه‌های ترافیک و دریانوردی",
        "ابزار عکس‌برداری باکیفیت از بوم نقشه (Canvas Area Capture) با ذخیره‌سازی مستقیم تصویر محدوده انتخاب‌شده",
        "کپسول ردیاب و انتخابگر تعاملی مختصات جغرافیایی (Coordinate Picker & Tracker) با امکان کپی مستقیم به کلیپ‌بورد",
        "طراحی فوق‌العاده مدرن با CSS خالص (Pure CSS)، صفر وابستگی سنگین UI، استایل شیشه‌ای و آیکون‌های برداری Lucide",
        "پشتیبانی بومی از تایپ‌های TypeScript، الگوهای کامپوننت ترکیبی (<Mapixa.Accordion />, <Mapixa.Button />) و هوک‌های ماژولار",
      ],
      en: [
        "Comprehensive GIS drawing suite: SVG pinpoint markers, polylines, polygons, geodesic circles, rectangles, and freehand sketching",
        "Live Drawn Layer Manager: popover panel supporting inline renaming, visibility toggling, drag-and-drop z-index reordering, and zoom-to-feature",
        "Interactive Shape Eraser: one-click canvas purge tool with instant visual feedback and clean state disposal",
        "Precision Geodesic Measurement: multi-segment distance ruler, spherical polygon area calculations (m² and km²), and perimeter tracking",
        "Basemap & Overlay Switcher: dynamic raster and vector style switching (Dark, Light, Voyager, OSM) with custom opacity overlays",
        "High-Resolution Area Screen Capture: export map canvas bounding box captures directly as image files",
        "Live Coordinate Capsule & Crosshair Point Picker: real-time cursor coordinate readout with instant click-to-copy",
        "Zero UI framework bloat: pure CSS modern glassmorphic interface styled with CSS custom properties and crisp Lucide icons",
        "Strict TypeScript typings, compound component architecture (<Mapixa.Accordion />, <Mapixa.Button />), and lifecycle draw hooks",
      ],
    },
    techStackDetailed: [
      {
        category: {
          fa: "هسته و معماری کتابخانه",
          en: "Core Architecture & Runtime",
        },
        items: [
          "React 18+",
          "MapLibre GL JS",
          "react-map-gl",
          "TypeScript",
          "ESM & CJS Dual Output",
        ],
      },
      {
        category: {
          fa: "موتور محاسباتی GIS و هندسی",
          en: "Geospatial & Computational Engines",
        },
        items: [
          "GeoJSON Spec",
          "Haversine Geodesic Math",
          "Spherical Polygon Area",
          "Turf.js Algorithms",
          "HTML5 Canvas API",
        ],
      },
      {
        category: {
          fa: "سیستم رابط کاربری و استایل",
          en: "UI & Styling System",
        },
        items: [
          "Pure CSS (Zero-Bloat)",
          "CSS Custom Properties",
          "Lucide Icons",
          "Glassmorphic Theme",
          "Keyboard Navigation",
        ],
      },
      {
        category: { fa: "توزیع و پکیجینگ", en: "Packaging & Distribution" },
        items: [
          "NPM Registry (mapixa)",
          "Semantic Versioning",
          "Tree-shakable Exports",
          "GitHub Open Source",
        ],
      },
    ],
    challenges: [
      {
        title: {
          fa: "حفظ استقلال کامل از فریمورک‌های UI سنگین بدون افت زیبایی بصری",
          en: "Zero UI Framework Bloat in React & MapLibre",
        },
        solution: {
          fa: "پیاده‌سازی تمام اجزا و پاپ‌اورها با CSS خام و متغیرهای استاندارد CSS به گونه‌ای که با هر سیستم طراحی و در هر پروژه‌ای بدون تداخل با Tailwind یا Material-UI قابل استفاده باشد.",
          en: "Architected every control and modal using pure vanilla CSS and standard CSS Custom Properties, enabling drop-in compatibility across any UI framework without style bleeding.",
        },
      },
      {
        title: {
          fa: "محاسبه دقیق مساحت و طول کروی عوارض در مقیاس کره زمین (Ellipsoid)",
          en: "High-precision Spherical and Geodesic Calculations",
        },
        solution: {
          fa: "به‌کارگیری فرمول‌های کروی ریاضی ژئودزی برای اندازه‌گیری دقیق مسافت خطوط و مساحت چندضلعی‌ها بدون اتکا به پروژکشن‌های مسطح تحریف‌شده مرکاتور.",
          en: "Engineered Haversine segment accumulation and spherical excess algorithms to provide accurate geodesic line distances and polygon areas directly in real time.",
        },
      },
    ],
    metrics: {
      fa: "بیش از ۲۰ ابزار تخصصی نقشه‌برداری با حجم سبک، صفر وابستگی خارجی UI و انتشار رسمی در NPM",
      en: "20+ production GIS map tools, zero UI framework dependencies, published on NPM",
    },
  },
];

export const PROJECTS: Project[] = [
  ...FEATURED_PROJECTS,
  ...BOT_PROJECTS,
  ...PACKAGE_PROJECTS,
];
