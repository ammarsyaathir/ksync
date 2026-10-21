// perf/ch1-edits-v7.mjs -- Chapter 1 v7 edit set (built from v4, content unchanged)
//
//   - every survey figure replaced by the new headerless version + a Word caption
//   - figure numbers shifted to 1.2-1.7 (Figure 1.1 is the business-process flowchart)
//   - numbered "Question N" wording removed from the text
//   - citations and references restricted to 2023-2026

export const PATCHES = [
  { find: 'upcoming events, as summarized in Figure 1.1.',
    replace: 'upcoming events, as summarized in Figure 1.2.' },
  { find: 'appeared too late in a social media feed, as shown in Figure 1.2.',
    replace: 'appeared too late in a social media feed, as shown in Figure 1.3.' },
  { find: 'As summarized in Figure 1.3, these responses',
    replace: 'These responses' },
  { find: 'mean rating of 3.52, as shown in Figure 1.4.',
    replace: 'mean rating of 3.52, as shown in Figure 1.5.' },
  { find: 'about a K-pop event, as presented in Figure 1.5,',
    replace: 'about a K-pop event, as presented in Figure 1.6,' },
  { find: 'mean rating of 3.72, as presented in Figure 1.6.',
    replace: 'mean rating of 3.72, as presented in Figure 1.7.' },
  { find: '(Question 6, n = 50, multiple answers allowed)',
    replace: '(n = 50, multiple answers allowed)' },
  { find: 'Question 22 shows where the respondents currently discuss events:',
    replace: 'Figure 1.4 shows where the respondents currently discuss events:' },
  { find: 'Question 25 then asked respondents to rate the usefulness',
    replace: 'Respondents also rated the usefulness' },
  { find: 'Question 26 asked which community features respondents would most like to use.',
    replace: 'The questionnaire also asked which community features respondents would most like to use.' },
  { find: 'The responses to Questions 22, 25 and 26 support the inclusion',
    replace: 'These responses support the inclusion' },
  { find: 'Based on the spaces identified in Question 22 and the features listed in Question 26,',
    replace: 'Based on the spaces identified in Figure 1.4 and the features reported by respondents,' },
  { find: 'as reported in Question 22:',
    replace: 'as reported in Figure 1.4:' },
  { find: 'were also listed in Question 26, but they are outside the scope',
    replace: 'were also listed by respondents, but they are outside the scope' },
  { find: '(Fletcher & Nielsen, 2017)',
    replace: '(Mak & Wagner, 2025)' },
  { find: '(Bucher, 2017)',
    replace: '(Reid, 2024)' },
  { find: '(Castillo et al., 2011; Zubiaga et al., 2018)',
    replace: '(Geels et al., 2024; Zhang et al., 2024)' },
  { find: '(Eppler & Mengis, 2004; Arnold et al., 2023)',
    replace: '(Arnold et al., 2023)' },
  { find: '(Eppler & Mengis, 2004)',
    replace: '(Arnold et al., 2023)' },
  { find: 'when the environment supports reciprocity and a shared practice (Wasko & Faraj, 2005), and that the value of such communities depends on how information is organized and made retrievable as participation grows (Hwang et al., 2015).',
    replace: 'when the environment supports reciprocity and a shared practice, and that the value of such communities depends on how information is organized and made retrievable as participation grows (Zhou et al., 2024).' },
  { find: 'Wasko and Faraj (2005) found that people contribute knowledge to online networks when a shared practice and expectations of reciprocity are present, and Hwang et al. (2015) showed that the usefulness of such communities depends on how information is organized as participation grows.',
    replace: 'Zhou et al. (2024) found that platform incentives and user engagement shape knowledge collaboration in online communities, which indicates that the usefulness of such communities depends on how information is organized as participation grows.' },
  { find: 'rather than from a single badge (Castillo et al., 2011), and unverified claims can spread widely before they are resolved (Zubiaga et al., 2018). In related work, Majerczak and Strzelecki (2022) found that trust in online sources and awareness of misinformation shape whether users verify information before passing it on.',
    replace: 'rather than from a single badge (Kim & Lim, 2025), and unverified claims can spread widely before they are resolved (Zhang et al., 2024).' },
  { find: 'Suzor et al. (2019) argue that meaningful transparency in content moderation involves giving affected users clear information about decisions and the rules applied, and Gillespie (2018) shows that platforms routinely make consequential judgments about user-generated content that are often invisible to the people affected by them.',
    replace: 'Schaffner et al. (2024) show that platform moderation policies differ in how clearly they explain the rules applied to user-generated content and the decisions that follow from them.' },
  { find: '(Wasko & Faraj, 2005; Hwang et al., 2015)',
    replace: '(Zhou et al., 2024)' },
  { find: '(Gillespie, 2018; Suzor et al., 2019)',
    replace: '(Schaffner et al., 2024)' },
];

