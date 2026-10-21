// perf/ch1-edits-v5.mjs -- Chapter 1 v5 edit set
//
//   - references restricted to 2022-2026 only, APA 6th edition, max 18 (12 used)
//   - section 1.2 reduced to three paragraphs (one per problem), each followed by
//     its two survey figures with a Word caption below the figure
//   - section 1.3 reduced to one page
//   - sections 1.6, 1.8 and 1.9 tightened to the agreed page budget
//   - figures no longer carry an in-image title or question number
//
// Keys are plain substrings of the source paragraph text; the builder matches
// them with whitespace/quote normalisation and requires a unique match.

// ---------------------------------------------------------------- replacements
export const REPLACE = [

  // ----- 1.1 Background: two citation blocks were out of the 2022-2026 window
  {
    key: 'Social media platforms play an important role in how K-pop fans discover events',
    text: 'Social media platforms play an important role in how K-pop fans discover events and interact with other fans. X, Instagram, TikTok, Telegram and organizer websites are among the channels used to share posters, schedules, venue information and announcements. Research on algorithmic curation shows that platforms decide which items are shown to which users, so the same announcement is not necessarily seen by the same people on every service (Reid, 2024). Research on Malaysian K-pop fandom has found that social media supports fan engagement and community participation (Roslan et al., 2024; Roslan et al., 2025). Recent work also describes how fans voluntarily create, seek and share fandom-related information through social platforms (Roslan et al., 2026), and how fandom participation has become organised around platform features rather than around a single site (James, 2025; Gutierrez-Jauregi et al., 2025). These studies provide a basis for understanding why online spaces are important for event discovery and fan communication.',
  },
  {
    key: 'A further concern is how fans determine whether an event announcement is reliable',
    text: 'A further concern is how fans determine whether an event announcement is reliable and up to date. A post may be shared by an unofficial account or reposted without the original source, while earlier details may remain visible after an update. Research by Geels et al. (2024) shows that source-related signals on social media do not automatically guarantee that readers will make accurate judgments about the credibility of a message. Research on crisis misinformation shows that a claim can gain credibility simply because many people appear to accept it, which allows unverified information to spread before any correction arrives (Kim & Lim, 2025). This supports the need to consider the evidence behind an event announcement rather than treating an online post or visible badge alone as conclusive proof. In a centralized event platform, a defined review process can help make the basis for publishing information more consistent and understandable.',
  },

  {
    key: 'Figure 1.1: Current business process for discovering and discussing K-pop events',
    capLabel: 'Figure 1.1',
    capTitle: 'Current Business Process for Discovering and Discussing K-Pop Events',
  },

  // ----- 1.6 Project Scope
  {
    key: 'K-Sync Malaysia will be implemented as a responsive web-based application',
    text: 'K-Sync Malaysia is implemented as a responsive web application accessible through desktop and mobile browsers. The interface uses HTML, CSS, JavaScript and server-side EJS templates, while Node.js with the Express framework handles routing and application logic. Accounts, artist and member profiles, event listings, submissions, discussion messages and reports are stored in a relational database, using SQLite for local development and MySQL for the deployed environment through the same data access layer. Google sign-in is authenticated with Firebase Authentication, and the returned ID token is verified on the server against Google\'s published keys before any identity is trusted. Verification and notification messages are delivered through an SMTP mail service. The project does not include separate native Android or iOS applications.',
  },

  // ----- 1.8 / 1.9
  {
    key: 'This thesis consists of five chapters',
    text: 'This thesis consists of five chapters, summarized in Table 1.2.',
  },

  // ----- table numbering after Tables 1.1 and 1.2 were replaced by figures
  {
    key: 'Table 1.3: Alignment between problem statements and proposed solutions',
    text: 'Table 1.1: Alignment between problem statements and proposed solutions',
  },
  {
    key: 'Table 1.4: Outline of the thesis',
    text: 'Table 1.2: Outline of the thesis',
  },
];

