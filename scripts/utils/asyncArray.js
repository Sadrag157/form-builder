export class AsyncArray {
    // Callback-based
    static asyncMapCallback(array, mapFn, callback, abortController = null) {
        if (!Array.isArray(array)) {
            return callback(new Error('Input must be an array'));
        }
        
        const results = [];
        let completed = 0;
        let aborted = false;

        if (abortController?.signal.aborted) {
            return callback(new Error('Operation aborted'));
        }

        const abortHandler = () => {
            aborted = true;
            callback(new Error('Operation aborted by user'));
        };

        abortController?.signal.addEventListener('abort', abortHandler);

        if (array.length === 0) {
            return callback(null, []);
        }

        array.forEach((item, index) => {
            if (aborted) return;

            mapFn(item, (error, result) => {
                if (aborted) return;
                
                if (error) {
                    aborted = true;
                    abortController?.signal.removeEventListener('abort', abortHandler);
                    return callback(error);
                }

                results[index] = result;
                completed++;

                if (completed === array.length) {
                    abortController?.signal.removeEventListener('abort', abortHandler);
                    callback(null, results);
                }
            });
        });
    }

    // Promise-based
    static asyncMapPromise(array, mapFn, abortController = null) {
        return new Promise((resolve, reject) => {
            if (!Array.isArray(array)) {
                return reject(new Error('Input must be an array'));
            }

            if (abortController?.signal.aborted) {
                return reject(new Error('Operation aborted'));
            }

            const results = [];
            let completed = 0;
            let aborted = false;

            const abortHandler = () => {
                aborted = true;
                reject(new Error('Operation aborted by user'));
            };

            abortController?.signal.addEventListener('abort', abortHandler);

            if (array.length === 0) {
                return resolve([]);
            }

            array.forEach((item, index) => {
                if (aborted) return;

                Promise.resolve(mapFn(item))
                    .then(result => {
                        if (aborted) return;
                        
                        results[index] = result;
                        completed++;

                        if (completed === array.length) {
                            abortController?.signal.removeEventListener('abort', abortHandler);
                            resolve(results);
                        }
                    })
                    .catch(error => {
                        if (aborted) return;
                        
                        aborted = true;
                        abortController?.signal.removeEventListener('abort', abortHandler);
                        reject(error);
                    });
            });
        });
    }
}