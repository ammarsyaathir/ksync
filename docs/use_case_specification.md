<USER_REQUEST>
For your FYP, K-Sync Malaysia: A Centralized Platform for K-Pop Event Information and Fan Community Discussions, I recommend organising the complete use case specification into four main actors: Guest, Registered Fan, Event Organizer and System Admin.

The design below follows your chosen workflow: organizers can submit events without registering an account, while the System Admin reviews submissions before publishing them. It also covers event discovery, fan community discussions, event verification, reporting and audit logs.

# 1. System actors

| No. | Actor                  | Description                                                                                                                                  |
| --- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Guest                  | A visitor who can discover events and view publicly available information without logging in.                                                |
| 2   | Registered Fan         | A fan who has registered and logged in to access personalised features and participate in discussions.                                       |
| 3   | Event Organizer        | A person or organisation that submits K-Pop event information for verification without creating an account.                                  |
| 4   | System Admin           | An authorised administrator responsible for reviewing submissions, managing event listings, handling reports and maintaining system records. |
| 5   | Email Service          | An external system that sends submission confirmations and approval or rejection notifications, if email notifications are implemented.      |
| 6   | Authentication Service | An external service that verifies user credentials or OTPs, if an external authentication provider is used.                                  |

Note: Email Service and Authentication Service are supporting external actors, not the four main human actors. Include them in your final diagram only if your implementation uses them.

# 2. Complete use case list

## A. Account and authentication management

| ID   | Use case                   | Actor                        | Description                                                                   |
| ---- | -------------------------- | ---------------------------- | ----------------------------------------------------------------------------- |
| UC01 | Register Account           | Guest                        | Creates a new fan account by providing the required registration information. |
| UC02 | Verify Email Address / OTP | Guest                        | Verifies the user's email address or OTP during registration, if required.    |
| UC03 | Log In                     | Registered Fan, System Admin | Authenticates a user and grants access according to their assigned role.      |
| UC04 | Log Out                    | Registered Fan, System Admin | Ends the current authenticated session.                                       |
| UC05 | Manage Profile             | Registered Fan               | Allows the fan to view and update personal profile information.               |
| UC06 | Change Password            | Registered Fan, System Admin | Allows an authenticated user to change their password.                        |
| UC07 | Recover Account            | Guest                        | Allows a user to recover access through an approved recovery process.         |

Include / extend relationships

| Base use case    | Relationship             | Related use case           | Explanation                                                                                                 |
| ---------------- | ------------------------ | -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Register Account | `«include»`              | Verify Email Address / OTP | Use only if verification is mandatory for every registration.                                               |
| Manage Profile   | `«extend»`               | Change Password            | Password changes are an optional action from profile management, if that is how your interface works.       |
| Log In           | No relationship required | Recover Account            | Account recovery is normally a separate flow initiated when login fails or the user forgets their password. |

Actor inheritance: Registered Fan and System Admin can share a generalised parent actor such as Authenticated User if they share login and logout functionality. Do not make Event Organizer a subtype of Registered Fan.

## B. Event discovery and information

| ID   | Use case                       | Actor                        | Description                                                                                                          |
| ---- | ------------------------------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| UC08 | Browse Events                  | Guest, Registered Fan        | Displays published K-Pop events in a chronological or categorised listing.                                           |
| UC09 | Search Events                  | Guest, Registered Fan        | Searches published events by event name, artist, group or keyword.                                                   |
| UC10 | Filter Events                  | Guest, Registered Fan        | Filters events by date, location, event category or artist.                                                          |
| UC11 | View Event Details             | Guest, Registered Fan        | Displays verified event details such as date, time, venue, organiser, rules and official source links.               |
| UC12 | View Event Verification Status | Guest, Registered Fan        | Displays whether an event is pending, verified, rejected, postponed or cancelled, as appropriate to the public view. |
| UC13 | Save / Bookmark Event          | Registered Fan               | Saves an event to the fan's personal list for future reference.                                                      |
| UC14 | View Saved Events              | Registered Fan               | Displays events bookmarked by the fan.                                                                               |
| UC15 | View Event Discussion          | Guest, Registered Fan        | Displays discussion posts and replies associated with an event, subject to visibility rules.                         |
| UC16 | View Event Change History      | Registered Fan, System Admin | Shows relevant recorded changes to event information, if the history is exposed to users.                            |