// ---------------------------------------------------------------- deletions
// "delete every paragraph strictly between these two anchors".
export const DELETE_BETWEEN = [
  // 1.2.1 body -> 1.2.2 heading
  { from: 'Difficulty Discovering K-pop Event Information Across Multiple Platforms', to: 'Disorganized Community Discussions' },
  // 1.2.2 body -> 1.2.3 heading
  { from: 'Disorganized Community Discussions', to: 'Need for a Consistent and Transparent Event Verification Process' },
  // 1.2.3 body -> 1.3 heading
  { from: 'Need for a Consistent and Transparent Event Verification Process', to: 'Proposed Solutions' },
  // 1.3 intro -> 1.3.1
  { from: 'Proposed Solutions', to: 'Centralized K-pop Event Information Platform' },
  // 1.3.1 body -> 1.3.2
  { from: 'Centralized K-pop Event Information Platform', to: 'Event-Based Community Discussion and Information Sharing' },
  // 1.3.2 body -> 1.3.3
  { from: 'Event-Based Community Discussion and Information Sharing', to: 'Standardized Event Submission and Verification' },
  // 1.3.3 body -> Table caption (kept, renumbered to 1.1 later)
  { from: 'Standardized Event Submission and Verification', to: 'Table 1.3: Alignment between problem statements and proposed solutions' },
  // empty page-break paragraph before 1.8 (half-empty page)
  { from: 'Reported event information and community content can be reviewed through an organized moderation process', to: '1.8 Outline of the Thesis' },
  // empty page-break paragraph before REFERENCES (blank page)
  { from: 'To address these problems, three corresponding solutions were proposed', to: 'REFERENCES' },
  // old reference entries (replace the whole list)
  { from: 'REFERENCES', to: null },
];

// replace an existing picture (the paragraph immediately above its caption)
export const FIGURE_SWAP = [
  { beforeCaption: 'Figure 1.1: Current business process for discovering and discussing K-pop events', fig: 'Figure_1_1_business_process' },
];

// tables removed entirely (0-based index into the source table list)
export const DROP_TABLES = [0, 1];

