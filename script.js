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

function drawDropdown(node){

}
