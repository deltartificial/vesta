import type { Rule } from "../types";
import { noAsCasts } from "./bans/no-as-casts";
import { noBannedLibs } from "./bans/no-banned-libs";
import { noComments } from "./bans/no-comments";
import { noDefaultExport } from "./bans/no-default-export";
import { noDirectStorage } from "./bans/no-direct-storage";
import { noEagerPageImport } from "./bans/no-eager-page-import";
import { noHandlePrefix } from "./bans/no-handle-prefix";
import { noInlineHandlers } from "./bans/no-inline-handlers";
import { noInlineTypes } from "./bans/no-inline-types";
import { noJsonParse } from "./bans/no-json-parse";
import { noMagicColors } from "./bans/no-magic-colors";
import { noMultipleConditionals } from "./bans/no-multiple-conditionals";
import { noNativeDate } from "./bans/no-native-date";
import { noSetTimeoutInComponent } from "./bans/no-set-timeout-in-component";
import { noUntypedFetch } from "./bans/no-untyped-fetch";
import { noUseEffect } from "./bans/no-use-effect";
import { noWindowNavigation } from "./bans/no-window-navigation";
import { maxComponentSize } from "./limits/max-component-size";
import { maxImports } from "./limits/max-imports";
import { maxStoreSize } from "./limits/max-store-size";
import { maxUseState } from "./limits/max-use-state";
import { enforceHookLocation } from "./requires/enforce-hook-location";
import { enforceStoreSuffix } from "./requires/enforce-store-suffix";
import { noUnmemoizedComponents } from "./requires/no-unmemoized-components";
import { requireZodAtBoundary } from "./requires/require-zod-at-boundary";
import { useShallowRequired } from "./requires/use-shallow-required";

export const rules: Rule[] = [
  noAsCasts,
  noBannedLibs,
  noComments,
  noDefaultExport,
  noDirectStorage,
  noEagerPageImport,
  noHandlePrefix,
  noInlineHandlers,
  noInlineTypes,
  noJsonParse,
  noMagicColors,
  noMultipleConditionals,
  noNativeDate,
  noSetTimeoutInComponent,
  noUntypedFetch,
  noUseEffect,
  noWindowNavigation,
  noUnmemoizedComponents,
  useShallowRequired,
  enforceStoreSuffix,
  enforceHookLocation,
  requireZodAtBoundary,
  maxStoreSize,
  maxComponentSize,
  maxUseState,
  maxImports,
];
