// JScript File

 
var defaultSettings = [];                 // store some defaults in array
defaultSettings['Location'] = "643";
defaultSettings['Animation'] = true;
defaultSettings['BureauServer'] = "mirror.bom.gov.au";
defaultSettings['AnimationDelay'] = 500;
defaultSettings['LeftOffset'] = -222;
defaultSettings['TopOffset'] = -322;
defaultSettings['GadgetHeight'] = 200;
defaultSettings['Radius'] = 128;
defaultSettings['RetrievalInterval'] = 10 * 1000 * 60; // 10 minutes
        
function readSetting(name)
{
   var r = System.Gadget.Settings.readString(name);
   // if none found, return default settings
   if (r == '')  r = defaultSettings[name];
   return r;
}
