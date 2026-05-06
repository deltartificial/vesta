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
import { bundleAnalyzablePaths } from "./perf/bundle/analyzable-paths";
import { bundleBarrelImports } from "./perf/bundle/barrel-imports";
import { bundleDeferThirdParty } from "./perf/bundle/defer-third-party";
import { bundleDynamicImports } from "./perf/bundle/dynamic-imports";
import { passiveEventListeners } from "./perf/client/passive-event-listeners";
import { combineIterations } from "./perf/js/combine-iterations";
import { flatmapFilter } from "./perf/js/flatmap-filter";
import { hoistRegexp } from "./perf/js/hoist-regexp";
import { minMaxLoop } from "./perf/js/min-max-loop";
import { toSortedImmutable } from "./perf/js/tosorted-immutable";
import { animateSvgWrapper } from "./perf/rendering/animate-svg-wrapper";
import { hydrationSuppressWarning } from "./perf/rendering/hydration-suppress-warning";
import { scriptDeferAsync } from "./perf/rendering/script-defer-async";
import { svgPrecision } from "./perf/rendering/svg-precision";
import { useTransitionLoading } from "./perf/rendering/usetransition-loading";
import { lazyStateInit } from "./perf/rerender/lazy-state-init";
import { memoDefaultValue } from "./perf/rerender/memo-default-value";
import { noInlineComponents } from "./perf/rerender/no-inline-components";
import { simpleExpressionInMemo } from "./perf/rerender/simple-expression-in-memo";
import { rerenderTransitions } from "./perf/rerender/transitions";
import { useRefTransient } from "./perf/rerender/use-ref-transient";
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

  bundleBarrelImports,
  bundleAnalyzablePaths,
  bundleDeferThirdParty,
  bundleDynamicImports,
  passiveEventListeners,
  combineIterations,
  flatmapFilter,
  hoistRegexp,
  minMaxLoop,
  toSortedImmutable,
  animateSvgWrapper,
  hydrationSuppressWarning,
  scriptDeferAsync,
  svgPrecision,
  useTransitionLoading,
  lazyStateInit,
  memoDefaultValue,
  noInlineComponents,
  simpleExpressionInMemo,
  rerenderTransitions,
  useRefTransient,
];