Include / extend relationships

| Base use case         | Relationship          | Related use case      | Explanation                                                                                                                           |
| --------------------- | --------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Browse Events         | `«include»`           | View Event Details    | Not required in strict UML. Browsing does not always mean a visitor opens an event, so connect these use cases independently instead. |
| View Event Details    | `«extend»`            | View Event Discussion | Viewing a discussion is optional when the fan opens an event.                                                                         |
| Save / Bookmark Event | No `«include»` needed | Log In                | The Registered Fan actor is already authenticated; do not create an include relationship solely to represent login.                   |
| View Saved Events     | No `«include»` needed | Save / Bookmark Event | Users can view their saved list even if they do not save a new event during that session.                                             |

The search, filter, browse and event-detail use cases should generally be connected directly to Guest and Registered Fan. They are distinct user goals rather than mandatory substeps of one another.

## C. Event organizer submission without an account

| ID   | Use case                        | Actor                            | Description                                                                                             |
| ---- | ------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| UC17 | Submit Event                    | Event Organizer                  | Submits a new K-Pop event through a public submission form without registering an account.              |
| UC18 | Provide Event Details           | Event Organizer                  | Enters event title, artist, date, time, venue, category and other required information.                 |
| UC19 | Provide Supporting Evidence     | Event Organizer                  | Supplies official source links, poster URLs or other evidence supporting the submitted details.         |
| UC20 | Receive Submission Confirmation | Event Organizer, Email Service\* | Receives confirmation that the submission has been received and assigned a reference number.            |
| UC21 | Check Submission Status         | Event Organizer                  | Checks whether the submission is pending, approved or rejected using a reference number or secure link. |
| UC22 | Receive Decision Notification   | Event Organizer, Email Service\* | Receives the approval or rejection outcome and any rejection reason.                                    |
| UC23 | Correct and Resubmit Event      | Event Organizer                  | Corrects rejected or incomplete event information and resubmits it, if this feature is implemented.     |

\*Email Service is included as an actor only when notifications are sent through an external email provider.

Include / extend relationships

| Base use case              | Relationship        | Related use case                | Explanation                                                                                                                                                                                                                                     |
| -------------------------- | ------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Submit Event               | `«include»`         | Provide Event Details           | Required event information must be supplied.                                                                                                                                                                                                    |
| Submit Event               | `«include»`         | Provide Supporting Evidence     | Use if evidence is mandatory for every submission. If evidence is optional, do not use `«include»`.                                                                                                                                             |
| Submit Event               | `«include»`         | Receive Submission Confirmation | Use if the system always displays or sends a confirmation after successful submission.                                                                                                                                                          |
| Check Submission Status    | No include required | Receive Decision Notification   | Checking status and receiving a notification are separate interactions.                                                                                                                                                                         |
| Correct and Resubmit Event | `«extend»`          | Check Submission Status         | This can be modelled as optional behaviour after the organizer discovers a rejected submission, but only if the resubmission flow is initiated from the status-checking process. Otherwise, connect both use cases directly to Event Organizer. |

Important: Because the organizer does not have an account, do not include `Edit Own Event`, `Manage Organizer Profile` or `Verify Organizer Account` unless you introduce a secure alternative such as a unique editing link.

## D. Administrator submission review and verification

| ID   | Use case                  | Actor        | Description                                                                        |
| ---- | ------------------------- | ------------ | ---------------------------------------------------------------------------------- |
| UC24 | View Pending Submissions  | System Admin | Displays submitted events waiting for review.                                      |
| UC25 | Review Event Submission   | System Admin | Examines submitted event information before deciding whether to publish it.        |
| UC26 | Check Supporting Evidence | System Admin | Checks official links, posters and other evidence for reliability and consistency. |
| UC27 | Approve Submission        | System Admin | Approves an event submission that satisfies the system's verification criteria.    |
| UC28 | Reject Submission         | System Admin | Rejects a submission that fails verification requirements and records the reason.  |
| UC29 | Record Decision Reason    | System Admin | Records the justification for approval or rejection to support accountability.     |
| UC30 | Publish Approved Event    | System Admin | Makes an approved event visible in the public event listing.                       |
| UC31 | View Submission History   | System Admin | Reviews previous submission decisions and status changes.                          |

