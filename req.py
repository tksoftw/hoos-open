import requests

url = "https://cal.lib.virginia.edu/ajax/space/times"
headers = {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "cookie": "_ga=GA1.1.218454845.1717462218; _ga_8R4MML71X6=GS1.1.1717800754.2.0.1717800754.0.0.0; _ga_R97F1KC2J1=GS1.1.1717801208.2.0.1717801208.0.0.0; _hp2_props.3001039959=%7B%22Base.appName%22%3A%22Canvas%22%7D; _hp2_id.3001039959=%7B%22userId%22%3A%227384623438062111%22%2C%22pageviewId%22%3A%226567379306003676%22%2C%22sessionId%22%3A%221463201988108480%22%2C%22identity%22%3A%22uu-2-a83fa8624c2b2eae6b8e9604b0108f01577e1a9f8a9f90a813bd6c8e8e58e6e9-TUhHL8VxNad1UxUmL2QTLfBPl1HNyLzdOKR8HQoy%22%2C%22trackerVersion%22%3A%224.0%22%2C%22identityField%22%3Anull%2C%22isIdentified%22%3A1%7D; lc_ea_po=0012a9b17dbb6ae296dafda7432f514c77b9358aec3e2c52dc4c25e1c60d2ef159728a5889037534ebfeb211735a570a7848d39bb58b67c5b57a3f888959dbf034a68442d67f79bac7858e7c5e707a6c60365c8fb8a209cfb4283d4b212a76ceae545d7e2e735eacfdde60adb2265b4ac6f30ffac210574ae2aeceb4e471e5238730825ea7e5c94382ca9014dcd322eaa27f16015dda1e736e81c664f9916a63d9b5c66; lc_ebcart=00156cd85f8eb91dd7ef619488af594c40c4b744866edeb7320ff9995da48e6280cf921574f6fe4d2433f17239560585e01ae539da70e2677e62cf441c25eeda6b98de48dce65d1474809e19d7fa64274702a85f8a8147d0cac18a8d9eff02f9d0587260a7097845602cdc29ea6c96793871ebe8afcb178cf876921df965b509b5e720856fd38c634b92507044fb59066c8fc88389720f75803cea0244eae36bdd9d211362f50ba371529a86d27aec11117adc8880d746d5a1d8f88aa062c1c74fc45caf514408fe89714303e",
    "origin": "https://cal.lib.virginia.edu",
    "priority": "u=1, i",
    "referer": "https://cal.lib.virginia.edu/reserve/spaces/clemons",
    "sec-ch-ua": '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    "x-requested-with": "XMLHttpRequest"
}
data = {
    "patron": "",
    "patronHash": "",
    "returnUrl": "/reserve/spaces/clemons",
    "bookings[0][id]": "1",
    "bookings[0][eid]": "10365",
    "bookings[0][seat_id]": "0",
    "bookings[0][gid]": "2660",
    "bookings[0][lid]": "1079",
    "bookings[0][start]": "2024-10-18 21:00",
    "bookings[0][end]": "2024-10-18 21:30",
    "bookings[0][checksum]": "ecdb7ecbcd5c02b2127a9ab00d814476",
    "method": "11"
}

response = requests.post(url, headers=headers, data=data)

print(response.text)
