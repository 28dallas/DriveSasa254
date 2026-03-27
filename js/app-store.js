(function() {
    function read(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || "[]");
        } catch (error) {
            return [];
        }
    }

    function write(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function upsert(key, item, uniqueField) {
        var items = read(key);
        var index = items.findIndex(function(entry) {
            return entry[uniqueField] === item[uniqueField];
        });

        if (index >= 0) {
            items[index] = Object.assign({}, items[index], item);
        } else {
            items.unshift(item);
        }

        write(key, items);
        return items;
    }

    function toggleSaved(collectionKey, item, uniqueField) {
        var items = read(collectionKey);
        var exists = items.some(function(entry) {
            return entry[uniqueField] === item[uniqueField];
        });

        var nextItems = exists
            ? items.filter(function(entry) {
                return entry[uniqueField] !== item[uniqueField];
            })
            : [item].concat(items);

        write(collectionKey, nextItems);
        return !exists;
    }

    function addInquiry(payload) {
        return upsert("ds_inquiries", payload, "id");
    }

    function addBooking(payload) {
        return upsert("ds_bookings", payload, "id");
    }

    function getSaved(type) {
        return read(type === "driver" ? "ds_saved_drivers" : "ds_saved_partners");
    }

    window.DriveSasaStore = {
        read: read,
        write: write,
        toggleSaved: toggleSaved,
        addInquiry: addInquiry,
        addBooking: addBooking,
        getSaved: getSaved
    };
})();
