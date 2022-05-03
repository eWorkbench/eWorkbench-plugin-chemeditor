# eWorkbench Plugin Chemical Stucture Editor Ketcher
Ketcher is an open-source web-based chemical structure editor which is here
implemented  and embedded as a plugin for the eWorkbench.
For more information and features as well as usage visit:
https://github.com/epam/ketcher

## Installation of Ketcher in the eWorkbench
We need the Ketcher standalone version.
The zip-file can be found here:
https://github.com/epam/ketcher/releases
It is usually called ```ketcher-standalone-X.Y.Z.zip```.
Unzip the contents into the plugin directory so that it contains the ```standalone``` directory.

## Update of Ketcher
For update replace the ```standalone``` directory with the current version. 


## Plugin Code Availability
The plugin code itself lies in the plugin directory where ```Ketcher.js``` provides the editor code as well the workbench code and ```index.html``` provides the iframe of ketcher.
```files
Ketcher.js
index.html
```

## Third Party Software Pablo for image representation
For an image representation of the editor a third party app Pablo is used.
http://pablojs.com/
It is an open-source library that visualizes the svg of ketcher in order to make this image representation.
Pablo can be found in the plugin directory. 
```file
pablo.min.js
```

## License
Ketcher is published under the Apache License Version 2.0.
Pablo is published under the MIT License.
