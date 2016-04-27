/* Copyright (c) 2013-2016 The TagSpaces Authors.
 * Use of this source code is governed by the MIT license which can be found in the LICENSE.txt file. */

/* globals marked */
"use strict";

var isCordova;
var isWin;
var isWeb;

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

  isCordova = parent.isCordova;
  isWin = parent.isWin;
  isWeb = parent.isWeb;

  $(document).on('drop dragend dragenter dragover' , function(event) {
    event.preventDefault();
  });

  $('#aboutExtensionModal').on('show.bs.modal' , function() {
    $.ajax({
      url: 'README.md' ,
      type: 'GET'
    }).done(function(mdData) {
      //console.log("DATA: " + mdData);
      if (marked) {
        var modalBody = $("#aboutExtensionModal .modal-body");
        modalBody.html(marked(mdData , {sanitize: true}));
        handleLinks(modalBody);
      } else {
        console.log("markdown to html transformer not found");
      }
    }).fail(function(data) {
      console.warn("Loading file failed " + data);
    });
  });

  function handleLinks($element) {
    $element.find("a[href]").each(function() {
      var currentSrc = $(this).attr("href");
      $(this).bind('click' , function(e) {
        e.preventDefault();
        var msg = {command: "openLinkExternally" , link: currentSrc};
        window.parent.postMessage(JSON.stringify(msg) , "*");
      });
    });
  }

  var $htmlContent = $("#htmlContent");


  $("#printButton").on("click" , function() {
    $(".dropdown-menu").dropdown('toggle');
    window.print();
  });

  if (isCordova) {
    $("#printButton").hide();
  }

  // Init internationalization
  $.i18n.init({
    ns: {namespaces: ['ns.viewerURL']} ,
    debug: true ,
    lng: locale ,
    fallbackLng: 'en_US'
  } , function() {
    $('[data-i18n]').i18n();
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

  $htmlContent.append($("<a>" , {
            "class": "viewerURLButton btn btn-primary flexMaxWidth" ,
            "style": "height: 40px;" ,
            "title": "Opens the URL in the default browser" ,
            "data-url": content ,
            "text": content
          }).prepend("<i class='fa fa-external-link'></i>&nbsp;").click(function(e) {
            e.preventDefault();
            var msg = {command: "openLinkExternally" , link: $(this).data("url")};
            window.parent.postMessage(JSON.stringify(msg) , "*");
          })
  );
}
