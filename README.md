# Processing Collaborative Code Editor

## Description
Prototype for a new collaborative code editor for Processing (2024 pr05).

## Weekly Reports

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

----

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

