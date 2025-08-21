import fs from "fs";
import path from "path";

const root = process.cwd();
const SRC = path.join(root, "src");

// --- utils ---
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });

const read = (p) => fs.readFileSync(p, "utf8");
const write = (p, s) => fs.writeFileSync(p, s);

// --- transforms ---
const stripVersionSuffix = (code) =>
  code
    // from "pkg@x.y.z" => from "pkg"
    .replace(/(from\s+['"])([^'"]+?)@[0-9][^'"]*(['"])/g, "$1$2$3")
    // import "pkg@x.y.z" => import "pkg"
    .replace(/(import\s+['"])([^'"]+?)@[0-9][^'"]*(['"])/g, "$1$2$3");

const useFramerMotion = (code) => code.replaceAll("motion/react", "framer-motion");

// Fix DayPicker icon prop types in calendar.tsx
const fixCalendarTypes = (code) => {
  let out = code;

  // Ensure IconProps import exists (exactly once)
  if (!/IconProps/.test(out)) {
    out = out.replace(
      /from\s+["']react-day-picker["'];?/,
      `from "react-day-picker";
import type { IconProps } from "react-day-picker";`
    );
  }

  // Annotate IconLeft / IconRight props
  out = out
    .replace(
      /(IconLeft:\s*\()\{\s*className,\s*\.\.\.props\s*\}\s*\)(\s*=>)/g,
      `$1{ className, ...props }: IconProps)$2`
    )
    .replace(
      /(IconRight:\s*\()\{\s*className,\s*\.\.\.props\s*\}\s*\)(\s*=>)/g,
      `$1{ className, ...props }: IconProps)$2`
    );

  return out;
};

// Remove duplicate size="default" where props are spread in pagination.tsx
const fixPaginationSize = (code) => {
  let out = code;
  // If size="default" appears directly before {...props}, drop it.
  out = out.replace(/\s*size="default"\s*\n\s*\{\.\.\.props\}/g, `\n      {...props}`);
  // Also remove any remaining size="default" duplicates harmlessly
  out = out.replace(/\s*size="default"/g, "");
  return out;
};

// Add explicit type for event param in sidebar onClick
const fixSidebarOnClickType = (code) =>
  code.replace(
    /onClick=\{\(event\)\s*=>/g,
    "onClick={(event: React.MouseEvent) =>"
  );

// input-otp: safer optional chaining for slots[index]
const fixInputOtpSlotsAccess = (code) =>
  code.replace(
    /const\s*\{\s*char,\s*hasFakeCaret,\s*isActive\s*\}\s*=\s*inputOTPContext\?\.\s*slots\[\s*index\s*\]\s*\?\?\s*\{\s*\};/,
    `const { char, hasFakeCaret, isActive } = (inputOTPContext as any)?.slots?.[index] ?? {};`
  );

// --- run ---
if (!fs.existsSync(SRC)) {
  console.error(`src/ not found at ${SRC}`);
  process.exit(1);
}

const files = walk(SRC).filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"));

let patched = 0;

for (const f of files) {
  let code = read(f);
  let next = useFramerMotion(stripVersionSuffix(code));

  if (f.endsWith(`${path.sep}components${path.sep}ui${path.sep}calendar.tsx`)) {
    next = fixCalendarTypes(next);
  }

  if (f.endsWith(`${path.sep}components${path.sep}ui${path.sep}pagination.tsx`)) {
    next = fixPaginationSize(next);
  }

  if (f.endsWith(`${path.sep}components${path.sep}ui${path.sep}sidebar.tsx`)) {
    next = fixSidebarOnClickType(next);
  }

  if (f.endsWith(`${path.sep}components${path.sep}ui${path.sep}input-otp.tsx`)) {
    next = fixInputOtpSlotsAccess(next);
  }

  if (next !== code) {
    write(f, next);
    patched++;
  }
}

console.log(`Patched files: ${patched}`);