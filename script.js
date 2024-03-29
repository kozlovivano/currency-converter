let currencies = ["$", "€", "₪", "£", "руб."];
var textNodes;
let currencyElems;

function textNodesUnder(node) {
    var all = [];
    for (node = node.firstChild; node; node = node.nextSibling) {
        if (node.nodeType == 3) all.push(node);
        else all = all.concat(textNodesUnder(node));
    }
    return all;
}

function getRate(symbol) {
    if (symbol === "€") {
        return twik_user_data.location.eur_exchange_rate;
    } else if (symbol === "$") {
        return twik_user_data.location.usd_exchange_rate;
    } else if (symbol === "£") {
        return twik_user_data.location.gbp_exchange_rate;
    } else if (symbol === "₪") {
        return twik_user_data.location.nis_exchange_rate;
    } else {
        return 1;
    }
}

function formatNumberToCurrencyType(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function convert(_symbol = twik_user_data.location.currency_symbol){
    textNodes = textNodesUnder(document.body);
    currencyElems = [...document.querySelectorAll("*")].filter(value => currencies.includes(value.innerHTML));

    for (var i = 0; i < textNodes.length; i++) {
        // Symbol and price are in the different node
        if (currencies.includes(textNodes[i].nodeValue)) {
            textNodes[i + 1].nodeValue = formatNumberToCurrencyType(parseInt(parseFloat(textNodes[i + 1].nodeValue.replace(",", "")) * getRate(textNodes[i].nodeValue) / getRate(_symbol)));
            textNodes[i].nodeValue = _symbol;
        }
        // Symbol and price are in the same node
        textNodes[i].nodeValue = textNodes[i].nodeValue.replace(/((\d|,|\.)+(\$|€|₪|£))|((\$|€|₪|£)(\d|,|\.)+)/g, function(match, token) {
            let number = parseFloat(match.replace(/\$|€|₪|£|,/g, ""));
            if (currencies.includes(match.charAt(0))) {
                return _symbol + formatNumberToCurrencyType(parseInt(number * getRate(match.charAt(0)) / getRate(_symbol)));
            } else {
                return formatNumberToCurrencyType(parseInt(number * getRate(match.charAt(match.length - 1)) / getRate(_symbol))) + _symbol;
            }
        })
    }
    // Long symbol
    currencyElems.map(value => {
        let symbol = value.innerText;
        let numberChild;
        let number;

        let children = [...value.parentElement.childNodes];
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeType === 3) {
                numberChild = children[i];
                number = parseFloat(children[i].nodeValue.replace(",", ""));
                break;
            }
        }
        numberChild.nodeValue = formatNumberToCurrencyType(parseInt(number * getRate(symbol) / getRate(_symbol)));
        value.innerText = _symbol;
    });
}
// ------------------------------------ Custom code for making dropdown element --------------------------------------- //
//                                This script only works for https://www.eshet.com/                                     //
// ---  Style to pseudo elements  ---
var UID = {
	_current: 0,
	getNew: function(){
		this._current++;
		return this._current;
	}
};

HTMLElement.prototype.pseudoStyle = function(element,prop,value){
	var _this = this;
	var _sheetId = "pseudoStyles";
	var _head = document.head || document.getElementsByTagName('head')[0];
	var _sheet = document.getElementById(_sheetId) || document.createElement('style');
	_sheet.id = _sheetId;
	var className = "pseudoStyle" + UID.getNew();

	_this.className +=  " "+className;

	_sheet.innerHTML += " ."+className+":"+element+"{"+prop+":"+value+"}";
	_head.appendChild(_sheet);
	return this;
};

// -------

function changeCurrency(currency){
    if(!device){
        dropdown_text.innerText = currency;
        dropdown_children.style.display = "none";
    }else{
        dropdown_text.innerText = currency;
    }
    if(currency.includes("$")){
        console.log("Convert " + twik_user_data.location.currency + " to USD");
        convert("$");
    }else if(currency.includes("€")){
        console.log("Convert " + twik_user_data.location.currency + " to EUR");
        convert("€");
    }else if(currency.includes("₪")){
        console.log("Convert " + twik_user_data.location.currency + " to ILS");
        convert("₪");
    }else if(currency.includes("£")){
        console.log("Convert " + twik_user_data.location.currency + " to GBP");
        convert("£");
    }else if(currency.includes("руб.")){
        console.log("Convert " + twik_user_data.location.currency + " to RUB");
        convert("руб.");
    }
}

// ------- Render dropdown --------

