/* Copyright (c) 2013-present The TagSpaces Authors.
 * Use of this source code is governed by the MIT license which can be found in the LICENSE.txt file. */

/* globals marked */
"use strict";

sendMessageToHost({command: 'loadDefaultTextContent'});

var isCordova;
var isWin;
var isWeb = (document.URL.startsWith('http') && !document.URL.startsWith('http://localhost:1212/'));

$(document).ready(function() {
  function getParameterByName(name) {
    name = name.replace(/[\[]/ , "\\\[").replace(/[\]]/ , "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)") ,
            results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g , " "));
  }

  var locale = getParameterByName("locale");

  var extSettings;
  loadExtSettings();

  // isCordova = parent.isCordova;
  // isWin = parent.isWin;

  // Init internationalization
  i18next.init({
    ns: {namespaces: ['ns.viewerURL']} ,
    debug: true ,
    lng: locale ,
    fallbackLng: 'en_US'
  } , function() {
    jqueryI18next.init(i18next, $);
    $('[data-i18n]').localize();
  });

  function loadExtSettings() {
    extSettings = JSON.parse(localStorage.getItem("viewerURLSettings"));
  }
});

function setContent(content , fileDirectory) {
  var $htmlContent = $('#htmlContent');

  if (fileDirectory.indexOf("file://") === 0) {
    fileDirectory = fileDirectory.substring(("file://").length , fileDirectory.length);
  }
  var urlBegin = "URL=";
  var url = content.substring(content.indexOf(urlBegin) + urlBegin.lengt, content.length);

  $htmlContent.append($("<input>", {
      "class": "form-control",
      "readonly": "readonly",
      "style": "margin: 10px; height: 40px; width: 100%",
      "title": "Opens the URL in the default browser",
      "value": url
    })
    .prepend("<i class='fa fa-external-link'></i>&nbsp;")
    .click(function(e) {
      e.preventDefault();
      sendMessageToHost({command: 'openLinkExternally', link : $(this).data("url")});
    })
  );

  $htmlContent.append($("<a>", {
      "class": "viewerURLButton btn btn-primary",
      "title": "Opens the URL in the default browser",
      "data-url": url,
      "text": "Open URL"
    })
    .prepend("<i class='fa fa-external-link'></i>&nbsp;")
    .click(function(e) {
      e.preventDefault();
      sendMessageToHost({command: 'openLinkExternally', link : $(this).data("url")});
    })
  );

}
