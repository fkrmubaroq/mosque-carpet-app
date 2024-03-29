import cn from "classnames";

export default function ToggleSwitch({
  className,
  text,
  checked,
  onChange,
}) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center", className)}>
      <div className="relative">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={() => onChange(!checked)}
        />
        <div
          className={cn(
            "h-6 w-11",
            "bg-gray-200 peer-focus:outline-none",
            "rounded-full after:content-[''] ",
            "after:absolute after:left-[2px] after:top-[2px] after:border after:border-gray-300 after:bg-white ",
            "after:h-5 after:w-5 after:rounded-full after:transition-all",
            {
              "peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white":
                checked,
            }
          )}
        ></div>
      </div>
      <span className={cn("ml-3 text-sm", { "text-gray-400": !checked })}>{text}</span>
    </label>
  );
}