Include / extend relationships

| Base use case           | Relationship         | Related use case              | Explanation                                                                                                                                      |
| ----------------------- | -------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Review Event Submission | `«include»`          | Check Supporting Evidence     | Evidence checking is a required step in the proposed review workflow.                                                                            |
| Approve Submission      | `«include»`          | Record Decision Reason        | Use if every decision must have a recorded justification.                                                                                        |
| Reject Submission       | `«include»`          | Record Decision Reason        | A rejection should always include a documented reason under the proposed policy.                                                                 |
| Approve Submission      | `«include»`          | Publish Approved Event        | Use if approval automatically publishes the event. If the administrator publishes it in a separate later action, model the use cases separately. |
| Reject Submission       | No mandatory include | Receive Decision Notification | The notification is triggered by the decision process but may be handled asynchronously by the system.                                           |

For fairness, define verification criteria such as the availability of official source links, consistency of the event date and venue, and whether the submitted event falls within the system's scope. Record the decision and reason in the audit log. This helps reduce unexplained or inconsistent decisions.

## E. Published event management

| ID   | Use case                              | Actor        | Description                                                                                           |
| ---- | ------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------- |
| UC32 | Manage Published Events               | System Admin | Opens administrative controls for published event listings.                                           |
| UC33 | Edit Event Information                | System Admin | Corrects inaccurate dates, venues, links or other event details.                                      |
| UC34 | Update Event Status                   | System Admin | Marks an event as upcoming, postponed, cancelled or completed when supported by verified information. |
| UC35 | Unpublish Event                       | System Admin | Temporarily removes an event from public listings when it should no longer be displayed.              |
| UC36 | Archive Event                         | System Admin | Retains completed or obsolete event records for reference instead of permanently deleting them.       |
| UC37 | Manage Artists, Venues and Categories | System Admin | Adds or updates the reference data used to organise event listings.                                   |

Include / extend relationships

| Base use case           | Relationship | Related use case       | Explanation                                                                                                                        |
| ----------------------- | ------------ | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Manage Published Events | `«include»`  | Edit Event Information | Only if entering the management workflow always includes editing; usually it does not, so independent associations are preferable. |
| Manage Published Events | `«include»`  | Update Event Status    | Not recommended: an admin may manage an event without changing its status.                                                         |
| Update Event Status     | `«extend»`   | Edit Event Information | Use only if status changes are an optional action within the edit workflow. Otherwise, keep them separate.                         |

In the final diagram, connect the System Admin directly to each supported management use case rather than forcing unrelated tasks to use `«include»`.

## F. Fan community discussions and interaction

| ID   | Use case                         | Actor                 | Description                                                                           |
| ---- | -------------------------------- | --------------------- | ------------------------------------------------------------------------------------- |
| UC38 | Search Discussions               | Guest, Registered Fan | Searches discussion posts by keyword or event.                                        |
| UC39 | Create Discussion Post           | Registered Fan        | Creates a general discussion post linked to an event or community topic.              |
| UC40 | Post Question                    | Registered Fan        | Publishes a question about an event or related topic.                                 |
| UC41 | Reply to Discussion              | Registered Fan        | Replies to a discussion post or another user's contribution.                          |
| UC42 | Answer Question                  | Registered Fan        | Provides an answer to a question posted by another fan.                               |
| UC43 | Edit Own Post                    | Registered Fan        | Edits a discussion post created by the current user.                                  |
| UC44 | Delete Own Post                  | Registered Fan        | Deletes the user's own post, subject to system rules.                                 |
| UC45 | Report Event or Post             | Registered Fan        | Reports misleading event information, spam or inappropriate discussion content.       |
| UC46 | Receive Discussion Notifications | Registered Fan        | Receives notifications about replies or relevant discussion activity, if implemented. |

Include / extend relationships