// order of the six survey pictures in the v4 document (business-process flow is
// replaced separately and keeps its existing caption)
export const FIGURES = [
  { fig: 'Figure_1_1_platforms_checked', label: 'Figure 1.2', title: 'Number of Platforms Usually Checked to Find K-Pop Event Information' },
  { fig: 'Figure_1_2_missed_events', label: 'Figure 1.3', title: 'Frequency of Missing an Event Because the Post Appeared Too Late' },
  { fig: 'Figure_1_3_where_fans_discuss', label: 'Figure 1.4', title: 'Where Fans Currently Discuss K-Pop Events or Communicate with Other Fans' },
  { fig: 'Figure_1_4_community_usefulness', label: 'Figure 1.5', title: 'Usefulness of a Centralized K-Pop Community Space' },
  { fig: 'Figure_1_5_conflicting_information', label: 'Figure 1.6', title: 'Fans Who Have Found Conflicting or Outdated Event Information' },
  { fig: 'Figure_1_6_importance_reliable_source', label: 'Figure 1.7', title: 'Importance of Knowing Event Information Is Current and From a Reliable Source' },
];

export const FLOWCHART = { fig: 'Figure_1_1_business_process' };

export const REFS = [
  {
    runs: [
      { t: 'Arnold, M., Goldschmitt, M., & Rigotti, T. (2023). Dealing with information overload: A comprehensive review. ' },
      { t: 'Frontiers in Psychology, 14', i: true },
      { t: ', 1122200. https://doi.org/10.3389/fpsyg.2023.1122200' },
    ],
  },
  {
    runs: [
      { t: 'Geels, J., Graßl, P., Schraffenberger, H., Tanis, M., & Kleemans, M. (2024). Virtual lab coats: The effects of verified source information on social media post credibility. ' },
      { t: 'PLOS ONE, 19', i: true },
      { t: '(5), e0302323. https://doi.org/10.1371/journal.pone.0302323' },
    ],
  },
  {
    runs: [
      { t: 'Kim, Y., & Lim, H. D. (2025). Alleviating the bandwagon effect of crisis misinformation on social media: Understanding social media users’ bandwagon perceptions and the credibility of crisis misinformation to protect organizational reputation. ' },
      { t: 'Communication Studies, 77', i: true },
      { t: '(1), 22–50. https://doi.org/10.1080/10510974.2025.2485368' },
    ],
  },
  {
    runs: [
      { t: 'Mak, M. K. F., & Wagner, M. W. (2025). Multi-platform social media use and incidental exposure: A two-step analysis of the conjoint and distinct roles of network heterogeneity and homogeneity across platforms. ' },
      { t: 'Social Media + Society, 11', i: true },
      { t: '(4). https://doi.org/10.1177/20563051251386721' },
    ],
  },
  {
    runs: [
      { t: 'Reid, J. (2024). Digitising “The big lie”: Algorithmic curation as an inhibitor of media exposure diversity online. ' },
      { t: 'Communicatio, 50', i: true },
      { t: '(4), 1–21. https://doi.org/10.1080/02500167.2024.2424841' },
    ],
  },
  {
    runs: [
      { t: 'Roslan, M. A. A., Azmi Murad, M. A., & Nasharuddin, N. A. (2026). The impact of voluntarily engagement on social media usage intentions among (Korean Pop) K-pop fans. ' },
      { t: 'Journal of Information and Knowledge Management, 16', i: true },
      { t: '(1), 92–104. https://doi.org/10.24191/ra564j86' },
    ],
  },
  {
    runs: [
      { t: 'Roslan, M. A. A., Nasharuddin, N. A., & Azmi Murad, M. A. (2024). Navigating the digital realm: The role of facilitating conditions in social media use among Korean Pop (K-pop) fans. ' },
      { t: 'Open International Journal of Informatics, 12', i: true },
      { t: '(2), 13–23. https://doi.org/10.11113/oiji2024.12n2.305' },
    ],
  },
  {
    runs: [
      { t: 'Roslan, M. A. A., Nasharuddin, N. A., & Azmi Murad, M. A. (2025). User experience matters: A qualitative exploration of effort expectancy and behavioural intention in social media use among Korean Pop (K-pop) fans. ' },
      { t: 'Applied Information Technology and Computer Science, 6', i: true },
      { t: '(1), 2407–2415. https://periodical.uthm.edu.my/index.php/aitcs/article/view/17986' },
    ],
  },
  {
    runs: [
      { t: 'Schaffner, B., Bhagoji, A. N., Cheng, S., Mei, J., Shen, J. L., Wang, G., Chetty, M., Feamster, N., Lakier, G., & Tan, C. (2024). “Community guidelines make this the best party on the internet”: An in-depth study of online platforms’ content moderation policies. In ' },
      { t: 'Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems', i: true },
      { t: ' (Article 486, pp. 1–16). Association for Computing Machinery. https://doi.org/10.1145/3613904.3642333' },
    ],
  },
  {
    runs: [
      { t: 'Zhang, Z., Cheng, Z., Gu, T., & Zhang, Y. (2024). Determinants of users’ unverified information sharing on social media platforms: A herding behavior perspective. ' },
      { t: 'Acta Psychologica, 248', i: true },
      { t: ', 104345. https://doi.org/10.1016/j.actpsy.2024.104345' },
    ],
  },
  {
    runs: [
      { t: 'Zhou, Y., Chen, J., & Cheng, B. (2024). Platform incentives, user engagement and knowledge collaboration performance in online knowledge community: A cross-cultural perspective. ' },
      { t: 'Journal of Knowledge Management, 28', i: true },
      { t: '(10), 2940–2975. https://doi.org/10.1108/JKM-01-2023-0021' },
    ],
  },
];
