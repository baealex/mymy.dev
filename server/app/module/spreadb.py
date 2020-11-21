import gspread

class GspreaDB:
    def __init__(self):
        gc = gspread.service_account(filename='key.json')
        sh = gc.open('CDB')
        self.worksheet = sh.worksheet('database')
        self.col = {
            'key': 'A',
            'value': 'B'
        }

    def get_value(self, key):
        try:
            value = self.worksheet.row_values(self.worksheet.find(key).row)
            return value[1]
        except:
            pass
        return None

    def update_value(self, key, value):
        find_row = None
        try:
            find_row = self.worksheet.find(key).row
            self.worksheet.update(self.col['value'] + str(find_row), value)
        except:
            self.worksheet.insert_row([key, value])