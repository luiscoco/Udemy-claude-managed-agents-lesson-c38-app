import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 38,
  title: "Plans, Task Boards and Completion Gates",
  description: "Imagine a three-step assignment: collect observations, generate a report, and review the result. An agent can write an attractive checklist, but the host still needs to know which tasks actually passed their checks.",
  concepts: ["Dependency-aware task transitions", "Compare-and-set board version", "Completion needs independently bound evidence"],
  scope: "Runs a local task-board completion gate with a seeded verifier record. It is not a distributed durable task board. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "Complete a verified task", "input": {"expectedVersion": 3, "dependencyComplete": true, "artifact": "reviewed code"}, "expected": "passed", "checks": {"version": 4}}, {"id": "1", "label": "Reject a stale board update", "input": {"expectedVersion": 2, "dependencyComplete": true, "artifact": "reviewed code"}, "expected": "conflict", "checks": {"version": 3}}, {"id": "2", "label": "Block on dependencies", "input": {"expectedVersion": 3, "dependencyComplete": false, "artifact": "reviewed code"}, "expected": "paused", "checks": {"version": 3}}, {"id": "3", "label": "Reject stale artifact evidence", "input": {"expectedVersion": 3, "dependencyComplete": true, "artifact": "changed code"}, "expected": "rejected", "checks": {"version": 3}}],
  async run(input) {

if(number(input,"expectedVersion")!==3)return report("conflict","Board version changed",{version:3},["Compare the expected board revision"]);
if(!flag(input,"dependencyComplete"))return report("paused","A required predecessor is not completed",{version:3},["Check dependencies before completion"]);
const artifactHash=hash(text(input,"artifact")),verifiedHash=hash("reviewed code");
if(artifactHash!==verifiedHash)return report("rejected","Evidence refers to different artifact bytes",{version:3},["Bind trusted verifier evidence to the current artifact"]);
return report("passed","Completed the active task with matching evidence",{version:4,status:"completed",artifactHash,evidenceId:"proof-demo-1"},["Check board revision","Check dependency closure","Check verifier artifact binding","Atomically advance the local board"]);

  }
};
