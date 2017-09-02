
var refwdformatter = {
	
	  editing : false,
	
	  format : function() {
	
		if (refwdformatter.editing) {
		  return;
		}
		refwdformatter.editing = true;
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.refwdformatter.");
		var ret = prefs.getBoolPref("replytext.on");
		var reh = prefs.getBoolPref("replyhtml.on");
		var lit = prefs.getBoolPref("listtext.on");
		var lih = prefs.getBoolPref("listhtml.on");
		var fwd = prefs.getBoolPref("fwdsubject.on");
		
		var t = gMsgCompose.type;
		if (fwd && (t ==3 || t ==4)) {
		  // Foward (3: ForwardAsAttachment, 4: ForwardInline)
		  document.getElementById("msgSubject").value = document.getElementById("msgSubject").value.replace(/^\[/,"").replace(/\]$/,"");
		} else if ((ret || reh || lit || lih) && (t == 1 || t == 2 || t == 6 || t == 7 || t == 8 || t == 13)) {
		  // Reply (1: Reply, 2: ReplyAll, 6: ReplyToSender, 7: ReplyToGroup, 8: ReplyToSenderAndGroup, 13: ReplyToList)
		  var b =document.getElementById("content-frame").contentDocument.body;
		  var h =b.innerHTML;
		  if (h != "<br>") {
			if ((ret || lit) && !gMsgCompose.composeHTML) {
			  b.innerHTML = "<br>" + h.replace(/(<\/?span [^>]+>)&gt; /g, "$1").replace(/<br>&gt; /g, "<br>").replace(/<br>&gt;  /g, "<br>&nbsp;").replace(/<br>&gt;((&gt;)+) /g, "<br>$1&nbsp;").replace(/<br>&gt;((&gt;)+)  /g, "<br>$1&nbsp;").replace(/<br>&gt;((&gt;)+)<br>/g, "<br>$1&nbsp;<br>");
			} else if ((reh || lih) && gMsgCompose.composeHTML) {
			  var str = "", epos = h.indexOf("<blockquote ", spos);
			  if (epos >= 0) {
				  str += h.substring(0, epos);
				  var spos = h.indexOf(">", epos);
				  if (spos > 0) {
					spos += 1;
					epos = h.lastIndexOf("</blockquote>");
					if (epos > 0) {
					  str += h.substring(spos, epos);
					  spos = epos + 13;
					  str += h.substring(spos, h.length);
					} else {
					  str = "";
					}
				  } else {
					str = "";
				  }
			  } else {
				str = "";
			  }
			  if (str != "") {
				b.innerHTML = str;
			  }
			}
			var e = GetCurrentEditor();
			e.beginningOfDocument();
			e.insertHTML(" ");
			e.undo(1);
		  }
		}
		window.setTimeout(function () { refwdformatter.editing=false; }, 700)
	  },
	
	  onDelayLoad : function() {
		window.setTimeout(function () { refwdformatter.format(); }, 700)
	  },
	
	  onDelayReopen : function() {
		window.setTimeout(function () { refwdformatter.format(); }, 700)
	  },
	
	  onLoad : function() {
		opening = false;
		document.getElementById("content-frame").addEventListener("load", refwdformatter.onDelayLoad, true);
		window.addEventListener("compose-window-reopen", refwdformatter.onDelayReopen, true);
	  }
	
	};
	window.addEventListener("load", refwdformatter.onLoad, true);