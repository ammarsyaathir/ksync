# -*- coding: utf-8 -*-
import json, io

refs = json.load(open("perf/_v4refs.json", encoding="utf-8"))
keep_prefix = ("Arnold, M.", "Geels, J.", "Roslan, M. A. A., Nasharuddin", "Roslan, M. A. A., Azmi", "Schaffner, B.")
kept = []
for r in refs:
    t = "".join(x["t"] for x in r["runs"])
    if t.startswith(keep_prefix):
        kept.append(r["runs"])

def js_runs(runs, indent="      "):
    out = []
    for x in runs:
        t = x["t"].replace("\\", "\\\\").replace("'", "\\'")
        out.append(f"{indent}{{ t: '{t}'" + (", i: true" if x.get("i") else "") + " },")
    return "\n".join(out)

new_refs = [
 [{"t":"Kim, Y., & Lim, H. D. (2025). Alleviating the bandwagon effect of crisis misinformation on social media: Understanding social media users\u2019 bandwagon perceptions and the credibility of crisis misinformation to protect organizational reputation. "},
  {"t":"Communication Studies, 77","i":True},
  {"t":"(1), 22\u201350. https://doi.org/10.1080/10510974.2025.2485368"}],
 [{"t":"Mak, M. K. F., & Wagner, M. W. (2025). Multi-platform social media use and incidental exposure: A two-step analysis of the conjoint and distinct roles of network heterogeneity and homogeneity across platforms. "},
  {"t":"Social Media + Society, 11","i":True},
  {"t":"(4). https://doi.org/10.1177/20563051251386721"}],
 [{"t":"Reid, J. (2024). Digitising \u201cThe big lie\u201d: Algorithmic curation as an inhibitor of media exposure diversity online. "},
  {"t":"Communicatio, 50","i":True},
  {"t":"(4), 1\u201321. https://doi.org/10.1080/02500167.2024.2424841"}],
 [{"t":"Zhang, Z., Cheng, Z., Gu, T., & Zhang, Y. (2024). Determinants of users\u2019 unverified information sharing on social media platforms: A herding behavior perspective. "},
  {"t":"Acta Psychologica, 248","i":True},
  {"t":"104345. https://doi.org/10.1016/j.actpsy.2024.104345"}],
 [{"t":"Zhou, Y., Chen, J., & Cheng, B. (2024). Platform incentives, user engagement and knowledge collaboration performance in online knowledge community: A cross-cultural perspective. "},
  {"t":"Journal of Knowledge Management, 28","i":True},
  {"t":"(10), 2940\u20132975. https://doi.org/10.1108/JKM-01-2023-0021"}],
]

allr = kept + new_refs
# order alphabetically by first surname+year key
def sortkey(runs):
    t = "".join(x["t"] for x in runs)
    return (t.split(",")[0].lower(), t)
allr.sort(key=sortkey)

body = []
for runs in allr:
    body.append("  {\n    runs: [\n" + js_runs(runs) + "\n    ],\n  },")

