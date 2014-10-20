import leveldb

db = leveldb.LevelDB("adhl.leveldb", error_if_exists=True)

count = 0;

for line in file("../../final_adhl.csv"):

    count = count + 1
    if count % 100000 == 0:
        print count

    fields = line.split(",")

    if len(fields) > 10:
        patron = fields[0]
        lid = fields[5]
        title = fields[8]
        author = fields[9]
        kind = fields[10]
