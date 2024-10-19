from datetime import datetime, timedelta
days_of_the_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

def find_nth(string, substring, n):
    if n == 0:
        return string.find(substring)
    else:
        return string.find(substring, find_nth(string, substring, n - 1) + 1)

def extract_between_markers(text, start, end, occurrence=0):
    start_index = find_nth(text, start, occurrence)
    if start_index == -1:
        return None
    start_index += len(start)
    end_index = text.find(end, start_index)
    if end_index == -1:
        return None
    return text[start_index:end_index]


def get_library_hours(contents, library_id, date):
    first_week = datetime(2024, 10, 13)
    lib_row_identifier = {
        'clem': 's-lc-h-loc s-lc-h-tr_3638 libbg_3638'
    }[library_id]

    day_of_the_week = days_of_the_week[date.weekday()]
    days_passed = date - first_week
    weeks_passed = days_passed.days // 7
    day_index = days_of_the_week.index(day_of_the_week)

    row_content = extract_between_markers(contents, lib_row_identifier, '</tr>', weeks_passed)
    if row_content:
        day_content = extract_between_markers(row_content, '<td>', '</td>', day_index)
        if day_content:
            return extract_between_markers(day_content, '>', '</span>')

    return "Library hours not found"

# Example usage:
with open('index.html', 'r', encoding='utf-8') as file:
    contents = file.read()
    our_date = datetime(2025, 1, 5)
    hours = get_library_hours(contents, 'clem', our_date)
    print(hours)
