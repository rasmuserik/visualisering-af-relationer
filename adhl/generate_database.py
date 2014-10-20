import leveldb

lidDB = leveldb.LevelDB("lids.leveldb", error_if_exists=True)
patronDB = leveldb.LevelDB("patrons.leveldb", error_if_exists=True)
lidInfoDB = leveldb.LevelDB("lid-info.leveldb", error_if_exists=True)

count = 0
limit = 100000

for line in file("../../final_adhl.csv"):

    count = count + 1
    if count % 10000 == 0:
        print count
    if count > limit:
        break

    fields = line.split(",")

    if len(fields) > 10:
        patron = fields[0]
        lid = fields[5]
        title = fields[8]
        author = fields[9]
        kind = fields[10]

        lidDB.Put(lid + ':' + patron, 't');
        patronDB.Put(patron + ':' + lid, 't');

stat = {}
for key, val in lidDB.RangeIter("0", ":"):
    lid = key.split(':')[0]
    stat[lid] = stat.get(lid, 0) + 1

for lid, count in stat:
    coloans = {}
    for key, _ in lidDB.RangeIter(lid,lid+';'):
        patron = key.split(':')[1]
        for key, _ in lidDB.RangeIter(patron,patron+';'):
            coloan = key.split(':')[1]
            coloans[coloan] = coloans.get(coloan, 0) + 1


    print coloans
