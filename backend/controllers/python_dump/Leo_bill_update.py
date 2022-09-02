import pandas as pd
import sys
#from DBConnection import connect_to_posdb
import json
import datetime
from bson.objectid import ObjectId
import numpy as np
from pymongo import MongoClient
import urllib
import bson
# Connection


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


"""Out Put Display Setting """
desired_width = 320
pd.set_option('display.width', desired_width)
pd.set_option('display.max_columns', None)

connect_to_posdb()


class NumpyEncoder(json.JSONEncoder):
    """ Special json encoder for numpy types """

    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)


def bill_details(argv_id):
    #print("hello python")
    #data = [{'CODE': 102}, {'status': argv_id}]
    # print(json.dumps(argv_id))
    print(argv_id)
    api_db = connect_to_posdb()
    check_id = api_db['purchaseloadmasters'].find_one({"_id": argv_id})
    # return argv_id
    check_id1 = api_db['purchaseloadmasters'].find()

    if check_id:
        check_product = api_db['purchaseloadmasters'].find_one(
            {"_id": argv_id, "products": {'$in': [[]]}})
        print(check_id['products'])
        if check_product:
            try:
                bill_path = check_id['serverfilelocation']

         #       print(bill_path)
            except KeyError:
                error_data = [{'CODE': 400}, {
                    'status': "The serverfilelocation field is not found for this id"}]
                print(json.dumps(error_data))
                sys.exit()
            if bill_path:
                try:
                    bill_items = pd.read_csv(
                        bill_path, delimiter='\t', encoding="ISO-8859-1")
                #    print(bill_items)
                except OSError:
                    error_data = [{'CODE': 400}, {'status': "Invaild file"}]
                    print(json.dumps(error_data))
                    sys.exit()
                if pd.Series(['ITEM NAME', 'PTR', 'BATCH NO', 'QTY', 'DISCOUNT', 'SCH.DIS%', 'MRP', 'FREE', 'DIS AMT', 'GST %',
                              'GST AMT', 'TAXABLE AMT', 'EXP DT', 'VALUE', 'NET AMOUNT', 'BILL NO',
                              'BILL DATE']).isin(bill_items.columns).all():
                    bill_items['sgst'] = bill_items['GST %'].astype(int) / 2
                    bill_items['cgst'] = bill_items['GST %'].astype(int) / 2
                    bill_items['hsncode'] = ''
                    bill_items['scan_verify'] = ''
                    bill_items['rack'] = ''
                    bill_items['subrack'] = ''
                    bill_items['fridge'] = ''
                    invoice_no = str(bill_items['BILL NO'].values[0])
                    # billdate = str(bill_items['BILL DATE'].values[0])
                    # print(invoice_no)
                    bill_items = bill_items[['ITEM NAME', 'PTR', 'BATCH NO', 'QTY', 'hsncode', 'rack', 'subrack', 'fridge',
                                             'DISCOUNT', 'SCH.DIS%', 'MRP', 'FREE',
                                             'DIS AMT', 'cgst', 'sgst', 'GST %', 'GST AMT', 'TAXABLE AMT', 'EXP DT', 'VALUE',
                                             'NET AMOUNT', 'BILL NO', 'BILL DATE', 'scan_verify']]
                    bill_items.rename(columns={'ITEM NAME': 'itemname', 'PTR': 'pur_rate', 'BATCH NO': 'batchno', 'QTY': 'qty',
                                               'DISCOUNT': 'dis_per', 'SCH.DIS%': 'sch_disc_per', 'MRP': 'mrp',
                                               'FREE': 'freeqty', 'DIS AMT': 'dis_amnt', 'GST %': 'taxper',
                                               'GST AMT': 'tax_amnt', 'TAXABLE AMT': 'taxable_amnt', 'EXP DT': 'exp_date',
                                               'VALUE': 'netamount', 'NET AMOUNT': 'grand_total', 'BILL NO': 'invoiceno',
                                               'BILL DATE': 'billdate'}, inplace=True)
                    check_invoice = api_db['purchaseloadmasters'].find_one(
                        {"invoiceno": invoice_no})
                #    print(check_invoice)
                    if check_invoice:
                        product_details = bill_items[
                            ['itemname', 'pur_rate', 'batchno', 'qty', 'hsncode', 'rack', 'subrack', 'fridge',
                             'dis_per', 'sch_disc_per', 'mrp', 'freeqty', 'dis_amnt', 'cgst', 'sgst', 'taxper',
                             'tax_amnt', 'taxable_amnt', 'exp_date', 'netamount', 'scan_verify']]
                        for i in product_details.index:
                            product_details.at[i, '_id'] = str(bson.objectid.ObjectId())
                        product_details = product_details.to_dict(
                            orient='records')

                        # print(product_details)

                        insert_data = json.dumps(
                            product_details, cls=NumpyEncoder)
                        insert_data = json.loads(insert_data)

                        upd_status = api_db['purchaseloadmasters'].update_one(
                            {"_id": argv_id}, {"$set": {"products": insert_data}})
                        if upd_status:
                            message = "success"
                            return message
                        else:
                            message = "update is not successful"
                            return message
                    else:
                        message = 'Invoice No is not available in the system'
                        return message
                else:
                    message = 'Unwanted column name in file'
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
        argv_id = sys.argv[1]
        argv_id = ObjectId(argv_id)
        status = bill_details(argv_id)
        if status == 'success':
            data = [{'CODE': 100}, {
                'status': 'Purchase details updated succesfully'}]
            print(json.dumps(data))
        else:
            data = [{'CODE': 400}, {'status': status}]
            print(json.dumps(data))

    except IndexError:
        data = [{'CODE': 400}, {'status': "argument satisfaction fail"}]
        print(json.dumps(data))
