let currencies = ["$", "€", "₪", "£"];

function textNodesUnder(node) {
    var all = [];
    for (node = node.firstChild; node; node = node.nextSibling) {
        if (node.nodeType == 3) all.push(node);
        else all = all.concat(textNodesUnder(node));
    }
    return all;
}

var textNodes = textNodesUnder(document.body);
for (var i = 0; i < textNodes.length; i++) {
    if (currencies.includes(textNodes[i].nodeValue)) {
        textNodes[i + 1].nodeValue = formatNumberToCurrencyType(parseInt(parseFloat(textNodes[i + 1].nodeValue.replace(",", "")) * getRate(textNodes[i].nodeValue)));
        textNodes[i].nodeValue = twik_user_data.location.currency_symbol;
    }

    textNodes[i].nodeValue = textNodes[i].nodeValue.replace(/((\d|,|\.)+(\$|€|₪|£))|((\$|€|₪|£)(\d|,|\.)+)/g, function(match, token) {
        let number = parseFloat(match.replace(/\$|€|₪|£|,/g, ""));
        if (currencies.includes(match.charAt(0))) {
            return twik_user_data.location.currency_symbol + formatNumberToCurrencyType(parseInt(number * getRate(match.charAt(0))));
        } else {
            return formatNumberToCurrencyType(parseInt(number * getRate(match.charAt(match.length - 1)))) + twik_user_data.location.currency_symbol;
        }
    })
}

let currencyElems = [...document.querySelectorAll("*")].filter(value => currencies.includes(value.innerHTML));
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

    numberChild.nodeValue = formatNumberToCurrencyType(parseInt(number * getRate(symbol)));
    value.innerText = twik_user_data.location.currency_symbol;
});

function getRate(symbol) {
    if (symbol === "€") {
        return twik_user_data.location.eur_exchange_rate;
    } else if (symbol === "$") {
        return twik_user_data.location.usd_exchange_rate;
    } else if (symbol === "£") {
        return twik_user_data.location.gbp_exchange_rate;
    } else if (symbol === "₪") {
        return twik_user_data.location.nis_exchange_rate;
    }
}

function formatNumberToCurrencyType(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
// ------------------------------------ Custom code for making dropdown element --------------------------------------- //

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

}

// ------- Render dropdown --------

var dropdown_parent = document.createElement("li");
var dropdown_icon = document.createElement("i");
var dropdown_text = document.createElement("div");

var dropdown_children = document.createElement("nav");
var children = ["דולר ($)", "אירו (€)", "שקלים (₪)"];

setTimeout(function(){

    dropdown_parent.style.position = "absolute";
    dropdown_parent.style.right = "-50px";
    dropdown_parent.style.top = "5px";
    dropdown_parent.style.cursor = "pointer";
    dropdown_text.innerText = "דולר ($)";

    dropdown_icon.addClass("icon-contact");
    dropdown_icon.style.paddingLeft = "15px";
    dropdown_icon.style.marginTop = "5px";
    dropdown_icon.style.color = "#d20018";
    dropdown_icon.style.fontSize = "15px";
    dropdown_parent.append(dropdown_icon);
    dropdown_parent.append(dropdown_text);

    dropdown_text.style.lineHeight = "14px";
    document.getElementsByClassName("links-and-phones-section")[1].append(dropdown_parent);

    for(var child of children){
        var child_tag = document.createElement("li");
        child_tag.pseudoStyle("hover", "background", "#ebebeb !important");
        child_tag.style.borderBottom = "1px solid rgba(0, 0, 0, 0.12)";
        child_tag.style.textAlign = "center";
        child_tag.style.padding = "10px 20px";
        child_tag.style.display = "block";
        child_tag.style.color = "#222";
        child_tag.style.background = "#fff"
        child_tag.style.position = "relative";
        child_tag.style.verticalAlign = "top";
        child_tag.style.textDecoration = "none";
        child_tag.style.marginLeft = "auto";
        child_tag.style.marginRight = "auto";
        child_tag.style.whiteSpace = "nowrap";
        child_tag.innerText = child;
        dropdown_children.append(child_tag);
    }
    dropdown_parent.append(dropdown_children);
}, 3000);
