# from csv import DictReader
# # open file in read mode
# with open("WebApp/geojson_files/practice_fr_data_edits.csv", 'r') as f:
     
#     dict_reader = DictReader(f)
     
#     list_of_dict = list(dict_reader)
   
#     print(list_of_dict)

import geojson
with open("WebApp\geojson_files\FR_Merge_Polys_MCE2.geojson") as f:
    gj = geojson.load(f)
features = gj['features']

print(features)