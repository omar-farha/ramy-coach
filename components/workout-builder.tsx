"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X, Play, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/use-language";

// Update the Exercise interface to include sets and reps
interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  target: string;
  instructions: string[];
  sets?: number;
  reps?: number;
}

interface WorkoutPlan {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: string;
  clientName?: string;
  notes?: string;
}

interface WorkoutBuilderProps {
  onSave: (plan: WorkoutPlan) => void;
  onCancel: () => void;
}

export default function WorkoutBuilder({
  onSave,
  onCancel,
}: WorkoutBuilderProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bodyPart, setBodyPart] = useState("all");
  const [loading, setLoading] = useState(false);
  const [workoutName, setWorkoutName] = useState("");
  const [clientName, setClientName] = useState("");
  const [notes, setNotes] = useState("");
  const { t } = useLanguage();

  const bodyParts = [
    "all",
    "back",
    "cardio",
    "chest",
    "lower arms",
    "lower legs",
    "neck",
    "shoulders",
    "upper arms",
    "upper legs",
    "waist",
  ];

  useEffect(() => {
    fetchExercises();
  }, [bodyPart]);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const url =
        bodyPart === "all"
          ? "https://exercisedb.p.rapidapi.com/exercises?limit=1300"
          : `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}?limit=50`;

      const response = await fetch(url, {
        headers: {
          "X-RapidAPI-Key":
            "92a161c08cmsh5d5639f4edcf728p1a1323jsn69728589e687",
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExercises(data);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // In the addExercise function, add default sets and reps
  const addExercise = (exercise: Exercise) => {
    if (!selectedExercises.find((e) => e.id === exercise.id)) {
      setSelectedExercises([
        ...selectedExercises,
        { ...exercise, sets: 3, reps: 12 },
      ]);
    }
  };

  // Add updateExercise function after addExercise
  const updateExercise = (exerciseId: string, sets: number, reps: number) => {
    setSelectedExercises((prev) =>
      prev.map((ex) => (ex.id === exerciseId ? { ...ex, sets, reps } : ex))
    );
  };

  const removeExercise = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter((e) => e.id !== exerciseId));
  };

  const saveWorkout = () => {
    if (!workoutName.trim() || selectedExercises.length === 0) return;

    const workout: WorkoutPlan = {
      id: Date.now().toString(),
      name: workoutName,
      exercises: selectedExercises,
      createdAt: new Date().toISOString(),
      clientName: clientName.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    onSave(workout);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-yellow-500/20 bg-black/50 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("Back")}
            </Button>
            <h1 className="text-xl font-bold text-yellow-500">
              {t("Create Workout Plan")}
            </h1>
          </div>

          <Button
            onClick={saveWorkout}
            disabled={!workoutName.trim() || selectedExercises.length === 0}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
          >
            <Send className="w-4 h-4 mr-2" />
            {t("Save Workout")}
          </Button>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workout Details */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-1"
          >
            <Card className="bg-gray-900 border-gray-800 sticky top-24 max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col">
              <CardHeader>
                <CardTitle className="text-yellow-500">
                  {t("Workout Details")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 overflow-y-auto">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    {t("Workout Name")} *
                  </label>
                  <Input
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    placeholder={t("Enter workout name")}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    {t("Client Name")}
                  </label>
                  <Input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder={t("Enter client name")}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    {t("Notes")}
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("Add workout notes or instructions")}
                    className="bg-gray-800 border-gray-700 text-white"
                    rows={3}
                  />
                </div>

                {/* Selected Exercises */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">
                    {t("Selected Exercises")} ({selectedExercises.length})
                  </h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-800">
                    <AnimatePresence>
                      {selectedExercises.map((exercise, index) => (
                        <motion.div
                          key={exercise.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -20, opacity: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-3 bg-gray-800 rounded-lg space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {exercise.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {exercise.target}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExercise(exercise.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Sets and Reps Controls */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-gray-400">
                                {t("Sets")}:
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={exercise.sets || 3}
                                onChange={(e) =>
                                  updateExercise(
                                    exercise.id,
                                    Number.parseInt(e.target.value) || 3,
                                    exercise.reps || 12
                                  )
                                }
                                className="w-12 h-8 bg-gray-700 border border-gray-600 rounded text-white text-center text-sm"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-gray-400">
                                {t("Reps")}:
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="50"
                                value={exercise.reps || 12}
                                onChange={(e) =>
                                  updateExercise(
                                    exercise.id,
                                    exercise.sets || 3,
                                    Number.parseInt(e.target.value) || 12
                                  )
                                }
                                className="w-12 h-8 bg-gray-700 border border-gray-600 rounded text-white text-center text-sm"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Exercise Selection */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-2"
          >
            {/* Filters */}
            <Card className="bg-gray-900 border-gray-800 mb-6">
              <CardHeader>
                <CardTitle className="text-yellow-500">
                  {t("Find Exercises")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t("Search exercises...")}
                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  <select
                    value={bodyPart}
                    onChange={(e) => setBodyPart(e.target.value)}
                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  >
                    {bodyParts.map((part) => (
                      <option key={part} value={part}>
                        {part === "all"
                          ? t("All Body Parts")
                          : part.charAt(0).toUpperCase() + part.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Exercise Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {filteredExercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="bg-gray-900 border-gray-800 hover:border-yellow-500/50 transition-colors">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-white text-base leading-tight">
                                {exercise.name}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                <Badge
                                  variant="secondary"
                                  className="bg-yellow-500/20 text-yellow-500 text-xs"
                                >
                                  {exercise.target}
                                </Badge>
                                <span className="text-gray-400 text-xs ml-2">
                                  {exercise.equipment}
                                </span>
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="relative mb-4 bg-gray-800 rounded-lg overflow-hidden">
                            <img
                              src={exercise.gifUrl || "/placeholder.svg"}
                              alt={exercise.name}
                              className="w-full h-32 object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Play className="w-8 h-8 text-white" />
                            </div>
                          </div>

                          <Button
                            onClick={() => addExercise(exercise)}
                            disabled={selectedExercises.some(
                              (e) => e.id === exercise.id
                            )}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold disabled:bg-gray-700 disabled:text-gray-400"
                          >
                            {selectedExercises.some(
                              (e) => e.id === exercise.id
                            ) ? (
                              t("Added")
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-2" />
                                {t("Add Exercise")}
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
