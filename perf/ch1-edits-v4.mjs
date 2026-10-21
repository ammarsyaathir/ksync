/* perf/ch1-edits-v4.mjs — Chapter 1 corrections (v4)

   Built from ch1-edits.mjs (the 45 system-description corrections) with:

   1. RESPONDENT DATA — every figure recomputed from the real questionnaire
      export ("...Research Survey (1).xlsx"), which contains one fully blank
      response row. That row is dropped, so the analysed sample is n = 50.
      (v3 wrongly used n = 51 and included the blank row in the denominator.)

   2. QUESTION 24 REMOVED — its "I do not experience these difficulties" option
      reached 40% at n = 50, so the question can no longer carry the argument.
      The Q24 paragraph, the Q24 figure and the Q24-based Table 1.2 are all
      replaced. Problem 2's evidence now comes from Q22 (where fans discuss),
      Q25 (usefulness of a centralized space), Q26 (in-scope community features)
      and Q16/Q11 (reliability).

   3. AUDIT LOG REMOVED — the built system writes audit entries to the database
      but exposes no administrator interface to read them, so the chapter must
      not claim an audit-log feature. Removed from the background, both solution
      sections, Table 1.3, the scope, the limitations and the significance.

   4. CITATIONS ADDED — eleven additional peer-reviewed sources (all verified
      against Crossref; DOIs in the reference list), woven into the background,
      the three problem statements and the proposed solutions.

   5. SPELLING — the chapter (and the project title, "A Centralized Platform")
      uses US -ize spelling, so "organise/organised/generalised" are normalized
      to "organize/organized/generalized".
*/
import { EDITS as BASE } from './ch1-edits.mjs';

