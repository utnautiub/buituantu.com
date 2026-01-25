import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NotFound({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-[calc(100svh-5.5rem)] flex-col items-center justify-center",
        className
      )}
    >
      <svg
        className="h-32 w-auto text-border"
        viewBox="0 0 192 192"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          fill="none"
        >
          <rect x="54.3333" y="12.75" width="33.3333" height="33.3333" />
          <rect x="87.6667" y="12.75" width="33.3333" height="33.3333" />
          <rect x="121" y="12.75" width="33.3333" height="33.3333" />
          <rect x="137.667" y="46.0833" width="33.3333" height="33.3333" />
          <rect x="121" y="71.0835" width="16.6667" height="16.6667" />
          <rect x="87.6667" y="87.75" width="16.6667" height="16.6667" />
          <rect x="104.333" y="87.75" width="16.6667" height="16.6667" />
          <rect x="121" y="87.75" width="16.6667" height="16.6667" />
          <rect x="121" y="104.417" width="16.6667" height="16.6667" />
          <rect x="137.667" y="112.75" width="33.3333" height="33.3333" />
          <rect x="87.6667" y="146.083" width="33.3333" height="33.3333" />
          <rect x="121" y="146.083" width="33.3333" height="33.3333" />
          <rect x="54.3333" y="146.083" width="33.3333" height="33.3333" />
        </g>
      </svg>

      <h1 className="my-6 text-8xl font-medium tracking-tighter tabular-nums">
        404
      </h1>

      <Button variant="default" asChild>
        <Link href="/">
          Go to Home
          <ArrowRightIcon />
        </Link>
      </Button>
    </div>
  );
}