| Base use case                    | Relationship        | Related use case                           | Explanation                                                                                                                                             |
| -------------------------------- | ------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create Discussion Post           | `«include»`         | Log In                                     | Do not use this in the use case diagram if Registered Fan already represents an authenticated actor.                                                    |
| Reply to Discussion              | No include required | View Event Discussion                      | A reply is a separate goal that usually starts after the fan views the discussion.                                                                      |
| Answer Question                  | No include required | Post Question                              | Questions can be answered independently; answering does not require the same user to post a question.                                                   |
| Edit Own Post                    | No include required | Create Discussion Post                     | Editing is a later action and does not happen every time a post is created.                                                                             |
| Delete Own Post                  | No include required | Create Discussion Post                     | Deletion is a separate action on an existing post.                                                                                                      |
| Report Event or Post             | `«extend»`          | View Event Details / View Event Discussion | Reporting is optional behaviour initiated while viewing event information or a discussion. Choose the appropriate base use case for each report target. |
| Receive Discussion Notifications | No include required | Reply to Discussion                        | Notifications may be generated when a reply occurs, but they are not necessarily part of the user's reply interaction.                                  |

You can keep both `Post Question` and `Create Discussion Post` if your system genuinely distinguishes question-and-answer posts from general discussions. If not, simplify the design to Create Discussion Post and Reply to Discussion, with a post category field to distinguish questions.

## G. Reports, moderation and accountability

| ID   | Use case                     | Actor                   | Description                                                                                        |
| ---- | ---------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------- |
| UC47 | View Reports                 | System Admin            | Displays reports submitted by fans for investigation.                                              |
| UC48 | Investigate Report           | System Admin            | Reviews the reported event or post and checks supporting information.                              |
| UC49 | Take Action on Report        | System Admin            | Dismisses an invalid report, removes inappropriate content or initiates an appropriate correction. |
| UC50 | Moderate Discussion Content  | System Admin            | Hides or removes content that violates the community rules.                                        |
| UC51 | Manage User Accounts         | System Admin            | Restricts or disables abusive accounts if account administration is included in the project scope. |
| UC52 | View Audit Log               | System Admin            | Reviews records of important administrative actions and system decisions.                          |
| UC53 | Record Administrative Action | System Admin / System\* | Stores the action, actor, timestamp and relevant decision details for accountability.              |

\*The system itself may generate the audit record automatically. If you represent the system as an actor in the use case diagram, that can be misleading; usually, show the audit log as a use case initiated by an administrator and document automatic logging as a system requirement.

Include / extend relationships

| Base use case                          | Relationship        | Related use case             | Explanation                                                                       |
| -------------------------------------- | ------------------- | ---------------------------- | --------------------------------------------------------------------------------- |
| Investigate Report                     | `«include»`         | View Reports                 | Use if the investigation always begins by opening a report from the report queue. |
| Take Action on Report                  | `«extend»`          | Investigate Report           | Taking action is conditional on the investigation findings.                       |
| Moderate Discussion Content            | `«extend»`          | Investigate Report           | Moderation may occur when an investigated report concerns inappropriate content.  |
| View Audit Log                         | No include required | Record Administrative Action | Reviewing the audit log is separate from recording a new action.                  |
| Approve Submission / Reject Submission | `«include»`         | Record Administrative Action | Use if every approval or rejection is automatically recorded for audit purposes.  |

## H. Optional and conditional features

These use cases should appear in your final diagram only if they are part of your confirmed scope and you plan to implement them.

| ID   | Use case                            | Actor                                | Description                                                                 | Recommendation                                                  |
| ---- | ----------------------------------- | ------------------------------------ | --------------------------------------------------------------------------- | --------------------------------------------------------------- |
| UC54 | Auto-Fill Event Details from Poster | Event Organizer, external AI service | Extracts potential event details from a poster to reduce manual data entry. | Optional; include only if AI poster recognition is implemented. |
| UC55 | Find Event Buddy                    | Registered Fan                       | Helps fans discover other users who want to attend the same event.          | Optional; requires additional privacy and matching rules.       |
| UC56 | Receive Event Update Notification   | Registered Fan                       | Notifies fans about changes to saved or followed events.                    | Optional; include only if a notification mechanism is built.    |
| UC57 | View Submission Status Timeline     | Event Organizer                      | Displays the sequence of submission, review and decision statuses.          | Optional; useful if the system stores status history.           |
| UC58 | Manage Notification Preferences     | Registered Fan                       | Allows users to choose which notifications they want to receive.            | Optional; only needed if notification settings are implemented. |

