#codeCanvas Desktop

This is an open source effort to create a community driven version of codeCanvas to run in App.js on the desktop.

##Idea and goals

The application hosted at codeCanvas.org requires a good amount of server side file handling. My goal is to provide file handling in Node using the App.js framework.

##Getting Started

- Download App.js for your platform (Mac, Linux, Windows)
- Place the codeCanvas files into the 'content' directory in app.js
- Start the app loader in the main app.js directory

##Structure

- The application codebase is located in the 'app' directory
- The user directory contains files needed to create tools (explained below)

###User directory

- usertools.html - this contains the html for each tool in your toolbox. The html construct is located inside a LI with the class "userTool". This allows you to create tool html naturally.

- usertools_design.js - This provides a the javascript for the tools while in the designer. 
- usertools_run.js - This provides the javascript your tool needs to work in a runtime environment

- usertools_design.css - This provides the styles for the tools while in the designer.  
- usertools_run.css - This provides the styles your tool needs to work in a runtime environment

##Participation

The idea for this project came after many, many requests to open codeCanvas. It is far from perfect but the concept is working and just needs a good team of people to make it awesome.

We need people to help:

- Code more awesome features
- Create interesting tools 
- Write docs and do videos
- Create a support forum

##Contact

You can contact me on the codeCanvas website

http://www.codecanvas.org/contact/


