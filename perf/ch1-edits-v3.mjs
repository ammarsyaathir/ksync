/* perf/ch1-edits-v3.mjs — FINAL Chapter 1 corrections.

   = the 45 corrections in ch1-edits.mjs (system description: Express/EJS/SQLite-MySQL,
     event-based community, submission + verification wording), PLUS
   = respondent-data corrections so every number in the chapter reflects the real
     K-Sync Malaysia fan survey (n = 51, Google Forms export), PLUS
   = figure references that point at Figures 1.1–1.6 (see perf/make-figures.mjs).

   Every `text` is the COMPLETE replacement for its paragraph. Keys must match the
   ORIGINAL document (K_Sync_Malaysia_Chapter_1_Revised.docx).
*/
import { EDITS as BASE } from './ch1-edits.mjs';

// ---------------------------------------------------------------------------
// BASE edits whose text must change now that the real data is available
// ---------------------------------------------------------------------------
const REPLACE = {
  'The problems addressed by this project were identified from the current event-information process':
    'The problems addressed by this project were identified from the current event-information process, a questionnaire completed by 51 respondents, and interviews with representatives from Malaysian K-pop fan communities. The questionnaire examined how respondents discover K-pop events and the difficulties they experience when discussing events across group chats or platforms. Interviews with the MKF Malaysia Instagram administrator and Ms Syazwani from Cupsleeve Malaysia provided additional context about how event information is published and shared. Three problems are discussed below: event information that is fragmented across platforms, event-related discussions that are difficult to organise and retrieve, and the absence of a consistent and transparent process for confirming that an event listing and its ticket channel are official. The questionnaire sample is limited and is used as evidence about the respondents who participated, not as a national estimate of all K-pop fans in Malaysia.',

  'The findings indicate that fans in this sample rely on multiple sources':
    'The findings indicate that fans in this sample rely on multiple sources to discover K-pop events. Because most respondents checked more than one platform, and more than half checked three or more, locating a single event can require several separate searches. This makes it harder to obtain a consolidated view of upcoming events, as summarised in Figure 1.1. A majority of respondents had also missed an event because a post appeared too late in a social media feed, as shown in Figure 1.2. A centralized directory that presents approved events in one comparable structure, with keyword search and filters for artist, event category and location, is therefore proposed to help fans discover relevant events and to let them check a single source that has already been reviewed before publication.',

  'The responses to Questions 24':
    'The responses to Questions 24–26 provide a direct reason to include community discussions as part of K-Sync Malaysia. Thirty-one of the 51 respondents (60.8%) reported at least one difficulty when discussing events across group chats or platforms, and just over half rated a centralized community space as useful. At the same time, 20 respondents (39.2%) reported no such difficulties, so the community function is presented as an additional organised space rather than a feature that every fan requires. Based on the recorded response themes and the features listed in Question 26, this project scopes the community function to an event-based discussion area attached to each published event listing. A general K-pop discussion area and a formal question-and-answer function were among the features listed in Question 26, and they were also among the options respondents selected most often, but they are recorded here as possible future extensions rather than as part of this project version.',

  'This chapter introduced K-Sync Malaysia as a proposed centralized platform':
    'This chapter introduced K-Sync Malaysia as a proposed centralized platform for K-pop event information and event-based fan community discussions. The background and current business process explained how event announcements and conversations are currently spread across separate social media platforms and community spaces. Three main problems were identified: event information that is fragmented across platforms, event-related discussions that are difficult to organise and retrieve, and the need for a consistent and transparent process for verifying event listings and identifying official sources. The discussion was supported by relevant research, questionnaire findings from 51 respondents and interviews with representatives of Malaysian K-pop fan communities. The questionnaire results highlighted the platforms fans rely on, the frequency of missed event updates, the difficulties fans experience when discussing events across group chats, and the importance placed on information being current and from a reliable source.',
};

