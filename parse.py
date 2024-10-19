import json
from datetime import datetime, timedelta

first_recorded_day = datetime(2024, 10, 13)
# days_of_the_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
# day_inds = {d: i for i, d in enumerate(days_of_the_week)}
# library_inds = {
#     'shannon': 2,
#     'clem': 5,
#     'brown': 4,
#     'music': 12,
#     'finearts': 13
# }
lib_row_identifiers = {
    'clem': 's-lc-h-loc s-lc-h-tr_3638 libbg_3638',
    'shannon': 's-lc-h-loc s-lc-h-tr_2090 libbg_2090',
    'brown': 's-lc-h-loc s-lc-h-tr_3727 libbg_3727',
    'music': 's-lc-h-loc s-lc-h-tr_3804 libbg_3804',
    'finearts': 's-lc-h-loc s-lc-h-tr_3805 libbg_3805'
}

def find_nth(string, substring, n):
   if (n == 0):
       return string.find(substring)
   else:
       return string.find(substring, find_nth(string, substring, n - 1) + 1)

def extract_between(s, startN, end, N=0):
    start_index = find_nth(s, startN, N)
    if start_index == -1:
        return None
    start_index += len(startN)
    end_index = s.find(end, start_index)
    if end_index == -1:
        return None
    return s[start_index:end_index]

def get_library_hours(html_text: str, lib_id: str, date: datetime):
    lib_row_identifier = lib_row_identifiers[lib_id]
    row_end_identifier = '</tr>'
    day_ind = (date.weekday() + 1) % 7 # sunday 1st day
    days_passed = date - first_recorded_day
    weeks_passed = days_passed.days // 7
    row_raw = extract_between(html_text, lib_row_identifier, row_end_identifier, N=weeks_passed)
    span_raw = extract_between(row_raw, '<td', '</td>', N=day_ind+1)
    hours_raw = extract_between(span_raw, '>', '</span>', N=1) # find 2nd occurance of ">", since 1st was from <td> tag
    if not ('&ndash;' in hours_raw):
        return hours_raw, None
    return tuple(hours_raw.split(' &ndash; '))

def get_all_library_hours(html_text, date):
    all_library_hours = {}
    for identifier in lib_row_identifiers:
        hours = get_library_hours(html_text, identifier, date)
        all_library_hours[identifier] = hours
    return all_library_hours
    

with open('lib_site.html', 'r', encoding='utf-8') as file:
    contents = file.read()
    db = {}
    start_day = first_recorded_day
    end_day = datetime(2025, 3, 2)
    day = start_day
    while day != end_day:
        contents
        all_hours = get_all_library_hours(contents, day)
        # print(hours)
        str_america_time = day.strftime("%m-%d-%Y")
        db[str_america_time] = all_hours
        day += timedelta(days=1)
    print(db)

with open('libraries_formatted.json', 'w') as file:
    json.dump(db, file, indent=4)

















# now = datetime.now()
# n = 100
# day_n = now + timedelta(days=n)
# our_date = datetime(2025, 1, 5)
# str_date = our_date.strftime("%b %d")

# with open('index.html', 'r', encoding='utf-8') as file:
#     contents = file.read()
#     i = contents.find(str_date)
#     s2 = contents[i+len(str_date)+len('<br/></span>'):]
#     i2 = s2.find('<')
#     day_of_the_week = s2[:i2]
#     print(day_of_the_week)    

# days_passed = our_date - first_week  # timedelta
# weeks_passed = days_passed.days // 7
# print(day_inds[day_of_the_week])
# i1 = find_nth(contents, lib_row_identifiers['clem'], weeks_passed)
# i2 = find_nth(contents[i1:], '<td>', day_inds[day_of_the_week])
# i2 += + i1 + len('<td>')
# i3 = contents.find('>', i2)+len('>')
# hours_raw = contents[i3:contents.find('</span>', i3)]
# hours = hours_raw.split(' &ndash; ') if '&ndash;' in hours_raw else hours_raw
# print(f'open: ({hours[0]}), close: ({hours[1]})' if isinstance(hours, list) else hours)