// ---------------------------------------------------------------------------
// BASE edits whose text changes in v4
// ---------------------------------------------------------------------------
const REPLACE = {
  'The problems addressed by this project were identified from the current event-information process':
    `The problems addressed by this project were identified from the current event-information process, a questionnaire completed by 50 respondents, and interviews with representatives from Malaysian K-pop fan communities. The questionnaire examined how respondents discover K-pop events, the platforms and group chats they use, and the difficulties they experience in retrieving event-related information. Interviews with the MKF Malaysia Instagram administrator and with Ms Syazwani from Cupsleeve Malaysia provided additional context about how event information is published, shared and updated, and how fans respond when announcements change. Three problems are discussed below: event information that is fragmented across platforms, event-related discussions that are difficult to organize and retrieve, and the absence of a consistent and transparent process for confirming that an event listing and its ticket channel are official. The questionnaire sample is limited and is used as evidence about the respondents who participated, not as a national estimate of all K-pop fans in Malaysia.`,

  'K-pop event information in Malaysia is published through different online platforms':
    `K-pop event information in Malaysia is published through different online platforms, including X, TikTok, Instagram, Telegram and official organizer websites. Each platform may contain different event announcements, and the information may not be presented in a consistent format. Research on cross-platform media use shows that audiences increasingly encounter information through several services rather than a single source, so the same item is not necessarily seen by the same people on each platform (Fletcher & Nielsen, 2017). Fans who want to discover concerts, fan meetings, festivals, cupsleeve events, exhibitions or pop-up events may therefore have to follow multiple accounts and compare separate posts to locate event details. The same event may also be described differently across sources when a date, venue or ticket detail is changed after the first announcement, and older posts may remain visible after the update. Because social media feeds are ordered by algorithms rather than chronologically, an announcement may also appear late or not at all for some followers (Bucher, 2017). This can make event discovery less convenient, especially when fans are interested in several artists or events occurring within a similar period.`,

  'The findings indicate that fans in this sample rely on multiple sources':
    `The findings indicate that fans in this sample rely on multiple sources to discover K-pop events. Because most respondents checked more than one platform, and three in five checked three or more, locating a single event can require several separate searches. This makes it harder to obtain a consolidated view of upcoming events, as summarized in Figure 1.1. Three in four respondents had also missed an event because a post appeared too late in a social media feed, as shown in Figure 1.2. A centralized directory that presents approved events in one comparable structure, with keyword search and filters for artist, event category and location, is therefore proposed to help fans discover relevant events and to let them check a single source that has already been reviewed before publication.`,

  'K-pop fans use group chats and online communities to discuss events':
    `K-pop fans use group chats and online communities to discuss events, ask questions, share updates and communicate with other fans. However, when conversations take place across several groups or platforms, useful information may become difficult to retrieve. Research on information overload shows that when messages accumulate faster than a person can process them, earlier items become hard to locate and important details can be missed (Eppler & Mengis, 2004). In group chats, important messages can be buried under newer messages, repeated questions may appear when earlier answers cannot be found, and event information may be scattered across different group conversations. In addition, a discussion is usually not attached to the event listing itself, so a fan must move between the event announcement and several chat groups to find an answer or confirm a detail. As a result, fans may need to scroll through long chat histories or switch between platforms to locate a previous answer or an event update.`,

  'The responses to Questions 24':
    `The responses to Questions 22, 25 and 26 support the inclusion of a community function in K-Sync Malaysia. The respondents spread their event discussions across four or more different spaces, and just over half rated a centralized community space as useful. Based on the spaces identified in Question 22 and the features listed in Question 26, this project scopes the community function to an event-based discussion area attached to each published event listing, where fans can also share event updates and announcements. The general K-pop forum, shared-interest group discussions and a formal question-and-answer function were also listed in Question 26, but they are outside the scope of this project version and are recorded as possible future extensions.`,

  'A centralized community feature could help organize conversations':
    `A centralized community function could help organize conversations according to the event they relate to, making it easier for fans to return to earlier discussions and share useful information in a relevant place. Wasko and Faraj (2005) found that people contribute knowledge to online networks when a shared practice and expectations of reciprocity are present, and Hwang et al. (2015) showed that the usefulness of such communities depends on how information is organized as participation grows. This feature would not eliminate all repeated questions or replace every external group chat. Instead, it would provide an additional organized space in which event-related conversations are kept with the event listing, reducing the need to switch between several platforms for every discussion.`,

  'Without a defined workflow, event submissions may be reviewed inconsistently':
    `Without a defined workflow, event submissions may be reviewed inconsistently, rejected organizers may not understand why their submissions were not published, and fans may have no way of checking whether a listing is still under review or has been approved. A documented decision process can improve accountability by recording whether an event was approved or rejected and the reason for that decision. Suzor et al. (2019) argue that meaningful transparency in content moderation involves giving affected users clear information about decisions and the rules applied, and Gillespie (2018) shows that platforms routinely make consequential judgments about user-generated content that are often invisible to the people affected by them. For K-Sync Malaysia, this supports the inclusion of standardized verification criteria, recorded rejection reasons, a reference number that allows a submitter to follow the status of a submission, an indicator that distinguishes verified organizer accounts, and a mechanism for fans to report incorrect or outdated listings. These features are intended to reduce avoidable inconsistency and improve traceability; they cannot guarantee that all decisions will be free from bias or that every event will remain accurate after publication.`,

  'The second proposed solution is to provide an organized fan community space':
    `The second proposed solution is to provide event-based community discussion within K-Sync Malaysia. Each published event page will include a discussion area where registered fans can post messages, reply to other fans and share useful information related to that event, so that the conversation is kept with the event listing instead of being scattered across separate group chats. Community participation will require a fan account, and each message is stored with a reference to the related event. Research on online communities indicates that participation depends on how information is organized and how easy it is to find earlier contributions (Wasko & Faraj, 2005; Hwang et al., 2015), and anchoring each conversation to a specific event is intended to serve that purpose. The system administrator will be responsible for reviewing reported content and enforcing the platform's discussion rules. A general K-pop forum, shared-interest group discussions and a formal question-and-answer function were considered during requirement gathering, but they are outside the scope of this project version and are recorded as possible future extensions.`,

  'This solution responds directly to the issues identified in Question 24':
    `This solution responds directly to the ways event discussions are currently spread across separate spaces, as reported in Question 22: Telegram groups, X replies or group chats, WhatsApp groups and Facebook groups or online forums. Keeping the discussion with the event listing means that a fan who opens an event page can read the related conversation in the same place, rather than searching several chat groups. The community function will serve as an additional organized space rather than a replacement for every external platform. It is intended to reduce unnecessary switching between groups, support information sharing and make event-related conversations easier for fans to follow. Because the discussion is stored against a specific event, it also gives the administrator a defined scope within which to moderate reported content.`,

  'The third proposed solution is to develop a standardized event submission':
    `The third proposed solution is to develop a standardized event submission and verification workflow. Event information can be submitted in two ways: an organizer may use a public submission form without creating a platform account, or a registered organizer account may be used, which can be marked as a verified organizer after review. The submission form will collect the event name, date, time, location, description, event category, organizing party, contact details and supporting evidence, such as an official announcement URL, a social media account or a poster image. This evidence is requested because the credibility of a social media post cannot be judged from its appearance alone, and unofficial reposts can omit or alter the original details (Castillo et al., 2011; Zubiaga et al., 2018). Submitted events will be marked as pending until the system administrator reviews the details and checks the available evidence against the platform's verification criteria. Each submission is issued a reference number so that the submitter can follow its status and correct the details while it is still pending. The administrator will then approve the submission for publication or reject it with a recorded reason. Only approved submissions will appear as verified listings in the public event directory.`,

  'This solution addresses the need for a consistent and transparent way to manage':
    `This solution addresses the need for a consistent and transparent way to manage submitted event information. A standard checklist will help the administrator review submissions against the same basic requirements, including the identity of the organizing party, the supporting source and the official ticket channel, while recorded decisions and rejection reasons will make the process easier to trace. Because the outcome of a review and the reasons for it are shown to the submitter, the process is more transparent than an unexplained approval or rejection (Gillespie, 2018; Suzor et al., 2019). Fans will be able to report listings that appear incorrect or outdated. These measures aim to improve the reliability and accountability of the platform's information management process. The verification status will mean that a submission has been reviewed against K-Sync Malaysia's criteria; it will not guarantee event safety, quality or the organizer's future conduct, and it does not replace the fan's own judgment when purchasing tickets.`,

  'Administrator functions: review pending submissions':
    `Administrator functions: review pending submissions, check supporting information, approve or reject submissions, record rejection reasons, manage published event information, manage event categories, artists and member profiles, mark organizer accounts as verified and review reports.`,

  // ---------- US -ize spelling consistency (these base texts used -ise) ----------
  'The first proposed solution is to develop a centralized event information platform':
    `The first proposed solution is to develop a centralized event information platform where fans can discover K-pop events in Malaysia through organized listings. The system will provide event pages for activities such as concerts, fan meetings, festivals, cupsleeve events, exhibitions and pop-up events. Fans will be able to browse event listings and search or filter them according to available criteria, such as event name, artist or group, event category and location. Each event page will present the available details in a consistent structure, including the event date, time, venue, description, gallery images, the organizing party, links to the relevant source announcement and, where available, the official ticket channel. Only listings that have been approved through the verification process will be published to the public directory, so the directory presents information that has been reviewed rather than every post that has been collected.`,

  'This solution directly addresses the difficulty of discovering event information':
    `This solution directly addresses the difficulty of discovering event information across different platforms. By organizing approved event details in one place, K-Sync Malaysia will give fans a central point from which to explore upcoming activities and revisit the information they need. The system will not replace organizers' original announcements or control how external platforms distribute posts, and it will not sell tickets or process payments. Instead, it will provide a structured directory with search and filtering functions, together with a link to the official source or ticket channel, thereby reducing the effort needed to discover events and compare their publicly available details.`,

  'Event discovery: browse published events':
    `Event discovery: browse approved events, search by keyword, filter by artist, event category and location, view event details and gallery images, identify the organizing party, open the source or official ticket link and add an event to a personal calendar.`,

  'This chapter introduced K-Sync Malaysia as a proposed centralized platform':
    `This chapter introduced K-Sync Malaysia as a proposed centralized platform for K-pop event information and event-based fan community discussions. The background and current business process explained how event announcements and conversations are currently spread across separate social media platforms and community spaces. Three main problems were identified: event information that is fragmented across platforms, event-related discussions that are difficult to organize and retrieve, and the need for a consistent and transparent process for verifying event listings and identifying official sources. The discussion was supported by relevant research, questionnaire findings from 50 respondents and interviews with representatives of Malaysian K-pop fan communities. The questionnaire results highlighted the platforms fans rely on, the frequency of missed event updates, the separate spaces in which fans currently discuss events, the perceived usefulness of a centralized community space, and the importance placed on information being current and from a reliable source.`,

  // ---------- Table 1.2 implication cells (base edits) ----------
  'Organize discussions and information sharing by event.':
    `Attach the discussion to the event listing so related messages stay together.`,
  'Provide topic-based discussion threads and searchable content.':
    `Provide one organized space so fans do not have to switch between platforms.`,
  'Provide questions and answers and make previous responses easier to find.':
    `Let fans post event updates and announcements in the discussion attached to the event.`,
  'Allow fans to revisit and search event-specific discussions.':
    `Keep each event's discussion in its own area so earlier messages can be re-read.`,

  // ---------- Table 1.3 main-functions cell (base edit) ----------
  'Public submission form; evidence review; approve/reject; reasons; audit log; reporting.':
    `Public form or registered organizer account; submission reference number; evidence review; approve or reject with reasons; verified-organizer indicator; reporting.`,
};

