import { GraduationCapIcon, InfinityIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

import { Markdown } from "@/components/markdown";
import {
  CollapsibleChevronsIcon,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleWithContext,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Tag } from "@/components/ui/tag";
import { ProseMono } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

import type { Education } from "../../types/education";

export function EducationItem({ education }: { education: Education }) {
  const { start, end } = education.period;
  const isOngoing = !end;

  return (
    <div className="screen-line-after space-y-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex size-6 shrink-0 items-center justify-center select-none">
          {education.institutionLogo ? (
            <Image
              src={education.institutionLogo}
              alt={education.institutionName}
              width={24}
              height={24}
              quality={100}
              className="rounded-full"
              unoptimized
              aria-hidden
            />
          ) : (
            <GraduationCapIcon className="size-5 text-zinc-400 dark:text-zinc-500" />
          )}
        </div>

        <h3 className="text-lg leading-snug font-medium">
          {education.institutionName}
        </h3>

        {education.isCurrent && (
          <span className="relative flex items-center justify-center">
            <span className="absolute inline-flex size-3 animate-ping rounded-full bg-info opacity-50" />
            <span className="relative inline-flex size-2 rounded-full bg-info" />
            <span className="sr-only">Current Education</span>
          </span>
        )}
      </div>

      <div className="relative space-y-4 before:absolute before:left-3 before:h-full before:w-px before:bg-border">
        <CollapsibleWithContext defaultOpen={education.isExpanded} asChild>
          <div className="relative last:before:absolute last:before:h-full last:before:w-4 last:before:bg-background">
            <CollapsibleTrigger
              className={cn(
                "block w-full text-left",
                "relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:-z-1 before:rounded-lg before:transition-[background-color] before:ease-out hover:before:bg-accent2"
              )}
            >
              <div className="relative z-1 mb-1 flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-lg",
                    "bg-muted text-muted-foreground",
                    "border border-muted-foreground/15 ring-1 ring-edge ring-offset-1 ring-offset-background"
                  )}
                  aria-hidden
                >
                  <GraduationCapIcon className="size-4" />
                </div>

                <h4 className="flex-1 font-medium text-balance">
                  {education.degree} - {education.major}
                </h4>

                <div
                  className="shrink-0 text-muted-foreground [&_svg]:size-4"
                  aria-hidden
                >
                  <CollapsibleChevronsIcon />
                </div>
              </div>

              <div className="flex items-center gap-2 pl-9 text-sm text-muted-foreground">
                {education.grade && (
                  <>
                    <dl>
                      <dt className="sr-only">Grade</dt>
                      <dd>{education.grade}</dd>
                    </dl>

                    <Separator
                      className="data-[orientation=vertical]:h-4"
                      orientation="vertical"
                    />
                  </>
                )}

                <dl>
                  <dt className="sr-only">Period</dt>
                  <dd className="flex items-center gap-0.5">
                    <span>{start}</span>
                    <span className="font-mono">—</span>
                    {isOngoing ? (
                      <>
                        <InfinityIcon
                          className="size-4.5 translate-y-[0.5px]"
                          aria-hidden
                        />
                        <span className="sr-only">Present</span>
                      </>
                    ) : (
                      <span>{end}</span>
                    )}
                  </dd>
                </dl>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="overflow-hidden duration-300 data-[state=closed]:animate-collapsible-fade-up data-[state=open]:animate-collapsible-fade-down">
              {education.description && (
                <ProseMono className="pt-2 pl-9">
                  <Markdown>{education.description}</Markdown>
                </ProseMono>
              )}
            </CollapsibleContent>

            {Array.isArray(education.skills) && education.skills.length > 0 && (
              <ul className="flex flex-wrap gap-1.5 pt-3 pl-9">
                {education.skills.map((skill, index) => (
                  <li key={index} className="flex">
                    <Tag>{skill}</Tag>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CollapsibleWithContext>
      </div>
    </div>
  );
}
