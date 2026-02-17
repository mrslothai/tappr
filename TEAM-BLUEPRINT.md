# 🦥 Team Sloth — AI Agent Team Blueprint

> **For:** Rajesh Chityal  
> **By:** Sloth (Team Lead)  
> **Date:** Feb 13, 2026  
> **Status:** Ready for review

---

## 📚 Reference: OpenClaw Ebook Insights

I read the full "OpenClaw: What People Are Actually Doing With It" ebook you shared. Key takeaways relevant to us:

1. **"John Wick" pattern** — Someone created an agent to hit $20K MRR. The agent *built its own team* using sub-agents. This is exactly what we're building.
2. **CEO Dashboard Mode** — Multi-agent dashboards for business oversight. We can build this for your 1M ARR goal.
3. **Content & Marketing automation** — Video production pipelines, brand voice consistency, YouTube analytics. All doable.
4. **Morning Briefings** — Automated daily intelligence (weather, calendar, social trends). Easy win.
5. **Mobile Development** — Build features from your phone via Telegram. You're already doing this!
6. **The ebook confirms:** Sub-agents + conversational delegation is the proven pattern. We're on the right track.

---

## 📋 Executive Summary

You want a **permanent AI team** where you give tasks to me (Sloth), and I manage specialist agents to complete the work. You get results, not busy work.

This blueprint covers:
1. **Architecture** — How the team is structured
2. **Team Members** — Who does what, which model, why
3. **Workflow** — How tasks flow from you → me → specialists → results
4. **Configuration** — Exact config changes needed
5. **Setup Steps** — Step-by-step implementation guide
6. **Cost Analysis** — What this will cost you
7. **Examples** — Real task delegation scenarios

---

## 🏗️ Architecture: Sub-Agents (Not Multi-Agent)

There are **two ways** to build an AI team in OpenClaw:

| Approach | What it is | Best for |
|---|---|---|
| **Multi-Agent** | Separate bots with separate Telegram accounts, separate workspaces | Multiple people sharing one server, completely isolated personas |
| **Sub-Agent** | One bot (Sloth), spawns background workers for specific tasks | One person's team, managed by a team lead |

### ✅ We're going with: **Sub-Agent Architecture**

**Why:**
- **Single interface** — You only talk to me (Sloth) on Telegram. No switching bots.
- **I manage everything** — I break down tasks, assign the right specialist, review results.
- **Cost efficient** — I use Opus (expensive but smart) for strategy/oversight. Specialists use cheaper models for grunt work.
- **Parallel execution** — Up to 8 sub-agents can work simultaneously.
- **No setup complexity** — No extra Telegram bots, no extra workspaces, no bindings.
- **Results come to you** — Sub-agents announce their results right in our chat.

### How Sub-Agents Work (Simple Version)

```
You → Message Sloth (Telegram)
         ↓
    Sloth (Opus) analyzes task
         ↓
    Spawns specialist sub-agent(s)
         ↓
    Sub-agents work in background (you can keep chatting with me)
         ↓
    Results announced back to our chat
         ↓
    Sloth reviews & delivers final output to you
```

---

## 👥 The Team

### 🦥 Sloth — Team Lead (YOU TALK TO ME)
- **Model:** Claude Opus 4.6 (smartest, best reasoning)
- **Role:** Strategy, task breakdown, delegation, quality review, direct conversation
- **When active:** Always — I'm your main interface
- **Tools:** Full access (browser, exec, files, cron, everything)
- **Cost:** ~$15/M input, $75/M output tokens

### 💻 Coder — Dev Specialist
- **Model:** Kimi K2.5 (fast, coding-optimized, cheapest)
- **Role:** Write code, debug, implement features, refactor
- **Tasks:** CaptionCraft features, new project scaffolding, bug fixes, API integrations
- **Strengths:** Fast iteration, large codebase understanding, multi-file edits
- **Cost:** Very low (Kimi pricing)

### 🎬 Creator — Content Specialist
- **Model:** Claude Sonnet 4.5 (great creative + fast)
- **Role:** Reel scripts (Hinglish), video prompts, content calendars, captions
- **Tasks:** Instagram content, Runway/Kling prompts, hook writing, caption optimization
- **Strengths:** Creative writing, audience understanding, viral content patterns
- **Cost:** ~$3/M input, $15/M output tokens

### 🔍 Researcher — Research Specialist
- **Model:** Claude Sonnet 4.5 (good reasoning + web access)
- **Role:** Market research, idea validation, competitor analysis, tool discovery
- **Tasks:** "Is this idea worth building?", "What tools exist for X?", "How big is this market?"
- **Strengths:** Web search, data synthesis, structured analysis
- **Cost:** ~$3/M input, $15/M output tokens

