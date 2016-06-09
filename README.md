# Internet of Things (IoT) for Pier 9

[![Node.js](https://img.shields.io/badge/Node.js-5.11.1-blue.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-3.9.3-blue.svg)](https://www.npmjs.com/)
[![Viewer](https://img.shields.io/badge/Forge%20Viewer-v2.8-green.svg)](http://developer-autodesk.github.io/)
![Platforms](https://img.shields.io/badge/platform-windows%20%7C%20osx%20%7C%20linux-lightgray.svg)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://opensource.org/licenses/MIT)


<b>Note:</b> For using this sample, you need a valid oAuth credential for the translation / extraction portion.
Visit this [page](https://developer.autodesk.com) for instructions to get on-board.

<b>Note:</b> It also relies on the https://github.com/cyrillef/PlougonvelinNode Project which is the real brain
running on a BeagleBone Black device which controls the shutters, lights, and sensors.


## Live demo at
http://pier9.autodesk.io/

[![](www/images/app.png)](https://pier9.autodesk.io/)


## Description

This sample uses the Autodesk Forge Viewer to display my house, and has a Forge Viewer IoT Extension to
connect to my house BeagleBone Black IoT implementation via a secured socket.io connection.
However, the security layers is implemented on the BeagleBone Black device.

## Dependencies

This sample is dependent of Node.js and few Node.js extensions which would update/install automatically via 'npm':

1. Node.js

    Node.js - built on Chrome's JavaScript runtime for easily building fast, scalable network applications.
	You can get Node.js from [here](http://nodejs.org/)<br /><br />
	Node.js modules:
	```
    "express": "4.x",
    "morgan": "1.x",
    "request": "*",
    "socket.io": "0.9.x",
    "view-and-data": "^1.0.6",
    "bower": "^1.6.5"
	```

2. Require.js - RequireJS is a JavaScript file and module loader. It is optimized for in-browser use, but it
    can be used in other JavaScript environments, like Rhino and Node. Using a modular script loader like
    RequireJS will improve the speed and quality of your code., available [here](http://requirejs.org/).

3. jquery.js - jQuery is a fast, small, and feature-rich JavaScript library. It makes things like HTML document
    traversal and manipulation, event handling, animation, and Ajax much simpler with an easy-to-use API
    that works across a multitude of browsers. With a combination of versatility and extensibility, jQuery
    has changed the way that millions of people write JavaScript., available [here](https://jquery.com/).

4. smoothie - A JavaScript Charting Library for Streaming Data, available [here](http://smoothiecharts.org/)

All these libraries can be install via bower
    ```
    "async": "1.4.2",
    "jquery": "2.1.4",
    "requirejs": "2.1.17",
    "domReady": "2.0.1",
    "view-and-data-toolkit": "*",
    "smoothie": "~1.27.0",
    "requirejs-plugins": "~1.0.3"
    ```


## Setup/Usage Instructions

The sample was created using Node.js and javascript.

### Deploy on Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Once the Heroku server is setup, go on your Heroku Dashboard, select this new server, next Settings, and
press the 'Reveal Config Vars.' button.

Create 3 variables like this:

a. PORT = 80

b. CONSUMERKEY = &lt;your consumer key&gt;

c. CONSUMERSECRET = &lt;your consumer secret&gt;

Next restart the server.


### Deploy on a server or local machine

1. Download and install [Node.js](http://nodejs.org/) (that will install npm as well)
2. Download this repo anywhere you want
3. Execute 'npm install', this command will download and install the required node & bower modules automatically for you.<br />
   ```
   npm install
   ```
4. Set your credential keys to run the sample: use system environment variables
   * Define a CONSUMERKEY and CONSUMERSECRET system variables from the console or script which will launch the server.<br />
     * Windows<br />
     ```
     set CONSUMERKEY=xxx

     set CONSUMERSECRET=xxx
     ```
     * OSX/Linux<br />
     ```
     export CONSUMERKEY xxx

     export CONSUMERSECRET xxx
     ```
     or passing on the command line to the Node.js process<br />
     ```
     sudo [PORT=<port>] CONSUMERKEY=xxx CONSUMERSECRET=xxx node server.js
     ```
     <br />
     Replace keys placeholder xxx with your own keys.

4. Edit file ./html/js/app-init.js line #39-41, and set your model URN <br />
   Edit files in ./html/data to describe your model / sensors settings.

5. You are done for the setup, launch the node server using the command '[sudo] node server.js'.
   sudo is required only on OSX and Linux.<br />
   * Windows<br />
   ```
   [set PORT=<port>]
   node start.js
   ```
   * OSX/Linux<br />
   ```
   sudo [PORT=<port>] node server.js
   ```
   <br />
   <b>Note:</b> the port argument can be omitted and default to port 80. If port 80 is already in use by another
   application (like Skype, or IIS, or Apache, ...), you can use any other free port such as 8000, 3000, etc...
   But in the next section you would need to specify the port to use, i.e. http://localhost[:port]/

6. If you choose option b. for setup, launch http://localhost[:port]/setup.html, otherwise you are good to go with
   http://localhost[:port]/


--------

## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.


## Written by

Hans Kellner, Autodesk, Inc. <br />
OCTO <br />

Alex Chein, Autodesk, Inc. <br />
PDG <br />

Cyrille Fauvel (Autodesk Developer Network)<br />
http://www.autodesk.com/adn<br />
http://around-the-corner.typepad.com/<br />

