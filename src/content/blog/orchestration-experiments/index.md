---                                                                                                                   
title: 'Orchestration Experiments'
description: "Lessons learned after building a local agent orchestrator and a cloud agent orchestrator"
pubDate: 'June 10, 2026'                                    
---

Over the past few months I've been building agent orchestrators to automate aspects of the software development lifecycle. I wrote a local agent orchestrator and a cloud agent orchestrator and learned some important lessons:

- Treat the model as a commodity
- Leverage state-of-the-art models for planning, and simple fast models for execution.
- Software development agents need to scale, and therefore should run in the cloud.

## Treat the Model as a Commodity

My local orchestrator used my Anthropic subscription for its agents. I discovered my agents had all stopped running one morning, and it was due to Anthropic locking out subscription access for anything but their own harness. Even after people complied to the new rules they continued to lock out non-interactive terminal use, then unlocked it, then locked it for certain usage. They thrashed their users.

Previous to the subscription lockdown, I experienced outages anytime that Claude went down. Which happened frequently.

This led me to my first rule: treat the model as a commodity. Do not couple your system to a single model provider; they should be swappable.

## SOTA for planning, cheap and fast for execution

I cancelled my Claude accound and opened an AWS Bedrock account so that I could try many different open models. This exposed me to the true, unsubsidized cost of inference. I quickly realized that I couldn't use a SOTA model for every task; it would cost me $100 / hour.

Instead I used the more advanced models for highly detailed planning, then had them pass the plans off to a cheap and fast model.  It worked fairly well; however the resulting code works but isn't quite as good as having the advanced models write it themselves. There would be poor code re-use, strange abstractions, and just generally sloppy code.  But- I saved a significant amount of money! 

## SDLC Agents Must be Cloud-native

When running my local agent orchestrator in a VPS, I noticed that it crashed frequently. I was running:

1. A SOTA planning agent that I could plan with via Github issues.
2. Two cheap and fast dev agents that would pull in issues that were ready and implement them.
3. A reviewer agent to fix any broken PRs.
4. An E2E test agent that would periodically run the e2e tests and fix any issues.

I realized that testing was quite heavy; the VPS would crash when running several test suites at once. I deployed it to a bigger box, but now I simply moved the goalposts and was paying for compute when I didn't need it.

Agents should scale via the cloud so that I could use as much or as little as I needed without worrying about costs or crashing.
