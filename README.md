
# VisualJS - Visually build web apps and microservice container images



Demo - A lightweight app builder for Kubernetes - https://yazz.com/app/homepage.html

- Build apps in minutes with drag and drop interface and code business logic in Javascript
- One click deploy to Docker or OpenShift
- Open source MIT license
- Runs in Docker on the cloud or locally
- Can be run as a Desktop app in Electron






<br /><br /><br /><br /><br />





## Docker Quick start
##### 1) Download and run Docker

##### 2) Expose the Docker REST api on port 1234 with:
    docker run -d -v /var/run/docker.sock:/var/run/docker.sock -p 127.0.0.1:1234:1234 bobrik/socat TCP-LISTEN:1234,fork UNIX-CONNECT:/var/run/docker.sock
    
##### 3) Install and run the VisualJS IDE with:

    docker run -p 80:80 -d zubairq/VisualJS
    
##### 4) Go to a browser and view VisualJS:

    http://localhost
    
##### 5) OPTIONAL - Run Postgres on docker on port 5432

    docker run -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
    
    Remember, that if you want to talk to Postgres from a Docker app then you need to connect to the host:
    
    host.docker.internal






<br /><br /><br /><br /><br />








## Building VisualJS from source on Linux:

##### 1) Install GIT from https://git-scm.com/downloads
##### 2) Install Node.js 8.9 64 bit installer from https://nodejs.org/en/download/
##### 3) From the command line get the Git repository
    git clone https://github.com/zubairq/visualjs.git
##### 4) Go to the VisualJS directory
    cd visualjs
##### 5) Install the NodeJS modules
    sudo npm config set strict-ssl false    
 
    sudo npm install --unsafe-perm

    
##### 6) Run the VisualJS NodeJS application

    node /src/electron.js --runapp homepage --nogui true --locked false
    
    
    
    
<br /><br /><br /><br /><br />






## Building VisualJS from source on Windows


##### 1) Install GIT from https://git-scm.com/downloads
##### 2) Install Node.js 8.9 64 bit installer from https://nodejs.org/en/download/
##### 3) From the command line get the Git repository
    git clone https://github.com/zubairq/visualjs.git
##### 4) Go to the VisualJS directory
    cd visualjs
##### 5) Install the NodeJS modules
    npm install
##### 6) Run the VisualJS Electron application
    electron .
    
##### OR run as Node.js application with browser based access

     node .\src\electron.js --runapp homepage --nogui true --locked false





<br /><br /><br /><br /><br />







## Building Visual Javascript from source on Mac:

##### 1) Install GIT from https://git-scm.com/downloads
##### 2) Install Node.js 8.9 64 bit installer from https://nodejs.org/en/download/
##### 3) From the command line get the Git repository
    git clone https://github.com/zubairq/visualjs.git
##### 4) Go to the VisualJS directory
    cd visualjs
##### 5) Install the NodeJS modules
    npm install
##### 6) Install SQlite3 for Electron
    Copy
        node_macos64/node_sqlite3.noderename
    to
        node_modules/sqlite3/lib/binding/node-v57-darwin-x64/node_sqlite3.node
##### 7) Install Electron 
    npm install electron

##### 8) Run the VisualJS Electron application
    electron .
    
##### OR run as Node.js application with browser based access

     node src/electron.js --runapp homepage --nogui true --locked false
     
### If Sqlite3 gives an error as it says it was compiled with a different version of NodeJS then recompile it

    npm rebuild sqlite3  --update-binary
    





<br /><br /><br /><br /><br />






## To build the Electron app:

##### 1) Install SQlite3 for Electron
    sudo npm install sqlite3 --build-from-source --runtime=electron --target=1.8.4 --dist-url=https://atom.io/download/electron (this step may not be needed on some platforms)
##### 2) Run electron packager
    Sudo electron-forge make





### To build the Windows 10 Electron app you also need to:
##### 1) Open Powershell in administator mode
    
##### 2) Install Python 27

    https://www.python.org/download/releases/2.7/
    
##### 3) Set the Path variable in Powershell to find Python

    $env:Path += ';d:\Python27\'

##### 4) Install Microsoft Build Tools 2015

    https://www.microsoft.com/en-us/download/details.aspx?id=48159
    
##### 5) Install electron-forge

    npm install -g electron-forge

##### 6) Build the Windows Electron app with Electron Forge

    electron-forge make





<br /><br /><br /><br /><br />





## Command line options:

    --help                 output usage information
    --version              output the version number
    --port                 Which port should I listen on? Default 80 or 3000 (if not run as sudo)
    --host                 Server address of the central host (default is local machine IP address)
    --locked               Allow server to be locked/unlocked on start up to other machines in intranet (default true)
    --nogui                Allow server to be run in headless mode (default false)
    --deleteonexit         Delete database files on exit (default false)
    --deleteonstartup      Delete database files on startup (default false) 
    --runapp               Run using a local app on startup (default not set). "homepage" often used
    --https                Run using a HTTPS (default is false)
    --private              Private HTTPS key location
    --public               Public HTTPS certificate location






<br /><br /><br /><br /><br />








### FAQ 

#### What is VisualJS's killer feature?

VisualJS's killer feature is being able to build Kubernetes applications in minutes, without having to setup Jenkins pipelines, Git, or anything else. It is ideal for demos or small throwaway apps.

#### Is there commercial support for Yazz?
If you require commercial support then please go to http://yazz.com