// ---------------------------------------------------------------------------
// Respondent-data edits, Q24 removal, audit-log removal, Table 1.2 rebuild
// ---------------------------------------------------------------------------
const ADDED = [
  // ---------- 1.2.1 survey paragraph (Questions 6, 7, 8) — n = 50 ----------
  {
    key: 'Among the 30 questionnaire respondents, 83.3%',
    text: `Among the 50 questionnaire respondents, 42 (84%) reported using X (formerly Twitter) to find K-pop event information, while 31 (62%) used Instagram and 31 (62%) used TikTok. Official event organizer websites were reported by 29 respondents (58%) and Telegram channels by 24 (48%), while 17 respondents (34%) received information through friends or word of mouth. These responses show that participants rely on several different channels to discover event information. In total, 42 respondents (84%) reported checking two or more platforms, including 30 (60%) who checked three or more and 16 (32%) who checked four or more. A total of 38 respondents (76%) reported that they sometimes, often or very often missed an event because the social media algorithm showed the post too late, and 20 of them (40%) reported this happening often or very often. During an interview on 26 April 2026, the MKF Malaysia Instagram administrator explained that the timing and distribution of social media posts can affect when followers see updates (MKF Malaysia Instagram administrator, personal communication, April 26, 2026). This interview provides context for the survey findings, although it does not establish that every fan experiences delayed updates.`,
  },
  {
    key: 'Table 1.1: Questionnaire findings on platforms used to discover K-pop event information',
    text: 'Table 1.1: Questionnaire findings on platforms used to discover K-pop event information (Question 6, n = 50, multiple answers allowed)',
  },

  // ---------- Table 1.1: values re-computed for n = 50, sorted high -> low ----------
  { key: 'TikTok', text: 'Instagram', inTable: 0 },
  { key: 'Telegram channels', text: 'TikTok', inTable: 0 },
  { key: 'Instagram', text: 'Telegram channels', inTable: 0 },
  { key: '83.3%', text: '84%', inTable: 0 },
  { key: '56.7%', text: '62%', inTable: 0 },
  { key: '40.0%', text: '62%', inTable: 0, occurrence: 1 },
  { key: '40.0%', text: '58%', inTable: 0, occurrence: 2 },
  { key: '36.7%', text: '48%', inTable: 0 },
  { key: '16.7%', text: '34%', inTable: 0 },

  // ---------- 1.2.2 survey paragraph — Q24 removed, Q22/Q25/Q26 used ----------
  {
    key: 'Question 24 asked respondents what difficulties they experience',
    text: `Question 22 shows where the respondents currently discuss events: Telegram groups (18 respondents, 36%), X replies or group chats (12, 24%), WhatsApp groups (8, 16%) and Facebook groups or online forums (6, 12%), while 6 respondents (12%) rarely participate in group discussions. As summarized in Figure 1.3, these responses illustrate how event-related conversations are spread across several separate spaces rather than being attached to the event listing. Question 25 then asked respondents to rate the usefulness of a centralized K-pop community space where fans could discuss events, ask questions and share information without switching between platforms; 27 respondents (54%) rated it 4 or 5 out of 5, with a mean rating of 3.52, as shown in Figure 1.4. Question 26 asked which community features respondents would most like to use. The options selected most often were event information sharing (34 respondents, 68%) and shared-interest group discussions (32, 64%), followed by a general K-pop forum (30, 60%); event discussion forums were selected by 28 respondents (56%) and questions and answers by 25 (50%).`,
  },

  // ---------- Table 1.2: rebuilt from Q22 / Q25 / Q26 (no Question 24) ----------
  {
    key: 'Table 1.2: Community discussion issues and their implications for K-Sync Malaysia',
    text: 'Table 1.2: Questionnaire evidence on event discussions and its implications for K-Sync Malaysia',
  },
  { key: 'Theme reported in Question 24', text: 'Evidence from the questionnaire (n = 50)', inTable: 1 },
  { key: 'Event information is scattered across different groups', text: 'Event discussions are spread across separate spaces: Telegram groups (36%), X (24%), WhatsApp (16%) and Facebook groups or online forums (12%)', inTable: 1 },
  { key: 'Important messages get buried among other messages', text: 'A centralized community space for discussing events without switching platforms was rated 4 or 5 out of 5 by 27 respondents (54%)', inTable: 1 },
  { key: 'The same questions are repeatedly asked', text: 'Event information sharing with other fans was selected by 34 respondents (68%)', inTable: 1 },
  { key: 'Previous discussions or shared information are difficult to find', text: 'Event discussion forums, where a specific event is discussed in one organized space, were selected by 28 respondents (56%)', inTable: 1 },

  // ---------- 1.2.3 survey evidence (Q11, Q16) — n = 50 ----------
  {
    key: 'In the current cross-platform process described in this study',
    text: `In the current cross-platform process described in this study, fans may need to check event details through the original organizer or other sources themselves. The survey shows that 31 of the 50 respondents (62%) had encountered conflicting or outdated information about a K-pop event, as presented in Figure 1.5, and that knowing whether event information is current and comes from a reliable source was rated 4 or 5 out of 5 by 30 respondents (60%), with a mean rating of 3.72, as presented in Figure 1.6. The survey demonstrates that respondents use multiple platforms to locate event information, but it does not directly prove that fake events are common or that existing administrators are biased. Similarly, the interviews provide context about event information sharing but do not establish deliberate misconduct. The problem addressed here is the need for K-Sync Malaysia to have its own defined process for reviewing public event submissions, applying criteria consistently and recording the basis for publication decisions.`,
  },

  // ---------- 1.6.4 sampling scope — n = 50 ----------
  {
    key: 'The requirement-gathering activities include a questionnaire involving 30 K-pop fans',
    text: `The requirement-gathering activities include a questionnaire involving 50 K-pop fans and interviews with representatives of Malaysian K-pop fan communities. Most respondents were aged between 18 and 24 (30 respondents, 60%), and 22 respondents (44%) described themselves as fans of multiple groups. The questionnaire collects information about event discovery, the platforms and group chats used for discussion, the perceived usefulness of a centralized community space and preferred community features. Interviews with the MKF Malaysia Instagram administrator and Ms Syazwani from Cupsleeve Malaysia provide contextual information about event announcements, updates and information sharing. The sample size is limited, and the results should not be generalized to all K-pop fans in Malaysia.`,
  },

  // ---------- 1.6.6 limitations — n = 50, audit log removed ----------
  {
    key: 'First, the questionnaire includes only 30 respondents',
    text: `The project has several limitations. First, the questionnaire includes only 50 respondents, so the findings may not represent all Malaysian K-pop fans. Second, the system depends on organizers submitting accurate event details and sufficient supporting evidence; administrator review cannot guarantee that every event will remain accurate after publication. Third, event updates may be published externally after a K-Sync listing has been approved, so the platform requires the information to be updated when new details are reported or identified. Fourth, a single system administrator may still make mistakes or exercise bias despite standard criteria and recorded decision reasons. Finally, the development period limits the number of advanced functions and the duration of evaluation. These limitations should be considered when interpreting the project outcomes.`,
  },
];