### 📈 Strategist — Business/Growth Specialist
- **Model:** Claude Sonnet 4.5
- **Role:** Pricing strategy, growth plans, monetization, funnel design
- **Tasks:** Instagram growth, lead generation, service packaging, competitive positioning
- **Strengths:** Business frameworks, marketing psychology, number crunching
- **Cost:** ~$3/M input, $15/M output tokens

---

## 🔄 Task Workflow

### Simple Task (Single Specialist)
```
Rajesh: "Write me a reel script about wedding videos"
  ↓
Sloth: Identifies → Content task → Spawns Creator
  ↓
Creator: Writes Hinglish reel script with hooks, CTA
  ↓  (announces result)
Sloth: Reviews, adds any tweaks → Sends to Rajesh
```

### Complex Task (Multiple Specialists)
```
Rajesh: "I want to launch a new SaaS product for wedding planners"
  ↓
Sloth: Breaks down into parallel tasks:
  ├─ Researcher: Market size, competitors, pricing benchmarks
  ├─ Strategist: Business model, pricing tiers, go-to-market
  └─ Coder: Technical feasibility, stack recommendations
  ↓  (all announce results)
Sloth: Synthesizes everything → Delivers unified plan to Rajesh
```

### Coding Task
```
Rajesh: "Add Hindi subtitle support to CaptionCraft"
  ↓
Sloth: Identifies → Coding task → Spawns Coder with context:
  - Current codebase structure
  - Sarvam API details
  - Technical requirements
  ↓
Coder: Implements feature, tests, commits
  ↓  (announces result)
Sloth: Reviews code quality → Reports to Rajesh
```

---

## ⚙️ Configuration

### Current Config (What You Have)
- 1 main agent (Sloth) on Telegram
- Default model: Kimi K2.5
- Session model override: Opus 4.6
- Sub-agents: default config (max 8 concurrent)

### Proposed Config Changes

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-opus-4-6"  // Sloth stays on Opus
      },
      subagents: {
        model: "anthropic/claude-sonnet-4-5",  // Default sub-agent model
        thinking: "low",                        // Light reasoning for speed
        maxConcurrent: 8,                       // Up to 8 parallel agents
        archiveAfterMinutes: 120,               // Clean up after 2 hours
      },
    },
  },
}
```

### Why These Settings?
- **Sloth on Opus:** Team lead needs the best reasoning for delegation decisions
- **Sub-agents on Sonnet (default):** Great quality at 1/5th the cost of Opus
- **Coder overridden to Kimi:** When I spawn a coding task, I'll explicitly set `model: "kimi-coding/k2p5"`
- **8 concurrent:** Enough for parallel research + coding + content
- **2h archive:** Keeps sessions clean but gives time to review

---

## 📝 Setup Steps (What We Need to Do)

### Step 1: Update Config (5 minutes)
- Change default model to Opus for main agent
- Set sub-agent defaults (model, concurrency, archive time)
- Gateway restart required

### Step 2: Update Workspace Files (10 minutes)
- Update `AGENTS.md` with team delegation instructions
- Add team member descriptions so I know when to spawn which specialist
- Update `TOOLS.md` with sub-agent conventions

### Step 3: Test the Team (15 minutes)
- Spawn a test sub-agent for each role
- Verify results come back correctly
- Test parallel spawning

### Step 4: Create Quick Commands (Optional, 10 minutes)
- Set up shorthand triggers so you can say things like:
  - "Code: [task]" → auto-spawns Coder
  - "Research: [task]" → auto-spawns Researcher
  - "Content: [task]" → auto-spawns Creator
  - Or just describe naturally — I'll figure out who to assign

---

## 💰 Cost Analysis

### Current (Everything on Opus)
All tasks run on Opus 4.6 = maximum cost per interaction

### With Team (Estimated Monthly)

| Agent | Usage | Model | Est. Cost |
|---|---|---|---|
| Sloth (Team Lead) | Strategy, delegation, chat | Opus 4.6 | ~$20-40/mo |
| Coder | 10-15 coding tasks | Kimi K2.5 | ~$2-5/mo |
| Creator | 15-20 content pieces | Sonnet 4.5 | ~$5-10/mo |
| Researcher | 5-10 research tasks | Sonnet 4.5 | ~$3-7/mo |
| Strategist | 3-5 strategy sessions | Sonnet 4.5 | ~$2-5/mo |
| **Total** | | | **~$32-67/mo** |

### Savings
- **Without team:** Everything on Opus = ~$80-150/mo
- **With team:** Opus for lead only = ~$32-67/mo
- **Savings:** 50-60% cost reduction with BETTER specialization

---

## 🎯 Real Examples (How You'd Use This)

### Example 1: "I need 5 reel scripts for this week"
```
You: "Give me 5 reel scripts for this week - topics: wedding videos, 
      AI tools, freelancing, content creation, and motivation"

