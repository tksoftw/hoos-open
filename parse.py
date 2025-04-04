import json
import pytz
import req
from jsontreeview import treeView
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

def export_libs():
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
        # print(db)

    with open('libraries_formatted.json', 'w') as file:
        json.dump(db, file, indent=4)

def get_first_digit_index(s: str):
    for i, ch in enumerate(s):
        if ch.isdigit():
            return i
    return -1

def update_dining_hours(html_text: str):
    dict_raw = extract_between(html_text, 'model', 'filter', 1)
    dict_start, dict_end = dict_raw.find('{'), dict_raw.rfind('}')+1
    dict_str = dict_raw[dict_start:dict_end]
    d = json.loads(dict_str)
    date_str = datetime.now(tz=pytz.timezone('US/Eastern')).strftime("%m-%d-%Y")

    id_modify_dict = {
        "704": 'Newcomb Dining Room',
        "701": 'Runk Dining Room',
        "6011": '1819 Supply @ Newcomb',
        "5433": 'Food Trucks'
    }
    id_excludes = {
        1392, # Pav IX general loc
        716,  # Croads general loc
    }

    locations_filtered = [location for location in d['Locations'] if int(location['Id']) not in id_excludes]
    for loc in locations_filtered:
        # print(loc['HoursOfOperations'])
        if loc['HoursOfOperations'] and get_first_digit_index(loc['HoursOfOperations']) != -1 and ' - ' in loc['HoursOfOperations']:
            loc['hours'] = [time_str.replace(':00', '') for time_str in loc['HoursOfOperations'][get_first_digit_index(loc['HoursOfOperations']):].split(' - ')]
            if loc['hours'][0] == loc['hours'][1]:
                loc['hours'] = ['24 Hours', None]
        else:
            loc['hours'] = ['Closed', None]

        # Modify display names for specific IDs
        loc['DisplayName'] = id_modify_dict.get(loc['Id'], loc['DisplayName'])
                

    d_restructured = {
        date_str : {loc['Id'] : {k : v for k, v in loc.items() if k in {'DisplayName', 'Address', 'LocationImageUrl', 'hours'}} for loc in locations_filtered}
    }
    
    with open('database/dining.json', 'r') as file:
        d_old = json.load(file)

    d_new = d_old | d_restructured
    
    with open('database/dining.json', 'w') as file:
        json.dump(d_new, file, indent=4)
        print('updated dine json!')
    
def get_location_hours(location_html):
    json_hours = json.loads(extract_between(location_html, 'JSON.parse(\'', '\');'))
    
    timestamp_format = "%Y-%m-%dT%H:%M:%SZ"
    local_timezone = pytz.timezone('US/Eastern')
    weekday_timestamps = [None]*7
    for meal_period in json_hours:
        t_open = pytz.utc.localize(datetime.strptime(meal_period['UtcStartTime'], timestamp_format)).astimezone(local_timezone)
        t_close = pytz.utc.localize(datetime.strptime(meal_period['UtcEndTime'], timestamp_format)).astimezone(local_timezone)
        if weekday_timestamps[meal_period['WeekDay']] is None:
            weekday_timestamps[meal_period['WeekDay']] = [t_open, t_close]
            continue
        if t_open < weekday_timestamps[meal_period['WeekDay']][0]:
            weekday_timestamps[meal_period['WeekDay']][0] = t_open
        if t_close > weekday_timestamps[meal_period['WeekDay']][1]:
            weekday_timestamps[meal_period['WeekDay']][1] = t_close

    """
    weekday->date mapping (w/ first day of week sunday):
    weekday : 0 -> the NEXT sunday
    weekday : 1 -> THIS monday
    weekday : 2 -> THIS tuesday
    weekday : 3 -> THIS wednesday
    ...
    weekday : 6 -> THIS saturday
    """
    # Remap to first day of the week monday
    weekday_timestamps = weekday_timestamps[1:] + [weekday_timestamps[0]]

    strf_timestamp = lambda t : f'{t.hour % 12}' + t.strftime(':%M%p').replace(':00', '').lower()
    weekday_formatted_hours = [(strf_timestamp(hours[0]), strf_timestamp(hours[1])) if hours else ['Closed', None] for hours in weekday_timestamps]

    now_local = datetime.now(tz=pytz.timezone('US/Eastern'))
    first_weekday_date = now_local - timedelta(days=now_local.weekday())
    print(first_weekday_date.strftime("%m-%d-%Y"))
    date_strs = [(first_weekday_date + timedelta(days=i)).strftime("%m-%d-%Y") for i in range(7)]
    update_dict = {d : t for d, t in zip(date_strs, weekday_formatted_hours)} 

    return update_dict

def update_location_hours(location_id, update_dict):
    with open('database/dining_test.json', 'r') as file:
        d_json = json.load(file)
    
    for date_str, hours in update_dict.items():
        if date_str not in d_json:
            d_json[date_str] = {}
        if str(location_id) not in d_json[date_str]:
            d_json[date_str][str(location_id)] = {}
        d_json[date_str][str(location_id)]['hours'] = hours

    with open('database/dining_test.json', 'w') as file:
        json.dump(d_json, file, indent=4)
        print('updated dine json!')
        

if __name__ == '__main__':
    newcomb = req.get_loc_hours(704)
    newcomb_hours = get_location_hours(newcomb)
    print(newcomb_hours)
    # update_location_hours(704, newcomb_hours)






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