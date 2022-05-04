//-------
//IDP2021/22
//you will find here: api workbench code and ketcher code below
//------

//wait until ketcher instance is fully loaded
console.log("setTimeout() example...");
//timeout
setTimeout(function(){
    console.log("Hello Ketcher");
}, 5000);


//obtain ketcher instance itself
ketcherFrame = document.getElementById('ifKetcher');
ketcher = null;
if ('contentDocument' in ketcherFrame)
    ketcher = ketcherFrame.contentWindow.ketcher;
else // IE7
    ketcher = document.frames['ifKetcher'].window.ketcher;

//---------//
// workbench api code; see readme of workbench api for detailed information
//---------//

//get params
const params = location.href.split("?")[1]?.split("&");
const locationData = {}; 

for (let x in params) {
  const paramParts = params[x].split("=");
  const key = paramParts[0];
  const value = paramParts[1];
  locationData[key] = value;
}

const auth = {
  apiBaseUrl: decodeURIComponent(locationData.apiBaseUrl),
  pk: locationData.pk,
  jwt: locationData.jwt,
};




//load plugin instance details from backend into workbench
function loadPluginInstanceDetailsfromBackend() {
  const url = auth.apiBaseUrl + auth.pk + "/?jwt=" + auth.jwt;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (pluginDetailJSON) {
      loadRawdatafromBackend(pluginDetailJSON["download_rawdata"]);
    });
}

//load ketcher rawdata by calling ketcher.setMolecule() function
function loadRawdatafromBackend(rawDataURL) {
    fetch(rawDataURL)
        .then(function(response) {
            return response.text();
        })
        .then(function(rawdata) {
            if (rawdata) {

                ketcherFrame.contentWindow.ketcher.setMolecule(
                    rawdata
                );

            }
        });
}


//clear all stuff written on the canvas of the ketcher editor
//calling ketcher.editor.clear()
function clear () {
console.log("clearing");
ketcherFrame.contentWindow.ketcher.editor.clear();
}

//save all ketcher data to the workbench
async function save() {
console.log("saving");

//write the data of ketcher.getKet() into ketcherData
//ketcher.getKet(): most versatile format to get all data represented in ket-format
ketcherData = await ketcherFrame.contentWindow.ketcher.getKet();

//create blob to save ketcherData in type text/xml
file = new Blob([ketcherData], {type: 'text/xml'});

/* 
for the image representation on the journal use ketcher.editor.render.paper.canvas to
get the data as SVG for Pablo. It then renders the image to an "png" and appends it to 
the workbench. Also create new FormData.
http://pablojs.com/
*/
var getCanvas = ketcherFrame.contentWindow.ketcher.editor.render.paper.canvas;
var img = Pablo(getCanvas).toImage('png', appendToForm);
const formData = new FormData();

//encode raw binary; taken out of workbench readme
function dataURItoBlob (dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {type: mimeString});
            
        }
        
//append rawdata and picture representation to formData
//taken out of workbench readme
function appendToForm() {

   picture = dataURItoBlob(img[0].src);
   formData.append('picture', picture, 'picture_representation.png');
   formData.append('rawdata', file, 'rawdata');

   const headers = new Headers({
    Authorization: "JWT " + auth.jwt,
  });

  const options = {
    method: "PATCH",
    body: formData,
    credentials: "include",
    headers,
  };

  const url = auth.apiBaseUrl + auth.pk + "/";
  // send form to backend
  fetch(url, options)
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => console.log("Success:", JSON.stringify(response)));
}//close bracket append
appendToForm();
}//close bracket save



//onload functions: run all code of saving and clearing by onclick
document.getElementById("clear").onclick = ((ketcher) =>
  function () {
    clear(ketcher);
  })(ketcher);

document.getElementById("save").onclick = ((ketcher) =>
  function () {
    save(ketcher);
  })(ketcher);
 
//optional: check iframe is fully loaded. 
document.querySelector("iframe").addEventListener( "load", function() {
    console.log("iframe content loaded");
} );