// ---------------------------------------------------------------------------
// New edits: respondent-data paragraphs, table 1.1 cells, table 1.2 cells
// ---------------------------------------------------------------------------
const ADDED = [
  // ---------- 1.2.1 the survey paragraph (Question 6, 7, 8) ----------
  {
    key: 'Among the 30 questionnaire respondents, 83.3%',
    text: 'Among the 51 questionnaire respondents, 43 (84.3%) reported using X (formerly Twitter) to find K-pop event information, while 31 (60.8%) used Instagram and 31 (60.8%) used TikTok. Official event organizer websites were reported by 30 respondents (58.8%) and Telegram channels by 25 (49.0%), while 18 respondents (35.3%) received information through friends or word of mouth. These responses show that participants rely on several different channels to discover event information. In total, 43 respondents (84.3%) reported checking two or more platforms, including 31 (60.8%) who checked three or more and 16 (31.4%) who checked four or more. A total of 38 respondents (74.5%) reported that they sometimes, often or very often missed an event because the social media algorithm showed the post too late, and 20 of them (39.2%) reported this happening often or very often. During an interview on 26 April 2026, the MKF Malaysia Instagram administrator explained that the timing and distribution of social media posts can affect when followers see updates (MKF Malaysia Instagram administrator, personal communication, April 26, 2026). This interview provides context for the survey findings, although it does not establish that every fan experiences delayed updates.'
  },
  {
    key: 'Table 1.1: Questionnaire findings on platforms used to discover K-pop event information',
    text: 'Table 1.1: Questionnaire findings on platforms used to discover K-pop event information (Question 6, n = 51, multiple answers allowed)'
  },

  // ---------- Table 1.1: values re-computed and rows sorted high → low ----------
  { key: 'TikTok', text: 'Instagram', inTable: 0 },
  { key: 'Telegram channels', text: 'TikTok', inTable: 0 },
  { key: 'Instagram', text: 'Telegram channels', inTable: 0 },
  { key: '83.3%', text: '84.3%', inTable: 0 },
  { key: '56.7%', text: '60.8%', inTable: 0 },
  { key: '40.0%', text: '60.8%', inTable: 0, occurrence: 1 },
  { key: '40.0%', text: '58.8%', inTable: 0, occurrence: 2 },
  { key: '36.7%', text: '49.0%', inTable: 0 },
  { key: '16.7%', text: '35.3%', inTable: 0 },

  // ---------- 1.2.2 the survey paragraph (Questions 24, 25, 26) ----------
  {
    key: 'Question 24 asked respondents what difficulties they experience',
    text: 'Question 24 asked respondents what difficulties they experience when discussing K-pop events across different group chats or platforms. The most common difficulties were that the same questions are repeatedly asked in different groups and that important messages get buried among other messages, each reported by 27 respondents (52.9%). Event information being scattered across different groups was reported by 24 respondents (47.1%), and difficulty finding previous discussions or shared information by 19 respondents (37.3%). Twenty respondents (39.2%) reported that they do not experience these difficulties. These themes describe retrieval and organisation problems rather than simply a lack of event announcements, as summarised in Figure 1.3. Figure 1.4 shows where the respondents currently discuss events: Telegram groups (19 respondents, 37.3%), X replies or group chats (12, 23.5%), WhatsApp groups (8, 15.7%) and Facebook groups or online forums (6, 11.8%), which illustrates how conversations are spread across several separate spaces. Question 25 then asked respondents to rate the usefulness of a centralized K-pop community space where fans could discuss events, ask questions and share information without switching between platforms; 28 respondents (54.9%) rated it 4 or 5 out of 5, with a mean rating of 3.55. Question 26 asked which community features respondents would most like to use. The options selected most often were event information sharing (35 respondents, 68.6%), shared-interest group discussions (33, 64.7%) and a general K-pop forum (31, 60.8%); event discussion forums were selected by 29 respondents (56.9%) and questions and answers by 26 (51.0%).'
  },

  // ---------- Table 1.2: attach the measured frequencies to each theme ----------
  { key: 'Theme reported in Question 24', text: 'Theme reported in Question 24 (n = 51, multiple answers allowed)', inTable: 1 },
  { key: 'Event information is scattered across different groups', text: 'Event information is scattered across different groups (47.1%)', inTable: 1 },
  { key: 'Important messages get buried among other messages', text: 'Important messages get buried among other messages (52.9%)', inTable: 1 },
  { key: 'The same questions are repeatedly asked', text: 'The same questions are repeatedly asked (52.9%)', inTable: 1 },
  { key: 'Previous discussions or shared information are difficult to find', text: 'Previous discussions or shared information are difficult to find (37.3%)', inTable: 1 },

  // ---------- 1.2.3 the survey evidence on conflicting information (Q11, Q16) ----------
  {
    key: 'In the current cross-platform process described in this study',
    text: 'In the current cross-platform process described in this study, fans may need to check event details through the original organizer or other sources themselves. The survey shows that 31 of the 51 respondents (60.8%) had encountered conflicting or outdated information about a K-pop event, as presented in Figure 1.5, and that knowing whether event information is current and comes from a reliable source was rated 4 or 5 out of 5 by 31 respondents (60.8%), with a mean rating of 3.75, as presented in Figure 1.6. The survey demonstrates that respondents use multiple platforms to locate event information, but it does not directly prove that fake events are common or that existing administrators are biased. Similarly, the interviews provide context about event information sharing but do not establish deliberate misconduct. The problem addressed here is the need for K-Sync Malaysia to have its own defined process for reviewing public event submissions, applying criteria consistently and recording the basis for publication decisions.'
  },

  // ---------- 1.6 requirement gathering: sample size + response profile ----------
  {
    key: 'The requirement-gathering activities include a questionnaire involving 30 K-pop fans',
    text: 'The requirement-gathering activities include a questionnaire involving 51 K-pop fans and interviews with representatives of Malaysian K-pop fan communities. Most respondents were aged between 18 and 24 (31 respondents, 60.8%), and 23 respondents (45.1%) described themselves as fans of multiple groups. The questionnaire collects information about event discovery, community discussion difficulties, perceived usefulness of a centralized community space and preferred community features. Interviews with the MKF Malaysia Instagram administrator and Ms Syazwani from Cupsleeve Malaysia provide contextual information about event announcements and information sharing. The sample size is limited, and the results should not be generalised to all K-pop fans in Malaysia.'
  },

  // ---------- 1.8 limitations: sample size ----------
  {
    key: 'First, the questionnaire includes only 30 respondents',
    text: 'The project has several limitations. First, the questionnaire includes only 51 respondents, so the findings may not represent all Malaysian K-pop fans. Second, the system depends on organizers submitting accurate event details and sufficient supporting evidence; administrator review cannot guarantee that every event will remain accurate after publication. Third, event updates may be published externally after a K-Sync listing has been approved, so the platform requires the information to be updated when new details are reported or identified. Fourth, a single system administrator may still make mistakes or exercise bias despite standard criteria and audit logs. Finally, the development period limits the number of advanced functions and the duration of evaluation. These limitations should be considered when interpreting the project outcomes.'
  },
];

export const EDITS = [
  ...BASE.map((e) => (REPLACE[e.key] ? { ...e, text: REPLACE[e.key] } : e)),
  ...ADDED,
];

// ---------------------------------------------------------------------------
// Figure insertions: after the last paragraph of each problem subsection
//   P48 = blank paragraph after Table 1.1  (end of 1.2.1)
//   P69 = blank paragraph after Table 1.2  (end of 1.2.2)
//   P78 = last paragraph of 1.2.3
// ---------------------------------------------------------------------------
export const INSERTS = [
  { afterPara: 48, figures: ['Figure_1_1_platforms_checked', 'Figure_1_2_missed_events'] },
  { afterPara: 69, figures: ['Figure_1_3_discussion_difficulties', 'Figure_1_4_where_fans_discuss'] },
  { afterPara: 78, figures: ['Figure_1_5_conflicting_information', 'Figure_1_6_importance_reliable_source'] },
];
