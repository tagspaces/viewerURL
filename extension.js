/* Copyright (c) 2013-2016 The TagSpaces Authors.
 * Use of this source code is governed by the MIT license which can be found in the LICENSE.txt file. */

define(function(require, exports, module) {
  "use strict";

  var extensionID = "viewerURL"; // ID should be equal to the directory name where the ext. is located
  var extensionSupportedFileTypes = ["url", "website", "desktop"];

  console.log("Loading " + extensionID);

  var TSCORE = require("tscore");
  var containerElID;
  var currentFilePath;
  var extensionDirectory = TSCORE.Config.getExtensionPath() + "/" + extensionID;

  function init(filePath, containerElementID) {
    console.log("Initalization MD Viewer...");
    containerElID = containerElementID;
    $('#' + containerElID).attr("style", "background-color: white;");
    currentFilePath = filePath;
    require(['css!' + extensionDirectory + '/extension.css'], function() {
      TSCORE.IO.loadTextFilePromise(filePath).then(function(content) {
        exports.setContent(content);
      }, 
      function(error) {
        TSCORE.hideLoadingAnimation();
        TSCORE.showAlertDialog("Loading " + filePath + " failed.");
        console.error("Loading file " + filePath + " failed " + error);
      });
    });
  }

  function setFileType() {

    console.log("setFileType not supported on this extension");
  }

  function viewerMode(isViewerMode) {}

  function setContent(content) {
    var urlBegin = "URL=";

    var url = content.substring(content.indexOf(urlBegin) + urlBegin.length, content.length);

    // preventing the case the url is at the end of the file
    url = url + "\n";

    url = url.substring(0, url.indexOf("\n"));

    var urlRegExp = /https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?/;

    console.log("URL: " + url);

    if (urlRegExp.test(url)) {
      $('#' + containerElID).append($("<button>", {
          "class": "viewerURLButton btn btn-primary flexMaxWidth",
          "style": "height: 40px;",
          "title": "Opens the URL in the default browser",
          "data-url": url,
          "text": url
        })
        .prepend("<i class='fa fa-external-link'></i>&nbsp;")
        .click(function(e) {
          e.preventDefault();
          TSCORE.IO.openFile($(this).attr("data-url"));
        })
      );
    } else {
      TSCORE.showAlertDialog("No URL found in this file.");
      console.log("No URL found!");
    }
  }

  function getContent() {}

  exports.init = init;
  exports.getContent = getContent;
  exports.setContent = setContent;
  exports.viewerMode = viewerMode;
  exports.setFileType = setFileType;

});