// ---------------------------------------------------------------- insertions
// chunks are appended immediately after the anchor paragraph
export const AFTER = [
  {
    key: 'Difficulty Discovering K-pop Event Information Across Multiple Platforms',
    chunks: [
      { para: 'K-pop event information in Malaysia is announced on several platforms at the same time, and no single place brings those announcements together. Announcements are also repeated, reposted and updated across these services, so the volume of material a fan has to scan keeps growing (Arnold et al., 2023). In the questionnaire, 42 of the 50 respondents (84%) checked two or more platforms when looking for event information, and 16 (32%) checked four or more (Figure 1.2). Reach is also unreliable in the other direction: 38 respondents (76%) had missed an event at least sometimes because a post appeared too late, including 20 who missed events often or very often (Figure 1.3). Because each service ranks and repeats posts according to its own logic, an announcement that one fan sees may never reach another, so discovery depends on timing and luck rather than on a dependable source.' },
      { fig: 'Figure_1_1_platforms_checked', cap: 'Figure 1.2', title: 'Number of Platforms Usually Checked to Find K-Pop Event Information' },
      { fig: 'Figure_1_2_missed_events', cap: 'Figure 1.3', title: 'Frequency of Missing an Event Because the Post Appeared Too Late' },
    ],
  },
  {
    key: 'Disorganized Community Discussions',
    chunks: [
      { para: 'The second problem concerns where fans talk about events once they find them. Discussions are spread across Telegram groups, X replies and group chats, WhatsApp groups and Facebook groups or forums, and 12% of respondents reported rarely participating in any group discussion at all (Figure 1.4). Conversations in these spaces are ordered chronologically, so earlier answers are pushed out of view and cannot be searched later, while a fan who joins after an announcement must repeat questions that were already answered. This matters because the same information is reconstructed separately in every group. When asked how useful a single community space attached to event information would be, 27 respondents (54%) rated it 4 or 5 out of 5 (Figure 1.5), which shows demand for discussion organised around the event rather than around the chat group.' },
      { fig: 'Figure_1_3_where_fans_discuss', cap: 'Figure 1.4', title: 'Where Fans Currently Discuss K-Pop Events or Communicate with Other Fans' },
      { fig: 'Figure_1_4_community_usefulness', cap: 'Figure 1.5', title: 'Usefulness of a Centralized K-Pop Community Space' },
    ],
  },
  {
    key: 'Need for a Consistent and Transparent Event Verification Process',
    chunks: [
      { para: 'The third problem is that published information can be incomplete, outdated or wrong, and fans have no consistent way to tell which version to trust. A post may be shared by an unofficial account, reposted without its original source, or left online after the organizer has issued a correction. In the questionnaire, 31 respondents (62%) had encountered conflicting or outdated information about a K-pop event (Figure 1.6), and 30 (60%) rated it important or very important to know that information is current and comes from a reliable source (Figure 1.7). Platforms provide no structured evidence for a listing beyond the post itself, and moderation policies rarely explain why a particular post was left online, so fans must judge credibility from appearance, follower counts and repetition (Schaffner et al., 2024). An administrator of a centralized platform, in turn, would have neither the evidence nor a consistent standard against which to review submissions.' },
      { fig: 'Figure_1_5_conflicting_information', cap: 'Figure 1.6', title: 'Fans Who Have Found Conflicting or Outdated Event Information' },
      { fig: 'Figure_1_6_importance_reliable_source', cap: 'Figure 1.7', title: 'Importance of Knowing Event Information Is Current and From a Reliable Source' },
    ],
  },
  {
    key: 'Proposed Solutions',
    chunks: [
      { para: 'The three problems identified in Section 1.2 are addressed by three linked solutions, each mapped to one problem.' },
    ],
  },
  {
    key: 'Centralized K-pop Event Information Platform',
    chunks: [
      { para: 'K-Sync Malaysia will organize approved event information in a single directory. Fans can browse listings, search by keyword and filter by artist, category and location, and each event page presents the date, time, venue, description, gallery, organizing party, source announcement and official ticket channel in the same structure. Only listings that pass the verification process are published, so the directory shows information that has been reviewed rather than every post that was collected.' },
    ],
  },
  {
    key: 'Event-Based Community Discussion and Information Sharing',
    chunks: [
      { para: 'Each published event page will also carry its own discussion area, where registered fans can post messages, reply and share information about that event. Anchoring the conversation to the event keeps it with the listing instead of scattering it across group chats, and research on online communities shows that participation depends on how information is organized and how easily earlier contributions can be found (Zhou et al., 2024). A general K-pop forum, shared-interest groups and a formal question-and-answer function are outside this project version and are recorded as future extensions.' },
    ],
  },
  {
    key: 'Standardized Event Submission and Verification',
    chunks: [
      { para: 'Event information will be submitted through a standard form, either publicly or through a registered organizer account, with supporting evidence such as an official announcement URL, a social media account or a poster image. Submissions are marked as pending until the administrator checks them against the verification criteria, and each submission receives a reference number so the submitter can follow its status. Approved submissions become verified listings, while rejected submissions are returned with a recorded reason. Fans may also report listings that appear incorrect or outdated.' },
    ],
  },
];

