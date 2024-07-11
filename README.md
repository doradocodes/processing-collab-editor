# Processing Collaborative Code Editor

## Description
Prototype for a new collaborative code editor for Processing (2024 pr05).

## Installation
1. Clone the repository
2. Run `npm install`
3. Run `npm run start`

## Weekly Reports
### Week 1 (July 1, 2024 - July 7, 2024)
**Summary of meetings:**

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

**Completed tasks:**

For the first step of this project, as Sinan suggested, I wanted to first attempt to launch a Processing sketch from an Electron app. My initial vision of this prototype was to have the Processing sketch output be displayed in the electron app itself (thinking that it should look more like a single application) but upon further discussion with Ted, it did make sense to keep the editor and sketch window separate, since often times the Processing is used to be displayed full screen (for performance, installation, etc). In that case, this initial test because much simpler than expected, and I was able to build an executable of Processing and launch it from the Electron app.

**Outstanding questions:**

- Are there thoughts on if the output window should be embedded in same window as the editor?
- Who is the primary audience of Processing? What is it used for mostly?
    - Things i’ve heard before:
        - Used for fullscreen use (installations/performance/etc)
        - Used for increased performance
    - Should I reach out to a forum to get this information?

