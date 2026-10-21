import io, re
src = io.open("perf/ch1-edits-v5.mjs", encoding="utf-8").read()
s = src

# ---- 1. restore the sections that were shortened only to meet the old page cap
drop_keys = [
 'The project scope defines the functions, users, geographical coverage',
 'The system supports three types of user interaction',
 'Fan account functions: register with email verification',
 'Event discovery: browse approved events, search by keyword',
 'Fan community: participate in the discussion attached to a published event',
 'Event submission: allow an organizer to enter event details',
 'Administrator functions: review pending submissions',
 'The system will not include a separate organizer dashboard',
 'The project covers two academic semesters',
 'K-Sync Malaysia is intended for K-pop events held in Malaysia',
 'The requirement-gathering activities include a questionnaire',
 'The project has several limitations',
 'This chapter introduced K-Sync Malaysia as a proposed centralized platform',
 'To address these problems, three corresponding solutions were proposed',
]
removed = 0
for k in drop_keys:
    pat = re.compile(r"\n  \{\n    key: '" + re.escape(k) + r"',[\s\S]*?\n  \},(?=\n)")
    s2, n = pat.subn("", s)
    if n != 1:
        print("WARN key not removed exactly once:", k, n)
    else:
        removed += n
    s = s2
print("entries restored:", removed)

# ---- 2. in-text citation swaps to 2023-2026
s = s.replace("(Zareie & Sakellariou, 2022)", "(Tang et al., 2025)")
s = s.replace("(Xie & Zhang, 2022)", "(Zhou et al., 2024)")

# Arnold 2023 + Schaffner 2024 are currently only in the reference list
s = s.replace(
 "and no single place brings those announcements together. In the questionnaire,",
 "and no single place brings those announcements together. Announcements are also repeated, reposted and updated across these services, so the volume of material a fan has to scan keeps growing (Arnold et al., 2023). In the questionnaire,")
s = s.replace(
 "Platforms provide no structured evidence for a listing beyond the post itself, so fans must judge credibility from appearance, follower counts and repetition, while an administrator of a centralized platform would have neither the evidence nor a consistent standard against which to review submissions.",
 "Platforms provide no structured evidence for a listing beyond the post itself, and moderation policies rarely explain why a particular post was left online, so fans must judge credibility from appearance, follower counts and repetition (Schaffner et al., 2024). An administrator of a centralized platform, in turn, would have neither the evidence nor a consistent standard against which to review submissions.")

# ---- 3. reference list: drop the three 2022 entries
for k in ['Majerczak, P., & Strzelecki, A. (2022)', 'Xie, R., & Zhang, W. (2022)', 'Zareie, A., & Sakellariou, R. (2022)']:
    pat = re.compile(r"\n  \{\n    key: '" + re.escape(k) + r"',[\s\S]*?\n  \},(?=\n)")
    s, n = pat.subn("", s)
    print("ref removed:", k.split(",")[0], n)

tang = """  {
    key: 'Tang, R., Burnley, B., Bode, L., & Vraga, E. K. (2025)',
    runs: [
      { t: 'Tang, R., Burnley, B., Bode, L., & Vraga, E. K. (2025). Corrective democracy? The relationship between correction of misinformation on social media and ' },
      { t: 'Social Media + Society, 11', i: true },
      { t: '(2). doi:10.1177/20563051251335086' },
    ],
  },
"""
zhou = """  {
    key: 'Zhou, Y., Chen, J., & Cheng, B. (2024)',
    runs: [
      { t: 'Zhou, Y., Chen, J., & Cheng, B. (2024). Platform incentives, user engagement and knowledge collaboration performance in online knowledge communities. ' },
      { t: 'Journal of Knowledge Management, 28', i: true },
      { t: '(10), 2940\\u20132975. doi:10.1108/JKM-01-2023-0021' },
    ],
  },
"""
# insert Tang after the Schaffner entry, Zhou at the end of the array
i = s.index("key: 'Schaffner, B., Bhagoji, A. N.'")
j = s.index("\n  },\n", i) + len("\n  },\n")
s = s[:j] + tang + s[j:]
s = s.replace("\n];\n", "\n" + zhou + "];\n", 1)

# ---- 4. swap the business-process figure for the new vector version
s = s.replace(
 "// tables removed entirely (0-based index into the source table list)",
 "// replace an existing picture (the paragraph immediately above its caption)\nexport const FIGURE_SWAP = [\n  { beforeCaption: 'Figure 1.1: Current business process for discovering and discussing K-pop events', fig: 'Figure_1_1_business_process' },\n];\n\n// tables removed entirely (0-based index into the source table list)")

io.open("perf/ch1-edits-v6.mjs", "w", encoding="utf-8", newline="\n").write(s)
print("\nwritten perf/ch1-edits-v6.mjs")
print("2022 left:", s.count("2022"), "| 2023-2026 refs:", len(re.findall(r"key: '[^']*\(\d{4}\)'", s)))
