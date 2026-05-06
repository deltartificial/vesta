import { join, sep } from "node:path";

export const STORE_DIR = join("src", "store") + sep;
export const HOOKS_DIR = join("src", "hooks") + sep;
export const COMPONENTS_DIR = join("src", "components") + sep;
export const COMPONENTS_UI_DIR = join("src", "components", "ui") + sep;
export const SERVICES_DIR = join("src", "services") + sep;
const PAGES_DIR = join("src", "pages") + sep;
export const APP_FILE = join("src", "app.tsx");

export const NATIVE_DATE_ALLOWED_DIRS = [join("src", "utils", "date") + sep];
export const FETCH_ALLOWED_DIRS = [SERVICES_DIR];
export const DEFAULT_EXPORT_ALLOWED_FILES = new Set<string>([APP_FILE]);
export const DEFAULT_EXPORT_ALLOWED_DIRS = [PAGES_DIR];

export const BANNED_LIBS = ["lodash", "moment", "dayjs", "axios", "underscore", "request"];
