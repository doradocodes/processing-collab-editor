# Processing Collaborative Code Editor

## Description
Prototype for a new collaborative code editor for Processing (2024 pr05).

## Installation
1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run start` to start the Electron app
4. Create a .env file with your credentials by copying the .env.example file and filling in the necessary information

## Scripts
- `npm run start` - Start the Electron app
- `npm run build` - Build the React app
- `npm run package` - Package the Electron app
- `npm run make` - Uses Electron Forge to package the app into /out folder
- `npm run sign_processing` - Signs the Processing library for notarization (macOS builds only). You must run this before packaging the app for the first time.
- 


## Weekly Reports

### Week 9 (September 2, 2024 - September 8, 2024)
#### Current Progress
This week, I met with Ted and Sinan to further discuss different ways to implement collaborative editing. In our meeting, we've identified WebRTC as a viable solution for small groups of 1-3 users, but noted scaling challenges for larger groups due to performance issues caused by slower connections. YJS has emerged as a promising framework for real-time collaboration, particularly in multiplayer scenarios, though its WebRTC support is limited. We're leaning towards websockets for text-based messaging due to their reliability and widespread support. On the server front, we're considering approaching Processing to host our websocket server, and but in the meantime, can use [Glitch.io](http://Glitch.io) to host a centralized server for this prototype.

We're exploring YJS implementation options, including its integration with CodeMirror, y-codemirror.next, which offers the flexibility to switch between websocket and WebRTC providers. This adaptability could prove valuable as we refine our architecture. Additional features under consideration include optional Language Server Protocol (LSP) integration for code completion, and a streamlined room creation process with both auto-generated and custom naming options.

Ted also gave some UI feedback, such as separating the "Create new sketch" option from the recent sketches list. We're also looking into implementing a URL-based app launch feature using Electron's capabilities.

Since the meeting, I have be able to integrate the [y-codemirror.next](http://y-codemirror.next) library with my Electron app, and create a new Websocket server to use a the Provider. It seems to be working well, but the next week, I will be testing it further.

#### Next steps

- Further research on Processing's potential to host a websocket server
- A thorough evaluation of the scalability of peer-to-peer versus centralized architectures
- Prototype room creation and sharing functionality
- Continue building functionality for creating locally saved sketches
- Investigate LSP integration to enhance the coding experience

---

### Week 8 (August 26, 2024 - September 1, 2024)
#### Completed Tasks & Progress
This week, I continued to experiment with different implementations of the collaborative functionality. From last week’s feedback, Ted suggested trying to use an existing a [yjs-codemirror](https://github.com/yjs/y-codemirror.next?tab=readme-ov-file) library that uses WebRTC for peer-to-peer editing. This library even includes an implementation of showing cursor positions from other users. From my initial tests, the library works well with a hardcoded room ID, but will require a signaling server with WebSockets in order to manage users and their connections. The development signaling server used in this library is down, so I will have to create a new server in order to manage the connections, which I plan to host on Glitch for now. I will be meeting with Ted next week to discuss the collaborative feature implementation further.

Alongside this, I worked on furthering the UI and managing different sketches locally. In the latest update, all local files are displayed in the column on the right and you can navigated between different saved sketches and update the local files when clicking the “Save” button:

![Screenshot 2024-09-01 at 7.59.17 PM.png](https://github.com/doradocodes/processing-collab-editor/blob/main/README_assets/Screenshot%202024-09-01%20at%207.59.17%20PM.png?raw=true)

#### Action items

- Meet with Ted next week to discuss collaboration implementation
- Create the signaling server to manage multiple rooms
- Continue building the UI for creating/updating local sketch files

---

### Week 7 (August 19, 2024 - August 25, 2024)
#### Completed Tasks & Progress
This week, since I was able to get a basic layout that displayed the CodeMirror editor and a basic console, I decided to put a pause on styling and focus on integrating the CodeMirror collaboration feature. CodeMirror has a [collaborative feature](https://codemirror.net/examples/collab/) as an extension already built, where the basic principles are:

- A central system tracks change history.
- Peers track synchronized versions and local changes.
- Peers receive updates from the central system to:
    - Remove their own changes from unconfirmed list.
    - Apply remote changes locally.
    - Use operational transformation for conflicting changes.
    - Update document version.
- Peers send unconfirmed changes to central system:
    - If versions match, changes are accepted.
    - Otherwise, server may reject or rebase changes.

In our case, the central system will be a separately running server with web sockets (using Socket.io). The general idea would be that once a sketch has been created, the server will create a record of that sketch on the server (eventually, in a database), which will act the “central system”. 

There are still a lot of things to fix (currently only able to send edits one way) and things to be added (cursor position, etc.). I’m still thinking about which is the right way to establish the connection (web sockets vs. WebRTC), but I think that can be changed and decided later. For now, the goal is to get things working completely with the local server.

#### Thoughts about connection

Currently, I’m deciding between two directions:

1. Using a locally hosted intermediary server with web sockets

   When a collaborative session is created, the “host” user’s application will start a local server where collaborative data will be sent to and shared among peers. Then using a tunnel service (ngrok), the server can be accessed by remote peers.

2. Using peer-to-peer with WebRTC

   Establish a peer-to-peer connection with WebRTC, that a way an intermediary server is not required. This is properly an easier implementation, but it has limitations on how many users can be connected to a session.


---

### Week 6 (August 12, 2024 - August 18, 2024)
#### Meeting summaries

This week, Sinan and I met and walked through the Figma prototype of the PCE UI. After Sinan’s feedback, we thought it was best to continue with this iteration of the designs, and move on to development. The main goal of this project would be to prototype and have a proof of concept for the collaborative ending, so we came to the conclusion that we should move forward with the CodeMirror approach, which has faster development. We still planned to meet with Luca to discuss the pros and cons of using Theia for future reference.

During our meeting with Luca, he explained the motivation behind transitioning to Theia. The plan was to use the same stack for both the Desktop and Cloud IDE, but this wasn’t feasible for a multitude of reasons, resulting in Arduino having two separate IDEs. The older one is still based on Angular.js and React, with components written from scratch. Some of the nice features, like internal tunneling and proxying, are no longer open-source, though alternatives exist for reverse tunneling between different endpoints.

Unexpected issues arose with Theia, particularly with its text editor and real-time debugging, which required rewriting by the team to make it fast enough for users. Every new version brought breaking changes, necessitating a rebuild from scratch for any plugin. However, as Theia gained more visibility in the Apache foundation and with pressure from Arduino, it became better supported. Despite this, changing the UI remained a significant challenge due to its highly opinionated design.

Luca explored other options, such as Codemirror, which had a perfect API for building an editor. He also considered a system in Rust, which now has an advanced version that could be used for Processing. The UI in this system is GPU-based, and text is rendered as graphics, making it incredibly fast.

Finally, Luca emphasized the importance of detaching the UI from the rest of the system, especially when working with Theia, and warned about the performance issues with Electron, particularly for fast-updating UIs or graphics.

#### Completed Tasks & Progress

I have resumed development of the Electron + CodeMirror build. I was running into a lot of issues with a build that used Vite to build both the Electron code and the React code, running into an error called `No sketchbook found` when I attempted to run `processing-java` from the NodeJs process. I returned to an older branch I had been working on where the `processing-java` process was running sketches successfully and created a new React app from there (so now Vite is only used to build the React app). This is a screenshot of the current progress of the app:

![image](https://github.com/doradocodes/processing-collab-editor/blob/main/README_assets/Screenshot%202024-08-18%20at%2010.20.48%20PM.png?raw=true)

When clicking “Play”, the app takes the content in the CodeMirror component and passes it to the backend, where a .pde folder and file are generated and processing-java runs the sketch with the path of that file (note: for a while I had run into a vague error Index 0 out of bounds for length 0 which I later discovered was caused by naming the file/folder with - ). The code for this build is in the electron branch of the repo.

---

### Week 5 (August 5, 2024 - August 11, 2024)
#### Completed Tasks and progress

This week, we met as a cohort with their mentors. I presented my progress, along with my findings on using Theia versus a custom implementation with CodeMirror, to see if others had any experiences or issues with either. No one mentioned using Theia, but those who have used CodeMirror expressed that they hadn’t found any issues with development/maintaining/upgrading with it. I still plan to meet with Luca, to see what their thoughts are on Theia, before we make a final decision. For now, I have put further development on hold, except for one issue I am seeing with the Electron + CodeMirror + React prototype I have been working on. My current implementation is having issues running the `processing-java` process when I use Vite. My previous implementation without React + Vite was able to run the executable successfully, so I am concluding that it is an issue with paths and Vite. I’m working on finding the exact cause of this problem.

Meanwhile, I have also been working on wireframes for the app UI. Here is a [Figma prototype](https://www.figma.com/proto/SxmAa94lAP37OLPpY1hgVf/Processing-Collaborative-Editor-(PCE)?page-id=0%3A1&node-id=104-264&viewport=4996%2C-858%2C0.88&t=tWxAKr0fDQwzdNGu-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=104%3A264) of the wireframes.

![image](https://github.com/doradocodes/processing-collab-editor/blob/main/README_assets/Screenshot%202024-08-11%20at%203.35.01%20PM.png?raw=true)

In this iteration of the design, the app has a simple two-column layout:

- The left column is dedicated for accessing previous sketches and joining rooms. It is collapsible to increase the editing area.
- The right column is the main editing space, with a draggable section to open the logs. The “Play” button on the top right corner runs the code, opening the output window, and turns into a “Stop” button while the sketch is running. The sketch can then be stopped and re-run by clicking the button.
- For a collaborative session, the user can join an existing session (note: should they be called “sessions” or “rooms”?) by entering the room ID and clicking “Join”:
  ![image](https://github.com/doradocodes/processing-collab-editor/blob/main/README_assets/Screenshot%202024-08-11%20at%203.39.36%20PM.png?raw=true)
  Once the room is joined, the user will see the room name and ID, and the code. There will be color-coded highlights dedicated to each joined user to differentiate which user is highlighting what. There are still smaller details to work out for this part of the user flow (ie. adding a name/profile image before joining, etc.).

- To create a new session/room, the user can click “Create a room” and the input field will switch to a field that says “Create a name”, which the session will be named and an ID will be generated, which would then open a new blank sketch.

A feature I haven’t added to this iteration yet is how plugins/external libraries will be included. That will be worked on in the upcoming week.

I’ve also met with Diya this week to discuss the LSP integration, which she has given me a good high-level description of how it works, and directed me to some good resources to look into. At a high-level, the language server is hosted locally, and is called upon certain actions (ie. hovering on a function, at a certain mouse position, etc.). For this project, I think that after the language server is running I can use an existing library (for either CodeMirror or Theia) which handles the logic/UI for calling the language server. Actually testing this will come in the upcoming weeks.

---

### Week 4 (July 29, 2024 - August 4, 2024)
#### Completed tasks & progress
This week, I met with Sinan and Raphael to discuss my current findings with the possible directions for implementation of this project. For more straightforward decision-making, I mostly focused on using either Theia or building a more custom build with CodeMirror. Below is a comparison chart of the two possible directions:

| Framework | Pros   | Cons |
|---|-------| --- |
| Theia | - Prebuilt framework <br> - Used by other popular IDEs (ie. Arduino IDE)<br> - Features are built modularly, can be included/excluded through package.json <br> - Desktop app deployment already set up (uses Electron)                                                   | - Does not have existing live collaborative extension <br> - Fixed to VSCode-style layout <br> - Difficult to enable/disable features (haven’t been able to successfully do this from their docs) <br> - Slower development (no dev environment, need to rebuild every time for changes)
  | CodeMirror | - CodeMirror easy to implement <br> - A lot of support since also used on p5 web editor <br> - Full control of UI <br> - CodeMirror has live collab extension (but not using yjs) <br> - Less dependency on other third-party plugins <br> - More rapid development for a prototype | - Dependency on CodeMirror <br> - Required to build new UI components from scratch <br> - More QA required 


From our meeting this week, Sinan and Raphael suggested that I bring my research to the next pr05 cohort meeting to get opinions from the other members. Some of them have had experience with libraries like CodeMirror, and it would be useful to learn about their experiences with usage and maintenance of it. It was also suggested that we get opinions from Q, Rachel, and Cassie, the p5 project leads, to see if they have any learnings/suggestions with building the p5 editor. Since this project is intended to be a prototype of a code editor, whichever direction we choose will at least give us in depth experience with either framework. However, I think it’s best to make a clear decision soon so that design and development can begin and we can have a working prototype by the end of this grant duration.

We also discussed design ideas for this editor’s UI. For instance, Raphael pointed out that students often get confused and frustrated by the concept of file systems, so potentially the UI should hide the file system and handle creating/saving files automatically. We also discussed how collaboration sessions should be created: one idea would be to allow creations of “rooms” which could generate an ID or URL which other users (most likely students) could use to join the room.

#### Next steps

- Share and discuss my learnings with the other cohort members and with the p5 leads
- Choose a direction by the end of next week, so that design and development can begin
- Begin sketching/creating wireframes of the UI
- Create diagrams for how collaborative editing should work (from a UX standpoint, and for technical architecture)

---

### Week 3 (July 22, 2024 - July 28, 2024)
#### Completed tasks & progress

This week, the main objective was to experiment with using Theia, the IDE framework, and a more custom build with CodeMirror.

##### Theia

I started with Theia, since we’ve seen it used with other popular open source tools like Arduino IDE. Initially, I was having a lot of trouble getting the Theia build up and running when trying to use the [“Build your own IDE/Tool” instructions from the Theia docs](https://theia-ide.org/docs/composing_applications/), but not successfully getting anything running there. Through some additional research, I then found the `theia-blueprint` [repo](https://github.com/eclipse-theia/theia-blueprint), which is the original repo for Theia (now referred to as Theia IDE). I was also having a lot of issues building this repo. For instance, I had to change my Node version from v21 to v18, and I downloaded the zip vs. cloning the repo which caused problems with submodules (something new I learned!). Since I was going back and forth between the Theia and CodeMirror build, I didn’t have time to play with the features/functionality this week. I plan to see how customizable the framework is next week and make a decision on whether we should move forward with it.

##### CodeMirror

For the CodeMirror experiment, I wanted to install CodeMirror6 on my existing Electron build, but I needed a bundler. I chose Vite.js, since it is a bundler I’m most familiar with and it’s quick setup works well for a prototype. I was running into issues with just adding the Vite bundler to my existing app, so I download a cloned a [template](https://electron-vite.github.io/guide/templates.html) that combines Electron, Vite, and a React framework (React being the front-end framework I would use if we were to move forward with this build). I was able to create a basic Java editor and wrap the CodeMirror library in a component. This build doesn’t run any code yet, only takes the contents of the CodeMirror editor after clicking the “Run” button, and writing it to a temp file. The next step of this build would be to take the path of the generated temp file and passing it to the Processing library. I think this is a viable build, so I will leave it as is until we can determine if we would rather move forward with Theia instead.

##### Other alternatives

I recently looked into how Google Colab was built, and it is a custom build of an open source software called [JupyterLab](https://jupyter.org/). I think Jupyter could be another thing we look into, because it already includes a lot of features that we want in PCE*, including:

- A prebuilt UI that we can work from, that centers around this idea of “notebooks” (similar to “sketches” as we wanted)
- An extension for collaborative editing (JupyterLab RTC, built on yjs)
- Support LSP (`jupyterlab-lsp`)
- Deployment of a cloud editor and a desktop editor
- Customization of the UI (will need to play with this also, to actually see how customizable the UI is)

In the next week, I’ll also create a build off this framework.

*Processing Collaborative Editor, PCE for short

#### Next steps

By the next week, I think a framework should be chosen so that we can move on to design and development. I will be creating a chart that compares all the frameworks, and will discuss with Sinan in our next meeting about which to move forward with (would love for Rapahel and Ted to join this call for their input).

#### Open questions

- Any thoughts on which direction to move forward so far?
- Are there any other frameworks that I should be looking into?

---

### Week 2 (July 8, 2024 - July 14, 2024)
#### Completed tasks

Since my last update, Sinan agreed that we should keep the output from Processing as a separate window, since it is consistent with the original Processing app.

Some more details about the Electron app and the Processing library implementation: From the currently existing Processing editor, I downloaded an executable called `processing-java` which allows Processing to build and run sketches from command line. From the Electron app, I added a “Run sketch” button and an input field to input a path to a test sketch. Using the `child_process` library, we can run the `processing-java` executable in the back-end with the path provided in the input field. That opens a Java window with the sketch. This implementation allows for a quick integration with Processing, and keep the library and app decoupled, which can prevent lots of potential bugs. Sinan also had an idea where we could pull the latest version of Processing and build it upon installation of the editor.

The next thing we agreed should be looked into was seeing if error/debugging messages from Processing can be captured and displayed in the Electron app. The first test went smoothly, and we are able to send messages from `stdout` and `stderr` to the Electron window via the `child_process` library.


Knowing that this is possible, I think that we can move on to choosing an MVP for this app and designing a layout for the editor. I’ve created a [Google Doc](https://docs.google.com/document/d/1rbMAvGepee8lPmaNjLItSL4Ah5MW0jLUfjhWWO8HgyQ/edit#heading=h.7i682dmq7yq7) to use as a living doc for the MVP. With the help of ChatGPT, I put together a high-level list of potential features for this MVP, and the doc is open for comments/feedback. The intention is that the doc will continuously be edited and become more in-depth, then we will be able to create tasks based on those agreed upon features.

Alongside that, I plan to also look into IDE development frameworks (ie. Theia) to see if that’s something that we’d want to use. Sinan and I discussed two main paths that could occur depending on whether we use a framework like Theia, or if we use CodeMirror. I plan to do prototypes of both, to see their pros and cons. For instance, Theia might be easy to fork, but we’d have little control of the UI.

Note: all code changes are committed to a branch called `electron` .

#### Outstanding questions

- Does the integration with the Processing library that I listed above work? Or are we looking for something more integrated? Is there potential problems with using the original Java JFrame window as the output window? How would integration with LSP work (I still need to gather more information to understand how this works)?

#### Next action items

- Look into Theia vs. CodeMirror
- Add more description into each feature on the MVP doc and break them down into tasks

---

### Week 1 (July 1, 2024 - July 7, 2024)
#### Summary of meetings

As the first week of the pr05 program, I met with my mentors, Raphael, Sinan, and Ted, to discuss the initial thoughts and context behind this project. The project began with some intentions in mind:

- To experiment with creating a collaborative code editor for Processing
- A way to use more modern technologies that could make it easier for others to contribute to
- Add a collaboration feature, similar to p5Live
- Design a UI that could speed up the process for beginners to spin up a sketch

During our conversations, we discussed some directions this project could go:

- Use ElectronJS as the framework to develop the front-end application
- Use an open-source IDE development framework like Theia, which could give us more cloud and desktop editors

I also met with Ted and we discussed more front-end ideas—

- Ted recommended using yjs to handle collaborative editing
- For this prototype, how many people should be able to simultaneously edit? Ted suggests ~30 (the size of a classroom)
- The layout of the editor window—should the app have the editor and output in the same window so it looks like a single app? Or should they stay as separate windows since its more likely to be used fullscreen? Or should there be an option for overlaying code on top of the output (similar live coding editors, like p5Live) and be used fullscreen?

#### Completed tasks

For the first step of this project, as Sinan suggested, I wanted to first attempt to launch a Processing sketch from an Electron app. My initial vision of this prototype was to have the Processing sketch output be displayed in the electron app itself (thinking that it should look more like a single application) but upon further discussion with Ted, it did make sense to keep the editor and sketch window separate, since often times the Processing is used to be displayed full screen (for performance, installation, etc). In that case, this initial test because much simpler than expected, and I was able to build an executable of Processing and launch it from the Electron app.

##### Outstanding questions

- Are there thoughts on if the output window should be embedded in same window as the editor?
- Who is the primary audience of Processing? What is it used for mostly?
    - Things I’ve heard before:
        - Used for fullscreen use (installations/performance/etc)
        - Used for increased performance
    - Should I reach out to a forum to get this information?

