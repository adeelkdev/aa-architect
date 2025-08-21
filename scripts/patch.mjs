import fs from "fs";
import path from "path";

const root = process.cwd();
const SRC = path.join(root, "src");

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });

const tsFiles = walk(SRC).filter(f => f.endsWith(".ts") || f.endsWith(".tsx"));

const stripVersion = (code) =>
  code
    .replace(/(from\s+["'])([^"']+?)@[0-9][^"']*(["'])/g, "$1$2$3")
    .replace(/(import\s+["'])([^"']+?)@[0-9][^"']*(["'])/g, "$1$2$3");

const useFramer = (code) => code.replaceAll("motion/react", "framer-motion");

let changed = 0;

for (const f of tsFiles) {
  const old = fs.readFileSync(f, "utf8");
  let next = useFramer(stripVersion(old));

  // calendar.tsx typing for DayPicker icons
  if (f.endsWith("components/ui/calendar.tsx")) {
    if (!/IconProps/.test(next)) {
      next = next.replace(
        /from "react-day-picker";/,
        'from "react-day-picker";from "react-day-pt-day-picker";'
      );
    }
    next = next
      .replace(/(IconLeft:\s*\()\{\s*className,\s*\.\.\.props\s*\}\s*\)(\s*=>)/, "$1{ className, ...props }: IconProps)$2")
      .replace(/(IconRight:\s*\()\{\s*className,\s*\.\.\.props\s*\}\s*\)(\s*=>)/, "$1{ className, ...props }: IconProps)      .replace(/(IconRight:\s*\()\{\s*className,\s*\.\.\.props\s*\}\s*\)(\nents/ui/pagination.tsx")) {
    next = next
    next = next
(IconRight:\s*\()\{\s*className,\s*\.\.\.prop\n      {...props}")
      .replace(/\s*size="default"/g, "");
  }

  // sideba  // sideba  // sideba  // sideba  // sideba  // sideba  // sideba  // sid {
    next = next.replace(
      /onClick=\{\(event\)\s*=>/g,
      "onClick={(event: React.MouseEvent) =>"
    );
  }

  // input-otp.tsx: optional chain + any for slots access
  if (f.endsWith("components/ui/input-otp.tsx")) {
    next = next.replace(
      /const \{ char, hasFakeCaret, isActive \} = inputOTPContext\?\.slots\[index\] \?\? \{\};/,
      'const { char, hasFakeCaret, isActive } = (inputOTPContext as any)?.slots?.[index] ?? {};'
    );
  }

  if (next !== old) {
    fs.writeFileSync(f, next);
    changed++;
  }
}

console.log(`Patched files: ${changed}`);
