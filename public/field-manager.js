function FieldManager (fields) {

	function getValues() {
		// read the values from the DOM
		Object.keys(fields).forEach(domfield => {
			const fieldElem = document.querySelector(`.${domfield}`);
			const value = fieldElem.value;
			fields[domfield] = value;
		});
		return fields;
	}

	function clear() {
		// read the fields in the DOM and set their value to blank
		Object.keys(fields).forEach(domfield => {
			const fieldElem = document.querySelector(`.${domfield}`);
			fieldElem.value = '';
		});
		// return fields;
	}

	return {
		clear,
		getValues
	}
}