Sloth: Spawns Creator sub-agent with:
  - Task: Write 5 Hinglish reel scripts
  - Context: Rajesh's style, Instagram audience, hook patterns
  - Constraints: Each script 30-60 seconds, viral hooks

Creator: Delivers 5 complete scripts with hooks, body, CTA

You get: 5 ready-to-shoot scripts in ~2 minutes
```

### Example 2: "Should I build a wedding video SaaS?"
```
You: "Is building a wedding video SaaS worth it?"

Sloth: Spawns in parallel:
  ├─ Researcher (Sonnet): Market size, competition, trends
  └─ Strategist (Sonnet): Business model, pricing, go-to-market

Both finish → Sloth synthesizes:
  "Here's the verdict: Market is ₹X crore, 5 competitors exist, 
   your differentiation is [X]. Recommended: [yes/no] because [reason].
   If yes, here's the plan..."
```

### Example 3: "Add a new feature to CaptionCraft"
```
You: "Add auto-detection of language in uploaded videos"

Sloth: 
  1. Spawns Researcher: "Find best speech-to-text APIs with language detection"
  2. After research returns → Spawns Coder with research context:
     "Implement auto language detection using [recommended API]"
  3. Coder implements, announces the code changes

You get: Feature implemented + committed, with research backing the technical choice
```

### Example 4: "Help me grow Instagram to 1K followers"
```
You: "I'm at 241 followers, help me get to 1000"

Sloth: Spawns Strategist with:
  - Current stats: 241 followers, 60 reels
  - Niche: AI tools & business growth
  - Content style: Hinglish

Strategist delivers: 30-day growth plan with:
  - Posting schedule
  - Content pillars
  - Engagement strategy
  - Collaboration targets
  - Hashtag sets
```

---

## ⚡ Quick Wins (Day 1 — From Ebook)

These are automations from the ebook we can set up immediately:

### 1. Morning Briefing (5 min setup)
- Daily summary at 8 AM: weather, trending AI topics, Instagram insights
- Via cron job → Telegram
- Cost: nearly free (runs on Kimi)

### 2. Content Idea Monitor (10 min setup)
- Track trending topics in AI tools, business, freelancing
- Weekly content calendar auto-generated
- Spawns Creator to write scripts

### 3. Competitor Tracking (10 min setup)
- Monitor competitor Instagram accounts
- Weekly analysis: what they're posting, engagement rates
- Spawns Researcher to compile reports

### 4. Business Goal Tracker (5 min setup)
- Document your 1M ARR goal in TOOLS.md
- Weekly progress reviews via cron
- Spawns Strategist for monthly milestone check-ins

---

## 🚀 Advanced Features (Phase 2)

Once the basic team is running, we can add:

### 1. Cron-Based Content Calendar
- Auto-generate weekly content ideas every Monday morning
- Spawns Creator to write scripts for the week
- Results delivered to your Telegram

### 2. Research Alerts
- Set up periodic market scans
- "Check what's trending in AI tools every week"
- Spawns Researcher on schedule

### 3. Code Review Pipeline
- After Coder implements something, Sloth auto-spawns a review sub-agent
- Two-pass quality check

### 4. Full Multi-Agent (if needed later)
- If any specialist needs persistent memory/context across sessions
- We upgrade that specialist to a full agent with its own workspace
- Sloth communicates via sessions_send

---

## ❓ FAQ

**Q: Can I still talk to Sloth directly for quick things?**
A: Absolutely! I'm always here for quick questions, brainstorming, or casual chat. I only spawn specialists for substantial tasks.

**Q: What if a sub-agent takes too long?**
A: Each sub-agent has a timeout. If it takes too long, it gets killed and I'll tell you what happened. You can also type `/subagents stop all` to kill everything.

**Q: Can I talk to a sub-agent directly?**
A: Yes! Use `/subagents send <id> <message>` to give additional instructions to a running sub-agent.

**Q: What about my private data?**
A: Sub-agents run in the same workspace as me (Sloth). They can read files but can't access session tools (can't read our chat history). I pass them only the context they need.

**Q: Do sub-agents remember previous work?**
A: No — each sub-agent is a fresh session. I (Sloth) maintain continuity through memory files. If a specialist needs context from previous work, I include it in the task description.

**Q: Can I switch models for specific tasks?**
A: Yes! I can override the model per sub-agent spawn. Want a coding task on Opus for a tricky problem? Just say so.

---

## ✅ Ready to Implement?

Say **"Let's set it up"** and I'll:
1. Update the config
2. Set up workspace files  
3. Test each specialist
4. We're live in 10 minutes

Or if you have questions/changes to the plan, let's discuss! 🦥
