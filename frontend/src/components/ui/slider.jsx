import * as React from "react";
import { cn } from "@/lib/utils";

/* Lightweight dual-thumb range slider */
const Slider = React.forwardRef(
  ({ className, min = 0, max = 100, step = 1, value = [0, 100], onValueChange, ...props }, ref) => {
    const handleChange = (index) => (e) => {
      const newValue = [...value];
      newValue[index] = Number(e.target.value);
      // Ensure min <= max
      if (index === 0 && newValue[0] > newValue[1]) newValue[0] = newValue[1];
      if (index === 1 && newValue[1] < newValue[0]) newValue[1] = newValue[0];
      onValueChange?.(newValue);
    };

    const pctLow = ((value[0] - min) / (max - min)) * 100;
    const pctHigh = ((value[1] - min) / (max - min)) * 100;

    return (
      <div ref={ref} className={cn("relative w-full h-6 flex items-center", className)} {...props}>
        {/* Track background */}
        <div className="absolute h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
        {/* Active range */}
        <div
          className="absolute h-2 rounded-full bg-indigo-500"
          style={{ left: `${pctLow}%`, width: `${pctHigh - pctLow}%` }}
        />
        {/* Thumb 1 */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleChange(0)}
          className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer"
        />
        {/* Thumb 2 */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={handleChange(1)}
          className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
