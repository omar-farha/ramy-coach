"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Dumbbell, Users, Share2, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import WorkoutBuilder from "@/components/workout-builder"
import { useLanguage } from "@/hooks/use-language"

interface WorkoutPlan {
  id: string
  name: string
  exercises: any[]
  createdAt: string
  clientName?: string
}

export default function Dashboard() {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([])
  const [showBuilder, setShowBuilder] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()

  useEffect(() => {
    const saved = localStorage.getItem("workoutPlans")
    if (saved) {
      setWorkoutPlans(JSON.parse(saved))
    }
  }, [])

  const saveWorkoutPlan = (plan: WorkoutPlan) => {
    const updated = [...workoutPlans, plan]
    setWorkoutPlans(updated)
    localStorage.setItem("workoutPlans", JSON.stringify(updated))
    setShowBuilder(false)
  }

  const shareWorkout = (planId: string) => {
    const url = `${window.location.origin}/workout/${planId}`
    const message =
      language === "ar" ? `مرحباً! إليك خطة التمرين الخاصة بك: ${url}` : `Hi! Here's your workout plan: ${url}`

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank")
  }

  if (showBuilder) {
    return <WorkoutBuilder onSave={saveWorkoutPlan} onCancel={() => setShowBuilder(false)} />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-yellow-500/20 bg-black/50 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-yellow-500">{t("GymCoach Pro")}</h1>
              <p className="text-sm text-gray-400">{t("Online Fitness Training")}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-yellow-500 hover:bg-yellow-500/10"
            >
              <Globe className="w-4 h-4 mr-2" />
              {language === "en" ? "العربية" : "English"}
            </Button>

            <Button
              onClick={() => setShowBuilder(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("Create Workout")}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-yellow-500 flex items-center gap-2">
                <Dumbbell className="w-5 h-5" />
                {t("Total Workouts")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{workoutPlans.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-yellow-500 flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t("Active Clients")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {new Set(workoutPlans.map((p) => p.clientName).filter(Boolean)).size}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-yellow-500 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                {t("Plans Shared")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{workoutPlans.length}</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Workout Plans */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{t("Workout Plans")}</h2>
          </div>

          {workoutPlans.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Dumbbell className="w-12 h-12 text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">{t("No workout plans yet")}</h3>
                <p className="text-gray-500 text-center mb-6">
                  {t("Create your first workout plan to get started with training your clients.")}
                </p>
                <Button onClick={() => setShowBuilder(true)} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  {t("Create First Workout")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workoutPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gray-900 border-gray-800 hover:border-yellow-500/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-white">{plan.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {plan.clientName && (
                          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500 mb-2">
                            {plan.clientName}
                          </Badge>
                        )}
                        <div>
                          {plan.exercises.length} {t("exercises")}
                        </div>
                        <div className="text-xs">
                          {t("Created")}: {new Date(plan.createdAt).toLocaleDateString()}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/workout/${plan.id}`, "_blank")}
                          className="flex-1 border-gray-700 hover:bg-gray-800"
                        >
                          {t("View")}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => shareWorkout(plan.id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
