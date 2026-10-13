import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // This codebase's entire data-fetching convention since lot 0 — every
      // `use*Page` hook fetches on mount via `useEffect(() => { void load(); }, [load])`
      // and sets state once the request resolves — is exactly what this
      // React Compiler rule flags, regardless of where the `await` sits.
      // Satisfying it would mean moving the whole app onto Suspense/`use()`
      // or a data-fetching library, which is a project-wide architecture
      // change, not a lint fix. Disabled here rather than peppering every
      // hook with a per-line disable comment.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
