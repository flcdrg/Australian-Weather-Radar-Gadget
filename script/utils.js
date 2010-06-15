var Debugging = false;
var MainTimer = 0;    

var AnimateTimer = 0;
var AnimateCounter = 0;

var ImageCacheCurrent = 0;
var ImageCache = new Array();

// offline testing
var Offline = false;
var TestImages = new Array("images/test1.jpg", "images/test2.jpg", "images/test3.jpg", "images/test4.jpg", "images/test5.jpg");
var CurrentTest = -1;

function UpdateRadarWithRadius(radarImage)
{
    
    var radiusValue = readSetting("Radius");

    var n = parseInt(radarImage, 10);
    
    if (radiusValue == 64)
        n++;
    if (radiusValue == 256)
        n--;

    // make sure we are always 3 digits            
    var s= n.toString();
    
    if (s.length == 2)
        s = "0" + s;

    return s;            
}
        
function GetImageUrl()
{
    if (Offline) {
        CurrentTest += 1;
        if (CurrentTest >= TestImages.length)
            CurrentTest = 0;
            
        return TestImages[CurrentTest];
    }
    var serverName = readSetting("BureauServer");

    var radarImage = readSetting("Location");
    
    var now = new Date();
    
    return "http://" + serverName + "/radar/IDR" + UpdateRadarWithRadius(radarImage) + ".gif?cidx=" + now.getTime();
    // testing
}

function UpdateGadget()
{
    var now = new Date();

    var u = GetImageUrl();
        
    if (ImageCache.length > 10) {
        delete ImageCache[0];
    }
    var pos = ImageCache.push(new Image());
    ImageCache[pos-1].src = u;
    
    DockedImage.src = u;
    DockedImage.style.left = readSetting("LeftOffset");
    DockedImage.style.top = readSetting("TopOffset");
    
    UndockedImage.src = u;

    Trace("Update");
    SetUpdated();
}

// run after settings have changed
function ApplySettings()
{
    StartMainTimer();

    // update size incase we changed it    
    var oBody = document.body.style;
    oBody.height = readSetting("GadgetHeight");

    UpdateGadget();
}


function StartAnimation()
{
    clearInterval(MainTimer);
    MainTimer = 0;
    
    if (readSetting("Animation")) {
        if (ImageCache.length > 0) {
            AnimateTimer = setInterval(DoAnimation, 1000);
            AnimateCounter = ImageCache.length - 1;
        }
        Trace("start");
    }
}

function FinishAnimation()
{
    if (readSetting("Animation")) {
        Trace("finish");
        
        if (AnimateTimer != 0) {
            clearInterval(AnimateTimer);
            DockedImage.src = ImageCache[ImageCache.length - 1].src;
            AnimateTimer = 0;
        }
        
        StartMainTimer();
    }
}

function DoAnimation()
{
    Trace("animating");
    if (ImageCache.length > 0) {
        
        DockedImage.src = ImageCache[AnimateCounter].src;
        AnimateCounter--;
        
        if (AnimateCounter < 0)
            AnimateCounter = ImageCache.length - 1;
            
    }
}


function Trace(s)
{
    if (!Debugging) 
        return;
        
    if (s == undefined) 
         s = "";
         
    s += " " + new Date();
    
    document.getElementById("DockedTitle").innerText = s;
}

function SetUpdated()
{
    document.getElementById("DockedTitle").innerText = new Date();
    document.getElementById("UndockedTitle").innerText = new Date();
}

function StartMainTimer()
{
    // turn off timer if it was running already
    if (MainTimer != 0)
        clearInterval(MainTimer);
        
    var gInterval = readSetting("RetrievalInterval");
    MainTimer = setInterval(UpdateGadget, gInterval);
}

function init()
{
    checkDockState(); // check the initial state
	
	// setup the event handlers for docking later
	System.Gadget.onDock = dockGadget;
	System.Gadget.onUndock = undockGadget;
	

    DockedImage.style.left = readSetting("LeftOffset");
    DockedImage.style.top = readSetting("TopOffset");


    UpdateGadget();  

    StartMainTimer();
}

function dockGadget()
{
    var oBody = document.body.style;
    oBody.height = readSetting("GadgetHeight");
    oBody.width = 130;
	
    showOrHide("docked", true);
    showOrHide("undocked", false);
}

function undockGadget()
{
    var oBody = document.body.style;
    
    var UndockedImageObj = document.getElementById("UndockedImage");
    
    // default undocked size is the full size of the image.
     
    if (UndockedImageObj.complete) {
    
	    oBody.width = UndockedImageObj.clientWidth;
	    oBody.height = UndockedImageObj.clientHeight;
	    
	} else {
	
	    // first image hasn't loaded yet, so go with default dimensions, and resize later
	    oBody.width = 200;
	    oBody.height = 100;
	    UndockedImageObj.onload = ImageLoaded;
	}
	
    showOrHide("undocked", true);
    showOrHide("docked", false);
}

function ImageLoaded()
{
    var UndockedImageObj = document.getElementById("UndockedImage");

    // don't handle this event again
    UndockedImageObj.onload = null;

    if (!System.Gadget.docked) {
        var oBody = document.body.style;

	    oBody.width = UndockedImageObj.clientWidth;
	    oBody.height = UndockedImageObj.clientHeight;
    
    }
}

function checkDockState()
{
    if (System.Gadget.docked) {
        dockGadget();
    }
    else {
        undockGadget();
    }
}

function showOrHide(oHTMLElement, bShowOrHide) 
{
  try 
  {
	if (typeof(oHTMLElement)=="string") 
	{ 
	  oHTMLElement = document.getElementById(oHTMLElement); 
	}
	if (oHTMLElement && oHTMLElement.style) 
	{
	  if (bShowOrHide == 'inherit') 
	  {
		oHTMLElement.style.visibility = 'inherit';
	  } 
	  else 
	  {
		if (bShowOrHide)
		{
		  oHTMLElement.style.visibility = 'visible';
		}
		else
		{
		  oHTMLElement.style.visibility = 'hidden';
		}
		try 
		{
		  if (bShowOrHide)
		  {
			oHTMLElement.style.display = 'block';
		  }
		  else
		  {
			oHTMLElement.style.display = 'none';
		  }
		}
		catch (ex) 
		{
		}
	  }
	}
  }
  catch (ex) 
  {
  }
}
function flyout()
{
    System.Gadget.Flyout.file = "flyout.html";
    System.Gadget.Flyout.show = true;   
}