var device = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // True for mobile, false for desktop

var dropdown_parent = document.createElement("li");
var dropdown_icon = document.createElement("i");
var dropdown_text = document.createElement("div");

var dropdown_children = document.createElement("nav");
var children = ["דולר ($)", "אירו (€)", "שקלים (₪)"];

var flag = false;

setTimeout(function(){

    if(!device){
        dropdown_parent.style.position = "absolute";
        dropdown_parent.style.width = "70px";
        dropdown_parent.style.top = "5px";
        dropdown_parent.style.left = (document.getElementsByClassName("contact-us-content")[0].offsetLeft + 52).toString() + "px";
        dropdown_parent.style.textAlign = "center";
        dropdown_parent.style.cursor = "pointer";
        dropdown_parent.onmouseenter = function(){
            dropdown_children.style.display = "block";
        }
        dropdown_parent.onmouseleave = function(){
            dropdown_children.style.display = "none";
        }
        dropdown_text.innerText = "דולר ($)";

        dropdown_icon.addClass("icon-cheapest");
        dropdown_icon.style.paddingLeft = "5px";
        dropdown_icon.style.marginTop = "5px";
        dropdown_icon.style.color = "#d20018";
        dropdown_icon.style.fontSize = "15px";
        dropdown_parent.append(dropdown_icon);
        dropdown_parent.append(dropdown_text);

        dropdown_children.style.position = "relative";
        dropdown_children.style.display = "none";
        dropdown_text.style.lineHeight = "14px";
        document.getElementsByClassName("contact-us-content")[0].before(dropdown_parent)
        var idx = 0;
        for(var child of children){
            var child_tag = document.createElement("li");
            child_tag.pseudoStyle("hover", "background", "#ebebeb !important");
            child_tag.style.borderBottom = "1px solid rgba(0, 0, 0, 0.12)";
            child_tag.style.textAlign = "center";
            child_tag.style.padding = "10px 20px";
            child_tag.style.display = "block";
            child_tag.style.color = "#222";
            child_tag.style.top = (40 * idx).toString() + "px";
            child_tag.style.width = "100px";
            child_tag.style.background = "#fff"
            child_tag.style.position = "absolute";
            child_tag.style.verticalAlign = "top";
            child_tag.style.textDecoration = "none";
            child_tag.style.marginLeft = "auto";
            child_tag.style.marginRight = "auto";
            child_tag.style.whiteSpace = "nowrap";
            child_tag.innerText = child;
            child_tag.onclick = function(){
                changeCurrency( this.innerText);
            }
            dropdown_children.append(child_tag);
            idx++;
        }
        dropdown_parent.append(dropdown_children);
    }else{

        dropdown_parent.style.position = "relative";
        dropdown_text = document.createElement("a");
        dropdown_text.innerText = "דולר ($)";
        dropdown_text.addClass("ui-btn");
        dropdown_text.onclick = function(){
            if(!flag){
                for(var child of children){
                    var child_tag = document.createElement("li");
                    var child_tag_text =  document.createElement("a");
                    child_tag.addClass("currency-types");
                    child_tag_text.innerText = child;
                    child_tag_text.addClass("ui-btn");
                    child_tag_text.onclick = function(){
                        while(item = document.getElementsByClassName("currency-types")[0]){
                            item.remove();
                        }
                        document.getElementsByClassName("navbar-eshet").scrollTop = document.getElementsByClassName("navbar-eshet").scrollHeight - 10;
                        flag = !flag;
                        changeCurrency( this.innerText);
                    }
                    child_tag.append(child_tag_text);
                    document.getElementsByClassName("ui-listview")[0].append(child_tag);
                    document.querySelector('.navbar-eshet li:last-child').scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }else{
                while(item = document.getElementsByClassName("currency-types")[0]){
                    item.remove();
                }
                document.getElementsByClassName("navbar-eshet").scrollTop = document.getElementsByClassName("navbar-eshet").scrollHeight - 10;
            }
            flag = !flag;
        }
        dropdown_icon.addClass("icon-cheapest");
        dropdown_icon.style.position = "absolute";
        dropdown_icon.style.zIndex = "1";
        dropdown_icon.style.top = "16px";
        dropdown_icon.style.fontSize = "20px";
        dropdown_icon.style.left = "33px";
        dropdown_icon.style.color = "#d20018";
        dropdown_parent.append(dropdown_icon);
        dropdown_parent.append(dropdown_text);
        document.getElementsByClassName("contact-us")[0].after(dropdown_parent);
    }

}, 3000);
