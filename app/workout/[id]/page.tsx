"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Share2, Download, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/hooks/use-language"

interface Exercise {
  id: string
  name: string
  bodyPart: string
  equipment: string
  gifUrl: string
  target: string
  instructions: string[]
  sets?: number
  reps?: number
}

interface WorkoutPlan {
  id: string
  name: string
  exercises: Exercise[]
  createdAt: string
  clientName?: string
  notes?: string
}

export default function WorkoutView({ params }: { params: { id: string } }) {
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timer, setTimer] = useState(0)
  const [exerciseTimer, setExerciseTimer] = useState(45) // 45 seconds per exercise
  const { language, toggleLanguage, t } = useLanguage()

  useEffect(() => {
    const workoutPlans = JSON.parse(localStorage.getItem("workoutPlans") || "[]")
    const foundWorkout = workoutPlans.find((w: WorkoutPlan) => w.id === params.id)
    setWorkout(foundWorkout)
  }, [params.id])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && exerciseTimer > 0) {
      interval = setInterval(() => {
        setExerciseTimer((prev) => prev - 1)
        setTimer((prev) => prev + 1)
      }, 1000)
    } else if (exerciseTimer === 0 && isPlaying) {
      // Auto advance to next exercise
      if (currentExercise < (workout?.exercises.length || 0) - 1) {
        setCurrentExercise((prev) => prev + 1)
        setExerciseTimer(45)
      } else {
        setIsPlaying(false)
      }
    }
    return () => clearInterval(interval)
  }, [isPlaying, exerciseTimer, currentExercise, workout])

  const toggleTimer = () => {
    setIsPlaying(!isPlaying)
  }

  const resetTimer = () => {
    setIsPlaying(false)
    setTimer(0)
    setExerciseTimer(45)
    setCurrentExercise(0)
  }

  const shareWorkout = () => {
    const url = window.location.href
    const message =
      language === "ar" ? `مرحباً! إليك خطة التمرين الخاصة بك: ${url}` : `Hi! Here's your workout plan: ${url}`

    if (navigator.share) {
      navigator.share({
        title: workout?.name || "Workout Plan",
        text: message,
        url: url,
      })
    } else {
      navigator.clipboard.writeText(url)
      alert(t("Link copied to clipboard!"))
    }
  }

  const downloadWorkout = () => {
    if (!workout) return

    const workoutData = {
      name: workout.name,
      clientName: workout.clientName,
      notes: workout.notes,
      exercises: workout.exercises.map((ex) => ({
        name: ex.name,
        target: ex.target,
        equipment: ex.equipment,
        instructions: ex.instructions,
      })),
    }

    const blob = new Blob([JSON.stringify(workoutData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${workout.name.replace(/\s+/g, "_")}_workout.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-yellow-500 mb-4">{t("Workout Not Found")}</h1>
          <p className="text-gray-400">{t("The requested workout plan could not be found.")}</p>
        </div>
      </div>
    )
  }

  const progress = ((currentExercise + 1) / workout.exercises.length) * 100
  const currentEx = workout.exercises[currentExercise]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-yellow-500/20 bg-black/50 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-yellow-500">{workout.name}</h1>
              {workout.clientName && (
                <p className="text-gray-400">
                  {t("For")}: {workout.clientName}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-yellow-500 hover:bg-yellow-500/10"
              >
                <Globe className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={shareWorkout}
                className="text-yellow-500 hover:bg-yellow-500/10"
              >
                <Share2 className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={downloadWorkout}
                className="text-yellow-500 hover:bg-yellow-500/10"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">
                {t("Exercise")} {currentExercise + 1} {t("of")} {workout.exercises.length}
              </span>
              <span className="text-yellow-500">
                {Math.round(progress)}% {t("Complete")}
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-800" />
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Exercise */}
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800 mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-yellow-500 text-xl">{currentEx.name}</CardTitle>
                    <CardDescription className="mt-2">
                      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500 mr-2">
                        {currentEx.target}
                      </Badge>
                      <span className="text-gray-400">{currentEx.equipment}</span>
                      {/* Add sets and reps display */}
                      <div className="mt-2 flex gap-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500 font-semibold">{currentEx.sets || 3}</span>
                          <span className="text-gray-400 text-sm">{t("Sets")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500 font-semibold">{currentEx.reps || 12}</span>
                          <span className="text-gray-400 text-sm">{t("Reps")}</span>
                        </div>
                      </div>
                    </CardDescription>
                  </div>

                  {/* Timer */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-500">
                      {Math.floor(exerciseTimer / 60)}:{(exerciseTimer % 60).toString().padStart(2, "0")}
                    </div>
                    <div className="text-sm text-gray-400">{t("Time Left")}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Exercise GIF */}
                <div className="relative mb-6 bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={currentEx.gifUrl || "/placeholder.svg"}
                    alt={currentEx.name}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </div>

                {/* Timer Controls */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button
                    onClick={resetTimer}
                    variant="outline"
                    size="lg"
                    className="border-gray-700 hover:bg-gray-800 bg-transparent"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    {t("Reset")}
                  </Button>

                  <Button
                    onClick={toggleTimer}
                    size="lg"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        {t("Pause")}
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        {t("Start")}
                      </>
                    )}
                  </Button>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">{t("Instructions")}</h3>
                  <ol className="space-y-2">
                    {currentEx.instructions.map((instruction, index) => (
                      <li key={index} className="text-gray-300 flex">
                        <span className="text-yellow-500 font-semibold mr-3 min-w-[1.5rem]">{index + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Exercise List */}
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-800 sticky top-24">
              <CardHeader>
                <CardTitle className="text-yellow-500">{t("Exercise List")}</CardTitle>
                {workout.notes && (
                  <CardDescription className="text-gray-300 bg-gray-800 p-3 rounded-lg mt-3">
                    <strong className="text-yellow-500">{t("Notes")}:</strong>
                    <br />
                    {workout.notes}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {workout.exercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        index === currentExercise
                          ? "bg-yellow-500/20 border border-yellow-500/50"
                          : index < currentExercise
                            ? "bg-green-500/20 border border-green-500/50"
                            : "bg-gray-800 hover:bg-gray-700"
                      }`}
                      onClick={() => setCurrentExercise(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium truncate ${
                              index === currentExercise ? "text-yellow-500" : "text-white"
                            }`}
                          >
                            {exercise.name}
                          </p>
                          <p className="text-sm text-gray-400">{exercise.target}</p>
                          <p className="text-xs text-gray-500">
                            {exercise.sets || 3} {t("sets")} × {exercise.reps || 12} {t("reps")}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === currentExercise
                              ? "bg-yellow-500 text-black"
                              : index < currentExercise
                                ? "bg-green-500 text-white"
                                : "bg-gray-700 text-gray-400"
                          }`}
                        >
                          {index < currentExercise ? "✓" : index + 1}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