// ---------------------------------------------------------------------------
// New citations in paragraphs that no earlier edit touched
// ---------------------------------------------------------------------------
const CITES = [
  {
    key: 'Social media platforms play an important role in how K-pop fans discover events',
    text: `Social media platforms play an important role in how K-pop fans discover events and interact with other fans. X, Instagram, TikTok, Telegram and organizer websites are among the channels used to share posters, schedules, venue information and announcements. Research on cross-platform media use shows that audiences increasingly encounter information through several services rather than one, so the same item is not necessarily seen by the same people on each platform (Fletcher & Nielsen, 2017). Research on Malaysian K-pop fandom has found that social media supports fan engagement and community participation (Roslan et al., 2024; Roslan et al., 2025). Recent work also describes how fans voluntarily create, seek and share fandom-related information through social platforms (Roslan et al., 2026). These studies provide a basis for understanding why online spaces are important for event discovery and fan communication.`,
  },
  {
    key: 'A further concern is how fans determine whether an event announcement is reliable',
    text: `A further concern is how fans determine whether an event announcement is reliable and up to date. A post may be shared by an unofficial account or reposted without the original source, while earlier details may remain visible after an update. Research by Geels et al. (2024) shows that source-related signals on social media do not automatically guarantee that readers will make accurate judgments about the credibility of a message. Studies of credibility in social media similarly find that reliability is inferred from several cues at once and that unverified claims can circulate widely before they are corrected (Castillo et al., 2011; Zubiaga et al., 2018). This supports the need to consider the evidence behind an event announcement rather than treating an online post or visible badge alone as conclusive proof. In a centralized event platform, a defined review process can help make the basis for publishing information more consistent and understandable.`,
  },
  {
    key: 'Research concerning Malaysian K-pop fans shows that social media is used for fan activities',
    text: `Research concerning Malaysian K-pop fans shows that social media is used for fan activities, connection and information sharing. Roslan et al. (2024) discussed how facilitating conditions influence social media use among K-pop fans, while Roslan et al. (2025) examined user experience and effort expectancy in fan-related social media use. These studies support the importance of social media in fandom but do not, by themselves, measure how difficult Malaysian fans find event discovery or how they cope when announcements are spread across several platforms. Research on information overload explains that when the volume of incoming messages exceeds what a person can process, relevant items become harder to identify and important details can be overlooked (Eppler & Mengis, 2004; Arnold et al., 2023). The questionnaire for this project therefore provides local evidence about the platforms used by its respondents and the difficulties they report.`,
  },
  {
    key: 'Research on K-pop fan communities recognizes that social media supports interaction',
    text: `Research on K-pop fan communities recognizes that social media supports interaction, participation and the sharing of fandom-related information. Roslan et al. (2026) describe how fans actively seek, organize and share information through online fan spaces. Studies of online communities more generally show that members are more willing to contribute when the environment supports reciprocity and a shared practice (Wasko & Faraj, 2005), and that the value of such communities depends on how information is organized and made retrievable as participation grows (Hwang et al., 2015). These findings demonstrate the role of community information sharing, but they do not establish that every K-pop group chat is disorganized. The problem in this project is supported more directly by the questionnaire items that collect respondents' experiences of retrieving event-related information across different spaces.`,
  },
  {
    key: 'Geels et al. (2024) examined how source identity and credential information',
    text: `Geels et al. (2024) examined how source identity and credential information affect perceived social media credibility. Their experiments found that visible source signals do not always lead users to accurate credibility judgments, and that source authenticity can be confused with the credibility of a particular message. Work on information credibility in social media reaches a similar conclusion: the reliability of a post is usually inferred from several signals together, such as the account, the wording and the pattern of sharing, rather than from a single badge (Castillo et al., 2011), and unverified claims can spread widely before they are resolved (Zubiaga et al., 2018). In related work, Majerczak and Strzelecki (2022) found that trust in online sources and awareness of misinformation shape whether users verify information before passing it on. Therefore, a verification label alone should not be treated as proof that every detail of an event is correct. A platform should consider the underlying event evidence and clearly communicate the scope of its verification process. Research on online content moderation also identifies consistency and clarity of decision criteria as important challenges for platforms that review user-generated content (Schaffner et al., 2024).`,
  },
  {
    key: 'Decision reasons and audit logs can improve traceability',
    text: `Standard verification criteria and recorded decision reasons can improve the traceability of approvals and rejections, so that submitters understand the outcome of a submission and the basis on which it was decided.`,
  },
];