// ---------------------------------------------------------------- references
// APA 6th edition. Italic runs carry journal titles and volume numbers.
export const REFS = [
  {
    key: 'Arnold, M., Goldschmitt, M., & Rigotti, T. (2023)',
    runs: [
      { t: 'Arnold, M., Goldschmitt, M., & Rigotti, T. (2023). Dealing with information overload: A comprehensive review. ' },
      { t: 'Frontiers in Psychology, 14', i: true },
      { t: ', 1122200. doi:10.3389/fpsyg.2023.1122200' },
    ],
  },
  {
    key: 'Geels, J., Graßl, P., Schraffenberger, H., Tanis, M., & Kleemans, M. (2024)',
    runs: [
      { t: 'Geels, J., Graßl, P., Schraffenberger, H., Tanis, M., & Kleemans, M. (2024). Virtual lab coats: The effects of verified source information on social media post credibility. ' },
      { t: 'PLOS ONE, 19', i: true },
      { t: '(5), e0302323. doi:10.1371/journal.pone.0302323' },
    ],
  },
  {
    key: 'Gutierrez-Jauregi, A., Aramendia-Muneta, M. E., & Gómez-Cámara, I. (2025)',
    runs: [
      { t: 'Gutierrez-Jauregi, A., Aramendia-Muneta, M. E., & Gómez-Cámara, I. (2025). Harmony in diversity: Unraveling the global impact of K-Pop through social media and fandom dynamics. ' },
      { t: 'Media Asia, 53', i: true },
      { t: '(2), 366\u2013392. doi:10.1080/01296612.2025.2480451' },
    ],
  },
  {
    key: 'James, S. (2025)',
    runs: [
      { t: 'James, S. (2025). Affective participation from the in-between: The platformization of K-Pop fandom. ' },
      { t: 'Social Media + Society, 11', i: true },
      { t: '(2). doi:10.1177/20563051251351390' },
    ],
  },
  {
    key: 'Kim, Y., & Lim, H. D. (2025)',
    runs: [
      { t: 'Kim, Y., & Lim, H. D. (2025). Alleviating the bandwagon effect of crisis misinformation on social media: Understanding social media users\u2019 bandwagon perceptions and the credibility of crisis misinformation to protect organizational reputation. ' },
      { t: 'Communication Studies, 77', i: true },
      { t: '(1), 22\u201350. doi:10.1080/10510974.2025.2485368' },
    ],
  },  {
    key: 'Reid, J. (2024)',
    runs: [
      { t: 'Reid, J. (2024). Digitising \u201CThe big lie\u201D: Algorithmic curation as an inhibitor of media exposure diversity online. ' },
      { t: 'Communicatio, 50', i: true },
      { t: '(4), 1\u201321. doi:10.1080/02500167.2024.2424841' },
    ],
  },
  {
    key: 'Roslan, M. A. A., Nasharuddin, N. A., & Azmi Murad, M. A. (2024)',
    runs: [
      { t: 'Roslan, M. A. A., Nasharuddin, N. A., & Azmi Murad, M. A. (2024). Navigating the digital realm: The role of facilitating conditions in social media use among Korean Pop (K-pop) fans. ' },
      { t: 'Open International Journal of Informatics, 12', i: true },
      { t: '(2), 13\u201323. doi:10.11113/oiji2024.12n2.305' },
    ],
  },
  {
    key: 'Roslan, M. A. A., Nasharuddin, N. A., & Azmi Murad, M. A. (2025)',
    runs: [
      { t: 'Roslan, M. A. A., Nasharuddin, N. A., & Azmi Murad, M. A. (2025). User experience matters: A qualitative exploration of effort expectancy and behavioural intention in social media use among Korean Pop (K-pop) fans. ' },
      { t: 'Applied Information Technology and Computer Science, 6', i: true },
      { t: '(1), 2407\u20132415. Retrieved from https://periodical.uthm.edu.my/index.php/aitcs/article/view/17986' },
    ],
  },
  {
    key: 'Roslan, M. A. A., Azmi Murad, M. A., & Nasharuddin, N. A. (2026)',
    runs: [
      { t: 'Roslan, M. A. A., Azmi Murad, M. A., & Nasharuddin, N. A. (2026). The impact of voluntarily engagement on social media usage intentions among (Korean Pop) K-pop fans. ' },
      { t: 'Journal of Information and Knowledge Management, 16', i: true },
      { t: '(1), 92\u2013104. doi:10.24191/ra564j86' },
    ],
  },
  {
    key: 'Schaffner, B., Bhagoji, A. N.',
    runs: [
      { t: 'Schaffner, B., Bhagoji, A. N., Cheng, S., Mei, J., Shen, J. L., Wang, G., ... Tan, C. (2024). \u201CCommunity guidelines make this the best party on the internet\u201D: An in-depth study of online platforms\u2019 content moderation policies. In ' },
      { t: 'Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems', i: true },
      { t: ' (Article 486, pp. 1\u201316). Association for Computing Machinery. doi:10.1145/3613904.3642333' },
    ],
  },
  {
    key: 'Zhou, Y., Chen, J., & Cheng, B. (2024)',
    runs: [
      { t: 'Zhou, Y., Chen, J., & Cheng, B. (2024). Platform incentives, user engagement and knowledge collaboration performance in online knowledge community: A cross-cultural perspective. ' },
      { t: 'Journal of Knowledge Management, 28', i: true },
      { t: '(10), 2940\u20132975. doi:10.1108/JKM-01-2023-0021' },
    ],
  },
];
