import React from "react";

import { EDUCATION } from "../../data/education";
import { Panel, PanelHeader, PanelTitle } from "../panel";
import { EducationItem } from "./education-item";

export function Education() {
  return (
    <Panel id="education">
      <PanelHeader>
        <PanelTitle>Education</PanelTitle>
      </PanelHeader>

      <div className="pr-2 pl-4">
        {EDUCATION.map((education) => (
          <EducationItem key={education.id} education={education} />
        ))}
      </div>
    </Panel>
  );
}
