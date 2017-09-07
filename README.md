# Internet of Things (IoT) for Pier 9

[![build status](https://api.travis-ci.org/cyrillef/extract.autodesk.io.png)](https://travis-ci.org/cyrillef/extract.autodesk.io)
[![Node.js](https://img.shields.io/badge/Node.js-6.3.1-blue.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-3.10.3-blue.svg)](https://www.npmjs.com/)
![Platforms](https://img.shields.io/badge/platform-windows%20%7C%20osx%20%7C%20linux-lightgray.svg)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://opensource.org/licenses/MIT)


*Forge API*:
[![oAuth2](https://img.shields.io/badge/oAuth2-v1-green.svg)](http://developer-autodesk.github.io/)
[![Data-Management](https://img.shields.io/badge/Data%20Management-v1-green.svg)](http://developer-autodesk.github.io/)
[![OSS](https://img.shields.io/badge/OSS-v2-green.svg)](http://developer-autodesk.github.io/)
[![Model-Derivative](https://img.shields.io/badge/Model%20Derivative-v2-green.svg)](http://developer-autodesk.github.io/)
[![Viewer](https://img.shields.io/badge/Forge%20Viewer-v2.17-green.svg)](http://developer-autodesk.github.io/)


<b>Note:</b> It also relies on the https://github.com/cyrillef/PlougonvelinNode Project which is the real brain
running on a BeagleBone Black device which controls the shutters, lights, and sensors.


## Live demo at
http://pier9.autodesk.io/

[![](www/images/app.png)](https://pier9.autodesk.io/)


## Description

This sample uses the Autodesk Forge Viewer to display the CNC Workshop, and implements a Viewer IoT Extension to
connect to the Raspberry PI IoT broadcaster via a secured socket.io connection.


## Dependencies

This sample is dependent on the server part on Node.js and couple of Node.js extensions
which would update/install automatically via 'npm':

This sample is dependent of Node.js and few Node.js extensions which would update/install automatically via 'npm'.

1. Node.js - built on Chrome's JavaScript runtime for easily building fast, scalable network applications.
   You can get Node.js from [here](http://nodejs.org/)

This sample is also dependent on the client side on couple of javascript library
which would update/install automatically via 'bower':

2. [Bootstrap](http://getbootstrap.com/) - Bootstrap is the most popular HTML, CSS, and JS framework for developing
   responsive, mobile first projects on the web.

3. [jQuery](https://jquery.com/).


## Setup/Usage Instructions

### Deploy on a server or local machine

1. Download and install [Node.js](http://nodejs.org/) (that will install npm as well)
2. Download this repo anywhere you want
3. Execute 'npm install', this command will download and install the required node & bower modules automatically for you.<br />
   ```
   npm install
   ```
4. Edit file ./html/index.html line #75-77, and set your model URN <br />
   Edit files in ./html/data to describe your model / sensors settings.
5. Install your credential keys: <br />
      Use system environment variables (This is actually the option you need to use for the tests suite
      which runs on [Travis-CI](https://travis-ci.org/)). Replace keys placeholder xxx with your own keys.

             * Windows<br />
               ```
               set FORGE_CLIENT_ID=xxx

               set FORGE_CLIENT_SECRET=xxx

               [set PORT=<port>]

   			node start.js
               ```
             * OSX/Linux<br />
               ```
               [sudo] [PORT=<port>] FORGE_CLIENT_ID=xxx FORGE_CLIENT_SECRET=xxx node start.js
               ```
      <br />
      <b>Note:</b> the port argument can be omitted and default to port 80. If port 80 is already in use by another
      application (like Skype, or IIS, or Apache, ...), you can use any other free port such as 8000, 3000, etc...
      But in the next section you would need to specify the port to use, i.e. http://localhost[:port]/


--------

## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT).
Please see the [LICENSE](LICENSE) file for full details.


## Written by

Hans Kellner, Autodesk, Inc. <br />
OCTO <br />

Alex Chein, Autodesk, Inc. <br />
PDG <br />

Cyrille Fauvel (Autodesk Developer Network)<br />
http://www.autodesk.com/adn<br />
http://around-the-corner.typepad.com/<br />
