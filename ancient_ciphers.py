#!/usr/bin/env python3

# Gravity Falls Ciphers / Шифры Гравити Фолз
# Caesar, Atbash, Vigenere for kids
#
# -----------------------------------------------------------------------------
# "THE BEER-WARE LICENSE" (Revision 42):
# zmey20000@yahoo.com wrote this file. As long as you retain this notice you
# can do whatever you want with this stuff. If we meet some day, and you think
# this stuff is worth it, you can buy me a beer in return Mikhail Zakharov
# -----------------------------------------------------------------------------
#
# 2018.01.14    v0.1    Mikhail Zakharov <zmey20000@yahoo.com>  Initial release
#

import sys


abc_dictionary = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'.lower()
# abc_dictionary = 'abcdefghijklmnopqrstuvwxyz'.lower()


# ----------------------------------------------------------------------------------------------------------------------
def dictionary_caesar(abc, shift=4):
    """Creates Caesar dictionary"""
    abcl = len(abc)

    caesar_abc = ''
    for pos_abc in range(0, abcl):
        pos_caesar = pos_abc + shift
        if pos_caesar > abcl - 1:
            pos_caesar = pos_caesar - abcl
        caesar_abc += abc[pos_caesar]

    return caesar_abc


def dictionary_atbash(abc):
    """Creates Atbash dictionary"""
    return abc[::-1]


def cipher_ca(text, d1, d2):
    """Caesar or Atbash encoding/decoding. Supply both dictionaries via d1 and d2"""

    result = ''
    for c in text:
        if c not in d1:
            result += c
        else:
            result += d2[d1.index(c)]
    return result


def vigenere(abc, text, secret, decrypt=False):
    """Simple Vigenere encoder/decoder over the dictionary"""

    ignore = ' ,.!?-+='
    abcl = len(abc)

    result = ''

    ti = []
    si = []
    for t in text:
        if t in ignore:
            ti.append(t)                                    # Do not encode punctuation marks
        else:
            ti.append(abc.index(t))

    for s in secret:
        si.append(abc.index(s))

    ps = 0
    for pt in range(len(text)):
        if ps == len(si):
            ps = 0
        if str(ti[pt]) in ignore:
            result += ti[pt]                                # Pass punctuation mark transparently
        else:
            if decrypt:
                result += abc[(ti[pt] - si[ps] + abcl) % abcl]
            else:
                result += abc[(ti[pt] + si[ps]) % abcl]
            ps += 1

    return result


def usage():
    print('Помощь:\n'
          '\tancient_ciphers.py a|c|v "Текст" "Ключ"\n'
          'Укажи "а", "c" или "v" чтобы выбрать метод кодирования: Атбаш, Цезаря или Виженера')

    sys.exit(1)


# ----------------------------------------------------------------------------------------------------------------------
if len(sys.argv) > 2:
    cipher = sys.argv[1].lower()
    text = sys.argv[2].lower()
else:
    usage()

if cipher == 'a':
    encrypted_dictionary = dictionary_atbash(abc_dictionary)
    print('Код Атбаш:', cipher_ca(text, encrypted_dictionary, abc_dictionary))
elif cipher == 'c':
    encrypted_dictionary = dictionary_caesar(abc_dictionary, 23)
    print('Код Цезаря:', cipher_ca(text, encrypted_dictionary, abc_dictionary))
elif cipher == 'v':
    if len(sys.argv) == 3:
        print('Вы забыли указать ключ для шифра Виженера!')
        usage()

    secret = sys.argv[3].lower()
    if len(sys.argv) == 4:
        print('Код Виженера:', vigenere(abc_dictionary, text, secret, decrypt=True))
    elif len(sys.argv) == 5:
        action = sys.argv[4].lower()
        if action:
            # We want Vigenere encryption
            print('Код Виженера:', vigenere(abc_dictionary, text, secret, decrypt=False))
    else:
        usage()
else:
    print('Укажи "а", "c" или "v" чтобы выбрать метод кодирования')
    usage()
