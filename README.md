# Processing Collaborative Code Editor

## Description
Prototype for a new collaborative code editor for Processing (2024 pr05).

## Weekly Reports

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