// ---------------------------------------------------------------------------
// The six existing reference entries, rewritten so their journal / conference
// titles are italicised (the source document had them as plain text). Text is
// reproduced exactly; only italic runs are added.
// ---------------------------------------------------------------------------
const REFS = [
  {
    key: 'Geels, J., Graßl, P., Schraffenberger',
    runs: [
      { t: 'Geels, J., Graßl, P., Schraffenberger, H., Tanis, M., & Kleemans, M. (2024). Virtual lab coats: The effects of verified source information on social media post credibility. ' },
      { t: 'PLOS ONE, 19', i: true },
      { t: '(5), e0302323. https://doi.org/10.1371/journal.pone.0302323' },
    ],
  },
  {
    key: 'Roslan, M. A. A., Azmi Murad, M. A., & Nasharuddin, N. A. (2026)',
    runs: [
      { t: 'Roslan, M. A. A., Azmi Murad, M. A., & Nasharuddin, N. A. (2026). The impact of voluntarily engagement on social media usage intentions among (Korean Pop) K-pop fans. ' },
      { t: 'Journal of Information and Knowledge Management, 16', i: true },
      { t: '(1), 92\u2013104. https://doi.org/10.24191/ra564j86' },
    ],
  },
  {
    key: 'Roslan, M. A. A., Nasharuddin, N. A., & Azmi Murad, M. A. (2024)',
    runs: [
      { t: 'Roslan, M. A. A., Nasharuddin, N. A., & Azmi Murad, M. A. (2024). Navigating the digital realm: The role of facilitating conditions in social media use among Korean Pop (K-pop) fans. ' },
      { t: 'Open International Journal of Informatics, 12', i: true },
      { t: '(2), 13\u201323. https://doi.org/10.11113/oiji2024.12n2.305' },
    ],
  },
  {
    key: 'Roslan, M. A. A., Nasharuddin, N. A., & Azmi Murad, M. A. (2025)',
    runs: [
      { t: 'Roslan, M. A. A., Nasharuddin, N. A., & Azmi Murad, M. A. (2025). User experience matters: A qualitative exploration of effort expectancy and behavioural intention in social media use among Korean Pop (K-pop) fans. ' },
      { t: 'Applied Information Technology and Computer Science, 6', i: true },
      { t: '(1), 2407\u20132415. https://periodical.uthm.edu.my/index.php/aitcs/article/view/17986' },
    ],
  },
  {
    key: 'Schaffner, B., Bhagoji, A. N.',
    runs: [
      { t: 'Schaffner, B., Bhagoji, A. N., Cheng, S., Mei, J., Shen, J. L., Wang, G., Chetty, M., Feamster, N., Lakier, G., & Tan, C. (2024). \u201CCommunity guidelines make this the best party on the internet\u201D: An in-depth study of online platforms\u2019 content moderation policies. In ' },
      { t: 'Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems', i: true },
      { t: ' (Article 486, pp. 1\u201316). Association for Computing Machinery. https://doi.org/10.1145/3613904.3642333' },
    ],
  },
  {
    key: 'Suzor, N. P., Myers West, S.',
    runs: [
      { t: 'Suzor, N. P., Myers West, S., Quodling, A., & York, J. (2019). What do we mean when we talk about transparency? Toward meaningful transparency in commercial content moderation. ' },
      { t: 'International Journal of Communication, 13', i: true },
      { t: ', 1526\u20131543. https://ijoc.org/index.php/ijoc/article/view/9736' },
    ],
  },
];

