/**
 * @license
 * Copyright (c) 2025 Daniele Rodrigues dos Santos
 * MIT License
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
