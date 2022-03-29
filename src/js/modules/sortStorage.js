export const sortStorage = (arr) => {
    let sorted = arr.sort(function (a, b) {
        if (a.id > b.id) {
            return 1;
        }
        if (a.id < b.id) {
            return -1;
        }
    });
    return sorted;
}