export const EDITS = [
  ...BASE.map((e) => (REPLACE[e.key] ? { ...e, text: REPLACE[e.key] } : e)),
  ...ADDED,
  ...CITES,
  ...REFS,
];

// ---------------------------------------------------------------------------
// Figure insertions (original paragraph indices)
//   P48 = blank paragraph after Table 1.1  (end of 1.2.1)
//   P69 = blank paragraph after Table 1.2  (end of 1.2.2)
//   P78 = last paragraph of 1.2.3
// Figure 1.3 is now "where fans discuss" (ex-Q1.4); Figure 1.4 is the new
// Question 25 chart. The Question 24 figure is gone.
// ---------------------------------------------------------------------------
export const INSERTS = [
  { afterPara: 48, figures: ['Figure_1_1_platforms_checked', 'Figure_1_2_missed_events'] },
  { afterPara: 69, figures: ['Figure_1_3_where_fans_discuss', 'Figure_1_4_community_usefulness'] },
  { afterPara: 78, figures: ['Figure_1_5_conflicting_information', 'Figure_1_6_importance_reliable_source'] },
];

// ---------------------------------------------------------------------------
// New reference-list paragraphs, inserted alphabetically.
// These are ORIGINAL-document paragraph indices (verified with perf/peek-refs.mjs):
//   #191 = REFERENCES heading   -> Arnold, Bucher, Castillo, Eppler, Fletcher
//   #192 = Geels et al. (2024)  -> Gillespie, Hwang, Majerczak
//   #197 = Suzor et al. (2019)  -> Wasko, Zubiaga
// `i: true` marks an italic run (journal / book title).
// ---------------------------------------------------------------------------
export const NEW_PARAS = [
  {
    afterPara: 191,
    templatePara: 192,
    paras: [
      { runs: [{ t: 'Arnold, M., Goldschmitt, M., & Rigotti, T. (2023). Dealing with information overload: A comprehensive review. ' }, { t: 'Frontiers in Psychology, 14', i: true }, { t: ', 1122200. https://doi.org/10.3389/fpsyg.2023.1122200' }] },
      { runs: [{ t: 'Bucher, T. (2017). The algorithmic imaginary: Exploring the ordinary affects of Facebook algorithms. ' }, { t: 'Information, Communication & Society, 20', i: true }, { t: '(1), 30\u201344. https://doi.org/10.1080/1369118X.2016.1154086' }] },
      { runs: [{ t: 'Castillo, C., Mendoza, M., & Poblete, B. (2011). Information credibility on Twitter. In ' }, { t: 'Proceedings of the 20th International Conference on World Wide Web', i: true }, { t: ' (pp. 675\u2013684). Association for Computing Machinery. https://doi.org/10.1145/1963405.1963500' }] },
      { runs: [{ t: 'Eppler, M. J., & Mengis, J. (2004). The concept of information overload: A review of literature from organization science, accounting, marketing, MIS, and related disciplines. ' }, { t: 'The Information Society, 20', i: true }, { t: '(5), 325\u2013344. https://doi.org/10.1080/01972240490507974' }] },
      { runs: [{ t: 'Fletcher, R., & Nielsen, R. K. (2017). Are news audiences increasingly fragmented? A cross-national comparative analysis of cross-platform news audience fragmentation and duplication. ' }, { t: 'Journal of Communication, 67', i: true }, { t: '(4), 476\u2013498. https://doi.org/10.1111/jcom.12315' }] },
    ],
  },
  {
    afterPara: 192,
    templatePara: 192,
    paras: [
      { runs: [{ t: 'Gillespie, T. (2018). ' }, { t: 'Custodians of the Internet: Platforms, content moderation, and the hidden decisions that shape social media', i: true }, { t: '. Yale University Press.' }] },
      { runs: [{ t: 'Hwang, E. H., Singh, P. V., & Argote, L. (2015). Knowledge sharing in online communities: Learning to cross geographic and hierarchical boundaries. ' }, { t: 'Organization Science, 26', i: true }, { t: '(6), 1593\u20131611. https://doi.org/10.1287/orsc.2015.1009' }] },
      { runs: [{ t: 'Majerczak, P., & Strzelecki, A. (2022). Trust, media credibility, social ties, and the intention to share towards information verification in an age of fake news. ' }, { t: 'Behavioral Sciences, 12', i: true }, { t: '(2), 51. https://doi.org/10.3390/bs12020051' }] },
    ],
  },
  {
    afterPara: 197,
    templatePara: 192,
    paras: [
      { runs: [{ t: 'Wasko, M. M., & Faraj, S. (2005). Why should I share? Examining social capital and knowledge contribution in electronic networks of practice. ' }, { t: 'MIS Quarterly, 29', i: true }, { t: '(1), 35\u201358. https://doi.org/10.2307/25148667' }] },
      { runs: [{ t: 'Zubiaga, A., Aker, A., Bontcheva, K., Liakata, M., & Procter, R. (2018). Detection and resolution of rumours in social media: A survey. ' }, { t: 'ACM Computing Surveys, 51', i: true }, { t: '(2), Article 32, 1\u201336. https://doi.org/10.1145/3161603' }] },
    ],
  },
];
