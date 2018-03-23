/**
 * Read file content as ArrayBuffer
 *
 * @param file File object
 * @return promise
 */
export const readFile = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function(event) {
      resolve(event.target.result);
    };

    reader.readAsArrayBuffer(file);
  });
};
