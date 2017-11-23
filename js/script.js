this.contentEditableDiv = document.getElementById('contents');

class SyntaxHighlighter {
	constructor(element) {
		this.currentElement = element;
		this.caretPos = 0;
	}
	getCaretInfo() {
		// console.log("inside getCaretInfo()");

			let sel, range;
			let arr = {
				'caretPosition': "",
				'parentElement': "",
				'childIndex': ""
			};

      if (window.getSelection) {
      	this.currentElement.focus();
		    sel = window.getSelection();
		    if (sel.rangeCount) {
		      range = sel.getRangeAt(0);
		      console.log("range values:");
		      console.log(range);
		      if (range.commonAncestorContainer.parentNode == this.currentElement) {
		        this.caretPos = range.endOffset;
		        arr.caretPosition = this.caretPos;
		        arr.parentElement = this.currentElement;
		      }
		      else {
		      	let children = this.currentElement.childNodes;
		      	for(let i=0; i<children.length; i++) {
		      		if (range.commonAncestorContainer.parentNode == children[i]) {
		      			this.caretPos = range.endOffset;
		      			arr.caretPosition = this.caretPos;
		      			arr.parentElement = children[i];
		      		}
		      	}
		      }
		    }
		  }
		  else if (document.selection && document.selection.createRange) {
		    range = document.selection.createRange();
		    if (range.parentElement() == this.currentElement) {
		      let tempEl = document.createElement("span");
		      editableDiv.insertBefore(tempEl, this.currentElement.firstChild);
		      let tempRange = range.duplicate();
		      tempRange.moveToElementText(tempEl);
		      tempRange.setEndPoint("EndToEnd", range);
		      this.caretPos = tempRange.text.length;
		    }
		  }
		  return arr;
	}

	getCharacterBeforeCaret() {
		console.log("inside getCharacterBeforeCaret()");
			// if(event.keyCode == 32 || event.keyCode == 13) {
				let caretInfo = this.getCaretInfo();
				return this.getSingleCharacter(caretInfo.parentElement, caretInfo.caretPosition-1, caretInfo.caretPosition);
			// }		
	}

	getSingleCharacter(containerElement, startPos, endPos) {
		return containerElement.textContent.substring(startPos, endPos);
	}

	checkForTags() {
		console.log("inside checkForTags()");
		// this.currentElement.onkeydown = (event) => {
			let character = this.getCharacterBeforeCaret();
			let caretInfo = this.getCaretInfo();

			let tagInformation = {
				"tagDetails": "",
				"containerDetails": "",
				"containerChildIndex": ""
			};

			if (character === ">") {
				tagInformation.tagDetails = this.returnTagInfo(caretInfo.parentElement, character, caretInfo.caretPosition);
				tagInformation.containerDetails = caretInfo.parentElement;
				tagInformation.containerChildIndex = caretInfo.childIndex;

				console.log("tagInformation: \n");
				console.log(tagInformation);
				return tagInformation;
			}
			
		// }
	}

	returnTagInfo (containerElement, character, caretPos) {
		console.log("inside returnTagInfo()");
		let container = containerElement;
		let tempCaret = caretPos - 1;
		let tempEnd = caretPos;
		let tempStr = container.textContent.substring(tempCaret, tempEnd);
		let tagInfo = {
			"tagName": "",
			"startOffset": "",
			"endOffset": ""
		};

		while (tempStr !== "<") {
			tempStr = container.textContent.substring(--tempCaret, --tempEnd);
		}

		let tempTag = container.textContent.substring(tempCaret+1, caretPos-1);
		tagInfo.tagName = tempTag;
		tagInfo.startOffset = tempCaret+1;
		tagInfo.endOffset = caretPos-1;
		console.log("tagInfo: \n");
		console.log(tagInfo);
		return tagInfo;
	}

/*	addCharacterToSpan(argString, containerElement) {
		this.spanElement = document.createElement('span');
		
		this.spanElement.textContent = argString;

		containerElement.appendChild(this.spanElement);		
	}*/

	checkCharacterType (character) {
		let charInfo = {"charType": ""};
		if (character === "<") {
			charInfo.charType = "tag-bracket-open";
		}
		else if (character === ">") {
			charInfo.charType = "tag-bracket-close";
		}
		else if (character.charCodeAt(0) >= 65 || character.charCodeAt(0) <= 122) {
			charInfo.charType = "alphabets";
		}
		else {
			charInfo.charType = "miscellaneous";
		}

		return charInfo;
	}

	getSelectedText(containerElement, prevCursorPos/*, startOffset, endOffset*/) {
		console.log("inside getSelectedText()");
		console.log("containerElement: ");
		console.log(containerElement);
		let startNode, endNode;

		startNode = endNode = containerElement;

		let range = document.createRange();
		range.setStart(startNode, 1);
		range.setEnd(endNode, 5);

		let selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);

		console.log(selection.toString());

		document.execCommand("foreColor", false, "red");
		selection.removeAllRanges();

		this.setCursorPosition(containerElement, prevCursorPos);
	}

	setCursorPosition(containerElement, prevCursorPos) {
		let node = containerElement;
		console.log("setCursorPosition");
		console.log(node);
		let range = document.createRange();
		range.selectNode(node);
		range.collapse();

		let selection = window.getSelection();
		selection.addRange(range);
	}

	main() {
		console.log("inside main()");
		// this.editorDoc = this.currentElement.contentWindow.document;


		this.currentElement.onkeyup = (event) => {
			let cursorInfo = this.getCaretInfo();
			console.log("onkeyup");

			let curChar = this.currentElement.textContent.substring(cursorInfo.caretPosition-1, cursorInfo.caretPosition);
			console.log("cursor position: "+cursorInfo.caretPosition);

				// if (event.keyCode == 32 || event.keyCode == 13) {

				if (curChar === ">") {
					
					// event.preventDefault();

					let tags = this.checkForTags();
					console.log("tags = ");
					console.log(tags);

					let str = tags.tagDetails.tagName;
					console.log(str); 

					// if(str == "html") {
						let selectedText;

						if (tags.containerDetails == this.currentElement) {
							console.log("1st condition matched");
							console.log(this.currentElement.firstChild);
							this.getSelectedText(this.currentElement.firstChild, cursorInfo.caretPosition);
							// this.setCursorPosition(this.currentElement.firstChild, cursorInfo.caretPosition, event);
							console.log(cursorInfo.caretPosition);
						}
						else {
							let children = this.currentElement.childNodes;
							alert("2nd condition matched");
							console.log(this.currentElement.children.length);
							console.log(children[tags.containerChildIndex]);
							this.getSelectedText(children[tags.containerChildIndex], cursorInfo.caretPosition);
						}
					// }
			}
			

			// }
		};
	}


}

let syntaxHighlighterObj = new SyntaxHighlighter(this.contentEditableDiv);
syntaxHighlighterObj.main();

// this.contentEditableDiv.execCommand('defaultParagraphSeperator', false, 'br');