I would exclude merchandise inventory, QR-based collection, ticket booking, ticket purchasing and shopping-cart functions from this use case model because they are outside the event-information and fan-discussion scope described here.

# 3. Consolidated include and extend relationship list

Use this as the relationship checklist when drawing the final diagram in draw\.io. These are the relationships I recommend only where the described behaviour is genuinely mandatory or conditional.

| Source use case             | Relationship | Target use case                                                          |
| --------------------------- | ------------ | ------------------------------------------------------------------------ |
| Register Account            | `«include»`  | Verify Email Address / OTP (if mandatory)                                |
| Submit Event                | `«include»`  | Provide Event Details                                                    |
| Submit Event                | `«include»`  | Provide Supporting Evidence (if mandatory)                               |
| Submit Event                | `«include»`  | Receive Submission Confirmation (if guaranteed)                          |
| Review Event Submission     | `«include»`  | Check Supporting Evidence                                                |
| Approve Submission          | `«include»`  | Record Decision Reason (if mandatory)                                    |
| Reject Submission           | `«include»`  | Record Decision Reason                                                   |
| Approve Submission          | `«include»`  | Publish Approved Event (if publication is automatic)                     |
| Report Event or Post        | `«extend»`   | View Event Details or View Event Discussion                              |
| Take Action on Report       | `«extend»`   | Investigate Report                                                       |
| Moderate Discussion Content | `«extend»`   | Investigate Report (when applicable)                                     |
| Correct and Resubmit Event  | `«extend»`   | Check Submission Status (only if the correction flow is initiated there) |

UML direction reminder:

- `«include»`: the dashed arrow points from the including use case towards the included use case.
- `«extend»`: the dashed arrow points from the extending use case towards the base use case.

Do not connect every related function using `«include»` or `«extend»`. A direct actor association is sufficient when two use cases are separate user goals.

# 4. Actor-to-use-case summary

| Actor                  | Main use cases                                                                |
| ---------------------- | ----------------------------------------------------------------------------- |
| Guest                  | UC01, UC02, UC07, UC08–UC12, UC15, UC38                                       |
| Registered Fan         | UC03–UC06, UC08–UC16, UC38–UC46, UC56, UC58                                   |
| Event Organizer        | UC17–UC23, UC54, UC57                                                         |
| System Admin           | UC03, UC04, UC06, UC24–UC37, UC47–UC53                                        |
| Email Service          | UC20, UC22 and UC46/UC56 where external email delivery is implemented         |
| Authentication Service | UC01–UC03, UC06–UC07 where external authentication or recovery is implemented |
| External AI service    | UC54 only, if implemented                                                     |

This summary includes optional functions for completeness; it does not mean you must implement all of them.

# 5. Recommended final scope for your FYP

For a manageable diploma/degree FYP implementation, I recommend prioritising these features:

Core 1 — Event discovery

Browse, search, filter, view event details and view verification status.

Core 2 — Public event submission and verification

Submit an event without an account, provide evidence, check status, review, approve or reject, notify the organizer and publish approved listings.

Core 3 — Fan community

Register, log in, manage profile, create posts, ask and answer questions, reply, and report inappropriate or misleading content.

Core 4 — Administration and accountability

Manage published events, investigate reports, moderate content, record decision reasons and view audit logs.

Features such as event buddies, AI poster extraction, notification preferences and advanced user account controls can be treated as optional extensions.

One final recommendation: use a separate system workflow or activity diagram to show the full submission process from organizer submission through verification, approval/rejection and publication. The use case diagram identifies who can perform each function; the activity diagram explains how the process flows. This distinction will make your FYP documentation clearer and easier to defend during your presentation.
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-10-13T02:39:20+08:00.
</ADDITIONAL_METADATA>