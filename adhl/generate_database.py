import leveldb

db = leveldb.LevelDB("adhl.leveldb", error_if_exists=True)

count = 0;

for line in file("../../final_adhl.csv"):

    count = count + 1
    if count % 1000 == 0:
        print count

    fields = line.split(",")

    patron = fields[0]
    lid = fields[5]
    title = fields[8]
    author = fields[9]
    kind = fields[10]

    print patron, lid, title, author, kind
