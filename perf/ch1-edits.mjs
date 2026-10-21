/* perf/ch1-edits.mjs — Chapter 1 corrections so the text matches the built system.

   Each edit finds the paragraph whose text CONTAINS `key` (must be unique) and
   replaces that paragraph's text while keeping the original paragraph style and
   run formatting. Text is plain: the patcher positions it in a single run and
   the document's own font/size/justification still apply.

   Changes applied (all sections, for whole-chapter consistency):
     - community function = event-based discussion attached to each listing
       (general K-pop board / Q&A / search recorded as future extensions)
     - organizers may submit publicly OR use a registered, verified organizer account
     - submission reference number, status tracking, official ticket channel check
     - technology = Express + EJS + SQLite/MySQL (not Hono/Supabase/Cloudflare)
     - Tables 1.2 and 1.3 aligned with the corrected functions
*/

export const EDITS = [
  // ---------- 1.1 Background: proposed-system paragraph ----------
  {
    key: 'To address these issues, K-Sync Malaysia is proposed as a centralized web-based platform',
    text: 'To address these issues, K-Sync Malaysia is proposed as a centralized web-based platform for K-pop event information and event-based fan community discussions in Malaysia. Fans will be able to browse and search approved event listings and take part in the discussion attached to each event. Event details can be submitted through a public form without creating an account, or through a registered organizer account that the administrator can mark as verified once reviewed. A system administrator will review submitted information before approved listings are published, and standardized review criteria and records of decisions will help improve transparency in the platform’s event verification process.'
  },
  // ---------- 1.1 Background: key terms ----------
  {
    key: 'Key terms. In this project, an event listing refers to a structured page',
    text: 'Key terms. In this project, an event listing refers to a structured page containing information about a K-pop event. Event-based fan discussion refers to user-generated posts and replies attached to a particular published event, rather than to a general discussion board. Event verification refers to the administrator’s review of submitted event details and supporting sources against the platform’s criteria; it does not guarantee event quality or safety.'
  },

  // ---------- 1.2 Problem Statements ----------
  {
    key: 'The problems addressed by this project were identified from the current event-information process',
    text: 'The problems addressed by this project were identified from the current event-information process, a questionnaire completed by 30 respondents, and interviews with representatives from Malaysian K-pop fan communities. The questionnaire examined how respondents discover K-pop events and the difficulties they experience when discussing events across group chats or platforms. Interviews with the MKF Malaysia Instagram administrator and Ms Syazwani from Cupsleeve Malaysia provided additional context about how event information is published and shared. Three problems are discussed below: event information that is fragmented across platforms, event-related discussions that are difficult to organise and retrieve, and the absence of a consistent and transparent process for confirming that an event listing and its ticket channel are official. The questionnaire sample is limited and is used as evidence about the respondents who participated, not as a national estimate of all K-pop fans in Malaysia.'
  },
  // 1.2.1
  {
    key: 'K-pop event information in Malaysia is published through different online platforms',
    text: 'K-pop event information in Malaysia is published through different online platforms, including X, TikTok, Instagram, Telegram and official organizer websites. Each platform may contain different event announcements, and the information may not be presented in a consistent format. Fans who want to discover concerts, fan meetings, festivals, cupsleeve events, exhibitions or pop-up events may have to follow multiple accounts and compare separate posts to locate event details. The same event may also be described differently across sources when a date, venue or ticket detail is changed after the first announcement, and older posts may remain visible after the update. This can make event discovery less convenient, especially when fans are interested in several artists or events occurring within a similar period.'
  },
  {
    key: 'The findings indicate that fans in this sample rely on multiple sources',
    text: 'The findings indicate that fans in this sample rely on multiple sources to discover K-pop events and that some respondents experience delays in seeing announcements. Searching across separate platforms can require additional effort and makes it harder to obtain a consolidated view of upcoming events. A centralized directory that presents approved events in one comparable structure, with keyword search and filters for artist, event category and location, is therefore proposed to help fans discover relevant events and to let them check a single source that has already been reviewed before publication.'
  },
  // 1.2.2
  {
    key: 'K-pop fans use group chats and online communities to discuss events',
    text: 'K-pop fans use group chats and online communities to discuss events, ask questions, share updates and communicate with other fans. However, when conversations take place across several groups or platforms, useful information may become difficult to retrieve. Important messages can be buried under newer messages, repeated questions may appear when earlier answers cannot be found, and event information may be scattered across different group conversations. In addition, a discussion is usually not attached to the event listing itself, so a fan must move between the event announcement and several chat groups to find an answer or confirm a detail. As a result, fans may need to scroll through long chat histories or switch between platforms to locate a previous answer or an event update.'
  },
  {
    key: 'The responses to Questions 24',
    text: 'The responses to Questions 24–26 provide a direct reason to include community discussions as part of K-Sync Malaysia. However, the response rows available for drafting this chapter do not include the complete distribution for all 30 respondents, so no overall percentage or average rating is claimed here. The final thesis should include the full frequency or percentage summary for these questions once it has been calculated from the complete questionnaire dataset. Based on the recorded response themes and the features presented in Question 26, this project scopes the community function to an event-based discussion area attached to each published event listing. A general K-pop discussion area and a formal question-and-answer function were among the features listed in Question 26, but they are recorded here as possible future extensions rather than as part of this project version.'
  },
  {
    key: 'A centralized community feature could help organize conversations',
    text: 'A centralized community function could help organise conversations according to the event they relate to, making it easier for fans to return to earlier discussions and share useful information in a relevant place. This feature would not eliminate all repeated questions or replace every external group chat. Instead, it would provide an additional organised space in which event-related conversations are kept with the event listing, reducing the need to switch between several platforms for every discussion.'
  },
  // 1.2.3
  {
    key: 'Finding an event announcement and discussing it with other fans do not automatically',
    text: 'Finding an event announcement and discussing it with other fans do not automatically establish that the information is official or current. Posts may be shared by accounts other than the original organizer, and reposted information may not include a direct link to the original announcement. Event details may also be changed after the first post is published, and ticket links circulated by unofficial accounts may lead to resale or fraudulent listings rather than an authorised ticketing channel. When fans obtain information from several sources, they may need to decide which source to trust or return to the organizer’s page to confirm the latest details. This creates a need for the proposed centralized platform to explain how event listings are checked before they are presented as verified, and to make the official source and ticket channel visible next to each listing.'
  },
  {
    key: 'Without a defined workflow, event submissions may be reviewed inconsistently',
    text: 'Without a defined workflow, event submissions may be reviewed inconsistently, rejected organizers may not understand why their submissions were not published, and fans may have no way of checking whether a listing is still under review or has been approved. A documented decision process can improve accountability by recording whether an event was approved or rejected and the reason for that decision. Suzor et al. (2019) argue that meaningful transparency in content moderation involves giving affected users clear information about decisions and the rules applied. For K-Sync Malaysia, this supports the inclusion of standardized verification criteria, recorded rejection reasons, administrative audit logs, a reference number that allows a submitter to follow the status of a submission, an indicator that distinguishes verified organizer accounts, and a mechanism for fans to report incorrect or outdated listings. These features are intended to reduce avoidable inconsistency and improve traceability; they cannot guarantee that all decisions will be free from bias or that every event will remain accurate after publication.'
  },

  // ---------- 1.3 Proposed Solutions ----------
  {
    key: 'To address the problems identified in Section 1.2',
    text: 'To address the problems identified in Section 1.2, this project proposes K-Sync Malaysia: A Centralized Platform for K-Pop Event Information and Fan Community Discussions. The system will provide three main solutions: a centralized and verified event directory, event-based community discussion, and a standardized event submission and verification process. Each solution is mapped to one problem so that the scope of development remains aligned with the evidence gathered during requirement analysis.'
  },
  // 1.3.1
  {
    key: 'The first proposed solution is to develop a centralized event information platform',
    text: 'The first proposed solution is to develop a centralized event information platform where fans can discover K-pop events in Malaysia through organised listings. The system will provide event pages for activities such as concerts, fan meetings, festivals, cupsleeve events, exhibitions and pop-up events. Fans will be able to browse event listings and search or filter them according to available criteria, such as event name, artist or group, event category and location. Each event page will present the available details in a consistent structure, including the event date, time, venue, description, gallery images, the organising party, links to the relevant source announcement and, where available, the official ticket channel. Only listings that have been approved through the verification process will be published to the public directory, so the directory presents information that has been reviewed rather than every post that has been collected.'
  },
  {
    key: 'This solution directly addresses the difficulty of discovering event information',
    text: 'This solution directly addresses the difficulty of discovering event information across different platforms. By organising approved event details in one place, K-Sync Malaysia will give fans a central point from which to explore upcoming activities and revisit the information they need. The system will not replace organizers’ original announcements or control how external platforms distribute posts, and it will not sell tickets or process payments. Instead, it will provide a structured directory with search and filtering functions, together with a link to the official source or ticket channel, thereby reducing the effort needed to discover events and compare their publicly available details.'
  },
  // 1.3.2
  {
    key: 'The second proposed solution is to provide an organized fan community space',
    text: 'The second proposed solution is to provide event-based community discussion within K-Sync Malaysia. Each published event page will include a discussion area where registered fans can post messages, reply to other fans and share useful information related to that event, so that the conversation is kept with the event listing instead of being scattered across separate group chats. Community participation will require a fan account, and each message is stored with a reference to the related event. The system administrator will be responsible for reviewing reported content and enforcing the platform’s discussion rules. A general K-pop discussion area and a formal question-and-answer function were considered during requirement gathering, but they are outside the scope of this project version and are recorded as possible future extensions.'
  },
  {
    key: 'This solution responds directly to the issues identified in Question 24',
    text: 'This solution responds directly to the issues identified in Question 24, including information being scattered across different group chats, important messages being buried and difficulty locating previous discussions. Keeping the discussion with the event listing means that a fan who opens an event page can read the related conversation in the same place, rather than searching several chat groups. The community function will serve as an additional organised space rather than a replacement for every external platform. It is intended to reduce unnecessary switching between groups, support information sharing and make event-related conversations easier for fans to follow. Because the discussion is stored against a specific event, it also gives the administrator a defined scope within which to moderate reported content.'
  },
  // 1.3.3
  {
    key: 'The third proposed solution is to develop a standardized event submission',
    text: 'The third proposed solution is to develop a standardized event submission and verification workflow. Event information can be submitted in two ways: an organizer may use a public submission form without creating a platform account, or a registered organizer account may be used, which can be marked as a verified organizer after review. The submission form will collect the event name, date, time, location, description, event category, organising party, contact details and supporting evidence, such as an official announcement URL, a social media account or a poster image. Submitted events will be marked as pending until the system administrator reviews the details and checks the available evidence against the platform’s verification criteria. Each submission is issued a reference number so that the submitter can follow its status and correct the details while it is still pending. The administrator will then approve the submission for publication or reject it with a recorded reason. Only approved submissions will appear as verified listings in the public event directory.'
  },
  {
    key: 'This solution addresses the need for a consistent and transparent way to manage',
    text: 'This solution addresses the need for a consistent and transparent way to manage submitted event information. A standard checklist will help the administrator review submissions against the same basic requirements, including the identity of the organising party, the supporting source and the official ticket channel, while recorded decisions and rejection reasons will make the process easier to trace. An audit log will record important administrative actions, and fans will be able to report listings that appear incorrect or outdated. These measures aim to improve the reliability and accountability of the platform’s information management process. The verification status will mean that a submission has been reviewed against K-Sync Malaysia’s criteria; it will not guarantee event safety, quality or the organizer’s future conduct, and it does not replace the fan’s own judgement when purchasing tickets.'
  },

  // ---------- 1.4 Aim ----------
  {
    key: 'The aim of this project is to develop K-Sync Malaysia:',
    text: 'The aim of this project is to develop K-Sync Malaysia: A Centralized Platform for K-Pop Event Information and Fan Community Discussions, a web-based platform that helps Malaysian K-pop fans discover event information in one place, take part in event-based community discussions and access event listings that have undergone a structured administrator verification process.'
  },

  // ---------- 1.5 Objectives ----------
  {
    key: 'To gather and analyse the system requirements for K-Sync Malaysia',
    text: 'To gather and analyse the system requirements for K-Sync Malaysia based on the needs of Malaysian K-pop fans for event discovery and event-based discussion, and on the event submission and verification process.'
  },
  {
    key: 'To design K-Sync Malaysia by preparing the system architecture',
    text: 'To design K-Sync Malaysia by preparing the system architecture, database design, user interface and use case workflows for event discovery, event-based community discussion and event verification.'
  },
  {
    key: 'To develop a web-based K-Sync Malaysia system that provides',
    text: 'To develop a web-based K-Sync Malaysia system that provides centralized event listings, event-based community discussion and administrator-controlled event submission and verification, including status tracking for submitters and a reporting function for fans.'
  },

  // ---------- 1.6 Scope ----------
  {
    key: 'The project scope defines the functions, users, geographical coverage',
    text: 'The project scope defines the functions, users, geographical coverage, study participants, technologies and time period covered by the development of K-Sync Malaysia. The system is limited to event information, event-based fan discussion and event verification. It does not provide ticket booking, online payments, merchandise purchasing or real-time merchandise stock tracking.'
  },
  {
    key: 'The system supports three types of interaction',
    text: 'The system supports three types of user interaction: fans with registered accounts, event organizers and the system administrator. Event organizers may submit information through a public form without creating an account, or may register an organizer account which the administrator can mark as a verified organizer after review. The main system functions are as follows:'
  },
  {
    key: 'Fan account functions: register, log in, log out',
    text: 'Fan account functions: register with email verification, log in (including Google sign-in), log out, manage profile information, change the account password, save events for later reference and manage notifications.'
  },
  {
    key: 'Event discovery: browse published events',
    text: 'Event discovery: browse approved events, search by keyword, filter by artist, event category and location, view event details and gallery images, identify the organising party, open the source or official ticket link and add an event to a personal calendar.'
  },
  {
    key: 'Fan community: participate in event-based discussions',
    text: 'Fan community: participate in the discussion attached to a published event, post messages and replies, share event information and report inappropriate or incorrect content.'
  },
  {
    key: 'Public event submission: allow an organizer to enter event details',
    text: 'Event submission: allow an organizer to enter event details and provide supporting evidence, either through a public form without registering an account or through a registered organizer account, and to follow the status of the submission using its reference number.'
  },
  {
    key: 'Administrator functions: review pending submissions',
    text: 'Administrator functions: review pending submissions, check supporting information, approve or reject submissions, record rejection reasons, manage published event information, manage event categories, artists and member profiles, mark organizer accounts as verified, review reports and access administrative audit records.'
  },
  {
    key: 'The system will not include a separate organizer dashboard',
    text: 'The system will not include a separate organizer dashboard or organizer-side analytics, ticket sales, event reservations, payment integration, fan support merchandise ordering, live stock tracking or a general discussion forum that is not tied to an event. These exclusions keep the system focused on event discovery, information sharing and verification. Organizer accounts exist only to submit event information and carry a verification indicator; community moderation will be handled by the system administrator rather than by a separate fanclub administrator role in this project version.'
  },
  {
    key: 'K-Sync Malaysia is intended for K-pop events held in Malaysia',
    text: 'K-Sync Malaysia is intended for K-pop events held in Malaysia. Event categories may include concerts, fan meetings, festivals, cupsleeve events, exhibitions, pop-up events and other relevant fan activities. The platform will present event information with identifiable locations in Malaysia. It is not intended to operate as a worldwide event directory, and the project will not provide location-based ticket purchasing or real-time GPS tracking.'
  },
  {
    key: 'K-Sync Malaysia will be implemented as a responsive web-based application',
    text: 'K-Sync Malaysia will be implemented as a responsive web-based application that can be accessed through desktop and mobile web browsers. The interface is built with HTML, CSS, JavaScript and server-side EJS templates, and Node.js with the Express framework handles the server-side routes and application logic. Relational data such as accounts, artists and member profiles, event listings, submissions, discussion messages and reports is stored in a relational database, using a local SQLite database for development and Hostinger MySQL for the deployed environment through the same data access layer. Google sign-in is verified through the Firebase Admin SDK, and email verification and notification messages are delivered through an SMTP mail service. The project does not include separate native Android or iOS applications.'
  },

  // ---------- 1.7 Significance ----------
  {
    key: 'K-Sync Malaysia is expected to benefit K-pop fans',
    text: 'K-Sync Malaysia is expected to benefit K-pop fans, event organizers and system administrators by bringing event discovery, event-based community discussion and event verification into one platform.'
  },
  {
    key: 'Search and filtering functions can help fans locate events',
    text: 'Search and filtering functions can help fans locate events by keyword, artist, location and event category.'
  },
  {
    key: 'Event-based discussions and questions and answers',
    text: 'Event-based discussions keep conversations with the event listing, so useful information is easier to find and repeated questions are reduced.'
  },
  {
    key: 'Organizers can submit event information through a public form without creating a platform account.',
    text: 'Organizers can submit event information through a public form without creating a platform account, or register an organizer account that can be marked as verified once reviewed.'
  },
  {
    key: 'Approval or rejection reasons can help organizers understand',
    text: 'Approval or rejection reasons, together with a reference number for each submission, can help organizers understand the outcome of a submission and identify information that needs correction.'
  },

  // ---------- 1.9 Chapter Summary ----------
  {
    key: 'This chapter introduced K-Sync Malaysia as a proposed centralized platform',
    text: 'This chapter introduced K-Sync Malaysia as a proposed centralized platform for K-pop event information and event-based fan community discussions. The background and current business process explained how event announcements and conversations are currently spread across separate social media platforms and community spaces. Three main problems were identified: event information that is fragmented across platforms, event-related discussions that are difficult to organise and retrieve, and the need for a consistent and transparent process for verifying event listings and identifying official sources. The discussion was supported by relevant research, questionnaire findings from 30 respondents and interviews with representatives of Malaysian K-pop fan communities.'
  },
  {
    key: 'To address these problems, three corresponding solutions were proposed',
    text: 'To address these problems, three corresponding solutions were proposed: a centralized and verified event directory, event-based community discussion and a standardized event submission and verification workflow. The chapter also established the project aim, objectives, scope, limitations and expected benefits. The next chapter reviews related literature and existing systems to provide a foundation for the requirements and design of K-Sync Malaysia.'
  },

  // ---------- Table 1.2 cells (implications) ----------
  { key: 'Organize discussions and information sharing by event.', text: 'Attach the discussion to the event listing so related messages stay together.' },
  { key: 'Provide topic-based discussion threads and searchable content.', text: 'Keep the discussion for an event in one stream instead of across several group chats.' },
  { key: 'Provide questions and answers and make previous responses easier to find.', text: 'Keep earlier replies in the same event discussion so they can be re-read.' },
  { key: 'Allow fans to revisit and search event-specific discussions.', text: 'Let fans revisit the discussion attached to a specific event.' },

  // ---------- Table 1.3 cells (main functions) ----------
  { key: 'Browse listings; search and filter events; view event details.', text: 'Browse approved listings; search by keyword; filter by artist, category and location; view event details, source link and official ticket channel.' },
  { key: 'Event discussions; general K-pop topics; questions and answers; share information.', text: 'Event-based discussion attached to each listing; post and reply to messages; report content.' },
  { key: 'Public submission form; evidence review; approve/reject; reasons; audit log; reporting.', text: 'Public form or registered organizer account; submission reference number; evidence review; approve or reject with reasons; verified-organizer indicator; audit log; reporting.' }
];
