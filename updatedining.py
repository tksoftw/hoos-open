from req import get_dine_html
from parse import update_dining_hours

if __name__ == '__main__':
    dine_html_text = get_dine_html()
    update_dining_hours(dine_html_text)