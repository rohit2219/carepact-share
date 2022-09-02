import pandas as pd
import sys
# from DBConnection import connect_to_posdb
import json
import datetime

from bson.errors import BSONError
from bson.objectid import ObjectId
import numpy as np
from pymongo import MongoClient
import urllib
import bson
import os

"""Out Put Display Setting """
desired_width = 320
pd.set_option('display.width', desired_width)
pd.set_option('display.max_columns', None)


# Connection
def connect_to_posdb():
    DATABASE_NAME = "DistScanning"
    # DATABASE_NAME = "carepact_b2c"
    try:
        con_link = 'mongodb://127.0.0.1:27017'
        myclient = MongoClient(con_link)
        mydb = myclient[DATABASE_NAME]
        print("[+] Database connected!")
        return mydb

    except Exception as e:
        print("[+] Database connection error!")
        raise e

def duplicate_master():
    coll = 'product_master_duplicates'
    DATABASE_NAME = "DistScanning"
    try:
        con_link = 'mongodb://127.0.0.1:27017'
        myclient = MongoClient(con_link)
        mydb = myclient[DATABASE_NAME]
        if coll in mydb.list_collection_names():
            duplicate = duplicate_master
            print(duplicate)
        else:
            print('false')
    except Exception as e:
        print("[+] Database connection error!")
        raise e

class NumpyEncoder(json.JSONEncoder):
    """ Special json encoder for numpy types """

    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, datetime.date):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)


def bill_details(argv_id):
    """Read Vendor bill and load in database"""
    api_db = connect_to_posdb()
    """Check whether given object_id in table"""
    check_id = api_db['purchaseloadmasters'].find_one({"_id": argv_id})
    if check_id:
        """If object id ia available in table then we need to check products are already loaded or not. """
        check_product = api_db['purchaseloadmasters'].find_one({"_id": argv_id, "products": {'$in': [[]]}})
        if check_product:
            """If products are not loaded in table then fetch file location"""
            try:
                bill_path = check_id['serverfilelocation']

            except KeyError:
                error_data = [{'CODE': 400}, {
                    'status': "The serverfilelocation field is not found for this id"}]
                print(json.dumps(error_data))
                sys.exit()
            if bill_path:
                """Checking file is in csv or xls format"""
                try:
                    outfile = os.path.splitext(bill_path)[1].upper()
                    print(outfile)
                    if outfile == '.CSV':
                        bill = pd.read_csv(bill_path, delimiter=',', encoding="ISO-8859-1")
                    elif outfile in ('.XLS', '.XLSX'):
                        bill = pd.read_excel(bill_path, engine='xlrd')

                except OSError:
                    error_data = [{'CODE': 400}, {'status': "Invalid file"}]
                    print(json.dumps(error_data))
                    sys.exit()
                # select required fields from bill
                # print(bill)
                print(duplicate_master())
                if duplicate_master() == 'True':
                    duplicate = duplicate_master
                    list_duplicate = list(duplicate)
                    data_f = pd.DataFrame(list_duplicate)
                    data_f = data_f.rename(columns={'product': 'itemname', 'batch': 'batchno'})
                    data_f = data_f[['duplicate_grade', 'itemname', 'batchno']]
                    print(data_f)
                else:
                    data_f = pd.DataFrame()
                    data_f['duplicate_grade'] = ''
                    data_f['itemname'] = ''
                    data_f['batchno'] = ''
                bill = bill[['itemname', 'batchno', 'expdate', 'invqty', 'salerate', 'itemmrp', 'cgstper', 'sgstper',
                             'invno', 'invdate', 'invamt', 'invdisc']]
                bill['expdate'] = pd.to_datetime(bill['expdate']).dt.strftime('%d-%m-%Y')
                bill['freeqty'] = ''
                bill['scan_verify'] = False
                bill['rack'] = ''
                bill['subrack'] = ''
                bill['fridge'] = ''
                bill['dis_per'] = ''
                bill['sch_disc_per'] = ''
                bill['dis_amnt'] = ''
                bill['taxper'] = bill['cgstper'] + bill['sgstper']
                bill['tax_amnt'] = ''
                bill['taxable_amnt'] = ''
                bill['hsncode'] = ''
                bill['netamount'] = ''

                invoice_no = bill.loc[0]['invno'].astype(int).astype(str)
                invoice_date = pd.to_datetime(bill['invdate'][0], dayfirst=True)

                invoice_date = invoice_date.strftime('%d-%m-%Y')
                net_amt = bill.iloc[0]['invamt'].astype(float)
                # customer_name = bill.iloc[0]['CUSTOMER']
                # distributor = bill.iloc[0]['SUPPLIER']
                # print(bill)
                bill = bill.rename(columns={'salerate': 'pur_rate', 'invqty': 'qty', 'itemmrp': 'mrp',
                                            'expdate': 'exp_date', 'cgstper': 'cgst', 'sgstper': 'sgst'})
                bill = pd.merge(left=bill, right=data_f, on=['itemname', 'batchno'],
                                how='left', indicator=True)
                bill['duplicate_grade'] = bill['duplicate_grade'].replace(np.nan, 0)
                product_details = bill[
                    ['itemname', 'pur_rate', 'batchno', 'duplicate_grade', 'qty', 'hsncode', 'rack', 'subrack',
                     'fridge',
                     'dis_per', 'sch_disc_per', 'mrp', 'freeqty', 'dis_amnt', 'cgst', 'sgst', 'taxper',
                     'tax_amnt', 'taxable_amnt', 'exp_date', 'netamount', 'scan_verify']]
                # print(product_details)

                # for each product we need to aasign a object id.
                for i in product_details.index:
                    product_details.at[i, '_id'] = str(
                        bson.objectid.ObjectId())
                product_details = product_details.to_dict(
                    orient='records')

                insert_data = json.dumps(
                    product_details, cls=NumpyEncoder)
                insert_data = json.loads(insert_data)

                upd_status = api_db['purchaseloadmasters'].update_one(
                    {"_id": argv_id}, {"$set": {"products": insert_data,
                                                'invoiceno': invoice_no,
                                                'grand_total': net_amt,
                                                'billdate': invoice_date
                                                }})
                if upd_status:
                    message = "success"
                    return message
                else:
                    message = "update is not successful"
                    return message

            else:
                message = 'Server File Path Location is empty'
                return message
        else:
            message = 'Product Details are already in the system'
            return message
    else:
        message = 'ObjectId not found in system'
        return message


if __name__ == "__main__":
    try:
        arg_id = sys.argv[1]
        # arg_id = '61dcf859c5cdf53a8c76e280'
        arg_id = ObjectId(arg_id)
        status = bill_details(arg_id)
        if status == 'success':
            data = [{'CODE': 202}, {'status': 'Purchase details updated succesfully'}]
            print(json.dumps(data))
        else:
            data = [{'CODE': 400}, {'status': status}]
            print(json.dumps(data))

    except IndexError:
        data = [{'CODE': 400}, {'status': "argument satisfaction fail"}]
        print(json.dumps(data))
