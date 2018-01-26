/*
  Gravity Falls Ciphers / Шифры Гравити Фолз
  Caesar, Atbash, Vigenere for kids

  -----------------------------------------------------------------------------
  "THE BEER-WARE LICENSE" (Revision 42):
  zmey20000@yahoo.com wrote this file. As long as you retain this notice you
  can do whatever you want with this stuff. If we meet some day, and you think
  this stuff is worth it, you can buy me a beer in return Mikhail Zakharov
  -----------------------------------------------------------------------------
*/

/*
  2018.01.26    v0.1    Mikhail Zakharov <zmey20000@yahoo.com>  Port from Python
*/

function ciphers(cipher, abcDict, inText, inKey, decrypt, shiftCaeser) {
    var abcLength = abcDict.length;
    var abcOrig = abcDict.slice();
    var inTextLength = inText.length;
    var inKeyLength = inKey.length;
    var result = "";

    switch(cipher.toLowerCase()) {
        case "atbash":
            var abcAtbash = []

            // Create Atbash "reverse" dictionary. Suppose there must
            // be a better way to loop through an array, but anyway:
            for (ch = 0; ch < abcLength; ch++) {
                abcAtbash.push(abcOrig.pop());
            }

            for (c = 0; c < inTextLength; c++) {
                if (abcAtbash.indexOf(inText[c]) == -1)
                    // Copy unknown character as-is
                    result += inText[c];
                else
                    // Find it's equivalent in the other dictionary
                    result += abcDict[abcAtbash.indexOf(inText[c])];
            }
            break;

        case "caesar":
            var abcCaesar = [];

            for (ch = 0; ch < abcLength; ch++) {
                posCaesar = ch + shiftCaeser;
                if (posCaesar > abcLength - 1)
                    posCaesar = posCaesar - abcLength;
                abcCaesar.push(abcOrig[posCaesar]);
            }

            // Can be pushed out to a new function
            for (c = 0; c < inTextLength; c++) {
                if (abcCaesar.indexOf(inText[c]) == -1)
                    // Copy unknown character as-is
                    result += inText[c];
                else
                    // Find it's equivalent in the other dictionary
                    result += abcDict[abcCaesar.indexOf(inText[c])];
            }
            break;

        case "vigenere":
            var ignore = " ,.!?-+=";
            var ti = [];
            var si = [];

            for (c = 0; c < inTextLength; c++) {
                if (ignore.indexOf(inText[c]) >= 0)
                    // Ignore punctuation
                    ti.push(inText[c]);
                else
                    // Save text character index
                    ti.push(abcDict.indexOf(inText[c]));
            }

            // Save key character index
            for (c = 0; c < inKeyLength; c++) {
                si.push(abcDict.indexOf(inKey[c]));
            }

            var ps = 0;
            for (pt = 0; pt < inTextLength; pt++) {
                if (ps == si.length) ps = 0;
                if (ignore.indexOf(ti[pt]) >= 0)
                    // Pass punctuation mark transparently
                    result += ti[pt];
                else {
                    if (decrypt == true)
                        result += abcDict[((ti[pt] - si[ps] + abcLength) % abcLength)];
                    else
                        result += abcDict[(ti[pt] + si[ps]) % abcLength];
                    ps += 1;
                }
            }
            break;

        default:
            return "Fatal: Unknown Cipher: " + cipher +
                    " was specified for decode()"
    }
    return result;
}

function code(action) {
    var abc = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя".toLowerCase();
    var abcDict = abc.split("");

    var lstCipher = document.getElementById("lstCiphers")
    var cipher = lstCipher.options[lstCipher.selectedIndex].text;
    var inText = document.getElementById("inText").value;
    var inKey = document.getElementById("keyVigenere").value;
    var outText = document.getElementById("outText");
    var shiftCaeser = 23;

    switch(action.toLowerCase()) {
        case "decode":
            outText.innerHTML = ciphers(cipher, abcDict, inText, inKey.toLowerCase(), true, shiftCaeser)
            break;
        case "encode":
            outText.innerHTML = ciphers(cipher, abcDict, inText, inKey.toLowerCase(), false, abc.length - shiftCaeser)
            break;
        default:
            outText.innerHTML = "Something went wrong!"
            break;
    }
}
