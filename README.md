# Pier9.IoT
Internet of Things (IoT) for Pier 9

## Installation:
- Copy files to your server
- Run 'npm install'
- Edit the "auth.js" file to set the Consumer Key and Secret values that allow access to data.

## Running:
- node server.js PORT#

### How to start server on Ubuntu boot:
- Add your Node.js start script to the file /etc/rc.local. That will run your Node.js launch script when the system starts.  [Running Node JS](http://stackoverflow.com/questions/16573668/best-practices-when-running-node-js-with-port-80-ubuntu-linode)
```
# Pier 9 IoT Viewer
/usr/local/bin/forever start --uid "pier9iot" -a -l forever.log -o out.log -e err.log --sourceDir /home/administrator/Pier9.IoT --workingDir /home/administrator/Pier9.IoT server.js 8080
```
- Redirect port 80 requests to port 8080.  Allows running NodeJS as web server without requiring it to be run as root:
```
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
```

## NOTE
The auth.js script contains the access keys, public and private, for the moment.  So we don't want to publish those in the future.

## ATTRIBUTION
This code is based on Jim Awe's project "Fluent".  See [demo](http://calm-inlet-4387.herokuapp.com/) and [source code on git](https://github.com/JimAwe/LmvNavTest.git)