# ------------------------------------------------------------------ patches
PATCHES = [
 # ---- figure renumbering (flowchart stays 1.1; survey figures 1.2-1.7)
 ("upcoming events, as summarized in Figure 1.1.", "upcoming events, as summarized in Figure 1.2."),
 ("appeared too late in a social media feed, as shown in Figure 1.2.", "appeared too late in a social media feed, as shown in Figure 1.3."),
 ("As summarized in Figure 1.3, these responses", "As summarized in Figure 1.4, these responses"),
 ("mean rating of 3.52, as shown in Figure 1.4.", "mean rating of 3.52, as shown in Figure 1.5."),
 ("about a K-pop event, as presented in Figure 1.5,", "about a K-pop event, as presented in Figure 1.6,"),
 ("mean rating of 3.72, as presented in Figure 1.6.", "mean rating of 3.72, as presented in Figure 1.7."),
 # ---- remove numbered "Question" wording
 ("(Question 6, n = 50, multiple answers allowed)", "(n = 50, multiple answers allowed)"),
 ("Question 22 shows where the respondents currently discuss events:", "Figure 1.4 shows where the respondents currently discuss events:"),
 ("Question 25 then asked respondents to rate the usefulness", "Respondents also rated the usefulness"),
 ("Question 26 asked which community features respondents would most like to use.", "The questionnaire also asked which community features respondents would most like to use."),
 ("The responses to Questions 22, 25 and 26 support the inclusion", "These responses support the inclusion"),
 ("Based on the spaces identified in Question 22 and the features listed in Question 26,", "Based on the spaces identified in Figure 1.4 and the features reported by respondents,"),
 ("as reported in Question 22:", "as reported in Figure 1.4:"),
 ("were also listed in Question 26, but they are outside the scope", "were also listed by respondents, but they are outside the scope"),
 # ---- citations: pre-2023 -> 2023-2026
 ("(Fletcher & Nielsen, 2017)", "(Mak & Wagner, 2025)"),
 ("(Bucher, 2017)", "(Reid, 2024)"),
 ("(Castillo et al., 2011; Zubiaga et al., 2018)", "(Geels et al., 2024; Zhang et al., 2024)"),
 ("(Eppler & Mengis, 2004; Arnold et al., 2023)", "(Arnold et al., 2023)"),
 ("(Eppler & Mengis, 2004)", "(Arnold et al., 2023)"),
 ("when the environment supports reciprocity and a shared practice (Wasko & Faraj, 2005), and that the value of such communities depends on how information is organized and made retrievable as participation grows (Hwang et al., 2015).",
  "when the environment supports reciprocity and a shared practice, and that the value of such communities depends on how information is organized and made retrievable as participation grows (Zhou et al., 2024)."),
 ("Wasko and Faraj (2005) found that people contribute knowledge to online networks when a shared practice and expectations of reciprocity are present, and Hwang et al. (2015) showed that the usefulness of such communities depends on how information is organized as participation grows.",
  "Zhou et al. (2024) found that platform incentives and user engagement shape knowledge collaboration in online communities, which indicates that the usefulness of such communities depends on how information is organized as participation grows."),
 ("rather than from a single badge (Castillo et al., 2011), and unverified claims can spread widely before they are resolved (Zubiaga et al., 2018). In related work, Majerczak and Strzelecki (2022) found that trust in online sources and awareness of misinformation shape whether users verify information before passing it on.",
  "rather than from a single badge (Geels et al., 2024), and unverified claims can spread widely before they are resolved (Zhang et al., 2024). In related work, Kim and Lim (2025) found that users\u2019 perceptions of how widely a claim is accepted shape whether they treat it as credible before verifying it."),
 ("Suzor et al. (2019) argue that meaningful transparency in content moderation involves giving affected users clear information about decisions and the rules applied, and Gillespie (2018) shows that platforms routinely make consequential judgments about user-generated content that are often invisible to the people affected by them.",
  "Schaffner et al. (2024) show that platform moderation policies differ in how clearly they explain the rules applied to user-generated content and the decisions that follow from them."),
 ("(Wasko & Faraj, 2005; Hwang et al., 2015)", "(Zhou et al., 2024)"),
 ("(Gillespie, 2018; Suzor et al., 2019)", "(Schaffner et al., 2024)"),
]

def jsq(s):
    return s.replace("\\", "\\\\").replace("'", "\\'")

NL = chr(10)
patch_js = ("," + NL).join(
    "  { find: '" + jsq(a) + "'," + NL + "    replace: '" + jsq(b) + "' }"
    for a, b in PATCHES)

FIGURES = [
 ("Figure_1_1_platforms_checked", "Figure 1.2", "Number of Platforms Usually Checked to Find K-Pop Event Information"),
 ("Figure_1_2_missed_events", "Figure 1.3", "Frequency of Missing an Event Because the Post Appeared Too Late"),
 ("Figure_1_3_where_fans_discuss", "Figure 1.4", "Where Fans Currently Discuss K-Pop Events or Communicate with Other Fans"),
 ("Figure_1_4_community_usefulness", "Figure 1.5", "Usefulness of a Centralized K-Pop Community Space"),
 ("Figure_1_5_conflicting_information", "Figure 1.6", "Fans Who Have Found Conflicting or Outdated Event Information"),
 ("Figure_1_6_importance_reliable_source", "Figure 1.7", "Importance of Knowing Event Information Is Current and From a Reliable Source"),
]
fig_js = ",\n".join(f"  {{ fig: '{f}', label: '{l}', title: '{t}' }}" for f,l,t in FIGURES)

src = f"""// perf/ch1-edits-v7.mjs -- Chapter 1 v7 edit set (built from v4, content unchanged)
//
//   - every survey figure replaced by the new headerless version + a Word caption
//   - figure numbers shifted to 1.2-1.7 (Figure 1.1 is the business-process flowchart)
//   - numbered "Question N" wording removed from the text
//   - citations and references restricted to 2023-2026

export const PATCHES = [
{patch_js},
];

// order of the six survey pictures in the v4 document (business-process flow is
// replaced separately and keeps its existing caption)
export const FIGURES = [
{fig_js},
];

export const FLOWCHART = {{ fig: 'Figure_1_1_business_process' }};

export const REFS = [
{chr(10).join(body)}
];
"""
io.open("perf/ch1-edits-v7.mjs", "w", encoding="utf-8", newline="\n").write(src)
print("written perf/ch1-edits-v7.mjs")
print("refs:", len(allr))
for runs in allr:
    print("  -", "".join(x["t"] for x in runs)[:70])


