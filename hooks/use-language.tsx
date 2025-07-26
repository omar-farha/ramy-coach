"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "en" | "ar"

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  t: (key: string) => string
}

const translations = {
  en: {
    "GymCoach Pro": "GymCoach Pro",
    "Online Fitness Training": "Online Fitness Training",
    "Create Workout": "Create Workout",
    "Total Workouts": "Total Workouts",
    "Active Clients": "Active Clients",
    "Plans Shared": "Plans Shared",
    "Workout Plans": "Workout Plans",
    "No workout plans yet": "No workout plans yet",
    "Create your first workout plan to get started with training your clients.":
      "Create your first workout plan to get started with training your clients.",
    "Create First Workout": "Create First Workout",
    exercises: "exercises",
    Created: "Created",
    View: "View",
    Back: "Back",
    "Create Workout Plan": "Create Workout Plan",
    "Save Workout": "Save Workout",
    "Workout Details": "Workout Details",
    "Workout Name": "Workout Name",
    "Enter workout name": "Enter workout name",
    "Client Name": "Client Name",
    "Enter client name": "Enter client name",
    Notes: "Notes",
    "Add workout notes or instructions": "Add workout notes or instructions",
    "Selected Exercises": "Selected Exercises",
    "Find Exercises": "Find Exercises",
    "Search exercises...": "Search exercises...",
    "All Body Parts": "All Body Parts",
    "Add Exercise": "Add Exercise",
    Added: "Added",
    "Workout Not Found": "Workout Not Found",
    "The requested workout plan could not be found.": "The requested workout plan could not be found.",
    For: "For",
    Exercise: "Exercise",
    of: "of",
    Complete: "Complete",
    "Time Left": "Time Left",
    Reset: "Reset",
    Start: "Start",
    Pause: "Pause",
    Instructions: "Instructions",
    "Exercise List": "Exercise List",
    "Link copied to clipboard!": "Link copied to clipboard!",
    Sets: "Sets",
    Reps: "Reps",
    sets: "sets",
    reps: "reps",
  },
  ar: {
    "GymCoach Pro": "مدرب الجيم المحترف",
    "Online Fitness Training": "التدريب الرياضي عبر الإنترنت",
    "Create Workout": "إنشاء تمرين",
    "Total Workouts": "إجمالي التمارين",
    "Active Clients": "العملاء النشطون",
    "Plans Shared": "الخطط المشاركة",
    "Workout Plans": "خطط التمرين",
    "No workout plans yet": "لا توجد خطط تمرين بعد",
    "Create your first workout plan to get started with training your clients.":
      "أنشئ خطة التمرين الأولى للبدء في تدريب عملائك.",
    "Create First Workout": "إنشاء أول تمرين",
    exercises: "تمارين",
    Created: "تم الإنشاء",
    View: "عرض",
    Back: "رجوع",
    "Create Workout Plan": "إنشاء خطة تمرين",
    "Save Workout": "حفظ التمرين",
    "Workout Details": "تفاصيل التمرين",
    "Workout Name": "اسم التمرين",
    "Enter workout name": "أدخل اسم التمرين",
    "Client Name": "اسم العميل",
    "Enter client name": "أدخل اسم العميل",
    Notes: "ملاحظات",
    "Add workout notes or instructions": "أضف ملاحظات أو تعليمات التمرين",
    "Selected Exercises": "التمارين المختارة",
    "Find Exercises": "البحث عن التمارين",
    "Search exercises...": "البحث عن التمارين...",
    "All Body Parts": "جميع أجزاء الجسم",
    "Add Exercise": "إضافة تمرين",
    Added: "تم الإضافة",
    "Workout Not Found": "التمرين غير موجود",
    "The requested workout plan could not be found.": "لم يتم العثور على خطة التمرين المطلوبة.",
    For: "لـ",
    Exercise: "تمرين",
    of: "من",
    Complete: "مكتمل",
    "Time Left": "الوقت المتبقي",
    Reset: "إعادة تعيين",
    Start: "بدء",
    Pause: "إيقاف مؤقت",
    Instructions: "التعليمات",
    "Exercise List": "قائمة التمارين",
    "Link copied to clipboard!": "تم نسخ الرابط!",
    Sets: "مجموعات",
    Reps: "تكرارات",
    sets: "مجموعات",
    reps: "تكرارات",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"))
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      <div className={language === "ar" ? "arabic-layout" : ""}>{children}</div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
