import pandas as pd
import sys, os
import json
# from Connection import connect_to_pos
from pymongo import MongoClient

def connect_to_posdb():
    DATABASE_NAME = "carepact"
    try:
        con_link = 'mongodb://127.0.0.1:27017'
        myclient = MongoClient(con_link)
        mydb = myclient[DATABASE_NAME]
      #  print(myclient)
        print("[+] Database connected!")
        return mydb

    except Exception as e:
        print("[+] Database connection error!")
        raise e


def inventory_insert(file_path):
    api_db = connect_to_posdb()
    inventory = pd.read_csv(file_path)
    # cols = ['item_code', 'item_name', 'batch', 'exp_date', 'rate', 'rack',
    #                            'subrack', 'fridge', 'mrp', 'hsn', 'taxper', 'stock_strip'
    #                            'stock_box', 'composition']
    cols = ['itemcode', 'item_name', 'batch', 'exp_date', 'rate', 'rack',
                               'subrack', 'fridge', 'mrp', 'hsn', 'taxper', 'stock_qty',
                                'composition']
    # if pd.Series(['item_code', 'item_name', 'batch', 'exp_date', 'rate', 'rack',
    #               'subrack', 'fridge', 'mrp', 'hsn', 'taxper',
    #               'stock_strip', 'stock_box', 'composition']).isin(inventory.columns).all():
    if pd.Series(['itemcode', 'item_name', 'batch', 'exp_date', 'rate', 'rack',
                  'subrack', 'fridge', 'mrp', 'hsn', 'taxper',
                  'stock_qty', 'composition']).isin(inventory.columns).all():
        inventory = inventory[cols]
        inv_data = inventory[inventory[cols].notnull().all(1)]
        inventory_data = inv_data.to_dict('records')
        try:
            if inv_data.shape[0] == inventory.shape[0]:
                api_db['inventory_stocks'].insert_many(inventory_data)
                message = "success"
            else:
                message = 'Some compulsory columns have null values. Please correct it.'
            return message

        except Exception as e_in:
            message = "Error in uploading file"
            return message
    else:
        message = 'Unwanted column name in file'
        return message


if __name__ == "__main__":
    try:
        argv_file_path = sys.argv[1]
        # argv_file_path = "D:\office\office\Customer\CAREPACT\inventory_stocks.cSV"
        outfile = os.path.splitext(argv_file_path)[1].upper()
        print(outfile)
        if outfile == '.CSV':
            status = inventory_insert(argv_file_path)
            if status == 'success':
                data = [{'CODE': 202}, {'status': 'Inventory File Uploaded'}]
                print(json.dumps(data))
            else:
                data = [{'CODE': 400}, {'status': status}]
                print(json.dumps(data))
        else:
            data = [{'CODE': 400}, {'status': 'File type is not CSV'}]
            print(json.dumps(data))

    except IndexError:
        data = [{'CODE': 400}, {'status': "argument satisfaction fail"}]
        print(json.dumps(data))
