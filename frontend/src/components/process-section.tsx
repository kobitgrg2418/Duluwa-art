"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ProcessStep } from "@/types";
import { Droplet, Layers, Sparkles, Brush } from "lucide-react";

interface ProcessSectionProps {
  steps: ProcessStep[];
}

const icons = [Droplet, Layers, Sparkles, Brush];

export function ProcessSection({ steps }: ProcessSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      const stepIndex = Math.floor(latest * steps.length);
      const clampedIndex = Math.min(Math.max(stepIndex, 0), steps.length - 1);
      setActiveStep(clampedIndex);
    });

    return () => unsubscribe();
  }, [scrollYProgress, steps.length]);

  if (!steps.length) return null;

  return (
    <section 
      className="py-32 lg:py-48 bg-gradient-to-b from-background to-muted/10" 
      id="process" 
      ref={containerRef}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-32"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium mb-4 text-foreground">
            Four Steps to Light
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            How we turn your vision into a masterpiece watercolour painting.
          </p>
        </motion.div>

        {/* Steps with Connecting Lines */}
        <div className="space-y-32 md:space-y-40">
          {steps.map((step, index) => {
            const Icon = icons[index];
            const isActive = activeStep >= index;
            const isCurrentActive = activeStep === index;
            const isLeft = index % 2 === 0;

            return (
              <div key={step.no} className="relative">
                {/* Step Content */}
                <motion.div
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`flex items-center gap-8 ${
                    isLeft ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Step Number Box */}
                  <motion.div
                    className="flex-shrink-0"
                    animate={isCurrentActive ? {
                      scale: [1, 1.05, 1],
                    } : {}}
                    transition={{ duration: 2, repeat: isCurrentActive ? Infinity : 0 }}
                  >
                    <div className={`p-6 border-2 rounded-2xl transition-all duration-700 bg-background shadow-lg ${
                      isActive ? 'border-foreground' : 'border-muted'
                    }`}>
                      <div className="text-center">
                        <div className={`text-2xl font-bold mb-1 transition-colors duration-500 ${
                          isActive ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          STEP {step.no}
                        </div>
                        <div className={`text-xs uppercase tracking-wider transition-colors duration-500 ${
                          isActive ? 'text-muted-foreground' : 'text-muted-foreground/60'
                        }`}>
                          {index === 0 ? 'IDEA' : index === 1 ? 'DRAFT' : index === 2 ? 'CREATE' : 'FINISH'}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Content Box */}
                  <motion.div
                    className="flex-1 max-w-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <div className={`p-8 border-2 rounded-2xl bg-background shadow-lg transition-all duration-700 ${
                      isActive ? 'border-muted' : 'border-muted/50'
                    }`}>
                      <motion.h3 
                        className={`text-2xl md:text-3xl font-bold mb-4 transition-all duration-700 ${
                          isCurrentActive 
                            ? 'text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text' 
                            : isActive ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {step.title}
                      </motion.h3>
                      
                      <p className={`text-base leading-relaxed transition-colors duration-500 ${
                        isActive ? 'text-muted-foreground' : 'text-muted-foreground/60'
                      }`}>
                        {step.text}
                      </p>
                    </div>
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    className="flex-shrink-0"
                    animate={isCurrentActive ? {
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{ duration: 3, repeat: isCurrentActive ? Infinity : 0 }}
                  >
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-lg ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="h-10 w-10" />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Connecting Line to Next Step */}
                {index < steps.length - 1 && (
                  <div className="relative flex justify-center mt-16">
                    <svg
                      width="400"
                      height="100"
                      viewBox="0 0 400 100"
                      className="text-muted-foreground/30"
                    >
                      {/* Background path */}
                      <motion.path
                        d={isLeft 
                          ? "M50 20 Q200 10 350 80" 
                          : "M350 20 Q200 10 50 80"
                        }
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="4 8"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                      
                      {/* Active progress path */}
                      {activeStep > index && (
                        <motion.path
                          d={isLeft 
                            ? "M50 20 Q200 10 350 80" 
                            : "M350 20 Q200 10 50 80"
                          }
                          stroke="url(#lineGradient)"
                          strokeWidth="3"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1 }}
                        />
                      )}

                      {/* Traveling orb */}
                      {activeStep > index && (
                        <motion.circle
                          r="6"
                          fill="url(#orbGradient)"
                          className="drop-shadow-lg"
                          initial={{ offsetDistance: "0%" }}
                          animate={{ offsetDistance: "100%" }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                          style={{
                            offsetPath: `path('${isLeft 
                              ? "M50 20 Q200 10 350 80" 
                              : "M350 20 Q200 10 50 80"}')`
                          }}
                        />
                      )}

                      {/* Connection point dot */}
                      <circle
                        cx={isLeft ? "350" : "50"}
                        cy={isLeft ? "80" : "80"}
                        r="4"
                        className={`transition-colors duration-500 ${
                          activeStep > index ? 'fill-blue-500' : 'fill-muted-foreground/40'
                        }`}
                      />

                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgb(59, 130, 246)" />
                          <stop offset="100%" stopColor="rgb(147, 51, 234)" />
                        </linearGradient>
                        
                        <radialGradient id="orbGradient" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="rgb(255, 255, 255)" />
                          <stop offset="70%" stopColor="rgb(59, 130, 246)" />
                          <stop offset="100%" stopColor="rgb(147, 51, 234)" />
                        </radialGradient>
                      </defs>
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Closing Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <div className="max-w-xl mx-auto p-8 border border-muted rounded-3xl bg-background/80 backdrop-blur-sm">
            <p className="text-lg italic text-muted-foreground leading-relaxed">
              &ldquo;Patience, precision, and knowing when to stop&rdquo;
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
