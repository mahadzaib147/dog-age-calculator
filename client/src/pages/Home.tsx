import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Dog, Bone, Calculator, ChevronDown, PawPrint } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBreeds, useCalculateDogAge } from "@/hooks/use-calculator";
import { ResultCard } from "@/components/ui/ResultCard";
import { Footer } from "@/components/Footer";

// Form Schema
const formSchema = z.object({
  breed: z.string().optional(),
  size: z.enum(["Small", "Medium", "Large", "Giant"]).optional(),
  age: z.string().min(1, "Please enter an age"),
}).refine(data => data.breed || data.size, {
  message: "Please select either a breed or a size",
  path: ["breed"]
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  // Queries & Mutations
  const { data: breeds, isLoading: isLoadingBreeds } = useBreeds();
  const calculateMutation = useCalculateDogAge();

  // Local State
  const [result, setResult] = useState<any>(null);
  const [showSizeFallback, setShowSizeFallback] = useState(false);

  // Form Setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      breed: "",
      age: "",
    },
  });

  // Handlers
  const onSubmit = (data: FormValues) => {
    calculateMutation.mutate(
      { breed: data.breed, size: data.size, dogAge: data.age },
      {
        onSuccess: (data) => {
          setResult(data);
          // Scroll to results on mobile smoothly
          setTimeout(() => {
            document
              .getElementById("results-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-paw-pattern relative overflow-hidden flex flex-col items-center">
      {/* Abstract Background Blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -right-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

      <main className="container max-w-4xl px-4 py-8 md:py-16 relative z-10 flex-1 w-full">
        {/* Header */}
        <header className="text-center mb-12">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="inline-flex items-center justify-center p-3 bg-[#E5CD6C] rounded-full shadow-lg mb-6 ring-4 ring-secondary/30"
          >
            <Dog className="w-10 h-10 text-[#2F1313]" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-[#2F1313] mb-4 drop-shadow-sm">
            Dog Age <span className="text-[#AE6427]">Calculator</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#8c6239]">
            Find Out Your Dog’s Age in Human Years Instantly
          </h2>
          <p className="text-lg md:text-xl text-[#2F1313]/80 font-medium max-w-2xl mx-auto">
            Easily calculate your dog’s age in human years based on breed or size and understand their life stage instantly.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Calculator Form */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-[#AE6427]" />
              <h2 className="text-2xl font-bold text-[#2F1313]">
                Enter Details
              </h2>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {!showSizeFallback ? (
                  <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="ml-1">
                          <h3 className="text-lg font-bold text-[#2F1313]/80">Breed</h3>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoadingBreeds}
                        >
                          <FormControl>
                            <SelectTrigger className="h-14 rounded-2xl bg-[#F9F3B9] border-2 border-[#E5CD6C]/50 focus:ring-4 focus:ring-[#AE6427]/10 hover:border-[#AE6427]/50 transition-all font-medium text-lg text-[#2F1313] hover-elevate">
                              <SelectValue placeholder="Search or select a breed" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px] rounded-xl border-2 border-[#E5CD6C] shadow-xl">
                            {breeds?.map((breed) => (
                              <SelectItem
                                key={breed}
                                value={breed}
                                className="focus:bg-[#E5CD6C]/20 cursor-pointer py-3 rounded-lg text-base"
                              >
                                {breed}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div 
                          className="text-sm text-[#AE6427] font-bold cursor-pointer hover:underline mt-2 ml-1 flex items-center gap-1"
                          onClick={() => {
                            setShowSizeFallback(true);
                            form.setValue("breed", "");
                          }}
                        >
                          <PawPrint className="w-4 h-4" />
                          Breed not in list? Click here
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="ml-1">
                          <h3 className="text-lg font-bold text-[#2F1313]/80">Dog Size</h3>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-14 rounded-2xl bg-[#F9F3B9] border-2 border-[#E5CD6C]/50 focus:ring-4 focus:ring-[#AE6427]/10 hover:border-[#AE6427]/50 transition-all font-medium text-lg text-[#2F1313] hover-elevate">
                              <SelectValue placeholder="Select size category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-2 border-[#E5CD6C] shadow-xl">
                            {["Small", "Medium", "Large", "Giant"].map((size) => (
                              <SelectItem
                                key={size}
                                value={size}
                                className="focus:bg-[#E5CD6C]/20 cursor-pointer py-3 rounded-lg text-base"
                              >
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div 
                          className="text-xs text-[#AE6427] cursor-pointer hover:underline mt-1 ml-1"
                          onClick={() => {
                            setShowSizeFallback(false);
                            form.setValue("size", undefined);
                          }}
                        >
                          Back to breed list
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="ml-1">
                        <h3 className="text-lg font-bold text-[#2F1313]/80">Age (Years.Months)</h3>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="e.g. 3.6"
                            className="h-14 pl-4 pr-12 rounded-2xl bg-[#F9F3B9] border-2 border-[#E5CD6C]/50 focus:ring-4 focus:ring-[#AE6427]/10 hover:border-[#AE6427]/50 transition-all font-medium text-lg text-[#2F1313]"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              // Allow digits and single decimal point
                              const val = e.target.value.replace(/[^0-9.]/g, "");
                              if (val.split(".").length <= 2) {
                                field.onChange(val);
                              }
                            }}
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2F1313]/60 font-bold text-sm pointer-events-none">
                            AGE
                          </div>
                        </div>
                      </FormControl>
                      <div className="text-[10px] text-[#AE6427] font-bold mt-1 ml-1 flex items-center gap-1 bg-[#E5CD6C]/10 p-2 rounded-lg border border-[#E5CD6C]/20">
                        <PawPrint className="w-3 h-3" />
                        <span>Example: <strong>3.6</strong> = 3 Years, 6 Months (An estimated age is fine)</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={calculateMutation.isPending}
                  className="w-full h-14 rounded-2xl text-lg font-bold bg-[#AE6427] hover:bg-[#AE6427]/90 text-white shadow-lg shadow-[#AE6427]/25 mt-2 active-elevate-2 transition-all"
                >
                  {calculateMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <PawPrint className="w-5 h-5 animate-bounce" />
                      Calculating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Bone className="w-5 h-5 fill-current" />
                      Calculate Age
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>

          {/* Results Area */}
          <div id="results-section" className="relative">
            <AnimatePresence mode="wait">
              {result ? (
                <ResultCard key="result" result={result} />
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                >
                  <div className="w-48 h-48 mb-6 relative group">
                    <div className="absolute inset-0 bg-secondary/20 rounded-full blur-2xl group-hover:bg-secondary/30 transition-all duration-500" />
                    {/* Unsplash dog image */}
                    {/* cute dog portrait happy */}
                    <img
                      src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=80"
                      alt="Waiting for calculation"
                      className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg relative z-10 transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Ready to Calculate?
                  </h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    Select your breed and enter an age to see the magic happen!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
