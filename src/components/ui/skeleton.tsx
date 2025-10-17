/**
 * @license
 * Copyright (c) 2025 Daniele Rodrigues dos Santos
 * MIT License
 */

import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export { Skeleton };
